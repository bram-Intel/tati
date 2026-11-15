import nodemailer from "nodemailer";
import { BRAND } from "@/config/brand";
import { formatPrice } from "@/config/catalog";
import type { OrderRecord } from "@/types/store";

export interface MailDispatchResult {
  dispatched: boolean;
  channel: "zoho-smtp" | "preview-noop";
  campaignSynced?: boolean;
  error?: string;
}

export function isZohoSmtpConfigured(): boolean {
  return Boolean(process.env.ZOHO_SMTP_USER?.trim() && process.env.ZOHO_SMTP_PASS?.trim());
}

export function isZohoCampaignsConfigured(): boolean {
  return Boolean(
    process.env.ZOHO_CAMPAIGNS_WEBHOOK_URL?.trim() ||
      (process.env.ZOHO_CAMPAIGNS_LIST_KEY?.trim() &&
        process.env.ZOHO_OAUTH_CLIENT_ID?.trim() &&
        process.env.ZOHO_OAUTH_CLIENT_SECRET?.trim() &&
        process.env.ZOHO_OAUTH_REFRESH_TOKEN?.trim())
  );
}

function createZohoTransporter() {
  const host = process.env.ZOHO_SMTP_HOST?.trim() || "smtp.zoho.com";
  const port = Number(process.env.ZOHO_SMTP_PORT || "465");
  const user = process.env.ZOHO_SMTP_USER!.trim();
  const pass = process.env.ZOHO_SMTP_PASS!.trim();

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrapTatiEmailTemplate(title: string, bodyHtml: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#F1E8DF;color:#432C2A;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F1E8DF;padding:36px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#FFF9F1;border:1px solid #EAD9C9;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="background:linear-gradient(115deg,#DB2850,#F57971 57%,#F27F49);padding:38px 32px;text-align:center;color:#FFF1DD;">
              <div style="font-size:11px;letter-spacing:2.4px;text-transform:uppercase;font-family:Arial,sans-serif;opacity:0.9;">Tati · bytatistudio.com</div>
              <div style="font-size:40px;font-style:italic;margin:10px 0 4px;line-height:1;">Tati<span style="color:#FFF1DD;">.</span></div>
              <div style="font-size:11px;letter-spacing:1.8px;text-transform:uppercase;font-family:Arial,sans-serif;opacity:0.92;">Colourful. Confident. Expressive.</div>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 34px;font-family:Arial,sans-serif;font-size:14px;line-height:1.75;color:#432C2A;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="background:#392B2B;color:#FFF1DD;padding:24px 32px;text-align:center;font-family:Arial,sans-serif;font-size:11px;letter-spacing:1.2px;">
              <div style="font-family:Georgia,serif;font-style:italic;font-size:20px;color:#F57971;margin-bottom:6px;">With love, Tati ♡</div>
              <div style="color:#C8AAA0;text-transform:uppercase;">© 2026 Tati Studio · bytatistudio.com</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function syncZohoNewsletterSubscriber(email: string): Promise<boolean> {
  const webhookUrl = process.env.ZOHO_CAMPAIGNS_WEBHOOK_URL?.trim();
  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "bytatistudio.com",
          subscribedAt: new Date().toISOString(),
        }),
      });
      return res.ok;
    } catch (err) {
      console.error("[Tati/Zoho] Webhook sync error:", err);
      return false;
    }
  }

  const listKey = process.env.ZOHO_CAMPAIGNS_LIST_KEY?.trim();
  const clientId = process.env.ZOHO_OAUTH_CLIENT_ID?.trim();
  const clientSecret = process.env.ZOHO_OAUTH_CLIENT_SECRET?.trim();
  const refreshToken = process.env.ZOHO_OAUTH_REFRESH_TOKEN?.trim();

  if (!listKey || !clientId || !clientSecret || !refreshToken) {
    return false;
  }

  try {
    const accountsDomain = process.env.ZOHO_ACCOUNTS_DOMAIN?.trim() || "https://accounts.zoho.com";
    const campaignsDomain = process.env.ZOHO_CAMPAIGNS_DOMAIN?.trim() || "https://campaigns.zoho.com";

    const tokenRes = await fetch(`${accountsDomain}/oauth/v2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "refresh_token",
      }),
    });

    if (!tokenRes.ok) return false;
    const tokenJson = (await tokenRes.json()) as { access_token?: string };
    if (!tokenJson.access_token) return false;

    const contactInfo = JSON.stringify({ "Contact Email": email });
    const subRes = await fetch(`${campaignsDomain}/api/v1.1/json/listsubscribe`, {
      method: "POST",
      headers: {
        Authorization: `Zoho-oauthtoken ${tokenJson.access_token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        resfmt: "JSON",
        listkey: listKey,
        contactinfo: contactInfo,
        source: "Website Newsletter",
      }),
    });
    return subRes.ok;
  } catch (err) {
    console.error("[Tati/Zoho] Zoho Campaigns OAuth list sync error:", err);
    return false;
  }
}

