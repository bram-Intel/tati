"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Box, Check, Image as ImageIcon, ShieldCheck, Sparkles } from "lucide-react";
import { CHARMS, formatPrice, type BagProduct } from "@/config/catalog";
import { ProductStage3D, type StageCameraView } from "@/components/cinematic/ProductStage3D";
import { useStore } from "@/components/layout/StoreContext";

interface ProductDetailClientProps {
  bag: BagProduct;
}

export function ProductDetailClient({ bag }: ProductDetailClientProps) {
  const { addBagToCart, currency } = useStore();
  const [stageMode, setStageMode] = useState<"studio" | "3d">("studio");
  const [cameraView, setCameraView] = useState<StageCameraView>("three-quarter");
  const [colorwayId, setColorwayId] = useState(bag.defaultColorwayId);
  const [complimentaryCharmId, setComplimentaryCharmId] = useState(bag.defaultCharmId);
  const [extraCharmIds, setExtraCharmIds] = useState<string[]>([]);

  const activeColorway =
    bag.colorways.find((c) => c.id === colorwayId) || bag.colorways[0];

  const extrasPriceGbp = extraCharmIds.reduce((sum, id) => {
    const ch = CHARMS.find((c) => c.id === id);
    return sum + (ch ? ch.priceGbp : 0);
  }, 0);

  const toggleExtra = (id: string) => {
    setExtraCharmIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : prev.length < 3
          ? [...prev, id]
          : prev
    );
    setStageMode("3d");
    setCameraView("charm");
  };

  return (
    <section className="tati-section">
      <div className="tati-container">
        <div style={{ marginBottom: 26 }}>
          <Link
            href="/shop"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--muted-warm)",
            }}
          >
            <ArrowLeft size={14} />
            Back to collection
          </Link>
        </div>

        <div className="tati-pdp-grid">
          {/* Left Visual Column: Studio Photography & Live 3D Stage */}
          <div>
            <div
              style={{
                position: "relative",
                aspectRatio: "3 / 4",
                borderRadius: 20,
                overflow: "hidden",
                border: "1px solid var(--hairline)",
                background: "radial-gradient(circle at 50% 42%, #FFF7EB 0%, #EFE2D3 100%)",
                boxShadow: "var(--shadow-soft)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 16,
                  left: 16,
                  right: 16,
                  zIndex: 5,
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    type="button"
                    onClick={() => setStageMode("studio")}
                    className="tati-3d-toggle"
                    data-active={stageMode === "studio" ? "true" : "false"}
                  >
                    <ImageIcon size={12} />
                    Studio Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => setStageMode("3d")}
                    className="tati-3d-toggle"
                    data-active={stageMode === "3d" ? "true" : "false"}
                  >
                    <Box size={12} />
                    Interactive 3D
                  </button>
                </div>

                {stageMode === "3d" && (
                  <div style={{ display: "flex", gap: 6 }}>
                    {(["front", "three-quarter", "charm"] as StageCameraView[]).map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setCameraView(v)}
                        className="tati-badge"
                        style={{
                          cursor: "pointer",
                          borderColor:
                            cameraView === v ? "var(--raspberry)" : "var(--hairline)",
                          color: cameraView === v ? "var(--raspberry)" : "var(--ink)",
                        }}
                      >
                        {v === "three-quarter" ? "3/4" : v === "charm" ? "Charm Zoom" : "Front"}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {stageMode === "studio" ? (
                <Image
                  src={bag.image}
                  alt={`${bag.name} studio photograph`}
                  fill
                  priority
                  sizes="(max-width: 1020px) 100vw, 48vw"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <ProductStage3D
                  silhouette={bag.silhouette}
                  leatherHex={activeColorway.hex}
                  accentHex={activeColorway.accentHex}
                  complimentaryCharmId={complimentaryCharmId}
                  extraCharmIds={extraCharmIds}
                  cameraView={cameraView}
                />
              )}
            </div>
          </div>

          {/* Right Configuration & Narrative Column */}
          <div>
            <div className="tati-eyebrow">
              Collection 001 · Edition {bag.editionNumber}
            </div>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(38px, 4.5vw, 54px)",
                fontWeight: 500,
                lineHeight: 1.05,
                marginTop: 10,
              }}
            >
              {bag.name}
            </h1>

            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 14,
                marginTop: 12,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 32,
                  color: "var(--raspberry)",
                  fontWeight: 500,
                }}
              >
                {formatPrice(bag.priceGbp, currency)}
              </span>
              <span style={{ fontSize: 12, color: "var(--muted)" }}>
                Complimentary charm included
              </span>
            </div>

            <p
              style={{
                fontSize: 15,
                lineHeight: 1.85,
                color: "var(--muted-warm)",
                marginTop: 18,
              }}
            >
              {bag.description}
            </p>

            {/* Step 1: Colorway */}
            <div
              style={{
                marginTop: 26,
                paddingTop: 22,
                borderTop: "1px solid var(--hairline)",
              }}
            >
              <div className="tati-eyebrow" style={{ marginBottom: 12 }}>
                1. Leather Shade — {activeColorway.name}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {bag.colorways.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setColorwayId(c.id);
                      setStageMode("3d");
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 9,
                      padding: "9px 15px",
                      borderRadius: 999,
                      border:
                        c.id === activeColorway.id
                          ? "1.5px solid var(--raspberry)"
                          : "1px solid var(--hairline)",
                      background:
                        c.id === activeColorway.id ? "#FFF1EC" : "var(--paper)",
                      fontSize: 12.5,
                    }}
                  >
                    <span
                      style={{
                        width: 15,
                        height: 15,
                        borderRadius: "50%",
                        background: c.hex,
                        border: "1px solid rgba(67,44,42,0.25)",
                      }}
                    />
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Complimentary Charm */}
            <div style={{ marginTop: 24 }}>
              <div
                className="tati-eyebrow"
                style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}
              >
                <Sparkles size={13} color="#DB2850" />
                2. Complimentary Charm (Included Free)
              </div>
              <div className="tati-charm-selector-row">
                {CHARMS.map((charm) => (
                  <button
                    key={charm.id}
                    type="button"
                    onClick={() => {
                      setComplimentaryCharmId(charm.id);
                      setStageMode("3d");
                      setCameraView("charm");
                    }}
                    className="tati-charm-chip"
                    data-selected={complimentaryCharmId === charm.id ? "true" : "false"}
                  >
                    <span>{charm.glyph}</span>
                    <span>{charm.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Optional Layered Charms */}
            <div style={{ marginTop: 24 }}>
              <div className="tati-eyebrow" style={{ marginBottom: 12 }}>
                3. Layer Additional Charms (Optional · up to 3)
              </div>
              <div className="tati-charm-selector-row">
                {CHARMS.map((charm) => {
                  const selected = extraCharmIds.includes(charm.id);
                  return (
                    <button
                      key={charm.id}
                      type="button"
                      onClick={() => toggleExtra(charm.id)}
                      className="tati-charm-chip"
                      data-extra={selected ? "true" : "false"}
                    >
                      {selected && <Check size={12} color="#DB2850" />}
                      <span>
                        {charm.glyph} {charm.shortName} (+
                        {formatPrice(charm.priceGbp, currency)})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <div style={{ marginTop: 28, display: "flex", flexWrap: "wrap", gap: 14 }}>
              <button
                type="button"
                className="tati-btn-primary"
                style={{ flex: 1, minWidth: 230, paddingBlock: 16 }}
                onClick={() =>
                  addBagToCart({
                    bagSlug: bag.slug,
                    colorwayId: activeColorway.id,
                    complimentaryCharmId,
                    extraCharmIds,
                  })
                }
              >
                Add to Bag · {formatPrice(bag.priceGbp + extrasPriceGbp, currency)}
              </button>
            </div>

            {/* Craft Specs */}
            <div
              className="tati-summary-card"
              style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 12 }}
            >
              <div className="tati-eyebrow">Atelier Specifications</div>
              <div style={{ fontSize: 13 }}>
                <strong>Dimensions:</strong> {bag.dimensions}
              </div>
              <div style={{ fontSize: 13 }}>
                <strong>Materials:</strong> {bag.materials}
              </div>
              <div style={{ fontSize: 13 }}>
                <strong>Strap &amp; Handle:</strong> {bag.strapDrop}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  paddingTop: 10,
                  borderTop: "1px solid var(--hairline)",
                  fontSize: 12,
                  color: "var(--muted-warm)",
                }}
              >
                <ShieldCheck size={15} color="#DB2850" />
                <span>Dispatched in our signature ivory dust bag with complimentary returns.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
