const ITEMS = [
  {
    question: "Quanto tempo leva para entregar um site?",
    answer:
      "Landing em 10 dias, Institucional em 21 dias, Branded em 30 a 45 dias. Projetos custom têm prazo definido no briefing, sem promessa irreal só para fechar.",
  },
  {
    question: "Vocês trabalham com manutenção contínua?",
    answer:
      "Sim. Três planos mensais (Base, Crescimento, Parceria) cuidam de hospedagem, atualizações, alterações e, no nível Parceria, estratégia recorrente com relatórios. Opcional, não obrigatório.",
  },
  {
    question: "Quem faz o trabalho?",
    answer:
      "Prumo é um estúdio solo, não uma agência com vendedor na frente e estagiário atrás. Você fala comigo do briefing à entrega, e estratégia e código passam por mim. No design, conto com o Guilherme Carvalho como parceiro recorrente; em projetos maiores, freelas pontuais. O ponto de contato é sempre um só, e isso fica transparente no escopo.",
  },
  {
    question: "Vocês usam template ou tudo é custom?",
    answer:
      "Depende do plano. Landing e Institucional podem usar bases no-code premium (Framer, Webflow) quando faz sentido pelo prazo. Branded e custom são sempre código sob medida em Next.js. Em qualquer caso, o design é original, nunca template comprado.",
  },
  {
    question: "Eu já tenho um site. Vocês reformulam ou começam do zero?",
    answer:
      "Avaliamos no briefing. Se o site atual tem base aproveitável e o problema é cópia, design ou conversão, reformulamos. Se a fundação está comprometida (stack ruim, SEO destruído, fora de manutenção), começar do zero costuma sair mais barato no longo prazo.",
  },
  {
    question: "Como funciona o pagamento?",
    answer:
      "50% para iniciar, 50% na entrega para planos one-time. Mensais são cobrados no início de cada ciclo. Aceito PIX, cartão e transferência. Nota fiscal emitida.",
  },
];

// Trocar pra comparar: 1=marginalia (tipográfico), 2=blueprint (grade), 3=halo (luz orbital), 4=prumo (fio descendente)
export type FaqBgVariant = 1 | 2 | 3 | 4;

type FaqProps = {
  bgVariant?: FaqBgVariant;
};

