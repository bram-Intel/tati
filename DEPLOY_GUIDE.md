# Tati (`bytatistudio.com`) — Deployment & Integration Guide

## 1. Architecture Summary

- **Frontend & Serverless APIs**: Next.js 16 (App Router) deployed to **Vercel**.
- **Interactive 3D & Motion**: Three.js PBR WebGL handbag & butterfly scenes synchronized with Lenis smooth scroll and GSAP ScrollTrigger.
- **Database**: **Firebase Firestore** (via `firebase-admin` in serverless Route Handlers for orders, newsletter subscribers, and studio inquiries + client SDK ready in `src/lib/firebase-client.ts`).
- **Mailer & Newsletter**: **Zoho Mail SMTP** (`nodemailer` on port 465 SSL) for branded transactional confirmations + optional **Zoho Campaigns** webhook / OAuth list sync.

---

## 2. Vercel Deployment

1. Import the repository (`bram-Intel/tati`) in Vercel and select **Next.js**.
2. Add custom domain `bytatistudio.com` and `www.bytatistudio.com` in **Project Settings → Domains**.
3. Configure all environment variables from `.env.example` under **Project Settings → Environment Variables**.

---

## 3. Firebase Setup (Firestore)

1. In [Firebase Console](https://console.firebase.google.com/), create a project (e.g., `tati-studio-prod`) and enable **Cloud Firestore** in Production mode.
2. Add Web App credentials to:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
3. Under **Project Settings → Service Accounts**, click **Generate new private key** and store either:
   - Single-line JSON in `FIREBASE_SERVICE_ACCOUNT_JSON`, **or**
   - Separate values in `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY`.
4. Collections created automatically on first submission:
   - `newsletter_subscribers` — guest list subscribers (deduplicated by email hash)
   - `orders` — server-verified checkout orders (`TATI-XXXXXX`)
   - `inquiries` — concierge contact messages (`INQ-XXXXXX`)

---

## 4. Zoho Mail & Zoho Campaigns Setup

1. Create a Zoho Mail mailbox for `hello@bytatistudio.com` and verify your domain SPF/DKIM records in Zoho Admin Console.
2. In **Zoho Accounts → Security → App Passwords**, generate an App-Specific Password for Vercel and populate:
   - `ZOHO_SMTP_HOST=smtp.zoho.com` (or `smtp.zoho.eu` / `smtp.zoho.in` matching your region)
   - `ZOHO_SMTP_PORT=465`
   - `ZOHO_SMTP_USER=hello@bytatistudio.com`
   - `ZOHO_SMTP_PASS=<app-specific-password>`
   - `ZOHO_FROM_NAME=Tati Studio`
   - `ZOHO_FROM_EMAIL=hello@bytatistudio.com`
   - `ZOHO_STUDIO_INBOX=hello@bytatistudio.com`
3. **Optional Zoho Campaigns List Sync**:
   - Either paste a **Zoho Flow / Campaigns Webhook URL** into `ZOHO_CAMPAIGNS_WEBHOOK_URL`, or configure `ZOHO_CAMPAIGNS_LIST_KEY`, `ZOHO_OAUTH_CLIENT_ID`, `ZOHO_OAUTH_CLIENT_SECRET`, and `ZOHO_OAUTH_REFRESH_TOKEN`.

---

## 5. Preview Mode Behavior (No Credentials Set)

When Firebase Admin or Zoho SMTP environment variables are omitted locally, API endpoints gracefully log records to `/tmp/tati-preview-store.json` and return honest `preview-noop` delivery telemetry instead of throwing errors or fabricating sent emails.
