import type { Metadata } from "next";
import { Newsreader, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-serif",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "AI Pulse — New AI Models & Agentic IDE Releases",
  description:
    "A quiet, source-linked briefing on new AI model launches, agentic IDEs and coding agents, refreshed on demand.",
  openGraph: {
    title: "AI Pulse — New AI Models & Agentic IDE Releases",
    description:
      "Track what's shipping in AI: new models, agentic IDEs, coding agents and launches, in one briefing.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Pulse — New AI Models & Agentic IDE Releases",
    description:
      "Track what's shipping in AI: new models, agentic IDEs, coding agents and launches, in one briefing.",
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${newsreader.variable} ${ibmPlexSans.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
