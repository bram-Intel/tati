"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Eye, RotateCw, Sparkles } from "lucide-react";
import { BRAND } from "@/config/brand";
import { BAGS, CHARMS } from "@/config/catalog";
import { ProductStage3D, type StageCameraView } from "@/components/cinematic/ProductStage3D";
import { ScrollReveal } from "@/components/cinematic/ScrollReveal";
import { CharmEmblemIcon } from "@/components/ui/CharmEmblemIcon";

interface CharmsSectionProps {
  hideHeader?: boolean;
}

export function CharmsSection({ hideHeader = false }: CharmsSectionProps) {
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

  return (
    <section className="tati-section tati-section--sand" id="charms">
      <div className="tati-container">
        {!hideHeader && (
          <ScrollReveal>
            <div className="tati-section-head">
              <div className="tati-eyebrow">{BRAND.charms.eyebrow}</div>
              <h2 className="tati-heading-section">{BRAND.charms.heading}</h2>
              <p className="tati-lead">{BRAND.charms.supporting}</p>
            </div>
          </ScrollReveal>
        )}

        <div className="tati-charms-grid">
          <ScrollReveal>
            <div className="tati-charms-workbench">
              <div className="tati-workbench-bar">
                <div className="tati-segmented" role="group" aria-label="Choose silhouette to preview">
                  {BAGS.slice(0, 3).map((bag) => (
                    <button
                      key={bag.id}
                      type="button"
                      onClick={() => setSelectedBagSlug(bag.slug)}
                      className="tati-seg-btn"
                      data-active={bag.slug === selectedBagSlug ? "true" : "false"}
                    >
                      {bag.name}
                    </button>
                  ))}
                </div>

                <div className="tati-segmented" role="group" aria-label="Camera angle">
                  <button
                    type="button"
                    onClick={() => setCameraView("charm")}
                    className="tati-seg-btn"
                    data-active={cameraView === "charm" ? "true" : "false"}
                  >
                    <Eye size={12} aria-hidden="true" />
                    <span>Charm Detail</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCameraView("three-quarter")}
                    className="tati-seg-btn"
                    data-active={cameraView === "three-quarter" ? "true" : "false"}
                  >
                    <RotateCw size={12} aria-hidden="true" />
                    <span>Full Bag</span>
                  </button>
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

              <div className="tati-control-group">
                <div className="tati-eyebrow tati-control-label">
                  <Sparkles size={12} color="var(--raspberry)" aria-hidden="true" />
                  <span>1. Choose your complimentary charm</span>
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

              <div className="tati-control-group">
                <div className="tati-eyebrow tati-control-label">
                  <span>2. Layer personal touches (up to 3)</span>
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

              <div className="tati-workbench-footer">
                <div>
                  <div className="tati-workbench-summary">
                    {activeBag.name} · {1 + extraCharmIds.length} Charm
                    {extraCharmIds.length > 0 ? "s" : ""}
                  </div>
                  <div className="tati-coming-soon-serif">Coming soon</div>
                </div>

                <Link href="/#newsletter" className="tati-btn-primary">
                  Notify Me at Launch ↗
                </Link>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={120}>
            <div className="tati-charms-copy">
              <div className="tati-eyebrow">{BRAND.charms.makeItYoursEyebrow}</div>
              <h3>{BRAND.charms.detailsHeading}</h3>
              <p>{BRAND.charms.description}</p>
              <p className="tati-charms-note">{BRAND.charms.note}</p>

              <div className="tati-charm-showcase-photo">
                <Image
                  src="/images/charms-studio.jpg"
                  alt="Tati sculpted champagne-gold and enamel bag charms arranged on silk ribbon"
                  fill
                  sizes="(max-width: 1020px) 100vw, 45vw"
                  style={{ objectFit: "cover" }}
                />
              </div>

              {!hideHeader && (
                <div style={{ marginTop: 24 }}>
                  <Link href="/charms" className="tati-btn-outline">
                    Discover All Bag Charms ↗
                  </Link>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
