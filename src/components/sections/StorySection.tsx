import React from "react";
import Link from "next/link";
import { BRAND } from "@/config/brand";
import { ButterflyCrest3D } from "@/components/cinematic/ButterflyCrest3D";

export function StorySection() {
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
            gap: 10,
            width: "100%",
          }}
        >
          <ButterflyCrest3D />
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: 48,
              color: "var(--ivory)",
              lineHeight: 1,
            }}
          >
            Tati.
          </div>
          <div className="tati-eyebrow tati-eyebrow--light">
            {BRAND.tagline}
          </div>
        </div>
      </div>

      <div className="tati-story-copy">
        <div className="tati-eyebrow">{BRAND.story.eyebrow}</div>
        <h2>
          {BRAND.story.headingLead}
          <br />
          <em>{BRAND.story.headingItalic}</em>
        </h2>

        <div className="tati-story-paragraphs">
          {BRAND.story.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        <p className="tati-story-signoff">{BRAND.story.closingSignOff}</p>

        <div style={{ marginTop: 26 }}>
          <Link href="/story" className="tati-btn-outline">
            Read Our Story &amp; Palette ↗
          </Link>
        </div>
      </div>
    </section>
  );
}
