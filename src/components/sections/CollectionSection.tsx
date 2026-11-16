import React from "react";
import Link from "next/link";
import { BRAND } from "@/config/brand";
import { BAGS } from "@/config/catalog";
import { ScrollReveal } from "@/components/cinematic/ScrollReveal";
import { BagProductCard } from "@/components/sections/BagProductCard";

export function CollectionSection() {
  const featuredBags = BAGS.filter((b) => b.featured);

  return (
    <section className="tati-section" id="shop">
      <div className="tati-container">
        <ScrollReveal>
          <div className="tati-section-head">
            <div className="tati-eyebrow">{BRAND.collection.eyebrow}</div>
            <h2 className="tati-heading-section">{BRAND.collection.heading}</h2>
            <p className="tati-lead">{BRAND.collection.supporting}</p>
          </div>
        </ScrollReveal>

        <div className="tati-collection-grid">
          {featuredBags.map((bag, idx) => (
            <ScrollReveal key={bag.id} delayMs={idx * 90}>
              <BagProductCard bag={bag} />
            </ScrollReveal>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 42 }}>
          <Link href="/shop" className="tati-btn-outline">
            Explore Full Collection ↗
          </Link>
        </div>
      </div>
    </section>
  );
}
