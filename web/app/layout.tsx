import type { Metadata } from "next";
import { instrumentSerif, inter } from "./fonts";
import "./globals.css";
import Script from "next/script";
import { SITE_URL } from "@/lib/site";

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
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const umamiSrc = process.env.NEXT_PUBLIC_UMAMI_SRC;
  const umamiId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  return (
    <html
      lang="pt-BR"
      className={`${instrumentSerif.variable} ${inter.variable} dark`}
    >
      <body className="min-h-screen bg-black text-white antialiased font-body">
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
