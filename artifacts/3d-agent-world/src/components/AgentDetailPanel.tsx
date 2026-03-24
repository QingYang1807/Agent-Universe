import { X } from 'lucide-react';
import { useSimulationStore } from '../simulation/simulationStore';
import { EMOTION_EMOJI, ACTIVITY_LABELS, LOCATIONS } from '../simulation/agentData';

export default function AgentDetailPanel() {
  const { agents, selectedAgentId, setSelectedAgent, gameHour } = useSimulationStore();

  if (!selectedAgentId) return null;
  const agent = agents[selectedAgentId];
  if (!agent) return null;

  const def = agent.definition;
  const emoji = EMOTION_EMOJI[agent.emotion];

  // Derive "current goal" from the active schedule entry
  const scheduleEntry = def.schedule.find(
    (s) => gameHour >= s.startHour && gameHour < s.endHour,
  ) ?? def.schedule[0];
  const currentGoalLabel = ACTIVITY_LABELS[scheduleEntry.activity];
  const currentGoalLocation = LOCATIONS[scheduleEntry.location]?.label ?? scheduleEntry.location;
  const isMoving = agent.waypointIndex < agent.waypoints.length;
  const destLocationLabel = LOCATIONS[agent.targetLocation]?.label ?? agent.targetLocation;

  return (
    <div
      style={{
        position: 'fixed',
        right: 0,
        top: 0,
        bottom: 0,
        width: 300,
        background: 'rgba(15,15,25,0.96)',
        borderLeft: `3px solid ${def.color}`,
        color: '#f0f0f0',
        overflowY: 'auto',
        zIndex: 30,
        fontFamily: 'system-ui, sans-serif',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '18px 16px 12px',
          borderBottom: `1px solid ${def.color}44`,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: '50%',
            background: def.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            flexShrink: 0,
          }}
        >
          {emoji}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: def.color }}>
            {def.name}
          </div>
          <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>{def.role}</div>
        </div>
        <button
          onClick={() => setSelectedAgent(null)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#888',
            padding: 4,
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Status */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #333' }}>
        <div style={{ fontSize: 11, color: '#888', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>
          Current Status
        </div>
        <div
          style={{
            background: '#1a1a2e',
            borderRadius: 8,
            padding: '10px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
          }}
        >
          {/* Current goal (derived from schedule) */}
          <div style={{ fontSize: 12, color: def.color, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
            <span>🎯</span>
            <span>
              {currentGoalLabel}
              {currentGoalLocation ? ` @ ${currentGoalLocation}` : ''}
            </span>
          </div>
          {/* Activity */}
          <div style={{ fontSize: 13, color: '#fff', display: 'flex', alignItems: 'center', gap: 5 }}>
            <span>{emoji}</span>
            <span>{ACTIVITY_LABELS[agent.currentActivity]}</span>
          </div>
          {/* Location / moving status */}
          <div style={{ fontSize: 12, color: '#aaa', display: 'flex', alignItems: 'center', gap: 5 }}>
            <span>📍</span>
            <span>
              {isMoving
                ? `En route → ${destLocationLabel}`
                : LOCATIONS[agent.currentLocation]?.label ?? agent.currentLocation}
            </span>
          </div>
        </div>
      </div>

      {/* Personality */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #333' }}>
        <div style={{ fontSize: 11, color: '#888', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
          Personality
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {def.personality.map((trait) => (
            <span
              key={trait}
              style={{
                background: `${def.color}22`,
                border: `1px solid ${def.color}55`,
                borderRadius: 20,
                padding: '3px 10px',
                fontSize: 12,
                color: def.color,
              }}
            >
              {trait}
            </span>
          ))}
        </div>
      </div>

      {/* Goals */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #333' }}>
        <div style={{ fontSize: 11, color: '#888', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
          Goals
        </div>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 5 }}>
          {def.goals.map((goal, i) => (
            <li key={i} style={{ fontSize: 12, color: '#ccc', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
              <span style={{ color: def.color, marginTop: 1 }}>›</span>
              {goal}
            </li>
          ))}
        </ul>
      </div>

      {/* Daily Schedule */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #333' }}>
        <div style={{ fontSize: 11, color: '#888', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
          Daily Schedule
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {def.schedule.map((entry, i) => {
            const isCurrent = agent.currentActivity === entry.activity &&
              agent.targetLocation === entry.location;
            return (
              <div
                key={i}
                style={{
                  background: isCurrent ? `${def.color}22` : '#1a1a2e',
                  border: isCurrent ? `1px solid ${def.color}55` : '1px solid #2a2a3e',
                  borderRadius: 6,
                  padding: '5px 8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: 11, color: isCurrent ? def.color : '#aaa' }}>
                  {String(entry.startHour).padStart(2, '0')}:00–{String(entry.endHour).padStart(2, '0')}:00
                </span>
                <span style={{ fontSize: 11, color: isCurrent ? '#fff' : '#888', textAlign: 'right', flex: 1, marginLeft: 8 }}>
                  {ACTIVITY_LABELS[entry.activity]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Memory / Conversations */}
      <div style={{ padding: '12px 16px', flex: 1 }}>
        <div style={{ fontSize: 11, color: '#888', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
          Recent Conversations
        </div>
        {agent.memory.length === 0 ? (
          <div style={{ fontSize: 12, color: '#555', fontStyle: 'italic' }}>No conversations yet...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {agent.memory.map((mem, i) => (
              <div
                key={i}
                style={{
                  background: '#1a1a2e',
                  borderRadius: 8,
                  padding: '8px 10px',
                  borderLeft: `3px solid ${def.color}`,
                }}
              >
                <div style={{ fontSize: 10, color: '#666', marginBottom: 3 }}>
                  {mem.time} · with {mem.partnerName}
                </div>
                <div style={{ fontSize: 12, color: '#ddd' }}>"{mem.text}"</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
