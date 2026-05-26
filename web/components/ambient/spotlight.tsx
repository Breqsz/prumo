export function Spotlight() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="prumo-spotlight absolute top-[18%] left-1/2 h-[160vh] w-[160vw] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.04) 28%, rgba(255,255,255,0.015) 52%, transparent 70%)",
          mixBlendMode: "screen",
        }}
      />
      <div
        className="prumo-spotlight-soft absolute top-[78%] left-[22%] h-[90vh] w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 40%, transparent 70%)",
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
}

export default Spotlight;
