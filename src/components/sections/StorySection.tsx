import React from "react";
import Link from "next/link";
import { BRAND } from "@/config/brand";
import { TatiLogo } from "@/components/brand/TatiLogo";
import { ButterflyCrest3D } from "@/components/cinematic/ButterflyCrest3D";

interface StorySectionProps {
  mode?: "home" | "page";
}

export function StorySection({ mode = "home" }: StorySectionProps) {
  return (
    <section className="tati-story-split" id="story">
      <div className="tati-story-art tati-gradient-surface">
        <div className="tati-grain-overlay" aria-hidden="true" />
        <div
          style={{
            position: "relative",
            zIndex: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
            width: "100%",
          }}
        >
          <ButterflyCrest3D />
          <TatiLogo variant="light" size="lg" />
          <div className="tati-eyebrow tati-eyebrow--light">
            {BRAND.tagline}
          </div>
        </div>
      </div>

      <div className="tati-story-copy">
        <div className="tati-eyebrow">{BRAND.story.eyebrow}</div>
        {mode === "page" ? (
          <h1>
            {BRAND.story.headingLead}
            <br />
            <em>{BRAND.story.headingItalic}</em>
          </h1>
        ) : (
          <h2>
            {BRAND.story.headingLead}
            <br />
            <em>{BRAND.story.headingItalic}</em>
          </h2>
        )}

        <div className="tati-story-paragraphs">
          {BRAND.story.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        <p className="tati-story-signoff">{BRAND.story.closingSignOff}</p>

        <div style={{ marginTop: 28 }}>
          {mode === "page" ? (
            <Link href="/shop" className="tati-btn-primary">
              Explore the Collection ↗
            </Link>
          ) : (
            <Link href="/story" className="tati-btn-outline">
              Our Story ↗
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
