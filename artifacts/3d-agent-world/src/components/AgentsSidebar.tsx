import { useSimulationStore } from '../simulation/simulationStore';
import { EMOTION_EMOJI, ACTIVITY_LABELS, LOCATIONS } from '../simulation/agentData';

const LOCATION_ICONS: Record<string, string> = {
  office:     '🏢',
  cafe:       '☕',
  park:       '🌳',
  shop:       '🛍',
  plaza:      '🏛',
  home_alice: '🏠',
  home_bob:   '🏠',
  home_carol: '🏠',
  home_dave:  '🏠',
  home_emma:  '🏠',
  home_frank: '🏠',
  home_grace: '🏠',
  home_henry: '🏠',
  home_iris:  '🏠',
  home_jack:  '🏠',
};

export default function AgentsSidebar() {
  const { agents, selectedAgentId, setSelectedAgent } = useSimulationStore();
  const agentList = Object.values(agents);

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: 240,
        background: 'rgba(10,10,20,0.97)',
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
        <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>
          Autonomous AI Town Simulation
        </div>
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
            const locationLabel = LOCATIONS[agent.currentLocation]?.label ?? agent.currentLocation;
            const locIcon = LOCATION_ICONS[agent.currentLocation] ?? '📍';
            const isMoving = agent.waypointIndex < agent.waypoints.length;
            const destLabel = isMoving
              ? LOCATIONS[agent.targetLocation]?.label ?? agent.targetLocation
              : null;

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
                  alignItems: 'flex-start',
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
                    marginTop: 2,
                  }}
                >
                  {emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Name + role */}
                  <div style={{ fontWeight: 600, fontSize: 13, color: isSelected ? def.color : '#ddd', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{def.name}</span>
                    <span style={{ fontSize: 10, color: '#555', fontWeight: 400, marginTop: 1 }}>{def.role}</span>
                  </div>
                  {/* Activity */}
                  <div style={{ fontSize: 11, color: '#777', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {ACTIVITY_LABELS[agent.currentActivity]}
                  </div>
                  {/* Location */}
                  <div style={{ fontSize: 10, color: '#4a7acc', marginTop: 2, display: 'flex', alignItems: 'center', gap: 3 }}>
                    <span>{locIcon}</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {destLabel
                        ? `→ ${destLabel}`
                        : locationLabel}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '8px 14px', borderTop: '1px solid #1a1a3a', fontSize: 10, color: '#444' }}>
        Click an agent to view their full profile
      </div>
    </div>
  );
}
