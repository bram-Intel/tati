"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { BRAND } from "@/config/brand";
import { BAGS, CHARMS, formatPrice } from "@/config/catalog";
import { ProductStage3D, type StageCameraView } from "@/components/cinematic/ProductStage3D";
import { ScrollReveal } from "@/components/cinematic/ScrollReveal";
import { useStore } from "@/components/layout/StoreContext";

export function CharmsSection() {
  const { addBagToCart, currency } = useStore();
  const [selectedBagSlug, setSelectedBagSlug] = useState(BAGS[0].slug);
  const [complimentaryCharmId, setComplimentaryCharmId] = useState(CHARMS[0].id);
  const [extraCharmIds, setExtraCharmIds] = useState<string[]>([CHARMS[1].id]);
  const [cameraView, setCameraView] = useState<StageCameraView>("charm");

  const activeBag = BAGS.find((b) => b.slug === selectedBagSlug) || BAGS[0];
  const activeColor =
    activeBag.colorways.find((c) => c.id === activeBag.defaultColorwayId) ||
    activeBag.colorways[0];

  const toggleExtra = (id: string) => {
    setExtraCharmIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : prev.length < 3
          ? [...prev, id]
          : prev
    );
    setCameraView("charm");
  };

  const extrasTotalGbp = extraCharmIds.reduce((sum, id) => {
    const ch = CHARMS.find((c) => c.id === id);
    return sum + (ch ? ch.priceGbp : 0);
  }, 0);

  return (
    <section className="tati-section tati-section--sand" id="charms">
      <div className="tati-container">
        <ScrollReveal>
          <div className="tati-section-head">
            <div className="tati-eyebrow">{BRAND.charms.eyebrow}</div>
            <h2 className="tati-heading-section">{BRAND.charms.heading}</h2>
            <p className="tati-lead">{BRAND.charms.supporting}</p>
          </div>
        </ScrollReveal>

        <div className="tati-charms-grid">
          <ScrollReveal>
            <div className="tati-charms-workbench">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 8,
                  marginBottom: 14,
                }}
              >
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {BAGS.slice(0, 3).map((bag) => (
                    <button
                      key={bag.id}
                      type="button"
                      onClick={() => setSelectedBagSlug(bag.slug)}
                      className="tati-3d-toggle"
                      data-active={bag.slug === selectedBagSlug ? "true" : "false"}
                    >
                      {bag.name}
                    </button>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 6 }}>
                  {(["three-quarter", "charm"] as StageCameraView[]).map((v) => (
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
                      {v === "charm" ? "Charm Close-up" : "Full Silhouette"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="tati-charm-stage-box">
                <ProductStage3D
                  silhouette={activeBag.silhouette}
                  leatherHex={activeColor.hex}
                  accentHex={activeColor.accentHex}
                  complimentaryCharmId={complimentaryCharmId}
                  extraCharmIds={extraCharmIds}
                  cameraView={cameraView}
                  compact
                />
              </div>

              <div style={{ marginTop: 16 }}>
                <div
                  className="tati-eyebrow"
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <Sparkles size={12} color="#DB2850" />
                  Step 1 · Choose your complimentary charm (Included free)
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

              <div style={{ marginTop: 16 }}>
                <div className="tati-eyebrow">
                  Step 2 · Layer additional charms (Optional · click to preview)
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

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 12,
                  marginTop: 20,
                  paddingTop: 16,
                  borderTop: "1px solid var(--hairline)",
                }}
              >
                <div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>
                    {activeBag.name} + {1 + extraCharmIds.length} Charm
                    {extraCharmIds.length > 0 ? "s" : ""}
                  </div>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: 25 }}>
                    {formatPrice(activeBag.priceGbp + extrasTotalGbp, currency)}
                  </div>
                </div>

                <button
                  type="button"
                  className="tati-btn-primary"
                  onClick={() =>
                    addBagToCart({
                      bagSlug: activeBag.slug,
                      colorwayId: activeColor.id,
                      complimentaryCharmId,
                      extraCharmIds,
                    })
                  }
                >
                  Add Custom Combination ↗
                </button>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={120}>
            <div className="tati-charms-copy">
              <div className="tati-eyebrow">Make it yours</div>
              <h3>{BRAND.charms.supporting}</h3>
              <p>{BRAND.charms.description}</p>
              <p>{BRAND.charms.additionalText}</p>
              <p
                style={{
                  fontSize: 10.5,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--eyebrow)",
                  marginTop: 18,
                }}
              >
                {BRAND.charms.note}
              </p>

              <div className="tati-charm-showcase-photo">
                <Image
                  src="/images/charms-studio.jpg"
                  alt="Tati sculpted champagne-gold and enamel bag charms arranged on silk ribbon"
                  fill
                  sizes="(max-width: 1020px) 100vw, 45vw"
                  style={{ objectFit: "cover" }}
                />
              </div>

              <div style={{ marginTop: 22 }}>
                <Link href="/charms" className="tati-btn-outline">
                  Discover All Bag Charms ↗
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
