"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { BAGS, CHARMS, formatPrice } from "@/config/catalog";
import { BagProductCard } from "@/components/sections/BagProductCard";
import { useStore } from "@/components/layout/StoreContext";

type FilterKind = "all" | "bags" | "charms";

export function ShopCatalogClient() {
  const searchParams = useSearchParams();
  const initialParam = searchParams.get("category");
  const initialFilter: FilterKind =
    initialParam === "charms" ? "charms" : initialParam === "bags" ? "bags" : "all";

  const [filter, setFilter] = useState<FilterKind>(initialFilter);
  const { addCharmToCart, currency } = useStore();

  const subtitle = useMemo(() => {
    if (filter === "bags") return "Every Tati silhouette arrives with one complimentary bag charm.";
    if (filter === "charms") return "Champagne-gold & enamel charms to mix, layer, and swap.";
    return "Distinctive handbags and personal charms designed for expressive everyday style.";
  }, [filter]);

  return (
    <div className="tati-section">
      <div className="tati-container">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            paddingBottom: 26,
            marginBottom: 38,
            borderBottom: "1px solid var(--hairline)",
          }}
        >
          <p className="tati-lead" style={{ maxWidth: 520 }}>
            {subtitle}
          </p>

          <div style={{ display: "flex", gap: 8 }} role="group" aria-label="Filter collection">
            {(
              [
                { id: "all", label: "All Pieces (9)" },
                { id: "bags", label: "Handbags (4)" },
                { id: "charms", label: "Bag Charms (5)" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={filter === tab.id ? "tati-btn-primary" : "tati-btn-outline"}
                style={{ padding: "10px 18px" }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {(filter === "all" || filter === "bags") && (
          <div style={{ marginBottom: filter === "all" ? 68 : 0 }}>
            <div className="tati-eyebrow" style={{ marginBottom: 18 }}>
              Handbags · Complimentary charm included
            </div>
            <div className="tati-collection-grid tati-collection-grid--four">
              {BAGS.map((bag) => (
                <BagProductCard key={bag.id} bag={bag} />
              ))}
            </div>
          </div>
        )}

        {(filter === "all" || filter === "charms") && (
          <div>
            <div className="tati-eyebrow" style={{ marginBottom: 18 }}>
              Bag Charms · Champagne gold &amp; enamel
            </div>
            <div className="tati-collection-grid">
              {CHARMS.map((charm) => (
                <article key={charm.id} className="tati-product-card">
                  <div className="tati-product-frame">
                    <div className="tati-card-pill-bar">
                      <span className="tati-badge">{charm.glyph} Atelier Charm</span>
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
                        fontSize: 12.5,
                        color: "var(--muted-warm)",
                        marginTop: 8,
                        lineHeight: 1.65,
                      }}
                    >
                      {charm.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
