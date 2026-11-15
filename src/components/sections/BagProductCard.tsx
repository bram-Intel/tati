"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Box, Image as ImageIcon } from "lucide-react";
import { formatPrice, type BagProduct } from "@/config/catalog";
import { ProductStage3D } from "@/components/cinematic/ProductStage3D";
import { useStore } from "@/components/layout/StoreContext";

interface BagProductCardProps {
  bag: BagProduct;
}

export function BagProductCard({ bag }: BagProductCardProps) {
  const { currency, openQuickAdd } = useStore();
  const [viewMode, setViewMode] = useState<"photo" | "3d">("photo");
  const [selectedColorId, setSelectedColorId] = useState(bag.defaultColorwayId);

  const activeColor =
    bag.colorways.find((c) => c.id === selectedColorId) || bag.colorways[0];

  return (
    <article className="tati-product-card">
      <div className="tati-product-frame">
        <div className="tati-card-pill-bar">
          <span className="tati-badge">{bag.badge}</span>
          <button
            type="button"
            className="tati-3d-toggle"
            data-active={viewMode === "3d" ? "true" : "false"}
            onClick={() => setViewMode((m) => (m === "photo" ? "3d" : "photo"))}
            aria-label={`Toggle 3D view for ${bag.name}`}
          >
            {viewMode === "3d" ? (
              <>
                <ImageIcon size={11} />
                <span>Studio</span>
              </>
            ) : (
              <>
                <Box size={11} />
                <span>3D View</span>
              </>
            )}
          </button>
        </div>

        {viewMode === "3d" ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "radial-gradient(circle at 50% 42%, #FFF7EB 0%, #EFE2D3 100%)",
            }}
          >
            <ProductStage3D
              silhouette={bag.silhouette}
              leatherHex={activeColor.hex}
              accentHex={activeColor.accentHex}
              complimentaryCharmId={bag.defaultCharmId}
              compact
            />
          </div>
        ) : (
          <Link
            href={`/products/${bag.slug}`}
            aria-label={`View ${bag.name}`}
            style={{ display: "block", position: "relative", width: "100%", height: "100%" }}
          >
            <Image
              src={bag.image}
              alt={`${bag.name} handbag in ${activeColor.name}`}
              fill
              sizes="(max-width: 780px) 100vw, (max-width: 1020px) 50vw, 33vw"
              className="tati-product-img"
            />
          </Link>
        )}

        <div className="tati-quick-bar">
          <button
            type="button"
            className="tati-quick-btn"
            onClick={() => openQuickAdd(bag.slug)}
          >
            Personalize &amp; Add · {formatPrice(bag.priceGbp, currency)}
          </button>
        </div>
      </div>

      <div className="tati-card-meta">
        <div className="tati-card-row">
          <Link href={`/products/${bag.slug}`} className="tati-card-title">
            {bag.name}
          </Link>
          <span className="tati-card-price">{formatPrice(bag.priceGbp, currency)}</span>
        </div>
        <p className="tati-card-tagline">{bag.tagline}</p>

        <div className="tati-swatch-row">
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

          <Link
            href={`/products/${bag.slug}`}
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.09em",
              textTransform: "uppercase",
              color: "var(--muted-warm)",
            }}
          >
            Explore ↗
          </Link>
        </div>
      </div>
    </article>
  );
}
