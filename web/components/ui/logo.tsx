type LogoProps = {
  className?: string;
};

export function Logo({ className = "" }: LogoProps) {
  return (
    <span className={`inline-flex items-center leading-none ${className}`}>
      {/* Official Prumo wordmark. Transparent PNG (white lettering), intrinsic 657x188. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/prumo-logo.png"
        alt=""
        aria-hidden="true"
        width={657}
        height={188}
        className="h-7 w-auto"
      />
      <span className="sr-only">Prumo</span>
    </span>
  );
}
