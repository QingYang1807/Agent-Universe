import Scene3D from '../components/Scene3D';
import AgentsSidebar from '../components/AgentsSidebar';
import AgentDetailPanel from '../components/AgentDetailPanel';
import TopBar from '../components/TopBar';

export default function SimulationPage() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#0a0a1e', position: 'relative' }}>
      <TopBar />
      <AgentsSidebar />
      <div
        style={{
          position: 'absolute',
          left: 240,
          right: 0,
          top: 44,
          bottom: 0,
        }}
      >
        <Scene3D />
      </div>
      <AgentDetailPanel />
    </div>
  );
}