export function Faq({ bgVariant = 1 }: FaqProps) {
  const faqInner = (
    <div className="relative mx-auto max-w-6xl">
      <header className="mb-14 grid gap-8 md:mb-20 md:grid-cols-[200px_1fr] md:gap-20">
        <span className="self-end pb-3 text-[11px] tracking-[0.3em] text-white/55 uppercase">
          Perguntas
        </span>
        <h2
          id="faq-heading"
          className="font-editorial max-w-3xl text-4xl font-semibold leading-[1.02] tracking-tight md:text-6xl"
        >
          O que costumam{" "}
          <em className="font-editorial italic font-normal text-white/70">
            perguntar antes
          </em>{" "}
          de fechar.
        </h2>
      </header>
      <dl className="grid grid-cols-1 gap-x-12 border-t border-white/15 pt-10 md:grid-cols-2">
        {ITEMS.map((item, i) => (
          <div
            key={item.question}
            className="grid grid-cols-[88px_1fr] items-start gap-6 border-b border-white/10 py-12"
          >
            <span
              aria-hidden
              className="font-editorial text-6xl leading-[0.85] text-white/15 italic select-none"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex flex-col gap-3">
              <dt className="font-display text-xl font-medium leading-snug tracking-tight text-white">
                {item.question}
              </dt>
              <dd className="max-w-[52ch] text-[0.95rem] leading-[1.6] text-white/75">
                {item.answer}
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );

  return (
    <section
      id="faq"
      data-bg-variant={bgVariant}
      className="relative overflow-hidden px-6 py-32 md:py-40"
      aria-labelledby="faq-heading"
    >
      <style>{FAQ_BG_CSS}</style>

      {/* Vignette comum a todas as variantes — borda escura, foco no centro */}
      <div aria-hidden className="faq-vignette" />

      {/* V1 — Marginalia: fantasma tipográfico editorial */}
      {bgVariant === 1 && (
        <div aria-hidden className="faq-bg-1">
          <span className="faq-marginalia">FAQ</span>
        </div>
      )}

      {/* V2 — Blueprint: grade editorial 12 colunas + grain drift */}
      {bgVariant === 2 && (
        <>
          <div aria-hidden className="faq-bg-2-grid" />
          <div aria-hidden className="faq-bg-2-rule faq-bg-2-rule-top" />
          <div aria-hidden className="faq-bg-2-rule faq-bg-2-rule-bot" />
          <div aria-hidden className="faq-bg-2-grain" />
        </>
      )}

      {/* V3 — Halo: luz radial orbitando off-frame */}
      {bgVariant === 3 && (
        <>
          <div aria-hidden className="faq-bg-3-halo" />
          <div aria-hidden className="faq-bg-3-halo faq-bg-3-halo-counter" />
          <div aria-hidden className="faq-bg-3-grain" />
        </>
      )}

      {/* V4 — Prumo: fio central + bob descendente */}
      {bgVariant === 4 && (
        <>
          <div aria-hidden className="faq-bg-4-line" />
          <div aria-hidden className="faq-bg-4-trail" />
          <div aria-hidden className="faq-bg-4-bob" />
          <div aria-hidden className="faq-bg-4-tick faq-bg-4-tick-top">
            <span>0</span>
          </div>
          <div aria-hidden className="faq-bg-4-tick faq-bg-4-tick-bot">
            <span>100</span>
          </div>
        </>
      )}

      {faqInner}
    </section>
  );
}

// CSS inline pra encapsular as 4 variantes. Cada bloco usa o seletor [data-bg-variant="N"]
// pra ficar isolado do resto da página. Animações longas (12s+), opacidade baixa (<12%),
// `prefers-reduced-motion` desliga todo o movimento mas mantém a estrutura visual.
const FAQ_BG_CSS = `
  /* ============ COMUM ============ */
  #faq .faq-vignette {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(ellipse 80% 60% at center, transparent 30%, rgba(10,10,10,0.55) 85%);
    z-index: 0;
  }
  #faq > :not(style):not([aria-hidden]) { position: relative; z-index: 1; }

  /* ============ V1 — MARGINALIA ============ */
  /* Instrument Serif gigante italic flutuando atrás, drift horizontal sutil */
  #faq[data-bg-variant="1"] .faq-bg-1 {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 0;
  }
  #faq[data-bg-variant="1"] .faq-marginalia {
    font-family: var(--font-editorial), "Instrument Serif", "Times New Roman", serif;
    font-style: italic;
    font-weight: 400;
    font-size: clamp(28rem, 48vw, 56rem);
    line-height: 0.78;
    letter-spacing: -0.06em;
    color: rgba(255, 255, 255, 0.022);
    user-select: none;
    white-space: nowrap;
    will-change: transform;
    animation: faq-marginalia-drift 60s ease-in-out infinite;
  }
  @keyframes faq-marginalia-drift {
    0%, 100% { transform: translate3d(-3vw, 0, 0) rotate(-0.4deg); }
    50%      { transform: translate3d( 3vw, 0, 0) rotate( 0.4deg); }
  }

  /* ============ V2 — BLUEPRINT ============ */
  /* Grade editorial de 12 colunas + 2 hairlines horizontais + grain drift */
  #faq[data-bg-variant="2"] .faq-bg-2-grid {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background-image: linear-gradient(
      to right,
      rgba(255,255,255,0.035) 0,
      rgba(255,255,255,0.035) 1px,
      transparent 1px,
      transparent 100%
    );
    background-size: calc(100% / 12) 100%;
    mask-image: linear-gradient(to bottom, transparent 0, black 12%, black 88%, transparent 100%);
    -webkit-mask-image: linear-gradient(to bottom, transparent 0, black 12%, black 88%, transparent 100%);
  }
  #faq[data-bg-variant="2"] .faq-bg-2-rule {
    position: absolute;
    left: 10%;
    right: 10%;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(255,255,255,0.18) 20%, rgba(255,255,255,0.18) 80%, transparent);
    pointer-events: none;
    z-index: 0;
  }
  #faq[data-bg-variant="2"] .faq-bg-2-rule-top { top: 8%; }
  #faq[data-bg-variant="2"] .faq-bg-2-rule-bot { bottom: 8%; }
  #faq[data-bg-variant="2"] .faq-bg-2-grain {
    position: absolute;
    inset: -10%;
    pointer-events: none;
    z-index: 0;
    opacity: 0.10;
    mix-blend-mode: screen;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='280' height='280'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
    background-size: 280px 280px;
    animation: faq-bp-grain 50s linear infinite;
  }
  @keyframes faq-bp-grain {
    from { background-position: 0 0; }
    to   { background-position: 280px 280px; }
  }

  /* ============ V3 — HALO ============ */
  /* Massa radial gigante orbitando elipse off-frame + grain leve */
  #faq[data-bg-variant="3"] .faq-bg-3-halo {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 90vw;
    height: 90vw;
    max-width: 1400px;
    max-height: 1400px;
    margin-top: calc(-45vw);
    margin-left: calc(-45vw);
    pointer-events: none;
    z-index: 0;
    border-radius: 50%;
    background: radial-gradient(
      circle at center,
      rgba(255,255,255,0.055) 0%,
      rgba(255,255,255,0.030) 20%,
      rgba(255,255,255,0.014) 38%,
      transparent 60%
    );
    filter: blur(60px);
    will-change: transform;
    animation: faq-halo-orbit 45s ease-in-out infinite;
  }
  #faq[data-bg-variant="3"] .faq-bg-3-halo-counter {
    animation: faq-halo-orbit-counter 62s ease-in-out infinite;
    background: radial-gradient(
      circle at center,
      rgba(255,255,255,0.030) 0%,
      rgba(255,255,255,0.012) 30%,
      transparent 55%
    );
    filter: blur(80px);
  }
  @keyframes faq-halo-orbit {
    0%   { transform: translate3d(-22%, -10%, 0); }
    25%  { transform: translate3d( 18%, -16%, 0); }
    50%  { transform: translate3d( 25%,  12%, 0); }
    75%  { transform: translate3d(-15%,  18%, 0); }
    100% { transform: translate3d(-22%, -10%, 0); }
  }
  @keyframes faq-halo-orbit-counter {
    0%   { transform: translate3d( 20%,  14%, 0); }
    33%  { transform: translate3d(-18%,  10%, 0); }
    66%  { transform: translate3d(-22%, -14%, 0); }
    100% { transform: translate3d( 20%,  14%, 0); }
  }
  #faq[data-bg-variant="3"] .faq-bg-3-grain {
    position: absolute;
    inset: -10%;
    pointer-events: none;
    z-index: 0;
    opacity: 0.07;
    mix-blend-mode: screen;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
    background-size: 220px 220px;
  }

  /* ============ V4 — PRUMO ============ */
  /* Fio vertical central permanente + onda brilhante descendo + bob na ponta + ticks editoriais */
  #faq[data-bg-variant="4"] .faq-bg-4-line {
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 1px;
    transform: translateX(-0.5px);
    pointer-events: none;
    z-index: 0;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(255,255,255,0.06) 12%,
      rgba(255,255,255,0.10) 50%,
      rgba(255,255,255,0.06) 88%,
      transparent 100%
    );
  }
  #faq[data-bg-variant="4"] .faq-bg-4-trail {
    position: absolute;
    left: 50%;
    top: -18%;
    width: 1px;
    height: 18%;
    transform: translateX(-0.5px);
    pointer-events: none;
    z-index: 0;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(255,255,255,0.05) 50%,
      rgba(255,255,255,0.45) 100%
    );
    will-change: top;
    animation: faq-plumb-trail 14s cubic-bezier(0.55, 0.05, 0.45, 0.95) infinite;
  }
  #faq[data-bg-variant="4"] .faq-bg-4-bob {
    position: absolute;
    left: 50%;
    top: 0;
    width: 7px;
    height: 7px;
    margin-left: -3.5px;
    margin-top: -3.5px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    background: rgba(255,255,255,0.85);
    box-shadow:
      0 0 10px rgba(255,255,255,0.45),
      0 0 28px rgba(255,255,255,0.20),
      0 -16px 32px -10px rgba(255,255,255,0.18);
    will-change: top, opacity;
    animation: faq-plumb-bob 14s cubic-bezier(0.55, 0.05, 0.45, 0.95) infinite;
  }
  #faq[data-bg-variant="4"] .faq-bg-4-tick {
    position: absolute;
    left: calc(50% + 14px);
    font-family: var(--font-editorial), "Instrument Serif", serif;
    font-style: italic;
    font-size: 11px;
    letter-spacing: 0.18em;
    color: rgba(255,255,255,0.32);
    text-transform: uppercase;
    pointer-events: none;
    z-index: 0;
  }
  #faq[data-bg-variant="4"] .faq-bg-4-tick-top { top: 24px; }
  #faq[data-bg-variant="4"] .faq-bg-4-tick-bot { bottom: 24px; }
  #faq[data-bg-variant="4"] .faq-bg-4-tick::before {
    content: "";
    position: absolute;
    left: -10px;
    top: 50%;
    width: 6px;
    height: 1px;
    background: rgba(255,255,255,0.32);
    transform: translateY(-50%);
  }
  @keyframes faq-plumb-bob {
    0%   { top: -2%;  opacity: 0; }
    5%   { opacity: 1; }
    95%  { opacity: 1; }
    100% { top: 102%; opacity: 0; }
  }
  @keyframes faq-plumb-trail {
    0%   { top: -20%; opacity: 0; }
    5%   { opacity: 1; }
    95%  { opacity: 1; }
    100% { top: 100%; opacity: 0; }
  }

  /* ============ REDUCED MOTION ============ */
  @media (prefers-reduced-motion: reduce) {
    #faq .faq-marginalia,
    #faq .faq-bg-2-grain,
    #faq .faq-bg-3-halo,
    #faq .faq-bg-4-trail,
    #faq .faq-bg-4-bob {
      animation: none !important;
    }
    #faq[data-bg-variant="4"] .faq-bg-4-bob { display: none; }
    #faq[data-bg-variant="4"] .faq-bg-4-trail { display: none; }
  }
`;
