"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { BAGS, CHARMS, type CurrencyCode } from "@/config/catalog";
import { initFirebaseAnalytics, trackTatiAnalyticsEvent } from "@/lib/firebase-client";
import type { CartBagItem, CartCharmItem, CartItem } from "@/types/store";

interface AddBagInput {
  bagSlug: string;
  colorwayId: string;
  complimentaryCharmId: string;
  extraCharmIds?: string[];
  quantity?: number;
}

interface StoreContextValue {
  items: CartItem[];
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  totalCount: number;
  subtotalGbp: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  quickAddBagSlug: string | null;
  openQuickAdd: (slug: string) => void;
  closeQuickAdd: () => void;
  addBagToCart: (input: AddBagInput) => void;
  addCharmToCart: (charmId: string, quantity?: number) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
  clearCart: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

const CART_STORAGE_KEY = "tati_cart_v1";
const CURRENCY_STORAGE_KEY = "tati_currency_v1";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [currency, setCurrencyState] = useState<CurrencyCode>("GBP");
  const [hydrated, setHydrated] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickAddBagSlug, setQuickAddBagSlug] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    Promise.resolve().then(() => {
      try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
          const parsed = JSON.parse(savedCart);
          if (Array.isArray(parsed)) setItems(parsed);
        }
        const savedCurr = localStorage.getItem(CURRENCY_STORAGE_KEY);
        if (savedCurr === "GBP" || savedCurr === "USD" || savedCurr === "EUR") {
          setCurrencyState(savedCurr);
        }
      } catch {
        // ignore storage errors
      } finally {
        setHydrated(true);
      }
      void initFirebaseAnalytics();
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore storage quota errors
    }
  }, [items, hydrated]);

  const setCurrency = useCallback((code: CurrencyCode) => {
    setCurrencyState(code);
    try {
      localStorage.setItem(CURRENCY_STORAGE_KEY, code);
    } catch {
      // ignore
    }
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const t = window.setTimeout(() => setToastMessage(null), 3200);
    return () => window.clearTimeout(t);
  }, [toastMessage]);

  const addBagToCart = useCallback(
    (input: AddBagInput) => {
      const bag = BAGS.find((b) => b.slug === input.bagSlug || b.id === input.bagSlug);
      if (!bag) return;

      const colorway =
        bag.colorways.find((c) => c.id === input.colorwayId) || bag.colorways[0];
      const compCharm =
        CHARMS.find((c) => c.id === input.complimentaryCharmId) ||
        CHARMS.find((c) => c.id === bag.defaultCharmId) ||
        CHARMS[0];

      const extras = (input.extraCharmIds || []).filter((id) =>
        CHARMS.some((c) => c.id === id)
      );
      const sortedExtras = [...extras].sort();
      const extraCharmsPriceGbp = sortedExtras.reduce((sum, id) => {
        const ch = CHARMS.find((c) => c.id === id);
        return sum + (ch ? ch.priceGbp : 0);
      }, 0);

      const lineId = `${bag.id}::${colorway.id}::${compCharm.id}::${sortedExtras.join(",")}`;
      const qty = Math.max(1, input.quantity || 1);

      setItems((prev) => {
        const existingIdx = prev.findIndex((item) => item.lineId === lineId);
        if (existingIdx >= 0) {
          return prev.map((it, idx) =>
            idx === existingIdx ? { ...it, quantity: it.quantity + qty } : it
          );
        }
        const nextItem: CartBagItem = {
          kind: "bag",
          lineId,
          bagId: bag.id,
          bagSlug: bag.slug,
          bagName: bag.name,
          image: bag.image,
          colorwayId: colorway.id,
          colorwayName: colorway.name,
          colorwayHex: colorway.hex,
          complimentaryCharmId: compCharm.id,
          complimentaryCharmName: compCharm.name,
          extraCharmIds: sortedExtras,
          unitPriceGbp: bag.priceGbp,
          extraCharmsPriceGbp,
          quantity: qty,
        };
        return [...prev, nextItem];
      });

      setQuickAddBagSlug(null);
      setIsCartOpen(true);
      showToast(`Added ${bag.name} with complimentary ${compCharm.shortName} charm`);
      void trackTatiAnalyticsEvent("add_to_cart", {
        item_id: bag.id,
        item_name: bag.name,
        colorway: colorway.name,
        complimentary_charm: compCharm.name,
        value_gbp: (bag.priceGbp + extraCharmsPriceGbp) * qty,
      });
    },
    [showToast]
  );

  const addCharmToCart = useCallback(
    (charmId: string, quantity = 1) => {
      const charm = CHARMS.find((c) => c.id === charmId);
      if (!charm) return;

      const lineId = `charm::${charm.id}`;
      setItems((prev) => {
        const idx = prev.findIndex((i) => i.lineId === lineId);
        if (idx >= 0) {
          return prev.map((it, i) =>
            i === idx ? { ...it, quantity: it.quantity + quantity } : it
          );
        }
        const item: CartCharmItem = {
          kind: "charm",
          lineId,
          charmId: charm.id,
          charmName: charm.name,
          image: charm.image,
          finish: charm.finish,
          unitPriceGbp: charm.priceGbp,
          quantity,
        };
        return [...prev, item];
      });
      setIsCartOpen(true);
      showToast(`Added ${charm.name} to your bag`);
      void trackTatiAnalyticsEvent("add_to_cart", {
        item_id: charm.id,
        item_name: charm.name,
        value_gbp: charm.priceGbp * quantity,
      });
    },
    [showToast]
  );

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.lineId !== lineId));
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.lineId === lineId ? { ...item, quantity: Math.min(20, quantity) } : item
      )
    );
  }, []);

  const removeItem = useCallback((lineId: string) => {
    setItems((prev) => prev.filter((item) => item.lineId !== lineId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotalGbp = useMemo(
    () =>
      items.reduce((sum, item) => {
        if (item.kind === "bag") {
          return sum + (item.unitPriceGbp + item.extraCharmsPriceGbp) * item.quantity;
        }
        return sum + item.unitPriceGbp * item.quantity;
      }, 0),
    [items]
  );

  const value: StoreContextValue = {
    items,
    currency,
    setCurrency,
    totalCount,
    subtotalGbp,
    isCartOpen,
    openCart: () => setIsCartOpen(true),
    closeCart: () => setIsCartOpen(false),
    quickAddBagSlug,
    openQuickAdd: (slug: string) => setQuickAddBagSlug(slug),
    closeQuickAdd: () => setQuickAddBagSlug(null),
    addBagToCart,
    addCharmToCart,
    updateQuantity,
    removeItem,
    clearCart,
    toastMessage,
    showToast,
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            left: "50%",
            bottom: 24,
            transform: "translateX(-50%)",
            zIndex: 90,
            background: "var(--footer)",
            color: "var(--ivory)",
            padding: "11px 22px",
            borderRadius: 999,
            fontSize: 12.5,
            letterSpacing: "0.04em",
            boxShadow: "0 16px 36px rgba(40,20,20,0.28)",
            border: "1px solid rgba(217, 160, 120, 0.45)",
            whiteSpace: "nowrap",
            maxWidth: "92vw",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {toastMessage}
        </div>
      )}
    </StoreContext.Provider>
  );
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return ctx;
}
