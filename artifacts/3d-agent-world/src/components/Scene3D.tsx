import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense, useState, useEffect } from 'react';
import TownMap from './TownMap';
import AgentMesh from './AgentMesh';
import DayNightSky from './DayNightSky';
import SimulationLoop from './SimulationLoop';
import { useSimulationStore } from '../simulation/simulationStore';
import Scene2D from './Scene2D';

function SceneContent() {
  const { agents, gameHour, gameMinute, selectedAgentId, setSelectedAgent } = useSimulationStore();

  return (
    <>
      <DayNightSky hour={gameHour} minute={gameMinute} />
      <SimulationLoop />
      <TownMap />
      {Object.values(agents).map((agent) => (
        <AgentMesh
          key={agent.id}
          agent={agent}
          isSelected={selectedAgentId === agent.id}
          onClick={() => setSelectedAgent(selectedAgentId === agent.id ? null : agent.id)}
        />
      ))}
      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        minDistance={5}
        maxDistance={60}
        maxPolarAngle={Math.PI / 2.1}
        target={[0, 0, 0]}
      />
    </>
  );
}

function checkWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return false;
    return true;
  } catch {
    return false;
  }
}

export default function Scene3D() {
  const [webglAvailable, setWebglAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    setWebglAvailable(checkWebGL());
  }, []);

  if (webglAvailable === null) return null;

  if (!webglAvailable) {
    return <Scene2D />;
  }

  return (
    <Canvas
      shadows
      gl={{ antialias: true, powerPreference: 'default' }}
      camera={{ position: [0, 28, 22], fov: 52, near: 0.1, far: 200 }}
      style={{ width: '100%', height: '100%' }}
      onPointerMissed={() => useSimulationStore.getState().setSelectedAgent(null)}
    >
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  );
}
