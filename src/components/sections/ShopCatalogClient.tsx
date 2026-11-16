"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BAGS, CHARMS } from "@/config/catalog";
import { BagProductCard } from "@/components/sections/BagProductCard";
import { CharmMedallionShowcase } from "@/components/ui/CharmMedallionShowcase";

type FilterKind = "all" | "bags" | "charms";

export function ShopCatalogClient() {
  const searchParams = useSearchParams();
  const initialParam = searchParams.get("category");
  const initialFilter: FilterKind =
    initialParam === "charms" ? "charms" : initialParam === "bags" ? "bags" : "all";

  const [filter, setFilter] = useState<FilterKind>(initialFilter);

  const subtitle = useMemo(() => {
    if (filter === "bags") return "Every Tati silhouette arrives with a complimentary charm at launch.";
    if (filter === "charms") return "Playful charms, sweet little symbols and personal touches.";
    return "A first look at Tati silhouettes and personal bag charms — arriving soon.";
  }, [filter]);

  return (
    <div className="tati-section">
      <div className="tati-container">
        <div className="tati-shop-toolbar">
          <p className="tati-lead" style={{ maxWidth: 480 }}>
            {subtitle}
          </p>

          <div className="tati-filter-tabs" role="group" aria-label="Filter collection">
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
                className="tati-filter-tab"
                data-active={filter === tab.id ? "true" : "false"}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {(filter === "all" || filter === "bags") && (
          <div style={{ marginBottom: filter === "all" ? 72 : 0 }}>
            <div className="tati-eyebrow" style={{ marginBottom: 20 }}>
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
            <div className="tati-eyebrow" style={{ marginBottom: 20 }}>
              Bag Charms · Personal touches
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
                      <Link href="/charms" className="tati-explore-link">
                        Style in 3D ↗
                      </Link>
                    </div>
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
