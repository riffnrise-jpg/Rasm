import { useEffect, useMemo, useState } from 'react';

interface Petal {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  hue: string;
  rotate: number;
}

const PALETTE = ['#d4af37', '#e3a7ad', '#f3d98c', '#cf6a76', '#b8932a', '#f87171'];

/**
 * Cinematic animated background: floating golden petals + drifting light mesh.
 * Pure CSS/SVG animation — no video assets.
 */
export default function ParticleBackground({ density = 18 }: { density?: number }) {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    const arr: Petal[] = Array.from({ length: density }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 6 + Math.random() * 10,
      duration: 12 + Math.random() * 14,
      delay: Math.random() * 14,
      drift: (Math.random() - 0.5) * 120,
      hue: PALETTE[i % PALETTE.length],
      rotate: Math.random() * 360,
    }));
    setPetals(arr);
  }, [density]);

  const meshes = useMemo(
    () => [
      { x: '10%', y: '15%', c: 'rgba(94,18,32,0.5)', s: 60, d: '0s' },
      { x: '80%', y: '20%', c: 'rgba(212,175,55,0.18)', s: 50, d: '-6s' },
      { x: '60%', y: '75%', c: 'rgba(94,18,32,0.35)', s: 55, d: '-12s' },
      { x: '25%', y: '80%', c: 'rgba(212,175,55,0.12)', s: 45, d: '-3s' },
    ],
    [],
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      {/* drifting light mesh */}
      <div className="absolute inset-0">
        {meshes.map((m, i) => (
          <div
            key={i}
            className="absolute rounded-full blur-3xl animate-meshShift"
            style={{
              left: m.x,
              top: m.y,
              width: `${m.s}vmax`,
              height: `${m.s}vmax`,
              background: `radial-gradient(circle, ${m.c}, transparent 70%)`,
              animationDelay: m.d,
            }}
          />
        ))}
      </div>

      {/* floating petals */}
      <div className="absolute inset-0">
        {petals.map((p) => (
          <div
            key={p.id}
            className="absolute bottom-[-10vh] animate-floatUp"
            style={{
              left: `${p.left}%`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              ['--drift' as string]: `${p.drift}px`,
            }}
          >
            <PetalShape size={p.size} color={p.hue} rotate={p.rotate} />
          </div>
        ))}
      </div>

      {/* subtle vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(10,6,6,0.7)_100%)]" />
    </div>
  );
}

function PetalShape({ size, color, rotate }: { size: number; color: string; rotate: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ transform: `rotate(${rotate}deg)`, opacity: 0.7 }}
    >
      <path
        d="M12 2c4 4 6 7 6 11a6 6 0 1 1-12 0c0-4 2-7 6-11z"
        fill={color}
        opacity="0.85"
      />
      <path
        d="M12 4c3 3 4.5 5.5 4.5 9a4.5 4.5 0 1 1-9 0c0-3.5 1.5-6 4.5-9z"
        fill="#fff"
        opacity="0.15"
      />
    </svg>
  );
}
