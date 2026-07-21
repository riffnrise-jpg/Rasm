import type { MotifKey } from '@/data/events';

interface MotifProps {
  motif: MotifKey;
  className?: string;
  color?: string;
}

/**
 * Decorative SVG motifs for each ceremony, drawn in a single elegant line-art style.
 */
export default function Motif({ motif, className = 'w-12 h-12', color = 'currentColor' }: MotifProps) {
  const common = {
    className,
    viewBox: '0 0 48 48',
    fill: 'none',
    stroke: color,
    strokeWidth: 1.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (motif) {
    case 'marigold':
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="4" />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2;
            const x1 = 24 + Math.cos(a) * 6;
            const y1 = 24 + Math.sin(a) * 6;
            const x2 = 24 + Math.cos(a) * 16;
            const y2 = 24 + Math.sin(a) * 16;
            return <path key={i} d={`M${x1} ${y1} L${x2} ${y2}`} />;
          })}
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
            const cx = 24 + Math.cos(a) * 11;
            const cy = 24 + Math.sin(a) * 11;
            return <circle key={i} cx={cx} cy={cy} r="3.5" />;
          })}
        </svg>
      );
    case 'music':
      return (
        <svg {...common}>
          <path d="M14 34V14l20-4v20" />
          <circle cx="11" cy="34" r="3.5" />
          <circle cx="31" cy="30" r="3.5" />
          <path d="M14 20l20-4" />
        </svg>
      );
    case 'henna':
      return (
        <svg {...common}>
          <path d="M24 6c-3 6-3 10 0 14 3-4 3-8 0-14z" />
          <path d="M24 20c-5 2-8 6-8 11 0 5 4 9 8 11 4-2 8-6 8-11 0-5-3-9-8-11z" />
          <path d="M24 24v14" />
          <path d="M20 28c2 1 4 3 4 6M28 28c-2 1-4 3-4 6" />
          <circle cx="24" cy="10" r="1.5" fill={color} />
        </svg>
      );
    case 'dhol':
      return (
        <svg {...common}>
          <ellipse cx="24" cy="14" rx="12" ry="4" />
          <path d="M12 14v20c0 2.2 5.4 4 12 4s12-1.8 12-4V14" />
          <path d="M24 18v18" opacity="0.4" />
          <path d="M16 22c2 1 4 1 8 0M16 28c2 1 4 1 8 0" />
          <path d="M8 8l6 4M40 8l-6 4M8 40l6-4M40 40l-6-4" />
        </svg>
      );
    case 'floral':
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="3" />
          {Array.from({ length: 6 }).map((_, i) => {
            const a = (i / 6) * Math.PI * 2;
            const cx = 24 + Math.cos(a) * 9;
            const cy = 24 + Math.sin(a) * 9;
            return <ellipse key={i} cx={cx} cy={cy} rx="4" ry="2.5" transform={`rotate(${(a * 180) / Math.PI} ${cx} ${cy})`} />;
          })}
          <path d="M24 33v9M20 40c2 1 6 1 8 0" />
        </svg>
      );
    default:
      return null;
  }
}
