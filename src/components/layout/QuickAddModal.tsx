"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Sparkles, X } from "lucide-react";
import { BAGS, CHARMS, type BagProduct } from "@/config/catalog";
import { ProductStage3D, type StageCameraView } from "@/components/cinematic/ProductStage3D";
import { useStore } from "@/components/layout/StoreContext";
import { CharmEmblemIcon } from "@/components/ui/CharmEmblemIcon";

function QuickAddModalBody({
  bag,
  onClose,
}: {
  bag: BagProduct;
  onClose: () => void;
}) {
  const [colorwayId, setColorwayId] = useState(bag.defaultColorwayId);
  const [complimentaryCharmId, setComplimentaryCharmId] = useState(bag.defaultCharmId);
  const [extraCharmIds, setExtraCharmIds] = useState<string[]>([]);
  const [cameraView, setCameraView] = useState<StageCameraView>("three-quarter");

  const activeColorway =
    bag.colorways.find((c) => c.id === colorwayId) || bag.colorways[0];

  const toggleExtraCharm = (id: string) => {
    setExtraCharmIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : prev.length < 3
          ? [...prev, id]
          : prev
    );
  };

  return (
    <div className="tati-modal">
      <div className="tati-pdp-grid" style={{ gap: 0 }}>
        {/* Interactive 3D Stage */}
        <div
          style={{
            background: "radial-gradient(circle at 50% 42%, #FFF7EB 0%, #EFE2D3 100%)",
            padding: 20,
            minHeight: 400,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderRight: "1px solid var(--hairline)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span className="tati-badge">3D Styling Preview</span>
            <div className="tati-segmented">
              {(["front", "three-quarter", "charm"] as StageCameraView[]).map((view) => (
                <button
                  key={view}
                  type="button"
                  onClick={() => setCameraView(view)}
                  className="tati-seg-btn"
                  data-active={cameraView === view ? "true" : "false"}
                >
                  {view === "three-quarter" ? "3/4 View" : view === "charm" ? "Charm" : "Front"}
                </button>
              ))}
            </div>
          </div>

          <div style={{ height: 340, marginBlock: 8 }}>
            <ProductStage3D
              silhouette={bag.silhouette}
              leatherHex={activeColorway.hex}
              accentHex={activeColorway.accentHex}
              complimentaryCharmId={complimentaryCharmId}
              extraCharmIds={extraCharmIds}
              cameraView={cameraView}
              compact
            />
          </div>

          <div style={{ fontSize: 11.5, color: "var(--muted-warm)", textAlign: "center" }}>
            Leather: <strong>{activeColorway.name}</strong> · Click charms to preview in 3D
          </div>
        </div>

        {/* Configuration Controls */}
        <div style={{ padding: "26px 28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div className="tati-eyebrow">Edition {bag.editionNumber}</div>
              <h3
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 32,
                  fontWeight: 500,
                  marginTop: 4,
                }}
              >
                {bag.name}
              </h3>
            </div>
            <button
              type="button"
              aria-label="Close personalization modal"
              onClick={onClose}
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                border: "1px solid var(--hairline)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <X size={16} />
            </button>
          </div>

          <p style={{ fontSize: 13.5, color: "var(--muted)", marginTop: 6 }}>{bag.tagline}</p>

          {/* Leather Colourway */}
          <div className="tati-control-group">
            <div className="tati-eyebrow tati-control-label">
              <span>1. Leather shade — {activeColorway.name}</span>
            </div>
            <div className="tati-shade-pill-row">
              {bag.colorways.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColorwayId(c.id)}
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

          {/* Complimentary Charm */}
          <div className="tati-control-group">
            <div className="tati-eyebrow tati-control-label">
              <Sparkles size={12} color="var(--raspberry)" />
              <span>2. Complimentary charm</span>
            </div>
            <div className="tati-charm-selector-grid">
              {CHARMS.map((charm) => (
                <button
                  key={charm.id}
                  type="button"
                  onClick={() => {
                    setComplimentaryCharmId(charm.id);
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

          {/* Extra Charms */}
          <div className="tati-control-group">
            <div className="tati-eyebrow tati-control-label">
              <span>3. Layer personal touches (up to 3)</span>
            </div>
            <div className="tati-charm-selector-grid">
              {CHARMS.map((charm) => {
                const selected = extraCharmIds.includes(charm.id);
                return (
                  <button
                    key={charm.id}
                    type="button"
                    onClick={() => {
                      toggleExtraCharm(charm.id);
                      setCameraView("charm");
                    }}
                    className="tati-charm-chip"
                    data-extra={selected ? "true" : "false"}
                  >
                    {selected ? (
                      <Check size={13} color="var(--raspberry)" />
                    ) : (
                      <CharmEmblemIcon symbol={charm.symbol} size={14} />
                    )}
                    <span>{charm.shortName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="tati-workbench-footer">
            <div>
              <div className="tati-workbench-summary">Launch Preview</div>
              <div className="tati-coming-soon-serif">Coming soon</div>
            </div>

            <Link
              href={`/products/${bag.slug}`}
              onClick={onClose}
              className="tati-btn-primary"
            >
              Explore Piece ↗
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function QuickAddModal() {
  const { quickAddBagSlug, closeQuickAdd } = useStore();
  const bag = quickAddBagSlug ? BAGS.find((b) => b.slug === quickAddBagSlug) : null;

  if (!bag) return null;

  return (
    <div
      className="tati-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={`Personalize ${bag.name}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeQuickAdd();
      }}
    >
      <QuickAddModalBody key={bag.slug} bag={bag} onClose={closeQuickAdd} />
    </div>
  );
}
