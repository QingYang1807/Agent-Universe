import { useFrame } from '@react-three/fiber';
import { useSimulationStore } from '../simulation/simulationStore';

export default function SimulationLoop() {
  const tick = useSimulationStore((s) => s.tick);

  useFrame((_state, delta) => {
    tick(delta);
  });

  return null;
}
