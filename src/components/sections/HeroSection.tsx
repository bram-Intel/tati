import React from "react";
import Link from "next/link";
import { BRAND } from "@/config/brand";
import { TatiLogo } from "@/components/brand/TatiLogo";
import { HeroAtelierCanvas } from "@/components/cinematic/HeroAtelierCanvas";

export function HeroSection() {
  return (
    <section className="tati-hero tati-gradient-surface">
      <div className="tati-grain-overlay" aria-hidden="true" />

      <div className="tati-container tati-hero-grid">
        <div className="tati-hero-copy">
          <div className="tati-eyebrow tati-eyebrow--light">{BRAND.hero.eyebrow}</div>
          <h1>
            {BRAND.hero.headlineLead}
            <br />
            <em>{BRAND.hero.headlineItalic}</em>
          </h1>
          <p className="tati-hero-sub">{BRAND.hero.supporting}</p>

          <div className="tati-hero-actions">
            <Link href="/shop" className="tati-btn-ivory">
              {BRAND.hero.ctaLabel} ↗
            </Link>
            <Link href="/charms" className="tati-btn-outline tati-btn-outline--light">
              Style Your Charms
            </Link>
          </div>

          <div className="tati-hero-mark" aria-hidden="true">
            <TatiLogo variant="light" size="md" />
          </div>
        </div>

        <div>
          <HeroAtelierCanvas />
        </div>
      </div>
    </section>
  );
}
