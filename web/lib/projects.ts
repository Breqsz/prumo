export type Project = {
  slug: string;
  title: string;
  scope: string;
  year: number;
  summary: string;
  videoSrc: string;
  meta: {
    cliente: string;
    setor: string;
    entrega: string;
  };
  brief: string;
  process: string;
  /** Narrativa de resultado. Ausente quando não há resultado verificável. */
  outcome?: string;
  /** Ordered screenshots used in the per-project gallery. Public-folder paths. */
  gallery: string[];
};

/**
 * Projetos do reel /trabalhos. A ordem define a sequência do scroll.
 * Campos marcados [STUB] devem ser preenchidos com narrativa real.
 */
export const projects: Project[] = [
  {
    slug: "hold-corretora",
    title: "Hold Corretora",
    scope: "Site institucional · consultoria financeira",
    year: 2026,
    summary:
      "19 anos de operação consultiva traduzidos em um site que confirma credibilidade em vez de competir por atenção. Sobriedade editorial num mercado saturado de cards verde e azul.",
    videoSrc:
      "https://res.cloudinary.com/dja7arhwd/video/upload/f_auto,q_auto:best/v1779824916/2026-05-26_16-46-59_zk8wx2.mp4",
    meta: {
      cliente: "Hold Corretora, Uberlândia/MG",
      setor: "Saúde · seguros · consórcios · finanças",
      entrega:
        "Site institucional, sistema de conversão (WhatsApp + formulário), design system tipográfico, copy estratégica por audiência",
    },
    brief:
      "Hold tem 19 anos de atuação consultiva em Uberlândia e 60+ parceiros institucionais. Autoridade real, auditável. Mas a presença digital não traduzia o peso da operação. O mercado de corretoras é saturado: gradientes azul-claro, fotos stock de família sorrindo, grids de cards idênticos, CTAs gritantes. Parecer com isso era apagar o diferencial. O briefing pedia um site que confirmasse credibilidade pra quem já chega indicado, sem precisar elevar a voz pra ser ouvido.",
    process:
      "Duas frentes paralelas. Estratégia de conteúdo: o site precisava servir quatro audiências distintas no mesmo funil. PF de alta renda, PF classe média consultiva, escritórios de advocacia e contabilidade parceiros, e empresas contratando saúde coletiva. Cada uma com argumento próprio. O componente AudienceToggle nasceu como princípio, não como botão: bifurca a copy quando o argumento muda, une quando serve a todos. Design: tipografia editorial (Cormorant italic + Outfit sans + hairlines) carregando o premium, paleta navy + dourado #c9a84c como assinatura, espaço em branco como diferenciação. Stack: Next.js 14, React 18, Tailwind, shadcn na base; Framer Motion e GSAP no acabamento; EmailJS + React Hook Form + Zod no formulário sem backend pesado.",
    outcome:
      "Site no ar com WhatsApp como régua. Toda seção termina, direta ou indiretamente, num caminho de contato. WCAG AA pragmático, prefers-reduced-motion respeitado, foco visível em todos os interativos. Sucesso medido em volume e qualidade de leads, não em tempo de sessão ou alcance editorial.",
    gallery: [
      "/Hold/01.png",
      "/Hold/02.png",
      "/Hold/03.png",
      "/Hold/04.png",
    ],
  },
  {
    slug: "desafog-ai",
    title: "Desafog.ai",
    scope: "App mobile · IA + finanças pessoais",
    year: 2026,
    summary:
      "App de gestão de dívidas com IA. Plano mensal automatizado, simulação de cenários e copiloto Claude pra responder dúvida financeira sem julgamento.",
    videoSrc:
      "https://res.cloudinary.com/dja7arhwd/video/upload/f_auto,q_auto:best/v1779823763/2026-05-26_16-28-19_wadqdx.mp4",
    meta: {
      cliente: "Desafog.ai",
      setor: "Fintech · finanças pessoais · IA",
      entrega:
        "App Flutter (iOS + Android), backend Firebase, integração Anthropic Claude, sistema de priorização de dívidas, simulador de cenários, chat IA, entrada por voz, exportação de relatório em PDF",
    },
    brief:
      "Brasileiro endividado tem pouca ferramenta séria. Quase tudo é planilha de Excel ou app genérico de finanças que não entende dívida como problema específico. Desafog nasceu pra resolver isso de frente: organizar dívidas reais, priorizar quitação com critério matemático, simular cenários de pagamento, e ter um copiloto IA disponível pra responder dúvida financeira sem julgamento moral.",
    process:
      "App Flutter cross-platform (iOS + Android no mesmo codebase). State management com Riverpod, navegação GoRouter, dados em tempo real via Cloud Firestore. Auth com Google + email + modo demo pra reduzir fricção de teste. Camada IA integra Claude 3.5 Sonnet direto via API com rate limiter pra evitar abuso. Entrada por voz via speech_to_text (o usuário fala e cadastra despesa), gráficos com fl_chart, exportação de PDF, notificações locais. Storage seguro com flutter_secure_storage pra credenciais e dados sensíveis.",
    outcome:
      "Versão 1.1.1 em desenvolvimento ativo, builds rodando em iOS e Android. Arquitetura preparada pra Cloud Functions assumirem cálculos pesados (insights, geração de planos) no servidor.",
    gallery: [
      "/Desafog/01.png",
      "/Desafog/02.png",
      "/Desafog/03.png",
      "/Desafog/04.png",
    ],
  },
  {
    slug: "todo",
    title: "To Do Green",
    scope: "Rebuild de site institucional · logística sustentável",
    year: 2026,
    summary:
      "Rebuild do site oficial da To Do Green, logística com frota 100% elétrica. Fidelidade total ao conteúdo institucional, com elevação de design, performance e SEO.",
    videoSrc:
      "https://res.cloudinary.com/dja7arhwd/video/upload/f_auto,q_auto:best/v1779824627/2026-05-26_16-42-41_kbdbve.mp4",
    meta: {
      cliente: "To Do Green",
      setor: "Logística sustentável · last e middle mile",
      entrega:
        "Site institucional Next.js 14 (App Router), 6 rotas espelhando o oficial, formulários de contato e vagas, fonte única de verdade em TypeScript, JSON-LD e metadata por rota",
    },
    brief:
      "To Do Green é transportadora 100% elétrica com diferenciais auditáveis (1,6 kg de CO2 evitado por km, 98% de taxa de sucesso nas entregas, parcerias institucionais como Linha 6-Laranja). O site antigo cumpria função informativa mas não comunicava o premium do que a empresa entrega. Pediam rebuild com fidelidade total ao conteúdo existente, sem inventar métrica, depoimento ou dado, com elevação de design, performance e SEO.",
    process:
      "Migração pra Next.js 14 com App Router. Todo o conteúdo do site centralizado em `siteContent.ts` como fonte única de verdade: copy, links, SEO e formulários moram num único arquivo, separados do template. Mudança editorial não exige tocar em componente. Formulários (contato + vagas) plugados em API routes internas com TODOs marcando os pontos de integração com CRM e e-mail. SEO por rota com metadata e JSON-LD estruturado. Cuidado anti-greenwashing: nenhum número entra sem fonte auditável.",
    outcome:
      "Site rebuildado, pronto pra deploy em Vercel, todas as 6 rotas (home, sobre, para empresas, parcerias, trabalhe conosco, vagas) espelhando a versão oficial em estrutura mas elevadas em hierarquia visual.",
    gallery: [
      "/ToDo/01.png",
      "/ToDo/02.png",
      "/ToDo/03.png",
      "/ToDo/04.png",
    ],
  },
  {
    slug: "breq-dev",
    title: "Software Engineer Portfolio",
    scope: "Portfólio bilíngue · recruiter-facing",
    year: 2026,
    summary:
      "Portfólio pessoal bilíngue (PT/EN) construído pra recruiter de tecnologia. Apresenta stack, projetos selecionados e perfil em formato premium inspirado em Vercel, Linear e ReactBits.",
    videoSrc:
      "https://res.cloudinary.com/dja7arhwd/video/upload/f_auto,q_auto:best/v1779824155/2026-05-26_16-34-58_tghjlu.mp4",
    meta: {
      cliente: "Guilherme · pessoal",
      setor: "Personal branding · dev",
      entrega:
        "Site Next.js 14 bilíngue (PT/EN), seleção de projetos, sobre, contato, download de currículo PT e EN, design system próprio",
    },
    brief:
      "Portfólio recruiter-facing precisa fazer três coisas em poucos segundos: (1) deixar claro o que faz, (2) provar com projetos reais, (3) abrir caminho direto pra contato e CV. A maioria dos portfólios de dev falha em hierarquia: muito conteúdo, pouca decisão. O briefing foi o oposto: simplificar e elevar.",
    process:
      "Next.js 14 App Router + TypeScript + Tailwind + Framer Motion + Shadcn UI. Bilíngue PT/EN via i18n próprio com `highlightPhrases()` aplicando gradiente em palavras-chave (web development, backend, cloud). Ênfase visual em vez de bold. Hero com chips de identidade (FullStack · Web · Cloud · DevSecOps), seção Sobre com retrato em formato editorial (sem card, aura gradiente), Selected Work com grid 2-col pros projetos secundários (Fyora + NeuroRace lado a lado). Contact section com dois CVs (PT/EN) acima do CTA principal: recruiter encontra em um clique.",
    outcome:
      "Online em modo recruiter-ready. Refinamento posterior elevou contraste tipográfico (text-neutral-300 no body, muted-400) pra leitura confortável em monitores de baixo gamut sem comprometer a estética dark premium. [Adicionar URL pública e métricas se houver]",
    gallery: [
      "/Breq/01.png",
      "/Breq/02.png",
      "/Breq/03.png",
      "/Breq/04.png",
    ],
  },
  {
    slug: "bereading",
    title: "BeReading",
    scope: "EdTech · plataforma de leitura gamificada",
    year: 2026,
    summary:
      "Where books come alive. Camada digital sobre o livro físico, pensada pra escolas privadas que querem cultura de leitura mensurável, sem virar LMS genérico nem brinquedo educacional.",
    videoSrc:
      "https://res.cloudinary.com/dja7arhwd/video/upload/f_auto,q_auto:best/v1779824341/2026-05-26_16-37-58_nlrxke.mp4",
    meta: {
      cliente: "BeReading (MVP)",
      setor: "EdTech · escolas privadas · ensino fundamental II",
      entrega:
        "Plataforma web Next.js 16 com quatro experiências (aluno, professor, família, admin/escola), landing premium, sistema de missões, biblioteca, dashboards e camada de gamificação (XP, níveis, streaks, badges)",
    },
    brief:
      "Mercado de EdTech pra leitura tá dividido em dois extremos ruins: LMS corporativo travado (Google Classroom genérico) ou app de gamificação infantil que escola privada nunca pilotaria. BeReading nasceu pra ocupar o vazio: produto premium, focado em 6º a 9º ano, que adiciona camada digital ao livro físico sem substituí-lo. Aluno lê livro de verdade, app conduz a jornada (missões, reflexões, checkpoints). Escola consegue medir cultura de leitura sem virar quartel.",
    process:
      "Quatro experiências distintas no mesmo produto. Cada perfil com sua superfície e seu nível de atenção: aluno (jornada de leitura, XP, missões, badges), professor (overview da turma com indicadores ahead/on-track/behind, criação de missões, biblioteca), família (acompanhamento da criança sem hovering, gráfico semanal, timeline) e admin/escola (métricas agregadas, performance por turma, configurações). Stack: Next.js 16 App Router, TypeScript, Tailwind 4, shadcn/ui na base, Framer Motion nos detalhes. Camada de dados em mock estruturada pra migração direta pra Supabase quando o MVP virar produto. Pricing em três tiers (Pilot, School, Network) embutido na landing pra acelerar conversa comercial.",
    outcome:
      "MVP funcional com as quatro experiências navegáveis e landing premium pronta pra conversa de piloto com escolas. Arquitetura preparada pra trocar mock por Supabase sem refatorar componentes.",
    gallery: [
      "/bereading/01.png",
      "/bereading/02.png",
      "/bereading/03.png",
      "/bereading/04.png",
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(slug: string): Project {
  const index = projects.findIndex((p) => p.slug === slug);
  return projects[(index + 1) % projects.length];
}
