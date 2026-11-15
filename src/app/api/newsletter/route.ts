import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { savePreviewSubscriber } from "@/lib/preview-store";
import { sendNewsletterWelcomeEmail } from "@/lib/zoho-mailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: unknown; source?: unknown };
    const rawEmail = typeof body.email === "string" ? body.email.trim() : "";
    const normalizedEmail = rawEmail.toLowerCase();
    const source =
      typeof body.source === "string" && body.source.trim()
        ? body.source.trim().slice(0, 64)
        : "homepage-newsletter";

    if (!EMAIL_RE.test(normalizedEmail)) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const db = getAdminDb();
    let storedInFirebase = false;
    let alreadySubscribed = false;

    if (db) {
      const docId = crypto
        .createHash("sha256")
        .update(normalizedEmail)
        .digest("hex")
        .slice(0, 24);
      const docRef = db.collection("newsletter_subscribers").doc(docId);
      const existing = await docRef.get();
      if (existing.exists) {
        alreadySubscribed = true;
      } else {
        await docRef.set({
          email: normalizedEmail,
          source,
          status: "subscribed",
          subscribedAt: new Date().toISOString(),
        });
      }
      storedInFirebase = true;
    } else {
      const previewRes = await savePreviewSubscriber(normalizedEmail, source);
      alreadySubscribed = previewRes.alreadyExists;
    }

    const mailResult = alreadySubscribed
      ? {
          dispatched: false,
          channel: "preview-noop" as const,
          campaignSynced: false,
        }
      : await sendNewsletterWelcomeEmail(normalizedEmail);

    let message =
      "You’re on the list ♡ Saved to Firebase Firestore (add Zoho Mail SMTP env vars on Vercel to also send welcome emails).";
    if (alreadySubscribed) {
      message = "You’re already on our studio guest list — stay tuned for upcoming drops.";
    } else if (mailResult.dispatched) {
      message = "Welcome to Tati ♡ We’ve sent your welcome note via Zoho Mail.";
    } else if (!storedInFirebase) {
      message =
        "Saved to the local preview list (connect Firebase & Zoho Mail credentials on Vercel for live storage and emails).";
    }

    return NextResponse.json({
      ok: true,
      email: normalizedEmail,
      alreadySubscribed,
      storedInFirebase,
      emailDispatched: mailResult.dispatched,
      campaignSynced: Boolean(mailResult.campaignSynced),
      channel: mailResult.channel,
      message,
    });
  } catch (err) {
    console.error("[Tati/API/Newsletter] Error:", err);
    return NextResponse.json(
      { ok: false, error: "Unable to process subscription right now." },
      { status: 500 }
    );
  }
}
