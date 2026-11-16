import React, { Suspense } from "react";
import type { Metadata } from "next";
import { BRAND } from "@/config/brand";
import { ShopCatalogClient } from "@/components/sections/ShopCatalogClient";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

export const metadata: Metadata = {
  title: "The Collection",
  description:
    "A first look at the world of Tati — sculpted everyday handbags and personal champagne-gold bag charms. Coming soon.",
};

export default function ShopPage() {
  return (
    <>
      <section className="tati-page-banner">
        <div className="tati-container">
          <div className="tati-eyebrow">{BRAND.collection.eyebrow}</div>
          <h1>{BRAND.collection.heading}</h1>
          <p className="tati-lead" style={{ maxWidth: 520, marginInline: "auto" }}>
            {BRAND.collection.supporting}
          </p>
        </div>
      </section>

      <Suspense
        fallback={
          <div className="tati-section tati-container" style={{ textAlign: "center" }}>
            Loading collection…
          </div>
        }
      >
        <ShopCatalogClient />
      </Suspense>

      <NewsletterSection />
    </>
  );
}
