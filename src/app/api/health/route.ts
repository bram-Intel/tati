import { connection, NextResponse } from "next/server";
import { isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import { isZohoCampaignsConfigured, isZohoSmtpConfigured } from "@/lib/zoho-mailer";

export async function GET() {
  await connection();

  return NextResponse.json({
    status: "ok",
    brand: "Tati (bytatistudio.com)",
    timestamp: new Date().toISOString(),
    integrations: {
      firebaseAdmin: isFirebaseAdminConfigured(),
      zohoSmtp: isZohoSmtpConfigured(),
      zohoCampaigns: isZohoCampaignsConfigured(),
    },
  });
}
