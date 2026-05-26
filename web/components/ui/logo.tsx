type LogoProps = {
  className?: string;
  wordmarkClassName?: string;
  showWordmark?: boolean;
};

export function PrumoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="6"
        r="4"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <line
        x1="12"
        y1="10"
        x2="12"
        y2="58"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <path d="M12 58 L22 68 L12 94 L2 68 Z" fill="currentColor" />
    </svg>
  );
}

export function Logo({
  className = "",
  wordmarkClassName = "",
  showWordmark = true,
}: LogoProps) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 leading-none ${className}`}
    >
      <PrumoMark className="h-7 w-auto" />
      {showWordmark && (
        <span
          className={`font-display text-2xl tracking-tight ${wordmarkClassName}`}
        >
          Prumo
        </span>
      )}
      <span className="sr-only">Prumo</span>
    </span>
  );
}
