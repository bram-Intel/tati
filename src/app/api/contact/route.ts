import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { savePreviewInquiry } from "@/lib/preview-store";
import { sendContactEmails } from "@/lib/zoho-mailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      name?: unknown;
      email?: unknown;
      topic?: unknown;
      message?: unknown;
    };

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const topic =
      typeof body.topic === "string" && body.topic.trim()
        ? body.topic.trim()
        : "General Studio Inquiry";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!name || !EMAIL_RE.test(email) || message.length < 5) {
      return NextResponse.json(
        { ok: false, error: "Please enter your name, a valid email, and a short message." },
        { status: 400 }
      );
    }

    const inquiryId = `INQ-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
    const record = {
      inquiryId,
      name,
      email,
      topic,
      message,
      createdAt: new Date().toISOString(),
    };

    const db = getAdminDb();
    let storedInFirebase = false;

    if (db) {
      await db.collection("inquiries").doc(inquiryId).set(record);
      storedInFirebase = true;
    } else {
      await savePreviewInquiry(record);
    }

    const mailResult = await sendContactEmails({ name, email, topic, message });

    return NextResponse.json({
      ok: true,
      inquiryId,
      storedInFirebase,
      emailDispatched: mailResult.dispatched,
      channel: mailResult.channel,
      message: mailResult.dispatched
        ? "Thank you — your note has been sent to hello@bytatistudio.com via Zoho Mail."
        : storedInFirebase
          ? "Thank you — your inquiry has been saved to Tati Studio Firebase Firestore (add Zoho Mail SMTP env vars on Vercel to send email notifications)."
          : "Note logged in preview mode (connect Firebase & Zoho Mail env vars on Vercel for live inbox delivery).",
    });
  } catch (err) {
    console.error("[Tati/API/Contact] Error:", err);
    return NextResponse.json(
      { ok: false, error: "Unable to send your note right now." },
      { status: 500 }
    );
  }
}
