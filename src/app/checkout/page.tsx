"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Lock, Sparkles } from "lucide-react";
import { CHARMS, formatPrice } from "@/config/catalog";
import { useStore } from "@/components/layout/StoreContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, currency, subtotalGbp, clearCart } = useStore();

  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [country, setCountry] = useState("United Kingdom");
  const [giftNote, setGiftNote] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shippingGbp = shippingMethod === "express" ? 12 : 0;
  const grandTotalGbp = subtotalGbp + shippingGbp;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || items.length === 0) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          currency,
          shippingMethod,
          shipping: {
            fullName,
            email,
            phone,
            addressLine1,
            addressLine2,
            city,
            postcode,
            country,
            giftNote,
          },
        }),
      });

      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        order?: { orderNumber: string };
        storedInFirebase?: boolean;
        emailDispatched?: boolean;
        channel?: string;
      };

      if (!res.ok || !data.ok || !data.order) {
        setError(data.error || "Please verify your delivery details and try again.");
        setSubmitting(false);
        return;
      }

      try {
        sessionStorage.setItem("tati_last_order", JSON.stringify(data));
      } catch {
        // ignore sessionStorage limitations
      }

      clearCart();
      router.push(`/checkout/success?order=${encodeURIComponent(data.order.orderNumber)}`);
    } catch {
      setError("Network connection interrupted. Please try submitting again.");
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <section className="tati-section">
        <div className="tati-container" style={{ textAlign: "center", maxWidth: 520 }}>
          <Sparkles size={30} color="#D9A078" style={{ marginInline: "auto", marginBottom: 14 }} />
          <h1 className="tati-heading-section" style={{ marginBottom: 12 }}>
            Your shopping bag is empty.
          </h1>
          <p className="tati-lead" style={{ marginBottom: 28 }}>
            Discover Tati’s signature silhouettes and choose your complimentary charm before checking out.
          </p>
          <Link href="/shop" className="tati-btn-primary">
            Explore the collection ↗
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="tati-page-banner">
        <div className="tati-container">
          <div className="tati-eyebrow">Studio Order Reservation</div>
          <h1>Checkout</h1>
          <p className="tati-lead">
            Every order is handcrafted with its complimentary charm, wrapped in creamy ivory tissue, and confirmed via Zoho Mail.
          </p>
        </div>
      </section>

      <section className="tati-section">
        <div className="tati-container tati-checkout-grid">
          <form
            onSubmit={handleSubmit}
            className="tati-summary-card"
            style={{ background: "var(--paper)", display: "flex", flexDirection: "column", gap: 18 }}
          >
            <div className="tati-eyebrow">1. Delivery Details</div>

            <div className="tati-form-row-2">
              <div className="tati-field">
                <label htmlFor="checkout-name">Full Name *</label>
                <input
                  id="checkout-name"
                  type="text"
                  required
                  className="tati-input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="tati-field">
                <label htmlFor="checkout-email">Email for Confirmation *</label>
                <input
                  id="checkout-email"
                  type="email"
                  required
                  className="tati-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="tati-field">
              <label htmlFor="checkout-phone">Phone (for courier updates)</label>
              <input
                id="checkout-phone"
                type="tel"
                className="tati-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="tati-field">
              <label htmlFor="checkout-addr1">Street Address *</label>
              <input
                id="checkout-addr1"
                type="text"
                required
                className="tati-input"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
              />
            </div>

            <div className="tati-field">
              <label htmlFor="checkout-addr2">Apartment / Suite (Optional)</label>
              <input
                id="checkout-addr2"
                type="text"
                className="tati-input"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
              />
            </div>

            <div className="tati-form-row-3">
              <div className="tati-field">
                <label htmlFor="checkout-city">City *</label>
                <input
                  id="checkout-city"
                  type="text"
                  required
                  className="tati-input"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="tati-field">
                <label htmlFor="checkout-postcode">Postcode / ZIP *</label>
                <input
                  id="checkout-postcode"
                  type="text"
                  required
                  className="tati-input"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                />
              </div>
              <div className="tati-field">
                <label htmlFor="checkout-country">Country *</label>
                <input
                  id="checkout-country"
                  type="text"
                  required
                  className="tati-input"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
            </div>

            <div className="tati-eyebrow" style={{ marginTop: 10 }}>
              2. Courier Option
            </div>
            <div className="tati-form-row-2">
              <button
                type="button"
                onClick={() => setShippingMethod("standard")}
                style={{
                  textAlign: "left",
                  padding: 14,
                  borderRadius: 12,
                  border:
                    shippingMethod === "standard"
                      ? "1.5px solid var(--raspberry)"
                      : "1px solid var(--hairline)",
                  background: shippingMethod === "standard" ? "#FFF2EE" : "#FFFFFF",
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 13 }}>Standard Atelier Shipping</div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>
                  3–5 business days · Complimentary
                </div>
              </button>

              <button
                type="button"
                onClick={() => setShippingMethod("express")}
                style={{
                  textAlign: "left",
                  padding: 14,
                  borderRadius: 12,
                  border:
                    shippingMethod === "express"
                      ? "1.5px solid var(--raspberry)"
                      : "1px solid var(--hairline)",
                  background: shippingMethod === "express" ? "#FFF2EE" : "#FFFFFF",
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 13 }}>Express Tracked Courier</div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>
                  Next-day dispatch · {formatPrice(12, currency)}
                </div>
              </button>
            </div>

            <div className="tati-field">
              <label htmlFor="checkout-note">Personal Gift Card Note (Optional)</label>
              <textarea
                id="checkout-note"
                rows={2}
                className="tati-textarea"
                placeholder="Write a personal note to be printed on ivory card stock…"
                value={giftNote}
                onChange={(e) => setGiftNote(e.target.value)}
              />
            </div>

            {error && (
              <div className="tati-status-pill tati-status-pill--error" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="tati-btn-primary"
              style={{ marginTop: 8, paddingBlock: 16 }}
              disabled={submitting}
            >
              <Lock size={14} />
              <span>
                {submitting
                  ? "Confirming Order with Studio…"
                  : `Place Order · ${formatPrice(grandTotalGbp, currency)}`}
              </span>
            </button>
          </form>

          {/* Right Order Summary */}
          <aside className="tati-summary-card">
            <div className="tati-eyebrow" style={{ marginBottom: 16 }}>
              Order Summary ({items.reduce((s, i) => s + i.quantity, 0)} items)
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {items.map((item) => {
                if (item.kind === "bag") {
                  const unitPrice = item.unitPriceGbp + item.extraCharmsPriceGbp;
                  const extras = item.extraCharmIds
                    .map((id) => CHARMS.find((c) => c.id === id)?.shortName)
                    .filter(Boolean);
                  return (
                    <div
                      key={item.lineId}
                      style={{
                        display: "flex",
                        gap: 12,
                        paddingBottom: 14,
                        borderBottom: "1px solid var(--hairline)",
                      }}
                    >
                      <Image
                        src={item.image}
                        alt={item.bagName}
                        width={64}
                        height={82}
                        style={{
                          objectFit: "cover",
                          borderRadius: 8,
                          border: "1px solid var(--hairline)",
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <strong style={{ fontFamily: "var(--font-serif)", fontSize: 19 }}>
                            {item.bagName} × {item.quantity}
                          </strong>
                          <span style={{ fontWeight: 600, fontSize: 13 }}>
                            {formatPrice(unitPrice * item.quantity, currency)}
                          </span>
                        </div>
                        <div style={{ fontSize: 12, color: "var(--muted)" }}>
                          Shade: {item.colorwayName}
                        </div>
                        <div style={{ fontSize: 11.5, color: "var(--raspberry)", marginTop: 2 }}>
                          Free charm: {item.complimentaryCharmName}
                        </div>
                        {extras.length > 0 && (
                          <div style={{ fontSize: 11.5, color: "var(--muted-warm)" }}>
                            + {extras.join(", ")}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={item.lineId}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingBottom: 12,
                      borderBottom: "1px solid var(--hairline)",
                    }}
                  >
                    <div>
                      <strong style={{ fontFamily: "var(--font-serif)", fontSize: 18 }}>
                        {item.charmName} × {item.quantity}
                      </strong>
                      <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{item.finish}</div>
                    </div>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>
                      {formatPrice(item.unitPriceGbp * item.quantity, currency)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: "var(--muted)" }}>Subtotal</span>
                <span>{formatPrice(subtotalGbp, currency)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: "var(--muted)" }}>Delivery</span>
                <span>{shippingGbp === 0 ? "Complimentary" : formatPrice(shippingGbp, currency)}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  paddingTop: 12,
                  borderTop: "1px solid var(--hairline)",
                }}
              >
                <span style={{ fontWeight: 600 }}>Total</span>
                <span style={{ fontFamily: "var(--font-serif)", fontSize: 30, fontWeight: 500 }}>
                  {formatPrice(grandTotalGbp, currency)}
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                marginTop: 18,
                padding: 12,
                borderRadius: 10,
                background: "var(--paper)",
                fontSize: 12,
                color: "var(--muted-warm)",
              }}
            >
              <CheckCircle2 size={16} color="#DB2850" style={{ flexShrink: 0, marginTop: 2 }} />
              <span>
                Totals are verified server-side and archived directly in Firebase Firestore with Zoho Mail confirmation support.
              </span>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
