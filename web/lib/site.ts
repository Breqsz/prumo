/** Base URL canônica do site. Vem de NEXT_PUBLIC_SITE_URL quando o domínio
 * estiver comprado (Tier 0). Até lá, cai na URL de produção da Vercel, e
 * em último caso localhost. Usado por metadataBase, sitemap, robots e OG. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
