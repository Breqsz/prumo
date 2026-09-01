import type { Metadata, Viewport } from "next";
import { archivo, instrumentSerif, inter } from "./fonts";
import "./globals.css";
import Script from "next/script";
import { SITE_URL } from "@/lib/site";
import { JsonLd } from "@/components/seo/json-ld";
import { siteGraph } from "@/lib/schema";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Prumo · Sites, estratégia e presença digital",
    template: "%s · Prumo",
  },
  description:
    "Estúdio digital. Sites sob medida, planos de manutenção e parceria contínua.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Prumo",
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const umamiSrc = process.env.NEXT_PUBLIC_UMAMI_SRC;
  const umamiId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  return (
    <html
      lang="pt-BR"
      className={`${archivo.variable} ${instrumentSerif.variable} ${inter.variable} dark`}
    >
      <body className="bg-bg min-h-screen text-white antialiased font-body">
        <JsonLd data={siteGraph()} />
        {children}
        {umamiSrc && umamiId && (
          <Script
            src={umamiSrc}
            data-website-id={umamiId}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
