type PrumoLinesProps = {
  positions: number[];
  className?: string;
};

export function PrumoLines({ positions, className = "" }: PrumoLinesProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`.trim()}
    >
      {positions.map((left, i) => (
        <span key={i} className="prumo-line" style={{ left: `${left}%` }} />
      ))}
    </div>
  );
}
