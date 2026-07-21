interface DividerProps {
  className?: string;
  color?: string;
}

/** Ornamental divider with a central diamond and tapered gold lines. */
export default function OrnateDivider({ className = '', color = '#d4af37' }: DividerProps) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden>
      <span
        className="h-px w-16 sm:w-24"
        style={{ background: `linear-gradient(90deg, transparent, ${color})` }}
      />
      <svg width="28" height="14" viewBox="0 0 28 14" fill="none">
        <path d="M14 1l4 6-4 6-4-6 4-6z" stroke={color} strokeWidth="1" />
        <circle cx="14" cy="7" r="1.5" fill={color} />
      </svg>
      <span
        className="h-px w-16 sm:w-24"
        style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
      />
    </div>
  );
}
