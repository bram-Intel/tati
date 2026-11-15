"use client";

import React from "react";
import Image from "next/image";
import { CHARMS, formatPrice } from "@/config/catalog";
import { useStore } from "@/components/layout/StoreContext";

export function CharmsCatalogSection() {
  const { addCharmToCart, currency } = useStore();

  return (
    <section className="tati-section">
      <div className="tati-container">
        <div className="tati-section-head">
          <div className="tati-eyebrow">Individual Pieces · Clip &amp; Layer</div>
          <h2 className="tati-heading-section">Additional Bag Charms</h2>
          <p className="tati-lead">
            Every charm features a hinged champagne-gold swivel clasp engineered to clip effortlessly onto any Tati bag ring.
          </p>
        </div>

        <div className="tati-collection-grid">
          {CHARMS.map((charm) => (
            <article key={charm.id} className="tati-product-card">
              <div className="tati-product-frame" style={{ aspectRatio: "1 / 1" }}>
                <div className="tati-card-pill-bar">
                  <span className="tati-badge">{charm.glyph} Solid Brass &amp; Enamel</span>
                </div>
                <Image
                  src={charm.image}
                  alt={charm.name}
                  fill
                  sizes="(max-width: 780px) 100vw, 33vw"
                  className="tati-product-img"
                />
                <div className="tati-quick-bar">
                  <button
                    type="button"
                    className="tati-quick-btn"
                    onClick={() => addCharmToCart(charm.id)}
                  >
                    Add Charm · {formatPrice(charm.priceGbp, currency)}
                  </button>
                </div>
              </div>

              <div className="tati-card-meta">
                <div className="tati-card-row">
                  <h3 className="tati-card-title" style={{ fontSize: 23 }}>
                    {charm.name}
                  </h3>
                  <span className="tati-card-price">
                    {formatPrice(charm.priceGbp, currency)}
                  </span>
                </div>
                <p className="tati-card-tagline">{charm.finish}</p>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--muted-warm)",
                    marginTop: 8,
                    lineHeight: 1.68,
                  }}
                >
                  {charm.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
