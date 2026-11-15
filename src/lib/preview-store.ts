import { promises as fs } from "node:fs";
import path from "node:path";

interface PreviewStoreData {
  subscribers: Array<{ email: string; subscribedAt: string; source: string }>;
  orders: Array<Record<string, unknown>>;
  inquiries: Array<Record<string, unknown>>;
}

const STORE_PATH = path.join("/tmp", "tati-preview-store.json");

async function readStore(): Promise<PreviewStoreData> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<PreviewStoreData>;
    return {
      subscribers: Array.isArray(parsed.subscribers) ? parsed.subscribers : [],
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
      inquiries: Array.isArray(parsed.inquiries) ? parsed.inquiries : [],
    };
  } catch {
    return { subscribers: [], orders: [], inquiries: [] };
  }
}

async function writeStore(data: PreviewStoreData): Promise<void> {
  await fs.writeFile(STORE_PATH, JSON.stringify(data, null, 2), "utf8");
}

export async function savePreviewSubscriber(
  email: string,
  source: string
): Promise<{ alreadyExists: boolean }> {
  const store = await readStore();
  const normalized = email.trim().toLowerCase();
  const exists = store.subscribers.some((s) => s.email === normalized);
  if (!exists) {
    store.subscribers.push({
      email: normalized,
      subscribedAt: new Date().toISOString(),
      source,
    });
    await writeStore(store);
  }
  return { alreadyExists: exists };
}

export async function savePreviewOrder(order: Record<string, unknown>): Promise<void> {
  const store = await readStore();
  store.orders.push(order);
  await writeStore(store);
}

export async function savePreviewInquiry(inquiry: Record<string, unknown>): Promise<void> {
  const store = await readStore();
  store.inquiries.push(inquiry);
  await writeStore(store);
}
