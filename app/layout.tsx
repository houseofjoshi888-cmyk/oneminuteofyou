import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Mono, Manrope } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({ variable: "--font-display", subsets: ["latin"], weight: ["400", "500", "600"] });
const sans = Manrope({ variable: "--font-sans", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const mono = DM_Mono({ variable: "--font-mono", subsets: ["latin"], weight: ["300", "400", "500"] });

export const metadata: Metadata = {
  title: { default: "One Minute of You", template: "%s — One Minute of You" },
  description: "A deterministic generative portrait shaped by sixty seconds of your movement.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    title: "One Minute of You",
    description: "Your movement. Made visible.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "One Minute of You — Your movement. Made visible." }],
  },
  twitter: { card: "summary_large_image", title: "One Minute of You", description: "Your movement. Made visible.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${display.variable} ${sans.variable} ${mono.variable}`}>{children}</body></html>;
}
