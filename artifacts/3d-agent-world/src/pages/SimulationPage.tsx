import Scene3D from '../components/Scene3D';
import AgentsSidebar from '../components/AgentsSidebar';
import AgentDetailPanel from '../components/AgentDetailPanel';

export default function SimulationPage() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#0a0a1e', position: 'relative' }}>
      <AgentsSidebar />
      <div
        style={{
          position: 'absolute',
          left: 240,
          right: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <Scene3D />
      </div>
      <AgentDetailPanel />
    </div>
  );
}
