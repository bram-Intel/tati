"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Sparkles, X } from "lucide-react";
import { BAGS, CHARMS, formatPrice, type BagProduct } from "@/config/catalog";
import { ProductStage3D, type StageCameraView } from "@/components/cinematic/ProductStage3D";
import { useStore } from "@/components/layout/StoreContext";

function QuickAddModalBody({
  bag,
  onClose,
}: {
  bag: BagProduct;
  onClose: () => void;
}) {
  const { addBagToCart, currency } = useStore();
  const [colorwayId, setColorwayId] = useState(bag.defaultColorwayId);
  const [complimentaryCharmId, setComplimentaryCharmId] = useState(bag.defaultCharmId);
  const [extraCharmIds, setExtraCharmIds] = useState<string[]>([]);
  const [cameraView, setCameraView] = useState<StageCameraView>("three-quarter");

  const activeColorway =
    bag.colorways.find((c) => c.id === colorwayId) || bag.colorways[0];

  const extrasTotal = extraCharmIds.reduce((sum, id) => {
    const c = CHARMS.find((ch) => ch.id === id);
    return sum + (c ? c.priceGbp : 0);
  }, 0);

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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="tati-badge">Live 3D Atelier</span>
            <div style={{ display: "flex", gap: 6 }}>
              {(["front", "three-quarter", "charm"] as StageCameraView[]).map((view) => (
                <button
                  key={view}
                  type="button"
                  onClick={() => setCameraView(view)}
                  className="tati-3d-toggle"
                  data-active={cameraView === view ? "true" : "false"}
                >
                  {view === "three-quarter" ? "3/4" : view === "charm" ? "Charm Zoom" : "Front"}
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
            Leather: <strong>{activeColorway.name}</strong> · Click charms on the right to see them clip on in 3D
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
          <div style={{ marginTop: 20 }}>
            <div className="tati-eyebrow" style={{ marginBottom: 10 }}>
              1. Leather shade — {activeColorway.name}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {bag.colorways.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColorwayId(c.id)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "7px 13px",
                    borderRadius: 999,
                    border:
                      c.id === activeColorway.id
                        ? "1.5px solid var(--raspberry)"
                        : "1px solid var(--hairline)",
                    background: c.id === activeColorway.id ? "#FFF1EC" : "var(--paper)",
                    fontSize: 12,
                  }}
                >
                  <span
                    style={{
                      width: 14,
                      height: 14,
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

          {/* Complimentary Charm */}
          <div style={{ marginTop: 20 }}>
            <div
              className="tati-eyebrow"
              style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}
            >
              <Sparkles size={12} color="#DB2850" />
              2. Complimentary charm (Included free)
            </div>
            <div className="tati-charm-selector-row">
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
                  <span>{charm.glyph}</span>
                  <span>{charm.shortName}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Extra Charms */}
          <div style={{ marginTop: 20 }}>
            <div className="tati-eyebrow" style={{ marginBottom: 10 }}>
              3. Layer additional charms (Optional · up to 3)
            </div>
            <div className="tati-charm-selector-row">
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
                    {selected && <Check size={12} color="#DB2850" />}
                    <span>
                      {charm.glyph} {charm.shortName} (+{formatPrice(charm.priceGbp, currency)})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              marginTop: 26,
              paddingTop: 18,
              borderTop: "1px solid var(--hairline)",
            }}
          >
            <div>
              <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase" }}>
                Total
              </div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 500 }}>
                {formatPrice(bag.priceGbp + extrasTotal, currency)}
              </div>
            </div>

            <button
              type="button"
              className="tati-btn-primary"
              onClick={() =>
                addBagToCart({
                  bagSlug: bag.slug,
                  colorwayId: activeColorway.id,
                  complimentaryCharmId,
                  extraCharmIds,
                })
              }
            >
              Add to Bag
            </button>
          </div>

          <div style={{ marginTop: 14, textAlign: "right" }}>
            <Link
              href={`/products/${bag.slug}`}
              onClick={onClose}
              style={{ fontSize: 12, color: "var(--raspberry)", textDecoration: "underline" }}
            >
              View full handbag specifications →
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
