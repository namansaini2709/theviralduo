"use client";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-16 px-6 border-t border-foreground/10">
      <div className="max-w-4xl mx-auto text-center">
        {/* Wordmark */}
        <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-4">
          VIRAL<span className="text-accent">DUO</span>
        </h2>

        {/* Tagline */}
        <p className="font-body text-lg text-foreground/50 mb-8">Built to go viral.</p>

        {/* Divider */}
        <div className="w-16 h-[1px] bg-foreground/20 mx-auto mb-8" />

        {/* Copyright */}
        <p className="font-body text-sm text-foreground/30">
          © {currentYear} VIRAL DUO. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
