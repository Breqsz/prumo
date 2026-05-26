import type { ReactNode } from "react";

type AuroraBlackProps = {
  children: ReactNode;
};

const GRAIN_SVG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.5'/></svg>\")";

export function AuroraBlack({ children }: AuroraBlackProps) {
  return (
    <div className="relative isolate">
      <div
        aria-hidden="true"
        data-testid="aurora-bg"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-black"
      >
        <div
          className="sticky top-0 h-screen w-full overflow-hidden"
          style={{ contain: "layout paint" }}
        >
          <div
            data-testid="aurora-1"
            className="aurora-layer aurora-1 absolute"
            style={{
              top: "-15%",
              left: "-10%",
              width: "80vw",
              height: "80vh",
              background:
                "radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 65%)",
              filter: "blur(80px)",
              willChange: "transform",
            }}
          />
          <div
            data-testid="aurora-2"
            className="aurora-layer aurora-2 absolute"
            style={{
              bottom: "-20%",
              right: "-12%",
              width: "70vw",
              height: "70vh",
              background:
                "radial-gradient(circle, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 65%)",
              filter: "blur(80px)",
              willChange: "transform",
            }}
          />
          <div
            data-testid="aurora-3"
            className="aurora-layer aurora-3 absolute"
            style={{
              top: "30%",
              left: "35%",
              width: "55vw",
              height: "55vh",
              background:
                "radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%)",
              filter: "blur(60px)",
              willChange: "transform",
            }}
          />
          <div
            data-testid="aurora-grain"
            className="absolute inset-0"
            style={{
              backgroundImage: GRAIN_SVG,
              opacity: 0.05,
              mixBlendMode: "screen",
            }}
          />
          <div
            data-testid="aurora-vignette"
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0) 35%, rgba(0,0,0,0.55) 100%)",
            }}
          />
        </div>
      </div>
      {children}
    </div>
  );
}
