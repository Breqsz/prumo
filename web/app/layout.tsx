import type { Metadata } from "next";
import { instrumentSerif, inter } from "./fonts";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Prumo · Sites, estratégia e presença digital",
  description:
    "Estúdio digital. Sites sob medida, planos de manutenção e parceria contínua.",
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
