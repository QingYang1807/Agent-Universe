# Agent Community — Autonomous AI Town Simulation

> A Stanford Smallville-inspired multi-agent community where 10 autonomous characters live, work, eat, socialize, and sleep through realistic daily schedules — all rendered in a top-down 2D town map.

---

## Table of Contents

1. [Overview](#overview)
2. [The Agents](#the-agents)
3. [Town Map and Locations](#town-map-and-locations)
4. [Simulation Mechanics](#simulation-mechanics)
5. [Time System](#time-system)
6. [User Interface](#user-interface)
7. [Project Structure](#project-structure)
8. [Key Source Files](#key-source-files)
9. [Dependencies](#dependencies)
10. [Getting Started](#getting-started)
11. [Extending the Simulation](#extending-the-simulation)

---

## Overview

Agent Community is a browser-based autonomous agent simulation inspired by the Stanford Smallville research paper ("Generative Agents: Interactive Simulacra of Human Behavior"). Ten distinct AI characters inhabit a small town, each following a detailed daily schedule. They move from location to location along the road network, interact with each other through typed conversations, and display real-time emotions — all without any LLM API calls.

**Key characteristics:**

- 10 unique agents with individual personalities, goals, emotions, and dialogue styles
- Schedule-driven behavior: each agent follows an hour-by-hour plan across a 24-hour day
- Road-following navigation: agents travel via a road-graph A\* pathfinder rather than cutting across the map
- Emergent conversations: when two non-sleeping agents come within proximity, they exchange context-aware dialogue
- Per-agent conversation memory: the last 10 interactions are stored and shown in the detail panel
- Day/night cycle: sky color, lighting, and star overlay shift continuously with game time
- Configurable simulation speed: 1x, 2x, 5x, or 10x real-time
- Pure HTML Canvas 2D renderer — no WebGL required

---

## The Agents

All agent definitions live in `src/simulation/agentData.ts`.

| Name  | Role       | Color     | Personality                        | Dialogue Style | Goals                                                       |
|-------|------------|-----------|------------------------------------|----------------|-------------------------------------------------------------|
| Alice | Teacher    | `#FF6B9D` | Caring, Patient, Organized         | Formal         | Inspire students · Stay healthy · Learn new things          |
| Bob   | Baker      | `#FFB347` | Cheerful, Creative, Early riser    | Enthusiastic   | Bake perfect bread · Make people happy · Socialize          |
| Carol | Doctor     | `#4ECDC4` | Serious, Dedicated, Empathetic     | Formal         | Help patients · Research medicine · Work life balance       |
| Dave  | Engineer   | `#45B7D1` | Analytical, Introverted, Precise   | Casual         | Build great software · Learn new tech · Find quiet time     |
| Emma  | Artist     | `#A8E6CF` | Creative, Dreamy, Sensitive        | Enthusiastic   | Create inspiring art · Find beauty · Connect with nature    |
| Frank | Shop Owner | `#DDA0DD` | Grumpy, Hardworking, Loyal         | Grumpy         | Run successful shop · Keep regular customers · Retire       |
| Grace | Student    | `#98D8C8` | Curious, Energetic, Social         | Casual         | Graduate with honors · Make friends · Explore the world     |
| Henry | Chef       | `#F0A500` | Passionate, Perfectionist, Warm    | Enthusiastic   | Cook perfect meals · Share culture · Win cooking award      |
| Iris  | Journalist | `#E8A0BF` | Inquisitive, Bold, Social butterfly| Enthusiastic   | Break big story · Meet interesting people · Travel          |
| Jack  | Retired    | `#B8B8FF` | Wise, Nostalgic, Kind              | Casual         | Enjoy retirement · Share stories · Stay active              |

### Dialogue Styles

Each agent has a `dialogueStyle` that controls what they say when meeting another agent. The style matrix is cross-referenced at runtime:

| Style        | Character | Example line                        |
|--------------|-----------|-------------------------------------|
| `formal`     | Alice, Carol | "Good day! How are your duties going?" |
| `casual`     | Dave, Grace, Jack | "Hey! How's it going?"         |
| `enthusiastic` | Bob, Emma, Henry, Iris | "OMGGG HI!! LOVE seeing you!!" |
| `grumpy`     | Frank     | "Hmph. You again."                  |
| `shy`        | (unused)  | "Oh! Hi... I didn't see you there." |

### Emotions

Agents display one of 10 emotions as an emoji badge on their map icon:

| Emotion    | Emoji | Triggered by                         |
|------------|-------|--------------------------------------|
| `happy`    | 😊    | Breakfast, park relaxation, free time |
| `tired`    | 😴    | Waking up                            |
| `working`  | 💼    | Work and study hours                 |
| `eating`   | 🍔    | Breakfast, lunch, dinner             |
| `chatting` | 💬    | Active conversation / socializing    |
| `sleeping` | 💤    | Night hours                          |
| `relaxing` | 😌    | Evening leisure, park visits         |
| `excited`  | 🤩    | Start-of-day excitement (Iris)       |
| `bored`    | 😑    | Idle stretches                       |
| `stressed` | 😰    | Late-afternoon work sessions         |

### Agent Schedules

Each agent has a full 24-hour schedule broken into `ScheduleEntry` blocks. Example — Alice (Teacher):

| Time        | Activity           | Location    | Emotion   |
|-------------|--------------------|-------------|-----------|
| 00:00–06:00 | Sleeping           | Home        | Sleeping  |
| 06:00–07:00 | Waking Up          | Home        | Tired     |
| 07:00–08:00 | Having Breakfast   | Café        | Happy     |
| 08:00–09:00 | Going to Work      | Office      | Working   |
| 09:00–12:00 | Working            | Office      | Working   |
| 12:00–13:00 | Having Lunch       | Café        | Eating    |
| 13:00–17:00 | Working            | Office      | Working   |
| 17:00–18:00 | Going Home         | Park        | Relaxing  |
| 18:00–19:00 | Relaxing at Park   | Park        | Happy     |
| 19:00–20:00 | Having Dinner      | Home        | Eating    |
| 20:00–22:00 | Evening Leisure    | Home        | Relaxing  |
| 22:00–24:00 | Sleeping           | Home        | Sleeping  |

Each agent's schedule is unique — Bob the Baker starts work at 06:00, Emma the Artist sleeps until 09:00, Frank runs his shop from 08:00–18:00, and so on.

---

## Town Map and Locations

The world spans **50×50 units** (coordinates −25 to +25 on both axes). Roads form a cross-grid: two horizontal roads at z = −6 and z = +6, and two vertical roads at x = −6 and x = +6.

### Public Locations

| Key     | Label  | World Coords (x, z) | Description                        |
|---------|--------|---------------------|------------------------------------|
| `office`| Office | (14, 10)            | Where Alice, Carol, Dave, Grace, Iris work |
| `cafe`  | Café   | (0, 10)             | Bob's bakery; breakfast, lunch, dinner spot |
| `park`  | Park   | (6, 0)              | Green zone with trees; social and leisure |
| `shop`  | Shop   | (14, 0)             | Frank's store; Henry shops here mornings |
| `plaza` | Plaza  | (0, 0)              | Central paved square with fountain |

### Residential Houses

Each agent has a private home in the residential zones (top-left and left edges of the map):

| Agent | Home Key      | World Coords (x, z) |
|-------|---------------|---------------------|
| Alice | `home_alice`  | (−18, −18)          |
| Bob   | `home_bob`    | (−10, −18)          |
| Carol | `home_carol`  | (−2, −18)           |
| Dave  | `home_dave`   | (6, −18)            |
| Emma  | `home_emma`   | (14, −18)           |
| Frank | `home_frank`  | (−18, −10)          |
| Grace | `home_grace`  | (−18, −2)           |
| Henry | `home_henry`  | (18, −18)           |
| Iris  | `home_iris`   | (−18, 6)            |
| Jack  | `home_jack`   | (−18, 14)           |

### Visual Rendering

The 2D canvas renderer draws the map at **900×700 pixels** using a linear world-to-canvas transform:

```
canvas_x = (world_x + 25) × (900 / 50)
canvas_y = (world_z + 25) × (700 / 50)
```

Sky background color shifts with the hour:

| Hour range | Color     | Period    |
|------------|-----------|-----------|
| 05:00–08:00 | `#ffd580` (amber) | Dawn |
| 08:00–18:00 | `#87ceeb` (sky blue) | Day |
| 18:00–20:00 | `#ff8c42` (orange) | Sunset |
| 20:00–22:00 | `#2b3a67` (dusk blue) | Dusk |
| 22:00–05:00 | `#0a0e2e` (deep navy) | Night |

At night (20:00–05:00) a semi-transparent dark overlay is drawn with 40 randomly scattered stars.

---

## Simulation Mechanics

### Schedule-Driven Movement

Every simulation tick, each agent's current hour is looked up against its `schedule` array. When the schedule entry's `location` changes (i.e., the hour crosses a boundary), the agent:

1. Picks a target position near the new location (with a small random offset for natural clustering)
2. Builds a new waypoint path via the road graph pathfinder
3. Begins walking toward the first waypoint

The agent's `currentActivity` and `emotion` are updated immediately to reflect the new schedule block.

### Road-Following Pathfinding (A\*)

Agents do **not** walk in straight lines through buildings. Instead, `src/simulation/pathfinding.ts` implements A\* on a road graph with 9 nodes:

```
RN_TL (−6, −6) ── RN_MT (0, −6) ── RN_TR (6, −6)
    |                   |                   |
RN_ML (−6, 0)  ── RN_C  (0, 0)  ── RN_MR (6, 0)
    |                   |                   |
RN_BL (−6, 6)  ── RN_MB (0, 6)  ── RN_BR (6, 6)
```

To travel from point A to point B:

1. Find the **nearest road node** to A (Manhattan distance)
2. Find the **nearest road node** to B
3. Run A\* between those two nodes along the edge graph
4. Append the final target position as the last waypoint

Agents advance through their waypoint list at **6 world units per second**, moving to the next waypoint once within 0.4 units of the current one.

### Conversations

At each tick, every pair of non-sleeping agents within **2.5 world units** of each other has a small probability of starting a conversation (`0.008 × effectiveDelta × 60` per frame). When triggered:

- Both agents receive a dialogue line chosen from the `DIALOGUES` matrix, cross-referencing their `dialogueStyle` values
- The conversation is shown as a speech bubble above each agent for **6 real seconds**
- The interaction is prepended to each agent's `memory` array (capped at 10 entries)
- Both agents' emotion is temporarily set to `chatting`

### Bobbing Animation

Each agent has a sinusoidal vertical bob on the canvas keyed to a per-agent random phase offset. This gives the map a sense of life even when agents are stationary.

---

## Time System

| Setting        | Value                                  |
|----------------|----------------------------------------|
| `MINUTES_PER_REAL_SECOND` | `1` — 1 real second = 1 game minute |
| Speed 1x       | 1 game minute / real second            |
| Speed 2x       | 2 game minutes / real second           |
| Speed 5x       | 5 game minutes / real second           |
| Speed 10x      | 10 game minutes / real second          |
| 1 game hour    | 60 real seconds at 1x                  |
| 1 full day     | 24 real minutes at 1x (2.4 min at 10x)|

Time is computed as a continuous floating-point accumulator and wraps at `24 × 60` minutes. Day count increments on each wrap.

---

## User Interface

The UI has three main sections, all driven by the Zustand `useSimulationStore`.

### Top Bar (fixed, above the map)

- **Current time** — large `HH:MM` display
- **Period badge** — icon and label (Morning / Afternoon / Evening / Night)
- **Day counter** — `Day N`
- **Speed selector** — toggle buttons for 1x, 2x, 5x, 10x
- **Pause / Resume** — green when running, red when paused
- **Tagline** — "Autonomous AI Town · Stanford Smallville-inspired" (right-aligned)

### Left Sidebar (240 px wide, full height)

- App title and tagline at the top
- Scrollable list of all 10 agent cards, each showing:
  - Colored circle with current emotion emoji
  - Agent name and role
  - Current activity label (e.g., "Having Breakfast")
  - Current location with icon (e.g., "☕ Café")
  - "→ Destination" when the agent is currently travelling
- Clicking a card selects that agent and opens the detail panel
- Clicking a selected card deselects it

### Right Detail Panel (300 px wide, slides in on agent selection)

- **Header** — agent name, role, emotion emoji, close button
- **Current Status** — three rows:
  - Current goal (activity + location from active schedule entry)
  - Current activity with emotion emoji
  - Location / "En route → Destination" when moving
- **Personality** — pill badges for each trait
- **Goals** — bulleted list of long-term goals
- **Daily Schedule** — full hour-by-hour table; current block is highlighted
- **Recent Conversations** — last 10 conversation entries with timestamp and partner name

### Town Map (canvas, center area)

- Rendered at 60 fps via `requestAnimationFrame`
- Click any agent dot to select / deselect it (within 20-pixel hit radius)
- Background, road, park, plaza, buildings, houses, and agents are all drawn in canvas 2D
- Agent dots bob sinusoidally and have a glow ring when selected
- Speech bubbles appear above agents during active conversations

---

## Project Structure

```
artifacts/3d-agent-world/
├── src/
│   ├── simulation/
│   │   ├── agentData.ts          # All agent definitions, locations, types, label maps
│   │   ├── simulationStore.ts    # Zustand store: tick loop, schedule, movement, conversations
│   │   └── pathfinding.ts        # A* road-graph pathfinding, waypoint builder
│   ├── components/
│   │   ├── Scene2D.tsx           # Primary HTML Canvas 2D renderer (active view)
│   │   ├── Scene3D.tsx           # Three.js/WebGL renderer (inactive in Replit sandbox)
│   │   ├── TopBar.tsx            # Fixed top bar: time, speed, pause/resume
│   │   ├── AgentsSidebar.tsx     # Left sidebar: agent list with status and location
│   │   ├── AgentDetailPanel.tsx  # Right panel: full agent profile, schedule, memory
│   │   ├── AgentMesh.tsx         # 3D agent mesh (used by Scene3D)
│   │   ├── DayNightSky.tsx       # 3D sky/lighting (used by Scene3D)
│   │   ├── TownMap.tsx           # 3D town geometry (used by Scene3D)
│   │   └── SimulationLoop.tsx    # Three.js frame loop driver (used by Scene3D)
│   ├── pages/
│   │   └── SimulationPage.tsx    # Top-level layout: composes all panels and the canvas
│   ├── App.tsx                   # Root component (renders SimulationPage)
│   ├── main.tsx                  # Vite entry point
│   └── index.css                 # Global reset and base styles
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## Key Source Files

### `src/simulation/agentData.ts`

The single source of truth for all agent data. Exports:

- `AGENTS` — array of 10 `AgentDefinition` objects (id, name, role, color, personality, goals, homeLocation, schedule, dialogueStyle)
- `LOCATIONS` — record mapping every `LocationKey` to world coordinates and a display label
- `EMOTION_EMOJI` — emoji string for each of the 10 emotion states
- `ACTIVITY_LABELS` — human-readable labels for each of the 13 activity types
- TypeScript types: `Emotion`, `Activity`, `LocationKey`, `Location`, `ScheduleEntry`, `AgentDefinition`

### `src/simulation/simulationStore.ts`

Zustand store driving the entire simulation. Exported store exposes:

| Field / Action    | Type                        | Description                                        |
|-------------------|-----------------------------|----------------------------------------------------|
| `agents`          | `Record<string, AgentState>`| Live state for all 10 agents                       |
| `gameHour`        | `number`                    | Current in-game hour (0–23)                        |
| `gameMinute`      | `number`                    | Current in-game minute (0–59)                      |
| `dayCount`        | `number`                    | How many full days have elapsed                    |
| `speed`           | `1 \| 2 \| 5 \| 10`        | Simulation speed multiplier                        |
| `isRunning`       | `boolean`                   | Whether the simulation is active                   |
| `selectedAgentId` | `string \| null`            | ID of the currently selected agent                 |
| `setSelectedAgent`| `(id) => void`              | Select or deselect an agent                        |
| `setSpeed`        | `(speed) => void`           | Change simulation speed                            |
| `togglePause`     | `() => void`                | Toggle pause/resume                                |
| `tick`            | `(delta: number) => void`   | Advance simulation by `delta` real seconds         |

`AgentState` per agent includes current and target positions, the active waypoint list and index, emotion, activity, location keys, conversation state, memory array, and animation offsets.

### `src/simulation/pathfinding.ts`

Exports a single function:

```typescript
buildPath(fromX, fromZ, toX, toZ): Array<[number, number]>
```

Internally uses A\* over a 9-node bidirectional road graph. Returns an ordered list of `[x, z]` waypoints from source to destination, routing via road intersection nodes.

### `src/components/Scene2D.tsx`

The primary rendering component. Uses a `requestAnimationFrame` loop to:

1. Call `store.tick(delta)` to advance simulation state
2. Draw the full town (background, ground, roads, park, plaza, buildings, houses)
3. Draw all agents (body circle, emotion emoji, name label, speech bubble)
4. Apply a night overlay with stars when `gameHour` is between 20:00 and 05:00

Click events on the canvas are mapped back to world space to detect agent selection within a 20-pixel hit radius.

### `src/components/Scene3D.tsx`

An alternative Three.js/WebGL renderer that detects WebGL context availability. When WebGL is not available (as in Replit's sandboxed preview), it automatically falls back to `Scene2D`. The 3D path is preserved for environments with GPU support.

### `src/components/TopBar.tsx`

Fixed 44 px bar rendered above the map viewport. Subscribes directly to the Zustand store for real-time time display and exposes speed and pause controls.

### `src/components/AgentsSidebar.tsx`

240 px wide fixed sidebar. Renders an agent card for each of the 10 agents with name, role, emotion emoji (in a colored circle), current activity, and current location / destination. Clicking a card calls `setSelectedAgent`.

### `src/components/AgentDetailPanel.tsx`

300 px wide panel that appears on the right when an agent is selected. Derives the agent's current scheduled goal from the active `ScheduleEntry`, shows the full daily schedule with the current block highlighted, lists conversation history from `agent.memory`, and shows personality traits and goals.

### `src/pages/SimulationPage.tsx`

Top-level layout component. Places `TopBar` (fixed, top), `AgentsSidebar` (fixed, left), `AgentDetailPanel` (fixed, right), and the `Scene3D` canvas area (fills remaining space from top: 44px, left: 240px).

---

## Dependencies

### Runtime Dependencies

| Package               | Version   | Purpose                                              |
|-----------------------|-----------|------------------------------------------------------|
| `zustand`             | `^5.0.12` | Lightweight React state management for the simulation store |
| `three`               | `^0.183.2`| 3D rendering library (used by the WebGL renderer path) |
| `@react-three/fiber`  | `^9.5.0`  | React bindings for Three.js scenes                   |
| `@react-three/drei`   | `^10.7.7` | Three.js helper components (OrbitControls, Environment, etc.) |

### Key Dev Dependencies

| Package               | Purpose                                              |
|-----------------------|------------------------------------------------------|
| `vite`                | Dev server and production bundler                    |
| `@vitejs/plugin-react`| Vite plugin for React JSX transform                  |
| `typescript`          | Static type checking                                 |
| `@types/three`        | TypeScript types for Three.js                        |
| `lucide-react`        | Icon set (used for the close button in the detail panel) |
| `tailwindcss`         | Utility CSS framework (available but minimally used here) |
| `react`, `react-dom`  | Core React libraries                                 |

---

## Getting Started

This package lives inside a pnpm monorepo. To run the development server:

```bash
pnpm --filter @workspace/3d-agent-world run dev
```

The app starts at `http://localhost:<PORT>` (port is assigned by the environment). The simulation begins automatically at 08:00 on Day 1.

To run a type-check without starting the server:

```bash
pnpm --filter @workspace/3d-agent-world run typecheck
```

To build for production:

```bash
pnpm --filter @workspace/3d-agent-world run build
```

---

## Extending the Simulation

### Adding a New Agent

1. Open `src/simulation/agentData.ts`
2. Add a new entry to the `AGENTS` array following the `AgentDefinition` interface
3. Add a `home_<name>` entry to the `LocationKey` union type and `LOCATIONS` record
4. The agent will automatically appear in the sidebar, on the map, and be eligible for conversations

```typescript
{
  id: 'kate',
  name: 'Kate',
  role: 'Nurse',
  color: '#FFD700',
  personality: ['Compassionate', 'Quick-thinking', 'Steady'],
  goals: ['Support patients', 'Learn new procedures', 'Find balance'],
  homeLocation: 'home_kate',
  dialogueStyle: 'formal',
  schedule: [
    { startHour: 0,  endHour: 7,  activity: 'sleeping',  location: 'home_kate', emotion: 'sleeping' },
    // ... rest of schedule
  ],
}
```

### Adding a New Location

1. Add the key to the `LocationKey` union in `agentData.ts`
2. Add a record entry to `LOCATIONS` with world `x` and `z` coordinates
3. Add a building rectangle to the `buildingData` array in `Scene2D.tsx`
4. Add an icon mapping to `LOCATION_ICONS` in `AgentsSidebar.tsx`

### Adding a New Schedule Activity

1. Add the activity string to the `Activity` union type in `agentData.ts`
2. Add a display label to `ACTIVITY_LABELS`
3. Reference it in any agent's `schedule` array

### Adding New Dialogue

Edit the `DIALOGUES` matrix in `simulationStore.ts`. The keys are `dialogueStyle` values; each sub-key is the partner's style. Add new lines to any pool or add new style keys to introduce new dialogue personalities.

### Adjusting the Road Graph

The pathfinding graph is defined as `ROAD_NODES` and `RAW_EDGES` in `src/simulation/pathfinding.ts`. Add new `WaypointNode` entries and connect them with bidirectional edge pairs to extend the road network.

### Changing Simulation Speed Defaults

The base rate is set by `MINUTES_PER_REAL_SECOND` in `simulationStore.ts` (currently `1`). Increase it to make the simulation run faster at all speeds. The speed multiplier (1x/2x/5x/10x) applies on top of this base rate.
