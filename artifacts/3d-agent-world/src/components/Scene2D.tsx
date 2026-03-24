import { useRef, useEffect, useCallback } from 'react';
import { useSimulationStore, type AgentState } from '../simulation/simulationStore';
import { EMOTION_EMOJI } from '../simulation/agentData';

const WORLD_SIZE = 50; // world units from -25 to +25
const CANVAS_W = 900;
const CANVAS_H = 700;
const WORLD_TO_CANVAS = CANVAS_W / WORLD_SIZE;

function worldToCanvas(wx: number, wz: number): [number, number] {
  return [
    (wx + WORLD_SIZE / 2) * WORLD_TO_CANVAS,
    (wz + WORLD_SIZE / 2) * (CANVAS_H / WORLD_SIZE),
  ];
}

function getSkyColor(hour: number): string {
  if (hour >= 5 && hour < 8) return '#ffd580';
  if (hour >= 8 && hour < 18) return '#87ceeb';
  if (hour >= 18 && hour < 20) return '#ff8c42';
  if (hour >= 20 && hour < 22) return '#2b3a67';
  return '#0a0e2e';
}

function drawBuilding(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  w: number,
  h: number,
  color: string,
  label: string,
  icon: string,
) {
  ctx.fillStyle = color;
  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(cx - w / 2, cy - h / 2, w, h, 6);
  ctx.fill();
  ctx.stroke();

  // Label
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 12px system-ui';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(icon + ' ' + label, cx, cy);
}

function drawHouse(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  color: string,
  name: string,
) {
  const w = 30;
  const h = 26;
  // House body
  ctx.fillStyle = color;
  ctx.strokeStyle = 'rgba(0,0,0,0.25)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.roundRect(cx - w / 2, cy - h / 2, w, h, 4);
  ctx.fill();
  ctx.stroke();

  // Roof (triangle above)
  ctx.fillStyle = '#c0392b';
  ctx.beginPath();
  ctx.moveTo(cx - w / 2 - 3, cy - h / 2);
  ctx.lineTo(cx + w / 2 + 3, cy - h / 2);
  ctx.lineTo(cx, cy - h / 2 - 10);
  ctx.closePath();
  ctx.fill();

  // Name
  ctx.fillStyle = '#333';
  ctx.font = '9px system-ui';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(name, cx, cy + 2);
}

