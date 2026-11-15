import React from "react";
import type { Metadata } from "next";
import { BRAND } from "@/config/brand";

export const metadata: Metadata = {
  title: "Shipping & Returns",
};

export default function ShippingReturnsPage() {
  return (
    <>
      <section className="tati-page-banner">
        <div className="tati-container">
          <div className="tati-eyebrow">Atelier Care &amp; Delivery</div>
          <h1>Shipping &amp; Returns</h1>
        </div>
      </section>
      <section className="tati-section">
        <div className="tati-container" style={{ maxWidth: 740, display: "flex", flexDirection: "column", gap: 18 }}>
          <h2 className="tati-heading-section" style={{ fontSize: 32 }}>Dispatch &amp; Complimentary Packaging</h2>
          <p className="tati-lead">
            Every Tati handbag ships nestled inside a protective creamy-ivory cotton dust bag together with your chosen complimentary bag charm. Standard UK &amp; international courier delivery is complimentary on all Collection 001 orders, with next-day Express delivery available at checkout.
          </p>
          <h2 className="tati-heading-section" style={{ fontSize: 32, marginTop: 14 }}>28-Day Returns</h2>
          <p className="tati-lead">
            Unworn handbags and charms in original packaging may be returned within 28 days of receipt. Write to{" "}
            <strong>{BRAND.email}</strong> with your order reference to arrange a complimentary return label.
          </p>
        </div>
      </section>
    </>
  );
}
