type LogoProps = {
  className?: string;
  wordmarkClassName?: string;
  showWordmark?: boolean;
};

export function PrumoMark({ className = "" }: { className?: string }) {
  return (
    // Official Prumo logomark (brand sheet primary logomark). Raster PNG with
    // transparent background; intrinsic size 66x220, sized for display via className.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/prumo-mark.png"
      alt=""
      aria-hidden="true"
      width={66}
      height={220}
      className={className}
    />
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
