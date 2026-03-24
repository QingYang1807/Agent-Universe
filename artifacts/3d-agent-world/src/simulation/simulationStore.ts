import { create } from 'zustand';
import {
  AGENTS,
  LOCATIONS,
  EMOTION_EMOJI,
  type AgentDefinition,
  type Emotion,
  type Activity,
  type LocationKey,
  type ScheduleEntry,
} from './agentData';
import { buildPath } from './pathfinding';

export interface ConversationEntry {
  time: string;
  partnerName: string;
  text: string;
}

export interface AgentState {
  id: string;
  definition: AgentDefinition;
  x: number;
  z: number;
  targetX: number;
  targetZ: number;
  waypoints: Array<[number, number]>;
  waypointIndex: number;
  emotion: Emotion;
  currentActivity: Activity;
  currentLocation: LocationKey;
  targetLocation: LocationKey;
  conversationWith: string | null;
  conversationText: string | null;
  conversationTimer: number;
  memory: ConversationEntry[];
  bobOffset: number;
  bobTime: number;
}

export interface SimulationState {
  agents: Record<string, AgentState>;
  gameHour: number;
  gameMinute: number;
  dayCount: number;
  speed: number;
  selectedAgentId: string | null;
  isRunning: boolean;
  setSelectedAgent: (id: string | null) => void;
  setSpeed: (speed: number) => void;
  togglePause: () => void;
  tick: (delta: number) => void;
}

const MINUTES_PER_REAL_SECOND = 1; // 1 real second = 1 game minute at speed 1x
const AGENT_MOVE_SPEED = 6; // world units per second
const CONVERSATION_DISTANCE = 2.5;
const CONVERSATION_DURATION = 6; // seconds

function getScheduleEntry(agent: AgentDefinition, hour: number): ScheduleEntry {
  return (
    agent.schedule.find((s) => hour >= s.startHour && hour < s.endHour) ||
    agent.schedule[0]
  );
}

const DIALOGUES: Record<string, Record<string, string[]>> = {
  formal: {
    formal:       ['Good day! How are your duties going?', 'I trust your work is going well.', 'A pleasure to meet you here.'],
    casual:       ['Hello! How are things?', 'Good to see you today!'],
    shy:          ['Um, hello... nice weather, isn\'t it?'],
    enthusiastic: ['What a delight to meet you!', 'How wonderful to cross paths!'],
    grumpy:       ['Hmm. Good day, I suppose.'],
  },
  casual: {
    formal:       ['Hey! All good?', 'What\'s up?'],
    casual:       ['Hey! How\'s it going?', 'What\'s new?', 'Sup! Good to see ya!'],
    shy:          ['Oh hey... you okay?'],
    enthusiastic: ['Yo! What\'s up?!'],
    grumpy:       ['Hey Frank. You alright?'],
  },
  shy: {
    formal:       ['Oh... hi. S-sorry to bother you.'],
    casual:       ['H-hi... um, how are you?'],
    shy:          ['Oh! Hi... I didn\'t see you there.'],
    enthusiastic: ['Oh! You scared me... hi!'],
    grumpy:       ['S-sorry if I\'m in the way...'],
  },
  enthusiastic: {
    formal:       ['OH WOW it\'s you! This is AMAZING!', 'GREAT to see you!!'],
    casual:       ['HEY! How\'s life treating you?!', 'So good to run into you!'],
    shy:          ['Oh you\'re so sweet! Hi!'],
    enthusiastic: ['OMGGG HI!! LOVE seeing you!!'],
    grumpy:       ['Frank!! Always a pleasure (sort of)!'],
  },
  grumpy: {
    formal:       ['...What do you want?', 'Yeah, yeah. Hello.'],
    casual:       ['Hmph. You again.', 'Don\'t just stand there.'],
    shy:          ['You\'re blocking the path.'],
    enthusiastic: ['Slow down, will ya?'],
    grumpy:       ['Great. Another complainer.'],
  },
};

function generateDialogue(a: AgentDefinition, b: AgentDefinition): [string, string] {
  const aStyle = a.dialogueStyle;
  const bStyle = b.dialogueStyle;
  const pool = DIALOGUES[aStyle]?.[bStyle] || ['Hello!'];
  const poolReply = DIALOGUES[bStyle]?.[aStyle] || ['Hello!'];
  return [
    pool[Math.floor(Math.random() * pool.length)],
    poolReply[Math.floor(Math.random() * poolReply.length)],
  ];
}

