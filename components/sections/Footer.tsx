"use client";

import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Wordmark */}
        <h2 className="footer-logo">
          VIRAL<span className="text-accent">DUO</span>
        </h2>

        {/* Tagline */}
        <p className="footer-tagline">Built to go viral.</p>

        {/* Divider */}
        <div className="footer-divider" />

        {/* Copyright */}
        <p className="footer-copyright">
          © {currentYear} VIRAL DUO. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
