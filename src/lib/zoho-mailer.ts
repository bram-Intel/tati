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

function getEmailAssetOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured && /^https?:\/\//i.test(configured)) {
    const normalized = configured.replace(/\/+$/, "");
    if (normalized === "https://bytatistudio.com") {
      return "https://www.bytatistudio.com";
    }
    return normalized;
  }
  return "https://www.bytatistudio.com";
}

function wrapTatiEmailTemplate(title: string, bodyHtml: string): string {
  const origin = getEmailAssetOrigin();
  const heroLogoUrl = `${origin}/images/tati-logo-ivory.png`;
  const footerLogoUrl = `${origin}/images/tati-logo-rose.png`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#F1E8DF;color:#432C2A;font-family:Georgia,'Times New Roman',serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#F1E8DF;padding:36px 14px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;width:100%;background:#FFF9F1;border:1px solid #EAD9C9;border-radius:14px;overflow:hidden;box-shadow:0 18px 42px -18px rgba(67,44,42,0.16);">
          <tr>
            <td align="center" bgcolor="#DB2850" style="background-color:#DB2850;background-image:linear-gradient(115deg,#DB2850 0%,#F57971 57%,#F27F49 100%);padding:38px 30px 34px;text-align:center;color:#FFF1DD;">
              <div style="font-family:Arial,'Helvetica Neue',sans-serif;font-size:10px;font-weight:600;letter-spacing:2.6px;text-transform:uppercase;color:#FFF1DD;opacity:0.9;">BYTATISTUDIO.COM &middot; COLLECTION 001</div>
              <a href="${origin}" target="_blank" style="text-decoration:none;display:inline-block;margin:14px auto 12px;">
                <img src="${heroLogoUrl}" width="176" height="91" alt="Tati" style="display:block;margin:0 auto;border:0;outline:none;text-decoration:none;max-width:100%;height:auto;font-family:Georgia,serif;font-style:italic;font-size:40px;line-height:1;color:#FFF1DD;" />
              </a>
              <div style="font-family:Arial,'Helvetica Neue',sans-serif;font-size:10px;letter-spacing:2.2px;text-transform:uppercase;color:#FFF1DD;opacity:0.92;">Colourful &middot; Confident &middot; Expressive</div>
            </td>
          </tr>
          <tr>
            <td style="height:3px;background:#D9A078;font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:38px 34px 34px;font-family:Arial,'Helvetica Neue',sans-serif;font-size:14.5px;line-height:1.8;color:#5A423D;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td align="center" bgcolor="#392B2B" style="background-color:#392B2B;color:#FFF1DD;padding:30px 28px 26px;text-align:center;font-family:Arial,'Helvetica Neue',sans-serif;">
              <a href="${origin}" target="_blank" style="text-decoration:none;display:inline-block;margin-bottom:10px;">
                <img src="${footerLogoUrl}" width="102" height="53" alt="Tati" style="display:block;margin:0 auto;border:0;outline:none;text-decoration:none;height:auto;font-family:Georgia,serif;font-style:italic;font-size:24px;color:#F2A0A4;" />
              </a>
              <div style="font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:20px;color:#F57971;margin:4px 0 16px;">With love, Tati &hearts;</div>
              <div style="margin:0 0 14px;font-size:10.5px;letter-spacing:1.4px;text-transform:uppercase;line-height:2.1;">
                <a href="${origin}/shop" style="display:inline-block;color:#EBD8CE;text-decoration:none;margin:0 11px;">The Collection</a>
                <a href="${origin}/charms" style="display:inline-block;color:#EBD8CE;text-decoration:none;margin:0 11px;">Bag Charms</a>
                <a href="${origin}/story" style="display:inline-block;color:#EBD8CE;text-decoration:none;margin:0 11px;">Our Story</a>
                <a href="${origin}/contact" style="display:inline-block;color:#EBD8CE;text-decoration:none;margin:0 11px;">Contact</a>
              </div>
              <div style="font-size:10.5px;letter-spacing:1.2px;color:#C8AAA0;text-transform:uppercase;">&copy; 2026 Tati Studio &middot; bytatistudio.com</div>
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
    const origin = getEmailAssetOrigin();

    const html = wrapTatiEmailTemplate(
      "Welcome to the world of Tati",
      `
      <div style="font-size:10.5px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#B56C59;margin:0 0 8px;">A little note from us</div>
      <h1 style="font-family:Georgia,'Times New Roman',serif;font-weight:500;font-size:28px;line-height:1.18;margin:0 0 16px;color:#432C2A;">Welcome to the world of <em>Tati.</em></h1>
      <p style="margin:0 0 14px;">Thank you for joining the Tati launch list. Style should feel like you &mdash; and we can&rsquo;t wait to share a closer look at our debut handbags and personal details.</p>
      <p style="margin:0 0 22px;color:#806E66;">As a reminder, every Tati bag is designed to arrive with a complimentary signature charm of your choice, with playful additional charms to combine your way.</p>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#F3E8DC;border:1px solid #EAD9C9;border-radius:10px;margin:0 0 26px;">
        <tr>
          <td style="padding:18px 20px;">
            <div style="font-size:10px;font-weight:600;letter-spacing:1.8px;text-transform:uppercase;color:#B56C59;margin-bottom:6px;">Collection 001 &middot; Coming Soon</div>
            <div style="font-size:13.5px;line-height:1.65;color:#432C2A;">You&rsquo;ll be the very first to hear when our debut silhouettes and charm studio open for ordering.</div>
          </td>
        </tr>
      </table>
      <div style="font-size:0;line-height:0;">
        <a href="${origin}/shop" target="_blank" style="display:inline-block;margin:0 10px 10px 0;padding:13px 26px;border-radius:999px;background-color:#DB2850;background-image:linear-gradient(115deg,#DB2850,#F27F49);font-family:Arial,'Helvetica Neue',sans-serif;font-size:11px;font-weight:600;line-height:1.2;letter-spacing:1.5px;text-transform:uppercase;color:#FFF1DD;text-decoration:none;white-space:nowrap;">Explore the Collection &#8599;</a>
        <a href="${origin}/charms" target="_blank" style="display:inline-block;margin:0 0 10px 0;padding:12px 22px;border-radius:999px;border:1px solid #C8A695;background-color:#FFF9F1;font-family:Arial,'Helvetica Neue',sans-serif;font-size:11px;font-weight:500;line-height:1.2;letter-spacing:1.3px;text-transform:uppercase;color:#432C2A;text-decoration:none;white-space:nowrap;">Preview Bag Charms</a>
      </div>
      `
    );

    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: email,
      replyTo: BRAND.email,
      subject: "Welcome to Tati ♡ — First look & launch notes",
      text: `A little note from us.\n\nThank you for joining the Tati launch list at bytatistudio.com. You'll be the first to know when Collection 001 opens and new bag charms drop.\n\nExplore the Collection: ${origin}/shop\nPreview Bag Charms: ${origin}/charms\n\nWith love, Tati ♡`,
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
    const configuredInbox = process.env.ZOHO_STUDIO_INBOX?.trim();
    const studioRecipients =
      configuredInbox && configuredInbox.toLowerCase() !== BRAND.email.toLowerCase()
        ? [BRAND.email, configuredInbox]
        : [BRAND.email];
    const origin = getEmailAssetOrigin();

    const studioHtml = wrapTatiEmailTemplate(
      `Studio Concierge Inquiry — ${payload.topic}`,
      `
      <div style="font-size:10.5px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#B56C59;margin:0 0 8px;">Studio Concierge Desk</div>
      <h1 style="font-family:Georgia,'Times New Roman',serif;font-weight:500;font-size:26px;line-height:1.2;margin:0 0 18px;color:#432C2A;">New note from <em>${escapeHtml(payload.name)}</em></h1>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#F3E8DC;border:1px solid #EAD9C9;border-radius:10px;margin:0 0 22px;">
        <tr>
          <td style="padding:18px 20px;font-size:13.5px;line-height:1.7;color:#432C2A;">
            <div><strong style="color:#B56C59;font-size:11px;letter-spacing:1.2px;text-transform:uppercase;">From:</strong> ${escapeHtml(payload.name)} &lt;<a href="mailto:${escapeHtml(payload.email)}" style="color:#DB2850;text-decoration:none;">${escapeHtml(payload.email)}</a>&gt;</div>
            <div style="margin-top:6px;"><strong style="color:#B56C59;font-size:11px;letter-spacing:1.2px;text-transform:uppercase;">Topic:</strong> ${escapeHtml(payload.topic)}</div>
          </td>
        </tr>
      </table>
      <div style="padding:18px 20px;background:#FFFFFF;border-left:3px solid #DB2850;border-radius:8px;font-size:14.5px;line-height:1.75;color:#432C2A;margin-bottom:20px;">
        ${escapeHtml(payload.message).replace(/\n/g, "<br/>")}
      </div>
      <p style="margin:0;font-size:12.5px;color:#806E66;">Hit <strong>Reply</strong> in Zoho Mail to write directly back to ${escapeHtml(payload.name)} (${escapeHtml(payload.email)}).</p>
      `
    );

    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      replyTo: payload.email,
      to: studioRecipients,
      subject: `[Tati Studio · ${payload.topic}] from ${payload.name}`,
      text: `New note from ${payload.name} (${payload.email})\nTopic: ${payload.topic}\n\n${payload.message}`,
      html: studioHtml,
    });

    const replyHtml = wrapTatiEmailTemplate(
      "We received your note",
      `
      <div style="font-size:10.5px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#B56C59;margin:0 0 8px;">Studio Concierge</div>
      <h1 style="font-family:Georgia,'Times New Roman',serif;font-weight:500;font-size:27px;line-height:1.18;margin:0 0 14px;color:#432C2A;">Thank you for writing to us, <em>${escapeHtml(payload.name)}.</em></h1>
      <p style="margin:0 0 16px;">Our studio team has received your note regarding <strong>${escapeHtml(payload.topic)}</strong> at <a href="mailto:${BRAND.email}" style="color:#DB2850;text-decoration:none;">${BRAND.email}</a> and will respond within one business day.</p>
      <div style="padding:16px 18px;background:#F3E8DC;border:1px solid #EAD9C9;border-radius:10px;font-size:13.5px;line-height:1.7;color:#5A423D;margin-bottom:24px;">
        &ldquo;${escapeHtml(payload.message).replace(/\n/g, "<br/>")}&rdquo;
      </div>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td style="border-radius:999px;background-color:#DB2850;background-image:linear-gradient(115deg,#DB2850,#F27F49);">
            <a href="${origin}/shop" target="_blank" style="display:inline-block;padding:13px 26px;font-family:Arial,'Helvetica Neue',sans-serif;font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#FFF1DD;text-decoration:none;">Explore the Collection &#8599;</a>
          </td>
        </tr>
      </table>
      `
    );

    try {
      await transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to: payload.email,
        replyTo: BRAND.email,
        subject: "Thank you for contacting Tati ♡",
        text: `Thank you for writing to Tati Studio, ${payload.name}.\n\nWe received your note regarding ${payload.topic} at ${BRAND.email} and will reply within one business day.\n\n"${payload.message}"\n\nWith love, Tati ♡`,
        html: replyHtml,
      });
    } catch (replyErr) {
      console.warn("[Tati/Zoho] Studio inquiry delivered to hello@bytatistudio.com, visitor auto-reply failed:", replyErr);
    }

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
