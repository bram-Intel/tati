import React from "react";
import type { Metadata } from "next";
import { BRAND } from "@/config/brand";

export const metadata: Metadata = {
  title: "Terms & Conditions",
};

export default function TermsPage() {
  return (
    <>
      <section className="tati-page-banner">
        <div className="tati-container">
          <div className="tati-eyebrow">Studio Terms</div>
          <h1>Terms &amp; Conditions</h1>
        </div>
      </section>
      <section className="tati-section">
        <div className="tati-container" style={{ maxWidth: 740, display: "flex", flexDirection: "column", gap: 18 }}>
          <h2 className="tati-heading-section" style={{ fontSize: 32 }}>Use of {BRAND.domain}</h2>
          <p className="tati-lead">
            All designs, photography, 3D models, the Tati italic script logo, and butterfly brand motifs displayed on {BRAND.domain} belong to Tati Studio.
          </p>
          <p className="tati-lead">
            Prices shown are verified server-side at checkout. Every qualifying handbag order entitles the customer to one complimentary bag charm subject to seasonal availability.
          </p>
        </div>
      </section>
    </>
  );
}
