import React from "react";
import type { Metadata } from "next";
import { BRAND } from "@/config/brand";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <>
      <section className="tati-page-banner">
        <div className="tati-container">
          <div className="tati-eyebrow">Data &amp; Privacy</div>
          <h1>Privacy Policy</h1>
        </div>
      </section>
      <section className="tati-section">
        <div className="tati-container" style={{ maxWidth: 740, display: "flex", flexDirection: "column", gap: 18 }}>
          <h2 className="tati-heading-section" style={{ fontSize: 32 }}>Newsletter &amp; Order Data</h2>
          <p className="tati-lead">
            When you join the Tati guest list, place an order, or message our studio concierge, your contact details are securely stored in Google Firebase Firestore and processed solely to deliver collection launch updates and order confirmations via Zoho Mail / Zoho Campaigns.
          </p>
          <p className="tati-lead">
            We never sell or share customer personal information with third-party data brokers. To unsubscribe or request removal of your record at any time, email{" "}
            <strong>{BRAND.email}</strong>.
          </p>
        </div>
      </section>
    </>
  );
}
