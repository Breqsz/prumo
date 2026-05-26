import type { Metadata } from "next";
import { instrumentSerif, inter } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prumo · Sites, estratégia e presença digital",
  description:
    "Estúdio digital. Sites sob medida, planos de manutenção e parceria contínua.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${instrumentSerif.variable} ${inter.variable} dark`}
    >
      <body className="min-h-screen bg-black text-white antialiased font-body">
        {children}
      </body>
    </html>
  );
}
