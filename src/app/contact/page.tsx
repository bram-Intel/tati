import React from "react";
import type { Metadata } from "next";
import { Mail, MapPin, Sparkles } from "lucide-react";
import { BRAND } from "@/config/brand";
import { ContactFormClient } from "@/components/sections/ContactFormClient";

export const metadata: Metadata = {
  title: "Contact Studio",
  description:
    "Connect with Tati Studio for handbag styling advice, charm customisation, orders, press, and wholesale inquiries.",
};

export default function ContactPage() {
  return (
    <>
      <section className="tati-page-banner">
        <div className="tati-container">
          <div className="tati-eyebrow">A little note to us</div>
          <h1>Contact Tati Studio</h1>
          <p className="tati-lead" style={{ maxWidth: 520, marginInline: "auto" }}>
            Whether you need help pairing charms or checking an upcoming collection drop, our studio concierge is delighted to hear from you.
          </p>
        </div>
      </section>

      <section className="tati-section">
        <div className="tati-container tati-pdp-grid">
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div className="tati-eyebrow">Studio Concierge</div>
            <h2 className="tati-heading-section" style={{ fontSize: 38 }}>
              Let’s talk colour, hardware &amp; personal details.
            </h2>
            <p className="tati-lead">
              Notes sent through our studio desk are routed via Zoho Mail directly to our team and archived securely so we can respond within one business day.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                marginTop: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Mail size={18} color="#DB2850" />
                <div>
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)" }}>
                    Direct Mail
                  </div>
                  <div style={{ fontWeight: 500 }}>{BRAND.email}</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Sparkles size={18} color="#DB2850" />
                <div>
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)" }}>
                    Press &amp; Collaborations
                  </div>
                  <div style={{ fontWeight: 500 }}>press@{BRAND.domain}</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <MapPin size={18} color="#DB2850" />
                <div>
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)" }}>
                    Atelier Hours
                  </div>
                  <div style={{ fontWeight: 500 }}>Monday – Friday · 9:30 AM – 6:00 PM GMT</div>
                </div>
              </div>
            </div>
          </div>

          <ContactFormClient />
        </div>
      </section>
    </>
  );
}
