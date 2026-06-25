import { Newsreader, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { getSiteUrl } from "@/lib/utils";

const displayFont = Newsreader({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "MedLens+ — Lab report intelligence",
    template: "%s | MedLens+",
  },
  description:
    "Upload scattered lab PDFs and see what changed over time. MedLens+ builds timelines from your reports so you're ready for your next appointment.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} h-full`}
    >
      <head>
        <meta name="apple-mobile-web-app-title" content="MedLens+" />
      </head>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
