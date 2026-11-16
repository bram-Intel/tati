"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { BagProduct } from "@/config/catalog";

interface BagProductCardProps {
  bag: BagProduct;
}

export function BagProductCard({ bag }: BagProductCardProps) {
  const [selectedColorId, setSelectedColorId] = useState(bag.defaultColorwayId);

  const activeColor =
    bag.colorways.find((c) => c.id === selectedColorId) || bag.colorways[0];

  const exploreHref = `/products/${bag.slug}?shade=${encodeURIComponent(activeColor.id)}`;

  return (
    <article className="tati-product-card">
      <div className="tati-product-frame">
        <div className="tati-card-pill-bar">
          <span className="tati-badge">{bag.badge}</span>
        </div>

        <Link
          href={exploreHref}
          aria-label={`Explore ${bag.name}`}
          style={{ display: "block", position: "relative", width: "100%", height: "100%" }}
        >
          <Image
            src={bag.image}
            alt={`${bag.name} handbag in ${activeColor.name}`}
            fill
            sizes="(max-width: 639px) 100vw, (max-width: 1020px) 50vw, 25vw"
            className="tati-product-img"
          />
        </Link>
      </div>

      <div className="tati-card-meta">
        <div className="tati-card-row">
          <Link href={exploreHref} className="tati-card-title">
            {bag.name}
          </Link>
        </div>

        <p className="tati-card-tagline">{bag.tagline}</p>

        <div className="tati-card-swatches-wrap">
          <div className="tati-swatches" role="group" aria-label={`${bag.name} colourways`}>
            {bag.colorways.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-label={`Select ${c.name} shade`}
                data-active={c.id === selectedColorId ? "true" : "false"}
                className="tati-swatch-dot"
                style={{ background: c.hex }}
                onClick={() => setSelectedColorId(c.id)}
              />
            ))}
          </div>
          <span className="tati-swatch-name">{activeColor.name}</span>
        </div>

        <div className="tati-swatch-row">
          <span className="tati-coming-soon">Coming soon</span>

          <Link href={exploreHref} className="tati-explore-link">
            Explore ↗
          </Link>
        </div>
      </div>
    </article>
  );
}
