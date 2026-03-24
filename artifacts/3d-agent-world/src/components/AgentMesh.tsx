import * as THREE from 'three';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import { type AgentState } from '../simulation/simulationStore';
import { EMOTION_EMOJI } from '../simulation/agentData';

interface AgentMeshProps {
  agent: AgentState;
  isSelected: boolean;
  onClick: () => void;
}

export default function AgentMesh({ agent, isSelected, onClick }: AgentMeshProps) {
  const bodyRef = useRef<THREE.Mesh>(null!);
  const groupRef = useRef<THREE.Group>(null!);

  const color = agent.definition.color;

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    // Smooth position update
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      agent.x,
      0.12,
    );
    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z,
      agent.z,
      0.12,
    );
    // Bobbing
    if (bodyRef.current) {
      const isSleeping = agent.currentActivity === 'sleeping';
      const bobSpeed = isSleeping ? 0.5 : 2.5;
      const bobAmt = isSleeping ? 0.04 : 0.08;
      bodyRef.current.position.y = 0.6 + Math.sin(clock.elapsedTime * bobSpeed + agent.bobOffset) * bobAmt;
    }
  });

  const isSleeping = agent.currentActivity === 'sleeping';
  const emoji = EMOTION_EMOJI[agent.emotion];

  const conversationLines = useMemo(() => {
    if (!agent.conversationText) return [];
    const text = agent.conversationText;
    const words = text.split(' ');
    const lines: string[] = [];
    let current = '';
    for (const w of words) {
      if ((current + ' ' + w).length > 20 && current) {
        lines.push(current);
        current = w;
      } else {
        current = current ? current + ' ' + w : w;
      }
    }
    if (current) lines.push(current);
    return lines;
  }, [agent.conversationText]);

  return (
    <group
      ref={groupRef}
      position={[agent.x, 0, agent.z]}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
    >
      {/* Body */}
      <mesh ref={bodyRef} position={[0, 0.6, 0]} castShadow>
        <capsuleGeometry args={[0.3, 0.6, 4, 8]} />
        <meshLambertMaterial color={isSelected ? '#fff' : color} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.45, 0]} castShadow>
        <sphereGeometry args={[0.28, 10, 8]} />
        <meshLambertMaterial color={color} />
      </mesh>

      {/* Selection ring */}
      {isSelected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.55, 0.7, 24]} />
          <meshBasicMaterial color="#fff" transparent opacity={0.8} />
        </mesh>
      )}

      {/* Name label */}
      <Text
        position={[0, 2.0, 0]}
        fontSize={0.38}
        color={isSelected ? '#fff' : '#111'}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor={isSelected ? '#333' : '#fff'}
      >
        {agent.definition.name}
      </Text>

      {/* Role label */}
      <Text
        position={[0, 1.7, 0]}
        fontSize={0.27}
        color={color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#fff"
      >
        {agent.definition.role}
      </Text>

      {/* Emoji float */}
      {!isSleeping && (
        <Text
          position={[0.6, 1.9, 0]}
          fontSize={0.45}
          anchorX="center"
          anchorY="middle"
        >
          {emoji}
        </Text>
      )}

      {/* Zzz for sleeping */}
      {isSleeping && (
        <Text
          position={[0.5, 2.0, 0]}
          fontSize={0.4}
          color="#8888ff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#fff"
        >
          💤
        </Text>
      )}

      {/* Speech bubble */}
      {agent.conversationText && conversationLines.length > 0 && (
        <Html
          position={[0, 2.6, 0]}
          center
          style={{ pointerEvents: 'none' }}
        >
          <div
            style={{
              background: 'rgba(255,255,255,0.95)',
              border: `2px solid ${color}`,
              borderRadius: 10,
              padding: '5px 9px',
              fontSize: 11,
              fontWeight: 600,
              color: '#222',
              maxWidth: 140,
              textAlign: 'center',
              whiteSpace: 'pre-wrap',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              lineHeight: 1.4,
            }}
          >
            💬 {agent.conversationText}
          </div>
        </Html>
      )}
    </group>
  );
}
