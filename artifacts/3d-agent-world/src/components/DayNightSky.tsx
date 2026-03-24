import * as THREE from 'three';
import { useMemo } from 'react';

interface DayNightSkyProps {
  hour: number;
  minute: number;
}

function getSkyColor(hour: number): string {
  if (hour >= 5 && hour < 8) return '#FFB347'; // sunrise orange
  if (hour >= 8 && hour < 18) return '#87CEEB'; // day blue
  if (hour >= 18 && hour < 20) return '#FF7043'; // sunset red-orange
  if (hour >= 20 && hour < 22) return '#2B3A67'; // dusk
  return '#0A0E2E'; // night dark blue
}

function getLightIntensity(hour: number): { ambient: number; directional: number; color: string } {
  if (hour >= 5 && hour < 8) return { ambient: 0.5, directional: 0.7, color: '#FFB347' };
  if (hour >= 8 && hour < 17) return { ambient: 0.8, directional: 1.2, color: '#FFF5E0' };
  if (hour >= 17 && hour < 20) return { ambient: 0.5, directional: 0.6, color: '#FF8C42' };
  if (hour >= 20 && hour < 22) return { ambient: 0.3, directional: 0.2, color: '#7788bb' };
  return { ambient: 0.15, directional: 0.05, color: '#445599' };
}

function getSunPosition(hour: number, minute: number): [number, number, number] {
  const t = (hour + minute / 60) / 24;
  const angle = t * Math.PI * 2 - Math.PI / 2;
  const radius = 30;
  return [Math.cos(angle) * radius, Math.abs(Math.sin(angle)) * 25 + 5, -15];
}

export default function DayNightSky({ hour, minute }: DayNightSkyProps) {
  const skyColor = useMemo(() => getSkyColor(hour), [hour]);
  const lightProps = useMemo(() => getLightIntensity(hour), [hour]);
  const sunPos = useMemo(() => getSunPosition(hour, minute), [hour, minute]);
  const isNight = hour >= 20 || hour < 5;
  const isSunrise = hour >= 5 && hour < 8;
  const isSunset = hour >= 18 && hour < 20;

  return (
    <>
      {/* Background color */}
      <color attach="background" args={[skyColor]} />
      <fog attach="fog" args={[skyColor, 35, 70]} />

      {/* Ambient light */}
      <ambientLight intensity={lightProps.ambient} color={lightProps.color} />

      {/* Directional sun/moon light */}
      <directionalLight
        position={sunPos}
        intensity={lightProps.directional}
        color={lightProps.color}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={100}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />

      {/* Sun/Moon sphere */}
      <mesh position={sunPos}>
        <sphereGeometry args={[isNight ? 1.5 : 2.5, 16, 16]} />
        <meshBasicMaterial
          color={isNight ? '#fffce8' : isSunrise || isSunset ? '#FF8C42' : '#FFFDD0'}
        />
      </mesh>

      {/* Stars at night */}
      {isNight && (
        <group>
          {Array.from({ length: 60 }, (_, i) => {
            const x = Math.cos(i * 2.399) * (20 + (i % 10) * 2);
            const y = 15 + (i % 8) * 2;
            const z = Math.sin(i * 2.399) * (20 + (i % 10) * 2) - 15;
            return (
              <mesh key={i} position={[x, y, z]}>
                <sphereGeometry args={[0.12, 4, 4]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
            );
          })}
        </group>
      )}
    </>
  );
}
