"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Sparkles, Trash2, X } from "lucide-react";
import { CHARMS, formatPrice } from "@/config/catalog";
import { useStore } from "@/components/layout/StoreContext";

export function CartDrawer() {
  const {
    items,
    currency,
    subtotalGbp,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
  } = useStore();

  if (!isCartOpen) return null;

  return (
    <div
      className="tati-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Your Shopping Bag"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeCart();
      }}
    >
      <div className="tati-drawer">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px",
            borderBottom: "1px solid var(--hairline)",
          }}
        >
          <div>
            <div className="tati-eyebrow">Your Tati selection</div>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 28,
                fontWeight: 500,
                marginTop: 2,
              }}
            >
              Shopping Bag
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close bag drawer"
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "1px solid var(--hairline)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", paddingBlock: 54 }}>
              <Sparkles
                size={28}
                style={{ marginInline: "auto", marginBottom: 14, color: "var(--gold)" }}
              />
              <h3
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 26,
                  fontWeight: 500,
                  marginBottom: 8,
                }}
              >
                Your bag is currently empty.
              </h3>
              <p className="tati-lead" style={{ marginBottom: 24 }}>
                Every Tati handbag includes a complimentary charm of your choice to make it unmistakably yours.
              </p>
              <Link href="/shop" onClick={closeCart} className="tati-btn-primary">
                Explore the collection
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {items.map((item) => {
                if (item.kind === "bag") {
                  const unitTotal = item.unitPriceGbp + item.extraCharmsPriceGbp;
                  const extraCharmNames = item.extraCharmIds
                    .map((id) => CHARMS.find((c) => c.id === id)?.shortName)
                    .filter(Boolean);

                  return (
                    <div
                      key={item.lineId}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "82px 1fr",
                        gap: 14,
                        paddingBottom: 18,
                        borderBottom: "1px solid var(--hairline)",
                      }}
                    >
                      <Image
                        src={item.image}
                        alt={item.bagName}
                        width={82}
                        height={104}
                        style={{
                          objectFit: "cover",
                          borderRadius: 10,
                          border: "1px solid var(--hairline)",
                        }}
                      />

                      <div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 8,
                            alignItems: "flex-start",
                          }}
                        >
                          <Link
                            href={`/products/${item.bagSlug}`}
                            onClick={closeCart}
                            style={{
                              fontFamily: "var(--font-serif)",
                              fontSize: 21,
                              fontWeight: 500,
                              lineHeight: 1.15,
                            }}
                          >
                            {item.bagName}
                          </Link>
                          <button
                            type="button"
                            aria-label={`Remove ${item.bagName}`}
                            onClick={() => removeItem(item.lineId)}
                            style={{ color: "var(--muted)", padding: 4 }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            fontSize: 12,
                            color: "var(--muted)",
                            marginTop: 5,
                          }}
                        >
                          <span
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              background: item.colorwayHex,
                              border: "1px solid rgba(67,44,42,0.25)",
                              display: "inline-block",
                            }}
                          />
                          <span>{item.colorwayName}</span>
                        </div>

                        <div
                          style={{
                            marginTop: 6,
                            padding: "5px 9px",
                            borderRadius: 8,
                            background: "var(--sand)",
                            fontSize: 11,
                            color: "var(--ink-soft)",
                          }}
                        >
                          <div>
                            <strong style={{ color: "var(--raspberry)", fontWeight: 600 }}>
                              Complimentary:
                            </strong>{" "}
                            {item.complimentaryCharmName}
                          </div>
                          {extraCharmNames.length > 0 && (
                            <div style={{ marginTop: 2 }}>
                              + Layered charms: {extraCharmNames.join(", ")}
                            </div>
                          )}
                        </div>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginTop: 12,
                          }}
                        >
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 10,
                              border: "1px solid var(--hairline)",
                              borderRadius: 999,
                              padding: "4px 10px",
                            }}
                          >
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                            >
                              <Minus size={12} />
                            </button>
                            <span style={{ fontSize: 12, fontWeight: 600 }}>
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          <span style={{ fontWeight: 600, fontSize: 14, color: "var(--ink)" }}>
                            {formatPrice(unitTotal * item.quantity, currency)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={item.lineId}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "82px 1fr",
                      gap: 14,
                      paddingBottom: 18,
                      borderBottom: "1px solid var(--hairline)",
                    }}
                  >
                    <Image
                      src={item.image}
                      alt={item.charmName}
                      width={82}
                      height={82}
                      style={{
                        objectFit: "cover",
                        borderRadius: 10,
                        border: "1px solid var(--hairline)",
                      }}
                    />
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                        <div style={{ fontFamily: "var(--font-serif)", fontSize: 20 }}>
                          {item.charmName}
                        </div>
                        <button
                          type="button"
                          aria-label={`Remove ${item.charmName}`}
                          onClick={() => removeItem(item.lineId)}
                          style={{ color: "var(--muted)", padding: 4 }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 3 }}>
                        {item.finish}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginTop: 10,
                        }}
                      >
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 10,
                            border: "1px solid var(--hairline)",
                            borderRadius: 999,
                            padding: "4px 10px",
                          }}
                        >
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                          >
                            <Minus size={12} />
                          </button>
                          <span style={{ fontSize: 12, fontWeight: 600 }}>
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <span style={{ fontWeight: 600, fontSize: 14 }}>
                          {formatPrice(item.unitPriceGbp * item.quantity, currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div
            style={{
              padding: "20px 24px 26px",
              background: "var(--sand-alt)",
              borderTop: "1px solid var(--hairline)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 6,
              }}
            >
              <span style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)" }}>
                Subtotal
              </span>
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 28,
                  fontWeight: 500,
                }}
              >
                {formatPrice(subtotalGbp, currency)}
              </span>
            </div>
            <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>
              Complimentary luxury dust bag & ribbon packaging included.
            </p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="tati-btn-primary"
              style={{ width: "100%" }}
            >
              Proceed to Checkout ↗
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
