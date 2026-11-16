"use client";

import React from "react";
import Link from "next/link";
import { CHARMS } from "@/config/catalog";
import { CharmMedallionShowcase } from "@/components/ui/CharmMedallionShowcase";

export function CharmsCatalogSection() {
  return (
    <section className="tati-section">
      <div className="tati-container">
        <div className="tati-section-head">
          <div className="tati-eyebrow">Make it yours</div>
          <h2 className="tati-heading-section">Personal Touches</h2>
          <p className="tati-lead">
            Every charm clips onto any Tati bag with a hinged champagne-gold clasp—mix symbols to create your own combination.
          </p>
        </div>

        <div className="tati-charms-catalog-grid">
          {CHARMS.map((charm) => (
            <article key={charm.id} className="tati-product-card">
              <div className="tati-product-frame tati-product-frame--medallion">
                <div className="tati-card-pill-bar">
                  <span className="tati-badge">Champagne Gold &amp; Enamel</span>
                </div>
                <CharmMedallionShowcase charm={charm} />
              </div>

              <div className="tati-card-meta">
                <div className="tati-card-row">
                  <h3 className="tati-card-title">{charm.name}</h3>
                </div>
                <p className="tati-card-tagline">{charm.finish}</p>
                <p className="tati-card-desc">{charm.description}</p>

                <div className="tati-swatch-row">
                  <span className="tati-coming-soon">Coming soon</span>
                  <Link href="#charms" className="tati-explore-link">
                    Preview on Bag ↑
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
