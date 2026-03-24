import { useSimulationStore } from '../simulation/simulationStore';
import { EMOTION_EMOJI, ACTIVITY_LABELS } from '../simulation/agentData';

export default function AgentsSidebar() {
  const { agents, selectedAgentId, setSelectedAgent, gameHour, gameMinute, dayCount, speed, setSpeed, isRunning, togglePause } = useSimulationStore();

  const timeStr = `${String(gameHour).padStart(2, '0')}:${String(gameMinute).padStart(2, '0')}`;
  const agentList = Object.values(agents);

  const getPeriod = (h: number) => {
    if (h >= 5 && h < 12) return '🌅 Morning';
    if (h >= 12 && h < 17) return '☀️ Afternoon';
    if (h >= 17 && h < 20) return '🌆 Evening';
    return '🌙 Night';
  };

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: 240,
        background: 'rgba(10,10,20,0.95)',
        borderRight: '1px solid #2a2a4a',
        color: '#f0f0f0',
        overflowY: 'auto',
        zIndex: 20,
        fontFamily: 'system-ui, sans-serif',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Title */}
      <div
        style={{
          padding: '14px 14px 10px',
          borderBottom: '1px solid #2a2a4a',
          background: 'linear-gradient(180deg, #1a1a3e 0%, #0a0a1e 100%)',
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 15, color: '#a0c4ff', letterSpacing: 0.5 }}>
          🏘 Agent Community
        </div>
        <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>
          Autonomous AI Town Simulation
        </div>
      </div>

      {/* Clock */}
      <div
        style={{
          padding: '10px 14px',
          borderBottom: '1px solid #1a1a3a',
          background: '#0d0d22',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#e0e0ff', letterSpacing: 1, lineHeight: 1 }}>
              {timeStr}
            </div>
            <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>
              {getPeriod(gameHour)} · Day {dayCount}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: '#666' }}>Speed</div>
            <div style={{ display: 'flex', gap: 3, marginTop: 3 }}>
              {[1, 2, 5, 10].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  style={{
                    background: speed === s ? '#4466cc' : '#1a1a3a',
                    border: '1px solid #3a3a6a',
                    borderRadius: 4,
                    color: speed === s ? '#fff' : '#888',
                    fontSize: 10,
                    padding: '2px 5px',
                    cursor: 'pointer',
                    fontWeight: speed === s ? 700 : 400,
                  }}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={togglePause}
          style={{
            marginTop: 8,
            width: '100%',
            padding: '5px 0',
            background: isRunning ? '#1a3a1a' : '#3a1a1a',
            border: `1px solid ${isRunning ? '#2a6a2a' : '#6a2a2a'}`,
            borderRadius: 6,
            color: isRunning ? '#6aff6a' : '#ff6a6a',
            fontSize: 12,
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          {isRunning ? '⏸ Pause' : '▶ Resume'}
        </button>
      </div>

      {/* Agent List */}
      <div style={{ padding: '8px 10px', flex: 1 }}>
        <div style={{ fontSize: 10, color: '#555', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
          {agentList.length} Agents
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {agentList.map((agent) => {
            const def = agent.definition;
            const emoji = EMOTION_EMOJI[agent.emotion];
            const isSelected = selectedAgentId === agent.id;
            return (
              <div
                key={agent.id}
                onClick={() => setSelectedAgent(isSelected ? null : agent.id)}
                style={{
                  background: isSelected ? `${def.color}22` : '#0d0d1e',
                  border: `1px solid ${isSelected ? def.color : '#2a2a4a'}`,
                  borderRadius: 8,
                  padding: '8px 10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 0.15s',
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: def.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 15,
                    flexShrink: 0,
                  }}
                >
                  {emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: isSelected ? def.color : '#ddd', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{def.name}</span>
                    <span style={{ fontSize: 11, color: '#666', fontWeight: 400 }}>{def.role}</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#777', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {ACTIVITY_LABELS[agent.currentActivity]}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer help */}
      <div style={{ padding: '8px 14px', borderTop: '1px solid #1a1a3a', fontSize: 10, color: '#444' }}>
        Click an agent to view their full profile
      </div>
    </div>
  );
}
