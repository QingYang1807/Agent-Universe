import { useSimulationStore } from '../simulation/simulationStore';

function getPeriod(h: number) {
  if (h >= 5 && h < 12) return { label: 'Morning', icon: '🌅' };
  if (h >= 12 && h < 17) return { label: 'Afternoon', icon: '☀️' };
  if (h >= 17 && h < 20) return { label: 'Evening', icon: '🌆' };
  return { label: 'Night', icon: '🌙' };
}

export default function TopBar() {
  const { gameHour, gameMinute, dayCount, speed, setSpeed, isRunning, togglePause } = useSimulationStore();

  const timeStr = `${String(gameHour).padStart(2, '0')}:${String(gameMinute).padStart(2, '0')}`;
  const period = getPeriod(gameHour);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 240,
        right: 0,
        height: 44,
        background: 'rgba(10,10,28,0.97)',
        borderBottom: '1px solid #2a2a4a',
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        padding: '0 18px',
        zIndex: 30,
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Time */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontSize: 20, fontWeight: 800, color: '#e0e0ff', letterSpacing: 1 }}>
          {timeStr}
        </span>
        <span style={{ fontSize: 12, color: '#888' }}>
          {period.icon} {period.label}
        </span>
        <span style={{ fontSize: 12, color: '#555', marginLeft: 4 }}>
          Day {dayCount}
        </span>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 22, background: '#2a2a4a' }} />

      {/* Speed */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 11, color: '#666' }}>Speed</span>
        <div style={{ display: 'flex', gap: 3 }}>
          {[1, 2, 5, 10].map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              style={{
                background: speed === s ? '#4466cc' : '#1a1a3a',
                border: `1px solid ${speed === s ? '#6688ee' : '#3a3a6a'}`,
                borderRadius: 4,
                color: speed === s ? '#fff' : '#888',
                fontSize: 11,
                padding: '2px 7px',
                cursor: 'pointer',
                fontWeight: speed === s ? 700 : 400,
                transition: 'all 0.1s',
              }}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 22, background: '#2a2a4a' }} />

      {/* Pause/Resume */}
      <button
        onClick={togglePause}
        style={{
          background: isRunning ? '#1a3a1a' : '#3a1a1a',
          border: `1px solid ${isRunning ? '#2a6a2a' : '#6a2a2a'}`,
          borderRadius: 6,
          color: isRunning ? '#6aff6a' : '#ff6a6a',
          fontSize: 12,
          padding: '4px 12px',
          cursor: 'pointer',
          fontWeight: 600,
          transition: 'all 0.1s',
        }}
      >
        {isRunning ? '⏸ Pause' : '▶ Resume'}
      </button>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Title badge */}
      <div style={{ fontSize: 11, color: '#444', fontStyle: 'italic' }}>
        Autonomous AI Town · Stanford Smallville-inspired
      </div>
    </div>
  );
}
