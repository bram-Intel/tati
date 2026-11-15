import React from "react";
import type { Metadata } from "next";
import { BRAND } from "@/config/brand";
import { CharmsSection } from "@/components/sections/CharmsSection";
import { CharmsCatalogSection } from "@/components/sections/CharmsCatalogSection";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

export const metadata: Metadata = {
  title: "Bag Charms",
  description:
    "Every Tati bag comes with a complimentary charm. Discover additional champagne-gold and enamel charms and create your own combination.",
};

export default function CharmsPage() {
  return (
    <>
      <section className="tati-page-banner">
        <div className="tati-container">
          <div className="tati-eyebrow">{BRAND.charms.eyebrow}</div>
          <h1>{BRAND.charms.heading}</h1>
          <p className="tati-lead" style={{ maxWidth: 580, marginInline: "auto" }}>
            {BRAND.charms.description} {BRAND.charms.additionalText}
          </p>
        </div>
      </section>

      <CharmsSection />
      <CharmsCatalogSection />
      <NewsletterSection />
    </>
  );
}
