import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Mono, Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const display = Cormorant_Garamond({ variable: "--font-display", subsets: ["latin"], weight: ["400", "500", "600"] });
const sans = Manrope({ variable: "--font-sans", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const mono = DM_Mono({ variable: "--font-mono", subsets: ["latin"], weight: ["300", "400", "500"] });

export const metadata: Metadata = {
  title: { default: "One Minute of You", template: "%s — One Minute of You" },
  description: "A deterministic generative portrait shaped by sixty seconds of your movement.",
  icons: { icon: "/one-minute-of-you-logo.png", apple: "/one-minute-of-you-logo.png" },
  openGraph: {
    type: "website",
    title: "One Minute of You",
    description: "Every minute enters a Royal House.",
    images: [{ url: "/og-royal.png", width: 1731, height: 909, alt: "One Minute of You — Your movement made visible." }],
  },
  twitter: { card: "summary_large_image", title: "One Minute of You", description: "Every minute enters a Royal House.", images: ["/og-royal.png"] },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#05040a" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${display.variable} ${sans.variable} ${mono.variable}`}><Providers>{children}</Providers></body></html>;
}
