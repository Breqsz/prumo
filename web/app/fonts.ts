import { Archivo, Instrument_Serif, Inter } from "next/font/google";

/**
 * Duas vozes tipográficas (ADR 0006).
 *
 * `--font-display`   Archivo condensada, voz da marca. Títulos que afirmam.
 * `--font-editorial` Instrument Serif, voz editorial. Frases que carregam o
 *                    itálico assinatura ("Preço *transparente*").
 * `--font-body`      Inter, interface e texto corrido.
 *
 * A Archivo é a substituta aberta da Neue Haas Grotesk W16 pedida pelo manual,
 * que é licenciada pela Monotype por pageview. Se a licença for comprada, a
 * troca acontece aqui e em nenhum outro lugar.
 */
export const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-display",
});

export const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-editorial",
});

export const inter = Inter({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});