export async function sendNewsletterWelcomeEmail(email: string): Promise<MailDispatchResult> {
  const campaignSynced = await syncZohoNewsletterSubscriber(email);

  if (!isZohoSmtpConfigured()) {
    return {
      dispatched: false,
      channel: "preview-noop",
      campaignSynced,
    };
  }

  try {
    const transporter = createZohoTransporter();
    const fromName = process.env.ZOHO_FROM_NAME?.trim() || "Tati Studio";
    const fromEmail = process.env.ZOHO_FROM_EMAIL?.trim() || process.env.ZOHO_SMTP_USER!.trim();
    const studioInbox = process.env.ZOHO_STUDIO_INBOX?.trim();

    const html = wrapTatiEmailTemplate(
      "Welcome to the world of Tati",
      `
      <p style="font-family:Georgia,serif;font-size:24px;margin:0 0 14px;color:#432C2A;">A little note from us.</p>
      <p>Thank you for joining the Tati inner circle. You’ll be the first to know about new handbag silhouettes, limited-edition bag charm drops, and private atelier releases.</p>
      <p style="color:#8D7770;">Remember: every Tati handbag includes a complimentary charm of your choice—because the details are the personality.</p>
      <div style="margin:26px 0;">
        <a href="${BRAND.url}/shop" style="display:inline-block;background:linear-gradient(115deg,#DB2850,#F27F49);color:#FFF1DD;text-decoration:none;padding:13px 26px;border-radius:30px;font-size:11px;letter-spacing:1.6px;text-transform:uppercase;">Explore the collection ↗</a>
      </div>
      `
    );

    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: email,
      subject: "Welcome to Tati ♡ — First look & collection notes",
      html,
    });

    if (studioInbox) {
      await transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to: studioInbox,
        subject: `New Tati Newsletter Subscriber: ${email}`,
        text: `New newsletter sign-up on bytatistudio.com:\n\nEmail: ${email}\nTimestamp: ${new Date().toISOString()}`,
      });
    }

    return { dispatched: true, channel: "zoho-smtp", campaignSynced };
  } catch (err) {
    console.error("[Tati/Zoho] Failed to send welcome email:", err);
    return {
      dispatched: false,
      channel: "zoho-smtp",
      campaignSynced,
      error: err instanceof Error ? err.message : "SMTP dispatch error",
    };
  }
}

