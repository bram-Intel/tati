import React from "react";
import type { Metadata } from "next";
import { BRAND } from "@/config/brand";
import { CharmsSection } from "@/components/sections/CharmsSection";
import { CharmsCatalogSection } from "@/components/sections/CharmsCatalogSection";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

export const metadata: Metadata = {
  title: "Bag Charms",
  description:
    "Give your bag its own signature. Think playful charms, sweet little symbols and personal touches that let you style your Tati your way.",
};

export default function CharmsPage() {
  return (
    <>
      <section className="tati-page-banner">
        <div className="tati-container">
          <div className="tati-eyebrow">{BRAND.charms.eyebrow}</div>
          <h1>{BRAND.charms.heading}</h1>
          <p className="tati-lead" style={{ maxWidth: 520, marginInline: "auto" }}>
            {BRAND.charms.supporting}
          </p>
        </div>
      </section>

      <CharmsSection hideHeader />
      <CharmsCatalogSection />
      <NewsletterSection />
    </>
  );
}
