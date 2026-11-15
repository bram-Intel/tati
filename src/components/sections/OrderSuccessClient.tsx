"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Mail } from "lucide-react";
import { formatPrice } from "@/config/catalog";
import type { OrderRecord } from "@/types/store";

interface LastOrderResponse {
  order: OrderRecord;
  storedInFirebase: boolean;
  emailDispatched: boolean;
  channel: string;
}

export function OrderSuccessClient() {
  const params = useSearchParams();
  const orderNumber = params.get("order") || "";
  const [payload, setPayload] = useState<LastOrderResponse | null>(null);

  useEffect(() => {
    Promise.resolve().then(() => {
      try {
        const raw = sessionStorage.getItem("tati_last_order");
        if (raw) {
          const parsed = JSON.parse(raw) as LastOrderResponse;
          if (!orderNumber || parsed.order?.orderNumber === orderNumber) {
            setPayload(parsed);
          }
        }
      } catch {
        // ignore
      }
    });
  }, [orderNumber]);

  return (
    <section className="tati-section">
      <div className="tati-container" style={{ maxWidth: 680 }}>
        <div className="tati-summary-card" style={{ textAlign: "center", padding: "42px 32px" }}>
          <CheckCircle2 size={42} color="#DB2850" style={{ marginInline: "auto", marginBottom: 14 }} />
          <div className="tati-eyebrow">Thank You · Studio Confirmation</div>
          <h1
            className="tati-heading-section"
            style={{ marginTop: 10, marginBottom: 12 }}
          >
            Your Tati order is confirmed.
          </h1>
          {(orderNumber || payload?.order.orderNumber) && (
            <p style={{ fontSize: 15, fontWeight: 600, color: "var(--raspberry)", marginBottom: 16 }}>
              Reference: {orderNumber || payload?.order.orderNumber}
            </p>
          )}

          {payload?.order ? (
            <div style={{ textAlign: "left", marginTop: 22 }}>
              <div
                style={{
                  padding: 18,
                  borderRadius: 12,
                  background: "var(--paper)",
                  border: "1px solid var(--hairline)",
                }}
              >
                <div className="tati-eyebrow" style={{ marginBottom: 10 }}>
                  Ordered Pieces
                </div>
                {payload.order.items.map((item) => (
                  <div
                    key={item.lineId}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingBlock: 8,
                      borderBottom: "1px solid var(--hairline)",
                      fontSize: 13.5,
                    }}
                  >
                    <div>
                      <strong>
                        {item.kind === "bag" ? item.bagName : item.charmName}
                      </strong>{" "}
                      × {item.quantity}
                      {item.kind === "bag" && (
                        <div style={{ fontSize: 12, color: "var(--muted)" }}>
                          {item.colorwayName} · Free charm: {item.complimentaryCharmName}
                        </div>
                      )}
                    </div>
                    <span>
                      {formatPrice(
                        (item.kind === "bag"
                          ? item.unitPriceGbp + item.extraCharmsPriceGbp
                          : item.unitPriceGbp) * item.quantity,
                        payload.order.currency
                      )}
                    </span>
                  </div>
                ))}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingTop: 12,
                    fontWeight: 600,
                  }}
                >
                  <span>Total</span>
                  <span>{formatPrice(payload.order.totalGbp, payload.order.currency)}</span>
                </div>
              </div>

              <div
                className="tati-status-pill"
                style={{ marginTop: 18, width: "100%", justifyContent: "center" }}
              >
                <Mail size={14} />
                <span>
                  {payload.emailDispatched
                    ? `Confirmation dispatched via Zoho Mail to ${payload.order.shipping.email}`
                    : payload.storedInFirebase
                      ? "Saved to Firebase Firestore (configure Zoho Mail SMTP env vars on Vercel to dispatch emails)."
                      : "Preview checkout stored locally (connect Firebase & Zoho Mail env vars on Vercel for live email & DB)."}
                </span>
              </div>
            </div>
          ) : (
            <p className="tati-lead" style={{ marginBottom: 24 }}>
              Thank you for shopping with Tati. Visit our collection anytime to add another silhouette or personal charm combination.
            </p>
          )}

          <div style={{ marginTop: 28, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <Link href="/shop" className="tati-btn-primary">
              Continue Exploring ↗
            </Link>
            <Link href="/" className="tati-btn-outline">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
