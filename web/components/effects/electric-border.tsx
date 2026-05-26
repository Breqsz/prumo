import type { CSSProperties, ReactNode } from "react";

function hexToRgba(hex: string, alpha = 1): string {
  if (!hex) return `rgba(0,0,0,${alpha})`;
  if (hex.startsWith("rgb")) return hex;
  let h = hex.replace("#", "");
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const int = parseInt(h, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

type ElectricBorderProps = {
  children: ReactNode;
  color?: string;
  borderRadius?: number;
  className?: string;
  style?: CSSProperties;
};

export function ElectricBorder({
  children,
  color = "#ffffff",
  borderRadius = 24,
  className,
  style,
}: ElectricBorderProps) {
  return (
    <div
      className={`relative overflow-visible isolate ${className ?? ""}`}
      style={{ borderRadius, ...style }}
    >
      <div className="pointer-events-none absolute inset-0 z-0 rounded-[inherit]">
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ border: `2px solid ${hexToRgba(color, 0.6)}`, filter: "blur(1px)" }}
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ border: `2px solid ${color}`, filter: "blur(4px)" }}
        />
        <div
          className="pointer-events-none absolute inset-0 -z-[1] scale-110 rounded-[inherit] opacity-30"
          style={{
            filter: "blur(32px)",
            background: `linear-gradient(-30deg, ${color}, transparent, ${color})`,
          }}
        />
      </div>
      <div className="relative z-[1] rounded-[inherit]">{children}</div>
    </div>
  );
}

export default ElectricBorder;
