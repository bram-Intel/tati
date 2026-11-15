import React, { Suspense } from "react";
import type { Metadata } from "next";
import { ShopCatalogClient } from "@/components/sections/ShopCatalogClient";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

export const metadata: Metadata = {
  title: "Shop The Collection",
  description:
    "Explore Tati handbags and personal champagne-gold bag charms. Every handbag includes a complimentary charm of your choice.",
};

export default function ShopPage() {
  return (
    <>
      <section className="tati-page-banner">
        <div className="tati-container">
          <div className="tati-eyebrow">A good bag changes everything</div>
          <h1>The Collection</h1>
          <p className="tati-lead" style={{ maxWidth: 520, marginInline: "auto" }}>
            Everyday bags, made to make a statement—each finished with a complimentary charm and optional combinations.
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
