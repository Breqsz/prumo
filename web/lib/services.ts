import { type Plan, getPlanByEventSlug } from "@/lib/plans";
import { type Project, getProject } from "@/lib/projects";

export type Service = {
  slug: "criacao-de-sites" | "landing-pages";
  navLabel: string;
  h1: string;
  subhead: string;
  metaTitle: string;
  metaDescription: string;
  /** Frase de vitrine no hub /servicos */
  cardBlurb: string;
  intro: string;
  benefits: { title: string; body: string }[];
  process: { step: string; body: string }[];
  /** eventSlug de plans.ts — linka pra /planos, sem repetir preço exato */
  relatedPlanSlugs: string[];
  /** slug de projects.ts — cases de prova */
  relatedProjectSlugs: string[];
  faq: { q: string; a: string }[];
};

export const SERVICES: Service[] = [
  {
    slug: "criacao-de-sites",
    navLabel: "Criação de sites",
    h1: "Criação de sites sob medida",
    subhead:
      "Sites institucionais e projetos digitais construídos do zero: design próprio, código sob medida e foco em resultado. Atendimento em todo o Brasil, 100% remoto.",
    metaTitle: "Criação de Sites Sob Medida | Prumo",
    metaDescription:
      "Criação de sites profissionais sob medida: institucionais, landing pages e projetos branded. Design premium, código próprio e foco em conversão. Atendimento nacional.",
    cardBlurb:
      "Sites institucionais e projetos completos, do briefing à entrega, sem template.",
    intro:
      "A maioria dos sites de empresa cai em um de dois extremos: template genérico que parece com o do concorrente, ou uma reforma cara que continua lenta e não aparece no Google. A Prumo trabalha no meio-termo raro: sites feitos sob medida, com design original e código enxuto, que carregam rápido, ranqueiam e conduzem o visitante até o contato. Cada projeto começa entendendo o objetivo comercial antes de qualquer pixel, porque site bonito que não converte é custo, não investimento.",
    benefits: [
      {
        title: "Design sob medida, nunca template",
        body: "Cada site é desenhado do zero a partir da sua marca e do seu público. Nada de tema comprado que mil empresas usam. A identidade é sua e o resultado não parece genérico.",
      },
      {
        title: "Rápido em qualquer dispositivo",
        body: "Código otimizado e imagens tratadas fazem a página abrir em segundos no celular e no computador. Velocidade é experiência do usuário e é fator de ranqueamento no Google.",
      },
      {
        title: "Encontrado no Google desde o dia um",
        body: "Estrutura técnica de SEO já vem embutida: títulos, metadados, dados estruturados (schema) e sitemap. O site nasce pronto pra ser indexado, não como um pensamento posterior.",
      },
      {
        title: "Construído para converter",
        body: "Cada seção tem um propósito e termina num caminho de contato: formulário conectado ao seu WhatsApp ou email, CTAs claros, sem visitante perdido no meio do caminho.",
      },
      {
        title: "Você no controle do conteúdo",
        body: "Quando o projeto pede, entra um painel (CMS) pra você editar textos e imagens sozinho, sem depender de ninguém e sem custo recorrente de manutenção só pra trocar uma frase.",
      },
      {
        title: "Acessível e sólido no detalhe",
        body: "Contraste, navegação por teclado, foco visível e respeito a quem prefere menos animação — o site funciona pra mais gente e passa mais confiança. Padrão WCAG aplicado com bom senso, não como checklist decorativo.",
      },
    ],
    process: [
      {
        step: "Conversa e briefing",
        body: "Começamos entendendo o objetivo do site, o público e o que precisa acontecer pra ser um sucesso comercial. Sem essa clareza, o resto é chute.",
      },
      {
        step: "Estratégia e estrutura",
        body: "Defino a arquitetura de páginas, a hierarquia da mensagem e os pontos de conversão antes de desenhar. É aqui que o SEO e a jornada do visitante são planejados.",
      },
      {
        step: "Design e desenvolvimento",
        body: "Desenho a identidade visual e construo o site em código sob medida (ou base no-code premium quando o prazo pede), com performance e responsividade desde o primeiro commit.",
      },
      {
        step: "Entrega e acompanhamento",
        body: "Publico o site, configuro domínio e medição, e acompanho a implantação. Manutenção contínua é opcional, nunca imposta pra te prender.",
      },
    ],
    relatedPlanSlugs: ["institucional", "branded"],
    relatedProjectSlugs: ["hold-corretora", "todo", "bereading"],
    faq: [
      {
        q: "Quanto custa criar um site com a Prumo?",
        a: "Depende do escopo. Um site institucional sob medida parte de um valor fixo fechado no briefing; projetos branded, construídos inteiramente em código, partem de uma faixa maior. Você vê os pontos de partida na página de planos, sempre com preço combinado antes de começar, sem surpresa.",
      },
      {
        q: "Quanto tempo leva pra ficar pronto?",
        a: "Um site institucional leva cerca de 15 a 21 dias; projetos branded, de 30 a 45 dias, dependendo da complexidade. O prazo é definido no briefing, sem promessa irreal só pra fechar.",
      },
      {
        q: "Vocês atendem empresas de fora de São Paulo?",
        a: "Sim. A Prumo é um estúdio 100% remoto e atende clientes em todo o Brasil. Toda a comunicação, aprovação e entrega acontece online, com a mesma proximidade de um time local.",
      },
      {
        q: "Eu consigo atualizar o site sozinho depois?",
        a: "Sim, quando o projeto inclui um CMS você edita textos e imagens por um painel simples, sem tocar em código. Para mudanças estruturais ou evolução contínua, existem os planos de manutenção, opcionais.",
      },
      {
        q: "Já tenho um site. Dá pra reformular em vez de começar do zero?",
        a: "Avaliamos no briefing. Se a base é aproveitável e o problema é design, copy ou conversão, reformulamos. Se a fundação está comprometida (stack ruim, SEO destruído), começar do zero costuma sair mais barato no longo prazo.",
      },
    ],
  },
  {
    slug: "landing-pages",
    navLabel: "Landing pages",
    h1: "Landing pages que convertem",
    subhead:
      "Página única, rápida e focada em um só objetivo: transformar visitante em contato ou venda. Copy estratégica, design sob medida e entrega em 10 dias.",
    metaTitle: "Criação de Landing Pages de Alta Conversão | Prumo",
    metaDescription:
      "Landing pages sob medida focadas em converter visitante em cliente: página única, rápida, com copy estratégica e formulário integrado. Entrega em 10 dias, atendimento nacional.",
    cardBlurb:
      "Página única de alta conversão pra campanha, lançamento ou anúncio.",
    intro:
      "Uma landing page tem um único trabalho: converter. Diferente de um site institucional, ela não tenta contar tudo sobre a empresa: remove distração e conduz o visitante a uma ação, seja preencher o formulário, chamar no WhatsApp ou comprar. É a peça certa pra quem investe em anúncios, lança um produto ou quer testar uma oferta sem construir um site inteiro. A Prumo desenha cada landing a partir do objetivo da campanha, com copy que argumenta e um caminho de conversão sem atrito.",
    benefits: [
      {
        title: "Um objetivo, zero distração",
        body: "A página inteira é construída em torno de uma única ação. Sem menu que dispersa, sem link que tira o visitante do funil: só o argumento e o caminho pra converter.",
      },
      {
        title: "Carrega antes do visitante desistir",
        body: "Landing lenta queima verba de anúncio: o clique é pago e a página não abre a tempo. As nossas carregam em segundos, o que também melhora o custo por lead nas plataformas.",
      },
      {
        title: "Copy que argumenta, não só enfeita",
        body: "O texto é estruturado pra levar da dor à solução até a ação: prova, objeções respondidas e um CTA claro. Design serve o argumento, não o contrário.",
      },
      {
        title: "Formulário conectado ao seu contato",
        body: "Os leads chegam direto no seu WhatsApp ou email, sem lead perdido e sem planilha manual. Integração pronta no dia da entrega.",
      },
      {
        title: "No ar em 10 dias",
        body: "Escopo enxuto e foco em uma página só permitem entrega rápida, ideal pra campanha com data marcada ou pra validar uma oferta antes de investir mais.",
      },
      {
        title: "Medição de conversão pronta",
        body: "A landing já sai com o rastreamento de conversão configurado pra conectar ao Google e à Meta. Você enxerga o custo por lead e otimiza a verba sem adivinhar o que funciona.",
      },
    ],
    process: [
      {
        step: "Objetivo e oferta",
        body: "Definimos qual é a única conversão que importa, quem é o público do anúncio e qual a oferta. Tudo na página serve a essa decisão.",
      },
      {
        step: "Copy e estrutura de conversão",
        body: "Escrevo a sequência de argumentos (promessa, prova, objeções, CTA) e defino a ordem das seções pra guiar o visitante sem atrito.",
      },
      {
        step: "Design e build",
        body: "Desenho e construo a página sob medida, rápida e responsiva, com o formulário já conectado ao seu canal de contato.",
      },
      {
        step: "Publicação e medição",
        body: "Publico, conecto ao domínio e deixo a medição de conversão pronta pra você acompanhar o desempenho da campanha desde o primeiro clique.",
      },
    ],
    relatedPlanSlugs: ["landing"],
    relatedProjectSlugs: ["breq-dev", "desafog-ai"],
    faq: [
      {
        q: "Qual a diferença entre landing page e site?",
        a: "Um site institucional apresenta a empresa inteira e tem várias páginas. Uma landing page é uma página única focada em uma ação específica, ideal pra anúncio, campanha ou lançamento, onde cada distração custa conversão.",
      },
      {
        q: "Quanto custa uma landing page?",
        a: "Uma landing sob medida parte de um valor fixo, fechado antes de começar. Você vê o ponto de partida na página de planos. Nada de escopo aberto: o preço é combinado no briefing.",
      },
      {
        q: "Em quanto tempo fica pronta?",
        a: "Cerca de 10 dias, do briefing à publicação. O escopo enxuto de uma página única permite entrega rápida, mesmo pra campanha com data marcada.",
      },
      {
        q: "A landing já vem preparada pra Google Ads e Meta Ads?",
        a: "Sim. Ela é construída pra carregar rápido (o que reduz o custo por clique) e já sai com a medição de conversão pronta pra conectar às plataformas de anúncio.",
      },
      {
        q: "Vocês fazem os anúncios também?",
        a: "O foco da Prumo é criar a página que converte. A gestão de tráfego pode ser acompanhada dentro dos planos de parceria ou feita pelo seu time/agência de mídia. A landing é entregue pronta pra receber a campanha.",
      },
    ],
  },
];

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export function getPlansForService(service: Service): Plan[] {
  return service.relatedPlanSlugs
    .map(getPlanByEventSlug)
    .filter((p): p is Plan => Boolean(p));
}

export function getProjectsForService(service: Service): Project[] {
  return service.relatedProjectSlugs
    .map(getProject)
    .filter((p): p is Project => Boolean(p));
}
