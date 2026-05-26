import type { CSSProperties, ReactNode } from "react";

type StarBorderProps = {
  children: ReactNode;
  color?: string;
  speed?: string;
  thickness?: number;
  borderRadius?: number;
  className?: string;
  style?: CSSProperties;
};

export function StarBorder({
  children,
  color = "rgba(255,255,255,0.75)",
  speed = "6s",
  thickness = 2,
  borderRadius = 28,
  className = "",
  style,
}: StarBorderProps) {
  return (
    <div
      className={`relative inline-block w-full overflow-hidden ${className}`}
      style={{ padding: `${thickness}px 0`, borderRadius, ...style }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-250%] bottom-[-11px] z-0 h-[50%] w-[300%] rounded-full opacity-70"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animation: `prumo-star-bottom ${speed} linear infinite alternate`,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-10px] left-[-250%] z-0 h-[50%] w-[300%] rounded-full opacity-70"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animation: `prumo-star-top ${speed} linear infinite alternate`,
        }}
      />
      <div className="relative z-[1]" style={{ borderRadius: "inherit" }}>
        {children}
      </div>
    </div>
  );
}

export default StarBorder;
