"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, X } from "lucide-react";
import { BRAND } from "@/config/brand";
import { CURRENCIES, type CurrencyCode } from "@/config/catalog";
import { TatiLogo } from "@/components/brand/TatiLogo";
import { useStore } from "@/components/layout/StoreContext";

const NAV_ITEMS = [
  { href: "/shop", label: "Shop" },
  { href: "/charms", label: "Bag charms" },
  { href: "/story", label: "Our story" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { totalCount, currency, setCurrency, openCart } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="tati-topline">
        <span>{BRAND.announcement}</span>
        <span>{BRAND.announcementSecondary}</span>
      </div>

      <header className="tati-header">
        <div className="tati-container tati-header-inner">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              type="button"
              className="tati-menu-btn"
              aria-label="Open navigation menu"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={18} />
            </button>
            <Link href="/" aria-label="Tati Home">
              <TatiLogo variant="dark" size="md" />
            </Link>
          </div>

          <nav className="tati-nav" aria-label="Primary navigation">
            {NAV_ITEMS.map((item) => {
              const active =
                pathname === item.href ||
                (item.href === "/shop" && pathname?.startsWith("/products"));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="tati-nav-link"
                  data-active={active ? "true" : "false"}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="tati-header-actions">
            <label htmlFor="tati-currency" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden" }}>
              Currency
            </label>
            <select
              id="tati-currency"
              className="tati-currency-select"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              aria-label="Select display currency"
            >
              {Object.values(CURRENCIES).map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} {c.symbol}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="tati-cart-trigger"
              onClick={openCart}
              aria-label={`Open shopping bag with ${totalCount} items`}
            >
              <ShoppingBag size={14} strokeWidth={1.8} />
              <span>YOUR BAG · {totalCount}</span>
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div
          className="tati-mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMobileMenuOpen(false);
          }}
        >
          <div className="tati-mobile-nav-panel">
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingBottom: 20,
                  borderBottom: "1px solid var(--hairline)",
                }}
              >
                <TatiLogo variant="dark" size="sm" />
                <button
                  type="button"
                  aria-label="Close navigation menu"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ padding: 6 }}
                >
                  <X size={20} />
                </button>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 18,
                  paddingTop: 28,
                }}
              >
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ fontFamily: "var(--font-serif)", fontSize: 28 }}
                >
                  Home
                </Link>
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ fontFamily: "var(--font-serif)", fontSize: 28 }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div
              style={{
                borderTop: "1px solid var(--hairline)",
                paddingTop: 18,
                fontSize: 12,
                color: "var(--muted)",
              }}
            >
              <p style={{ fontStyle: "italic", fontFamily: "var(--font-serif)", fontSize: 18, color: "var(--raspberry)", marginBottom: 4 }}>
                {BRAND.signOff}
              </p>
              <p>{BRAND.domain}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
