import React from "react";
import Link from "next/link";
import { BRAND } from "@/config/brand";
import { TatiLogo } from "@/components/brand/TatiLogo";

export function SiteFooter() {
  return (
    <footer className="tati-footer">
      <div className="tati-container">
        <div>
          <Link href="/" aria-label="Tati Studio Home">
            <TatiLogo variant="footer" size="md" />
          </Link>
        </div>

        <p className="tati-footer-tagline">{BRAND.tagline.toUpperCase()}</p>

        <nav className="tati-footer-links" aria-label="Footer navigation">
          <Link href="/shop">Shop</Link>
          <Link href="/charms">Bag Charms</Link>
          <Link href="/story">Our Story</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        <div className="tati-footer-policies">
          <Link href="/policies/shipping-returns">Shipping &amp; Returns</Link>
          <span>·</span>
          <Link href="/policies/privacy">Privacy Policy</Link>
          <span>·</span>
          <Link href="/policies/terms">Terms &amp; Conditions</Link>
        </div>

        <p className="tati-footer-copy">
          © 2026 {BRAND.name} · {BRAND.domain} · Colourful. Confident. Expressive.
        </p>
      </div>
    </footer>
  );
}
