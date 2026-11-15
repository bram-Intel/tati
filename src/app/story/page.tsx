import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { BRAND } from "@/config/brand";
import { StorySection } from "@/components/sections/StorySection";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Style should feel like you. Discover the Tati perspective on personal expression, signature palette, and sculptural handbags.",
};

const PALETTE_SWATCHES = [
  { name: "1. Raspberry Pink", role: "Primary Pink", hex: "#DB2850" },
  { name: "2. Warm Coral", role: "Transition Colour", hex: "#F57971" },
  { name: "3. Tangerine Orange", role: "Primary Orange", hex: "#F27F49" },
  { name: "4. Creamy Ivory", role: "Logo Lettering", hex: "#FFF1DD" },
  { name: "5. Soft Champagne Gold", role: "Decorative Accent", hex: "#D9A078" },
  { name: "6. Warm Ivory", role: "Neutral Canvas", hex: "#F1E8DF" },
];

export default function StoryPage() {
  return (
    <>
      <section className="tati-page-banner">
        <div className="tati-container">
          <div className="tati-eyebrow">{BRAND.story.eyebrow}</div>
          <h1>
            {BRAND.story.headingLead}{" "}
            <em style={{ fontStyle: "italic" }}>{BRAND.story.headingItalic}</em>
          </h1>
          <p className="tati-lead" style={{ maxWidth: 560, marginInline: "auto" }}>
            {BRAND.tagline}
          </p>
        </div>
      </section>

      <StorySection />

      <section className="tati-section">
        <div className="tati-container">
          <div className="tati-section-head">
            <div className="tati-eyebrow">Visual Signature · Collection 001</div>
            <h2 className="tati-heading-section">Our Official Colour Direction</h2>
            <p className="tati-lead">
              Every silhouette, hardware piece, and hand-poured enamel charm lives inside our sunlit raspberry, coral, tangerine, ivory, and champagne-gold world.
            </p>
          </div>

          <div className="tati-collection-grid">
            {PALETTE_SWATCHES.map((swatch) => (
              <div
                key={swatch.hex}
                style={{
                  borderRadius: 16,
                  border: "1px solid var(--hairline)",
                  background: "var(--paper)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: 112,
                    background: swatch.hex,
                    borderBottom: "1px solid var(--hairline)",
                  }}
                />
                <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-serif)", fontSize: 22 }}>
                      {swatch.name}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{swatch.role}</div>
                  </div>
                  <code style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-soft)" }}>
                    {swatch.hex}
                  </code>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 44 }}>
            <Link href="/shop" className="tati-btn-primary">
              Explore the Collection ↗
            </Link>
          </div>
        </div>
      </section>

      <NewsletterSection />
    </>
  );
}