function drawTree(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.fillStyle = '#5ab838';
  ctx.beginPath();
  ctx.arc(cx, cy, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#3d7a25';
  ctx.beginPath();
  ctx.arc(cx, cy - 2, 4, 0, Math.PI * 2);
  ctx.fill();
}

function drawAgent(
  ctx: CanvasRenderingContext2D,
  agent: AgentState,
  isSelected: boolean,
  t: number,
) {
  const [cx, cy] = worldToCanvas(agent.x, agent.z);
  const color = agent.definition.color;
  const bob = Math.sin(t * 2.5 + agent.bobOffset) * 2;

  // Selection glow
  if (isSelected) {
    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = 20;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx, cy - bob, 14, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // Body
  ctx.fillStyle = color;
  ctx.strokeStyle = isSelected ? '#fff' : 'rgba(0,0,0,0.3)';
  ctx.lineWidth = isSelected ? 2 : 1;
  ctx.beginPath();
  ctx.arc(cx, cy - bob, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Head highlight
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.beginPath();
  ctx.arc(cx - 3, cy - bob - 3, 4, 0, Math.PI * 2);
  ctx.fill();

  // Emoji
  const emoji = EMOTION_EMOJI[agent.emotion];
  ctx.font = '11px system-ui';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, cx + 12, cy - bob - 8);

  // Name
  ctx.font = `bold 10px system-ui`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.strokeText(agent.definition.name, cx, cy - bob + 20);
  ctx.fillText(agent.definition.name, cx, cy - bob + 20);

  // Speech bubble
  if (agent.conversationText) {
    const bx = cx - 5;
    const by = cy - bob - 35;
    const maxW = 120;
    ctx.font = '9px system-ui';
    const text = agent.conversationText.substring(0, 40);
    const tw = Math.min(ctx.measureText(text).width + 14, maxW);
    const th = 22;

    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(bx - tw / 2, by - th / 2, tw, th, 6);
    ctx.fill();
    ctx.stroke();

    // Tail
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.beginPath();
    ctx.moveTo(bx - 5, by + th / 2);
    ctx.lineTo(bx, by + th / 2 + 6);
    ctx.lineTo(bx + 5, by + th / 2);
    ctx.fill();

    ctx.fillStyle = '#222';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('💬 ' + text.substring(0, 18) + (text.length > 18 ? '…' : ''), bx, by);
  }
}

const TREE_POS_FIXED = [
  [3, -3], [5, -4], [7, -3], [4, -1], [8, -2],
  [3, 1], [5, 2], [7, 1], [4, 3], [6, 3],
];

export default function Scene2D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const tRef = useRef<number>(0);
  const lastTimestampRef = useRef<number>(0);

  const { agents, selectedAgentId, setSelectedAgent, gameHour, gameMinute, tick } = useSimulationStore.getState();

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = useSimulationStore.getState();
    const { agents, gameHour, selectedAgentId } = state;

    // Advance time
    const now = performance.now();
    const delta = Math.min((now - lastTimestampRef.current) / 1000, 0.1);
    lastTimestampRef.current = now;
    tRef.current += delta;
    state.tick(delta);

    const t = tRef.current;
    const skyColor = getSkyColor(gameHour);

    // Background
    ctx.fillStyle = skyColor;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Draw ground
    const [gx0, gy0] = worldToCanvas(-25, -25);
    const [gx1, gy1] = worldToCanvas(25, 25);
    ctx.fillStyle = '#7ec850';
    ctx.fillRect(gx0, gy0, gx1 - gx0, gy1 - gy0);

    // Roads
    const SCALE_X = CANVAS_W / WORLD_SIZE;
    const SCALE_Y = CANVAS_H / WORLD_SIZE;
    const roadW = 2 * SCALE_X;
    ctx.fillStyle = '#8a8a8a';
    const [rx, _ry] = worldToCanvas(-25, -6);
    ctx.fillRect(0, _ry - roadW / 2, CANVAS_W, roadW);
    const [rx2, _ry2] = worldToCanvas(-25, 6);
    ctx.fillRect(0, _ry2 - roadW / 2, CANVAS_W, roadW);
    const [_rx3, ry3] = worldToCanvas(-6, -25);
    ctx.fillRect(_rx3 - roadW / 2, 0, roadW, CANVAS_H);
    const [_rx4, ry4] = worldToCanvas(6, -25);
    ctx.fillRect(_rx4 - roadW / 2, 0, roadW, CANVAS_H);

    // Park zone
    const [px, py] = worldToCanvas(2, -4);
    const [px2, py2] = worldToCanvas(10, 4);
    ctx.fillStyle = '#5ab838';
    ctx.fillRect(px, py, px2 - px, py2 - py);

    // Trees in park
    TREE_POS_FIXED.forEach(([tx, tz]) => {
      const [tcx, tcy] = worldToCanvas(tx, tz);
      drawTree(ctx, tcx, tcy);
    });

    // Park label
    ctx.font = 'bold 12px system-ui';
    ctx.fillStyle = '#1a5c0a';
    ctx.textAlign = 'center';
    const [plx, ply] = worldToCanvas(6, -3.5);
    ctx.fillText('🌳 Park', plx, ply);

    // Plaza (paved center)
    const [plzx, plzy] = worldToCanvas(-2.5, -2.5);
    const [plzx2, plzy2] = worldToCanvas(2.5, 2.5);
    ctx.fillStyle = '#d0c8b0';
    ctx.fillRect(plzx, plzy, plzx2 - plzx, plzy2 - plzy);
    ctx.font = '11px system-ui';
    ctx.fillStyle = '#665544';
    const [plzcx, plzcy] = worldToCanvas(0, 0);
    ctx.textAlign = 'center';
    ctx.fillText('🏛 Plaza', plzcx, plzcy);

    // Fountain
    ctx.fillStyle = '#a0b8d0';
    ctx.beginPath();
    ctx.arc(plzcx, plzcy + 10, 8, 0, Math.PI * 2);
    ctx.fill();

    // Buildings
    const buildingData: Array<{ x: number; z: number; w: number; h: number; color: string; label: string; icon: string }> = [
      { x: 14, z: 10, w: 65, h: 44, color: '#5b8fa8', label: 'Office', icon: '🏢' },
      { x: 0, z: 10, w: 50, h: 36, color: '#e8b89a', label: 'Café', icon: '☕' },
      { x: 14, z: 0, w: 40, h: 36, color: '#f0c050', label: 'Shop', icon: '🛍' },
    ];

    buildingData.forEach(({ x, z, w, h, color, label, icon }) => {
      const [bx, bz] = worldToCanvas(x, z);
      drawBuilding(ctx, bx, bz, w, h, color, label, icon);
    });

    // Houses
    const houseData: Array<{ x: number; z: number; color: string; name: string }> = [
      { x: -18, z: -18, color: '#f4a262', name: 'Alice' },
      { x: -10, z: -18, color: '#ffd166', name: 'Bob' },
      { x: -2,  z: -18, color: '#06d6a0', name: 'Carol' },
      { x: 6,   z: -18, color: '#118ab2', name: 'Dave' },
      { x: 14,  z: -18, color: '#a8e6cf', name: 'Emma' },
      { x: -18, z: -10, color: '#dda0dd', name: 'Frank' },
      { x: -18, z: -2,  color: '#98d8c8', name: 'Grace' },
      { x: 18,  z: -18, color: '#f0a500', name: 'Henry' },
      { x: -18, z: 6,   color: '#e8a0bf', name: 'Iris' },
      { x: -18, z: 14,  color: '#b8b8ff', name: 'Jack' },
    ];

    houseData.forEach(({ x, z, color, name }) => {
      const [hx, hz] = worldToCanvas(x, z);
      drawHouse(ctx, hx, hz, color, name);
    });

    // Agents
    Object.values(agents).forEach((agent) => {
      drawAgent(ctx, agent, selectedAgentId === agent.id, t);
    });

    // Night overlay
    if (gameHour >= 20 || gameHour < 5) {
      ctx.fillStyle = 'rgba(0,0,40,0.35)';
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Draw some stars
      ctx.fillStyle = '#ffffffcc';
      for (let i = 0; i < 40; i++) {
        const sx = ((i * 137.5083) % CANVAS_W);
        const sy = ((i * 97.3141) % (CANVAS_H * 0.3));
        ctx.beginPath();
        ctx.arc(sx, sy, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    animRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    lastTimestampRef.current = performance.now();
    animRef.current = requestAnimationFrame(draw);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [draw]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;
    const cx = (e.clientX - rect.left) * scaleX;
    const cy = (e.clientY - rect.top) * scaleY;

    const state = useSimulationStore.getState();
    const agents = Object.values(state.agents);
    let closestId: string | null = null;
    let closestDist = 20;

    for (const agent of agents) {
      const [ax, ay] = worldToCanvas(agent.x, agent.z);
      const dist = Math.sqrt((cx - ax) ** 2 + (cy - ay) ** 2);
      if (dist < closestDist) {
        closestDist = dist;
        closestId = agent.id;
      }
    }

    if (closestId) {
      state.setSelectedAgent(state.selectedAgentId === closestId ? null : closestId);
    } else {
      state.setSelectedAgent(null);
    }
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a1e' }}>
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        onClick={handleClick}
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          cursor: 'pointer',
          borderRadius: 8,
          objectFit: 'contain',
        }}
      />
    </div>
  );
}
