import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { BAGS, CHARMS, type CurrencyCode } from "@/config/catalog";
import { getAdminDb } from "@/lib/firebase-admin";
import { savePreviewOrder } from "@/lib/preview-store";
import { sendOrderConfirmationEmail } from "@/lib/zoho-mailer";
import type { CartBagItem, CartCharmItem, CartItem, CreateOrderRequest, OrderRecord } from "@/types/store";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<CreateOrderRequest>;

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Your bag is empty. Please add a piece before checking out." },
        { status: 400 }
      );
    }

    const s = body.shipping;
    if (
      !s ||
      !s.fullName?.trim() ||
      !EMAIL_RE.test(s.email?.trim() || "") ||
      !s.addressLine1?.trim() ||
      !s.city?.trim() ||
      !s.postcode?.trim() ||
      !s.country?.trim()
    ) {
      return NextResponse.json(
        { ok: false, error: "Please complete all required delivery details with a valid email." },
        { status: 400 }
      );
    }

    const verifiedItems: CartItem[] = [];
    let subtotalGbp = 0;

    for (const rawItem of body.items) {
      const qty = Math.max(1, Math.min(20, Math.floor(Number(rawItem.quantity) || 1)));

      if (rawItem.kind === "bag") {
        const bag = BAGS.find((b) => b.id === rawItem.bagId || b.slug === rawItem.bagSlug);
        if (!bag) {
          return NextResponse.json(
            { ok: false, error: "An item in your bag is no longer recognised in our catalog." },
            { status: 400 }
          );
        }

        const colorway =
          bag.colorways.find((c) => c.id === rawItem.colorwayId) ||
          bag.colorways[0];

        const complimentaryCharm =
          CHARMS.find((c) => c.id === rawItem.complimentaryCharmId) ||
          CHARMS.find((c) => c.id === bag.defaultCharmId) ||
          CHARMS[0];

        const extraIds = Array.isArray(rawItem.extraCharmIds)
          ? rawItem.extraCharmIds.filter((id): id is string =>
              CHARMS.some((c) => c.id === id)
            )
          : [];

        const extraCharmsPriceGbp = extraIds.reduce((sum, id) => {
          const c = CHARMS.find((ch) => ch.id === id);
          return sum + (c ? c.priceGbp : 0);
        }, 0);

        const verifiedBag: CartBagItem = {
          kind: "bag",
          lineId: rawItem.lineId || `${bag.id}-${colorway.id}`,
          bagId: bag.id,
          bagSlug: bag.slug,
          bagName: bag.name,
          image: bag.image,
          colorwayId: colorway.id,
          colorwayName: colorway.name,
          colorwayHex: colorway.hex,
          complimentaryCharmId: complimentaryCharm.id,
          complimentaryCharmName: complimentaryCharm.name,
          extraCharmIds: extraIds,
          unitPriceGbp: bag.priceGbp,
          extraCharmsPriceGbp,
          quantity: qty,
        };

        subtotalGbp += (bag.priceGbp + extraCharmsPriceGbp) * qty;
        verifiedItems.push(verifiedBag);
      } else if (rawItem.kind === "charm") {
        const charm = CHARMS.find((c) => c.id === rawItem.charmId);
        if (!charm) {
          return NextResponse.json(
            { ok: false, error: "Selected charm could not be found in catalog." },
            { status: 400 }
          );
        }
        const verifiedCharm: CartCharmItem = {
          kind: "charm",
          lineId: rawItem.lineId || charm.id,
          charmId: charm.id,
          charmName: charm.name,
          image: charm.image,
          finish: charm.finish,
          unitPriceGbp: charm.priceGbp,
          quantity: qty,
        };
        subtotalGbp += charm.priceGbp * qty;
        verifiedItems.push(verifiedCharm);
      }
    }

    const currency: CurrencyCode =
      body.currency === "USD" || body.currency === "EUR" ? body.currency : "GBP";
    const shippingMethod = body.shippingMethod === "express" ? "express" : "standard";
    const shippingGbp = shippingMethod === "express" ? 12 : 0;
    const totalGbp = subtotalGbp + shippingGbp;

    const orderNumber = `TATI-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
    const order: OrderRecord = {
      orderNumber,
      createdAt: new Date().toISOString(),
      status: "confirmed",
      currency,
      subtotalGbp,
      shippingGbp,
      totalGbp,
      shippingMethod,
      shipping: {
        fullName: s.fullName.trim(),
        email: s.email.trim().toLowerCase(),
        phone: (s.phone || "").trim(),
        addressLine1: s.addressLine1.trim(),
        addressLine2: (s.addressLine2 || "").trim(),
        city: s.city.trim(),
        postcode: s.postcode.trim(),
        country: s.country.trim(),
        giftNote: (s.giftNote || "").trim(),
      },
      items: verifiedItems,
    };

    const db = getAdminDb();
    let storedInFirebase = false;

    if (db) {
      await db.collection("orders").doc(orderNumber).set(order);
      storedInFirebase = true;
    } else {
      await savePreviewOrder(order as unknown as Record<string, unknown>);
    }

    const mailResult = await sendOrderConfirmationEmail(order);

    return NextResponse.json({
      ok: true,
      order,
      storedInFirebase,
      emailDispatched: mailResult.dispatched,
      channel: mailResult.channel,
    });
  } catch (err) {
    console.error("[Tati/API/Orders] Error:", err);
    return NextResponse.json(
      { ok: false, error: "Could not complete your order right now." },
      { status: 500 }
    );
  }
}
