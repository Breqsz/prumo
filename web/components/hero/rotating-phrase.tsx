"use client";

import { useEffect, useState } from "react";

const PHRASES = [
  "uma linha reta.",
  "um norte certo.",
  "um plano firme.",
  "uma meta clara.",
] as const;

const INTERVAL_MS = 4000;
const TRANSITION_MS = 900;
const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

export function RotatingPhrase() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % PHRASES.length),
      INTERVAL_MS,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <span className="relative inline-block align-baseline">
      <span aria-hidden className="invisible">
        {PHRASES[0]}
      </span>
      {PHRASES.map((phrase, i) => {
        const active = i === index;
        return (
          <em
            key={phrase}
            aria-hidden={!active}
            className="font-editorial absolute inset-0 italic will-change-[opacity,transform]"
            style={{
              opacity: active ? 1 : 0,
              transform: active ? "translateY(0)" : "translateY(0.25rem)",
              transition: `opacity ${TRANSITION_MS}ms ${EASE}, transform ${TRANSITION_MS}ms ${EASE}`,
            }}
          >
            {phrase}
          </em>
        );
      })}
    </span>
  );
}
