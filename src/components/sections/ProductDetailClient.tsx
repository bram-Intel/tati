"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Box, Check, Image as ImageIcon, ShieldCheck, Sparkles } from "lucide-react";
import { CHARMS, type BagProduct } from "@/config/catalog";
import { ProductStage3D, type StageCameraView } from "@/components/cinematic/ProductStage3D";
import { CharmEmblemIcon } from "@/components/ui/CharmEmblemIcon";

interface ProductDetailClientProps {
  bag: BagProduct;
}

export function ProductDetailClient({ bag }: ProductDetailClientProps) {
  const [stageMode, setStageMode] = useState<"studio" | "3d">("studio");
  const [cameraView, setCameraView] = useState<StageCameraView>("three-quarter");
  const [colorwayId, setColorwayId] = useState(bag.defaultColorwayId);
  const [complimentaryCharmId, setComplimentaryCharmId] = useState(bag.defaultCharmId);
  const [extraCharmIds, setExtraCharmIds] = useState<string[]>([]);

  useEffect(() => {
    const paramShade = new URLSearchParams(window.location.search).get("shade");
    if (paramShade && bag.colorways.some((c) => c.id === paramShade)) {
      Promise.resolve().then(() => setColorwayId(paramShade));
    }
  }, [bag.colorways]);

  const activeColorway =
    bag.colorways.find((c) => c.id === colorwayId) || bag.colorways[0];

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
        <div style={{ marginBottom: 24 }}>
          <Link href="/shop" className="tati-back-link">
            <ArrowLeft size={14} aria-hidden="true" />
            <span>Back to collection</span>
          </Link>
        </div>

        <div className="tati-pdp-grid">
          {/* Left Visual Column: Studio Photography & Live 3D Stage */}
          <div className="tati-pdp-visual">
            <div className="tati-pdp-top-controls">
              <div className="tati-segmented" role="group" aria-label="View mode">
                <button
                  type="button"
                  onClick={() => setStageMode("studio")}
                  className="tati-seg-btn"
                  data-active={stageMode === "studio" ? "true" : "false"}
                >
                  <ImageIcon size={13} aria-hidden="true" />
                  <span>Studio Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStageMode("3d")}
                  className="tati-seg-btn"
                  data-active={stageMode === "3d" ? "true" : "false"}
                >
                  <Box size={13} aria-hidden="true" />
                  <span>Interactive 3D</span>
                </button>
              </div>
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
                showHint={false}
              />
            )}

            {stageMode === "3d" && (
              <div className="tati-pdp-bottom-controls">
                <div className="tati-segmented" role="group" aria-label="3D camera angle">
                  {(["front", "three-quarter", "charm"] as StageCameraView[]).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setCameraView(v)}
                      className="tati-seg-btn"
                      data-active={cameraView === v ? "true" : "false"}
                    >
                      {v === "three-quarter"
                        ? "3/4 View"
                        : v === "charm"
                          ? "Charm Zoom"
                          : "Front"}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Configuration & Narrative Column */}
          <div>
            <div className="tati-eyebrow">
              Collection 001 · Edition {bag.editionNumber}
            </div>
            <h1 className="tati-pdp-heading">{bag.name}</h1>

            <div className="tati-pdp-status-row">
              <span className="tati-coming-soon-serif">Coming soon</span>
              <span className="tati-pdp-status-note">
                Complimentary charm included at launch
              </span>
            </div>

            <p className="tati-pdp-desc">{bag.description}</p>

            {/* Step 1: Colourway */}
            <div className="tati-pdp-block">
              <div className="tati-eyebrow tati-control-label">
                <span>1. Leather Shade — {activeColorway.name}</span>
              </div>
              <div className="tati-shade-pill-row">
                {bag.colorways.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setColorwayId(c.id);
                      setStageMode("3d");
                    }}
                    className="tati-shade-pill"
                    data-active={c.id === activeColorway.id ? "true" : "false"}
                  >
                    <span
                      className="tati-shade-pill-swatch"
                      style={{ background: c.hex }}
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Complimentary Charm */}
            <div className="tati-control-group">
              <div className="tati-eyebrow tati-control-label">
                <Sparkles size={13} color="var(--raspberry)" aria-hidden="true" />
                <span>2. Complimentary Charm (Preview in 3D)</span>
              </div>
              <div className="tati-charm-selector-grid">
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
                    <CharmEmblemIcon symbol={charm.symbol} size={14} />
                    <span>{charm.shortName}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Optional Layered Charms */}
            <div className="tati-control-group">
              <div className="tati-eyebrow tati-control-label">
                <span>3. Layer Additional Charms (Up to 3)</span>
              </div>
              <div className="tati-charm-selector-grid">
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
                      {selected ? (
                        <Check size={13} color="var(--raspberry)" aria-hidden="true" />
                      ) : (
                        <CharmEmblemIcon symbol={charm.symbol} size={14} />
                      )}
                      <span>{charm.shortName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pre-launch CTA */}
            <div style={{ marginTop: 28, display: "flex", flexWrap: "wrap", gap: 14 }}>
              <Link
                href="#newsletter"
                className="tati-btn-primary"
                style={{ flex: 1, minWidth: 230, paddingBlock: 16 }}
              >
                Coming Soon · Notify Me at Launch ↗
              </Link>
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
                <span>Presented in our signature ivory dust bag when Collection 001 launches.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
