import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans, Caveat } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "VIRAL DUO | High-End Cinematic Marketing Agency",
  description:
    "We don't post content. We engineer virality. A high-end cinematic marketing agency that builds brands that can't be ignored.",
  keywords: [
    "marketing",
    "content agency",
    "viral content",
    "brand strategy",
    "social media",
    "reels",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${dmSans.variable} ${caveat.variable} antialiased film-grain`}
      >
        {children}
      </body>
    </html>
  );
}