export async function sendOrderConfirmationEmail(order: OrderRecord): Promise<MailDispatchResult> {
  if (!isZohoSmtpConfigured()) {
    return { dispatched: false, channel: "preview-noop" };
  }

  try {
    const transporter = createZohoTransporter();
    const fromName = process.env.ZOHO_FROM_NAME?.trim() || "Tati Studio";
    const fromEmail = process.env.ZOHO_FROM_EMAIL?.trim() || process.env.ZOHO_SMTP_USER!.trim();
    const studioInbox = process.env.ZOHO_STUDIO_INBOX?.trim();

    const itemsHtml = order.items
      .map((item) => {
        if (item.kind === "bag") {
          const lineTotal = (item.unitPriceGbp + item.extraCharmsPriceGbp) * item.quantity;
          return `<div style="padding:12px 0;border-bottom:1px solid #EAD9C9;">
            <strong>${escapeHtml(item.bagName)}</strong> × ${item.quantity} — ${formatPrice(lineTotal, order.currency)}<br/>
            <span style="font-size:12px;color:#8D7770;">Colourway: ${escapeHtml(item.colorwayName)} · Complimentary Charm: ${escapeHtml(item.complimentaryCharmName)}</span>
          </div>`;
        }
        return `<div style="padding:12px 0;border-bottom:1px solid #EAD9C9;">
          <strong>${escapeHtml(item.charmName)}</strong> × ${item.quantity} — ${formatPrice(item.unitPriceGbp * item.quantity, order.currency)}<br/>
          <span style="font-size:12px;color:#8D7770;">${escapeHtml(item.finish)}</span>
        </div>`;
      })
      .join("");

    const html = wrapTatiEmailTemplate(
      `Order Confirmation ${order.orderNumber}`,
      `
      <p style="font-family:Georgia,serif;font-size:24px;margin:0 0 10px;">Thank you, ${escapeHtml(order.shipping.fullName)}.</p>
      <p>Your Tati order <strong>${escapeHtml(order.orderNumber)}</strong> has been received by our studio and is being lovingly prepared with its complimentary charm.</p>
      <div style="margin:22px 0;padding:18px;background:#F3E8DC;border-radius:8px;">
        <div style="font-size:11px;letter-spacing:1.6px;text-transform:uppercase;color:#B56C59;margin-bottom:8px;">Order Summary</div>
        ${itemsHtml}
        <div style="padding-top:14px;font-size:14px;">
          <strong>Total: ${formatPrice(order.totalGbp, order.currency)}</strong>
          <span style="color:#8D7770;font-size:12px;"> (${order.shippingMethod === "express" ? "Express Atelier Delivery" : "Standard Complimentary Delivery"})</span>
        </div>
      </div>
      <p style="font-size:12px;color:#8D7770;">Shipping to: ${escapeHtml(order.shipping.addressLine1)}, ${escapeHtml(order.shipping.city)}, ${escapeHtml(order.shipping.postcode)}, ${escapeHtml(order.shipping.country)}</p>
      `
    );

    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: order.shipping.email,
      subject: `Tati Order Confirmed · ${order.orderNumber}`,
      html,
    });

    if (studioInbox) {
      await transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to: studioInbox,
        subject: `New Order ${order.orderNumber} (${formatPrice(order.totalGbp, order.currency)})`,
        html,
      });
    }

    return { dispatched: true, channel: "zoho-smtp" };
  } catch (err) {
    console.error("[Tati/Zoho] Failed to send order confirmation:", err);
    return {
      dispatched: false,
      channel: "zoho-smtp",
      error: err instanceof Error ? err.message : "SMTP dispatch error",
    };
  }
}

export async function sendContactEmails(payload: {
  name: string;
  email: string;
  topic: string;
  message: string;
}): Promise<MailDispatchResult> {
  if (!isZohoSmtpConfigured()) {
    return { dispatched: false, channel: "preview-noop" };
  }

  try {
    const transporter = createZohoTransporter();
    const fromName = process.env.ZOHO_FROM_NAME?.trim() || "Tati Studio";
    const fromEmail = process.env.ZOHO_FROM_EMAIL?.trim() || process.env.ZOHO_SMTP_USER!.trim();
    const studioInbox = process.env.ZOHO_STUDIO_INBOX?.trim() || fromEmail;

    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      replyTo: payload.email,
      to: studioInbox,
      subject: `[Tati Studio Inquiry · ${payload.topic}] from ${payload.name}`,
      text: `Name: ${payload.name}\nEmail: ${payload.email}\nTopic: ${payload.topic}\n\n${payload.message}`,
    });

    const replyHtml = wrapTatiEmailTemplate(
      "We received your note",
      `
      <p style="font-family:Georgia,serif;font-size:24px;margin:0 0 12px;">Thank you for writing to us, ${escapeHtml(payload.name)}.</p>
      <p>Our studio concierge has received your message regarding <strong>${escapeHtml(payload.topic)}</strong> and will respond within one business day.</p>
      <p style="padding:14px;background:#F3E8DC;border-radius:8px;font-size:13px;color:#806E66;">“${escapeHtml(payload.message)}”</p>
      `
    );

    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: payload.email,
      subject: "Thank you for contacting Tati ♡",
      html: replyHtml,
    });

    return { dispatched: true, channel: "zoho-smtp" };
  } catch (err) {
    console.error("[Tati/Zoho] Failed to send contact email:", err);
    return {
      dispatched: false,
      channel: "zoho-smtp",
      error: err instanceof Error ? err.message : "SMTP dispatch error",
    };
  }
}
