import type { Metadata } from "next";
import { DM_Sans, Caveat, Outfit, Fraunces } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700", "800", "900"],
});


const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700", "800", "900"],
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

import { DynamicDataProvider } from "@/lib/DynamicDataContext";
import CustomCursor from "@/components/global/CustomCursor";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${caveat.variable} ${outfit.variable} ${fraunces.variable} antialiased film-grain`}
      >
        <DynamicDataProvider>
          <CustomCursor />
          {children}
        </DynamicDataProvider>
      </body>
    </html>
  );
}