function initAgentState(def: AgentDefinition, hour: number): AgentState {
  const entry = getScheduleEntry(def, hour);
  const loc = LOCATIONS[entry.location];
  const tx = loc.x + (Math.random() - 0.5) * 1.5;
  const tz = loc.z + (Math.random() - 0.5) * 1.5;
  const sx = loc.x + (Math.random() - 0.5) * 2;
  const sz = loc.z + (Math.random() - 0.5) * 2;
  return {
    id: def.id,
    definition: def,
    x: sx,
    z: sz,
    targetX: tx,
    targetZ: tz,
    waypoints: buildPath(sx, sz, tx, tz),
    waypointIndex: 0,
    emotion: entry.emotion,
    currentActivity: entry.activity,
    currentLocation: entry.location,
    targetLocation: entry.location,
    conversationWith: null,
    conversationText: null,
    conversationTimer: 0,
    memory: [],
    bobOffset: Math.random() * Math.PI * 2,
    bobTime: 0,
  };
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  agents: Object.fromEntries(
    AGENTS.map((def) => [def.id, initAgentState(def, 8)])
  ),
  gameHour: 8,
  gameMinute: 0,
  dayCount: 1,
  speed: 1,
  selectedAgentId: null,
  isRunning: true,

  setSelectedAgent: (id) => set({ selectedAgentId: id }),
  setSpeed: (speed) => set({ speed }),
  togglePause: () => set((s) => ({ isRunning: !s.isRunning })),

  tick: (delta: number) => {
    const state = get();
    if (!state.isRunning) return;

    const effectiveDelta = delta * state.speed;

    // Advance game time
    const minutesElapsed = effectiveDelta * MINUTES_PER_REAL_SECOND * 60;
    const totalMinutes = state.gameHour * 60 + state.gameMinute + minutesElapsed;
    const wrappedMinutes = totalMinutes % (24 * 60);
    const newHour = Math.floor(wrappedMinutes / 60);
    const newMinute = Math.floor(wrappedMinutes % 60);
    const newDay = state.dayCount + (totalMinutes >= 24 * 60 ? Math.floor(totalMinutes / (24 * 60)) : 0);

    const agentsCopy = { ...state.agents };

    for (const agentId of Object.keys(agentsCopy)) {
      const agent = { ...agentsCopy[agentId] };
      const def = agent.definition;

      // Update schedule — when destination changes, build new road-following path
      const entry = getScheduleEntry(def, newHour);
      if (entry.location !== agent.targetLocation) {
        const loc = LOCATIONS[entry.location];
        const tx = loc.x + (Math.random() - 0.5) * 1.5;
        const tz = loc.z + (Math.random() - 0.5) * 1.5;
        agent.targetLocation = entry.location;
        agent.targetX = tx;
        agent.targetZ = tz;
        agent.waypoints = buildPath(agent.x, agent.z, tx, tz);
        agent.waypointIndex = 0;
      }
      agent.currentActivity = entry.activity;
      agent.emotion = entry.emotion;

      // Move toward the current waypoint along the road graph
      if (agent.waypointIndex < agent.waypoints.length) {
        const [wpX, wpZ] = agent.waypoints[agent.waypointIndex];
        const dx = wpX - agent.x;
        const dz = wpZ - agent.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        const WAYPOINT_ARRIVAL = 0.4;

        if (dist < WAYPOINT_ARRIVAL) {
          // Arrived at this waypoint — advance to next
          agent.waypointIndex += 1;
        } else {
          const step = Math.min(AGENT_MOVE_SPEED * effectiveDelta, dist);
          agent.x += (dx / dist) * step;
          agent.z += (dz / dist) * step;
        }
      } else {
        // All waypoints consumed — agent has arrived
        agent.currentLocation = agent.targetLocation;
      }

      // Bobbing animation
      agent.bobTime += effectiveDelta * 2;

      // Conversation timer
      if (agent.conversationTimer > 0) {
        agent.conversationTimer -= effectiveDelta;
        if (agent.conversationTimer <= 0) {
          agent.conversationWith = null;
          agent.conversationText = null;
          agent.conversationTimer = 0;
        }
      }

      agentsCopy[agentId] = agent;
    }

    // Check for new conversations between close agents
    const agentList = Object.values(agentsCopy);
    for (let i = 0; i < agentList.length; i++) {
      const a = agentList[i];
      if (a.conversationTimer > 0) continue;
      if (a.currentActivity === 'sleeping') continue;

      for (let j = i + 1; j < agentList.length; j++) {
        const b = agentList[j];
        if (b.conversationTimer > 0) continue;
        if (b.currentActivity === 'sleeping') continue;

        const dx = a.x - b.x;
        const dz = a.z - b.z;
        const nearDist = Math.sqrt(dx * dx + dz * dz);

        if (nearDist < CONVERSATION_DISTANCE && Math.random() < 0.008 * effectiveDelta * 60) {
          const [aText, bText] = generateDialogue(a.definition, b.definition);
          const timeStr = `${String(newHour).padStart(2, '0')}:${String(newMinute).padStart(2, '0')}`;

          agentsCopy[a.id] = {
            ...agentsCopy[a.id],
            conversationWith: b.id,
            conversationText: aText,
            conversationTimer: CONVERSATION_DURATION,
            emotion: 'chatting',
            memory: [
              { time: timeStr, partnerName: b.definition.name, text: aText },
              ...agentsCopy[a.id].memory.slice(0, 9),
            ],
          };
          agentsCopy[b.id] = {
            ...agentsCopy[b.id],
            conversationWith: a.id,
            conversationText: bText,
            conversationTimer: CONVERSATION_DURATION,
            emotion: 'chatting',
            memory: [
              { time: timeStr, partnerName: a.definition.name, text: bText },
              ...agentsCopy[b.id].memory.slice(0, 9),
            ],
          };
          break;
        }
      }
    }

    set({
      agents: agentsCopy,
      gameHour: newHour,
      gameMinute: newMinute,
      dayCount: newDay,
    });
  },
}));
