import * as THREE from 'three';
import { useMemo } from 'react';
import { Text } from '@react-three/drei';

interface BuildingProps {
  x: number;
  z: number;
  w: number;
  h: number;
  d: number;
  color: string;
  label?: string;
}

function Building({ x, z, w, h, d, color, label }: BuildingProps) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshLambertMaterial color={color} />
      </mesh>
      {label && (
        <Text
          position={[0, h + 0.6, 0]}
          fontSize={0.55}
          color="#222"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#fff"
        >
          {label}
        </Text>
      )}
    </group>
  );
}

function Road({ x1, z1, x2, z2 }: { x1: number; z1: number; x2: number; z2: number }) {
  const midX = (x1 + x2) / 2;
  const midZ = (z1 + z2) / 2;
  const lenX = Math.abs(x2 - x1) + 1.5;
  const lenZ = Math.abs(z2 - z1) + 1.5;
  return (
    <mesh position={[midX, 0.01, midZ]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[lenX, lenZ]} />
      <meshLambertMaterial color="#8a8a8a" />
    </mesh>
  );
}

function House({ x, z, color, label }: { x: number; z: number; color: string; label: string }) {
  return (
    <group position={[x, 0, z]}>
      {/* Walls */}
      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[3, 2, 3]} />
        <meshLambertMaterial color={color} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <coneGeometry args={[2.3, 1.2, 4]} />
        <meshLambertMaterial color="#c0392b" />
      </mesh>
      <Text
        position={[0, 3.5, 0]}
        fontSize={0.45}
        color="#333"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#fff"
      >
        {label}
      </Text>
    </group>
  );
}

function Tree({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 1.5, 6]} />
        <meshLambertMaterial color="#6b3a2a" />
      </mesh>
      <mesh position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.9, 8, 6]} />
        <meshLambertMaterial color="#2d8a3e" />
      </mesh>
    </group>
  );
}

const TREE_POSITIONS = [
  [3, -3], [5, -4], [7, -3], [4, -1], [8, -2],
  [3, 1], [5, 2], [7, 1], [4, 3], [6, 3],
  [3, -6], [5, -7], [7, -6], [8, -5],
  [-5, 6], [-4, 8], [-6, 7], [-3, 9],
];

export default function TownMap() {
  const treePositions = useMemo(() => TREE_POSITIONS, []);

  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshLambertMaterial color="#7ec850" />
      </mesh>

      {/* Roads - horizontal and vertical grid */}
      <Road x1={-25} z1={-6} x2={25} z2={-6} />
      <Road x1={-25} z1={6} x2={25} z2={6} />
      <Road x1={-6} z1={-25} x2={-6} z2={25} />
      <Road x1={6} z1={-25} x2={6} z2={25} />

      {/* Pavement / sidewalk paths */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <meshLambertMaterial color="#c8b89a" />
      </mesh>

      {/* Park - green area */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[6, 0.02, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshLambertMaterial color="#5ab838" />
      </mesh>
      <Text position={[6, 0.05, -3]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.6} color="#1a5c0a">
        🌳 Park
      </Text>

      {/* Trees in park */}
      {treePositions.map(([tx, tz], i) => (
        <Tree key={i} x={tx} z={tz} />
      ))}

      {/* Office Building */}
      <Building x={14} z={10} w={7} h={5} d={5} color="#5b8fa8" label="🏢 Office" />

      {/* Café */}
      <Building x={0} z={10} w={5} h={3} d={4} color="#e8b89a" label="☕ Café" />

      {/* Shop */}
      <Building x={14} z={0} w={4} h={3} d={4} color="#f0c050" label="🛍 Shop" />

      {/* Plaza */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]} receiveShadow>
        <planeGeometry args={[5, 5]} />
        <meshLambertMaterial color="#d0c8b0" />
      </mesh>
      <Text position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.55} color="#665544">
        🏛 Plaza
      </Text>

      {/* Houses - residential area in NW */}
      <House x={-18} z={-18} color="#f4a262" label="Alice" />
      <House x={-10} z={-18} color="#ffd166" label="Bob" />
      <House x={-2}  z={-18} color="#06d6a0" label="Carol" />
      <House x={6}   z={-18} color="#118ab2" label="Dave" />
      <House x={14}  z={-18} color="#a8e6cf" label="Emma" />
      <House x={-18} z={-10} color="#dda0dd" label="Frank" />
      <House x={-18} z={-2}  color="#98d8c8" label="Grace" />
      <House x={18}  z={-18} color="#f0a500" label="Henry" />
      <House x={-18} z={6}   color="#e8a0bf" label="Iris" />
      <House x={-18} z={14}  color="#b8b8ff" label="Jack" />

      {/* Fence around park */}
      <mesh position={[6, 0.3, -4]} castShadow>
        <boxGeometry args={[8, 0.5, 0.15]} />
        <meshLambertMaterial color="#6b4c2a" />
      </mesh>
      <mesh position={[6, 0.3, 4]} castShadow>
        <boxGeometry args={[8, 0.5, 0.15]} />
        <meshLambertMaterial color="#6b4c2a" />
      </mesh>
      <mesh position={[2, 0.3, 0]} castShadow>
        <boxGeometry args={[0.15, 0.5, 8]} />
        <meshLambertMaterial color="#6b4c2a" />
      </mesh>
      <mesh position={[10, 0.3, 0]} castShadow>
        <boxGeometry args={[0.15, 0.5, 8]} />
        <meshLambertMaterial color="#6b4c2a" />
      </mesh>

      {/* Bench in park */}
      <mesh position={[5, 0.3, 1]}>
        <boxGeometry args={[1.5, 0.15, 0.5]} />
        <meshLambertMaterial color="#8b5e3c" />
      </mesh>
      <mesh position={[8, 0.3, -1]}>
        <boxGeometry args={[1.5, 0.15, 0.5]} />
        <meshLambertMaterial color="#8b5e3c" />
      </mesh>

      {/* Fountain in plaza */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[1, 1.2, 0.5, 16]} />
        <meshLambertMaterial color="#a0b8d0" />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
        <meshLambertMaterial color="#c0d0e0" />
      </mesh>
    </group>
  );
}
