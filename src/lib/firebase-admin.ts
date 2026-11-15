import { cert, getApps, initializeApp, type App, type ServiceAccount } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let adminApp: App | null = null;
let adminDb: Firestore | null = null;

function resolveServiceAccount(): ServiceAccount | null {
  const jsonRaw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (jsonRaw) {
    try {
      const parsed = JSON.parse(jsonRaw) as ServiceAccount & {
        private_key?: string;
        client_email?: string;
        project_id?: string;
      };
      if (parsed.private_key) {
        parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
      }
      return parsed;
    } catch {
      console.error("[Tati/Firebase] Invalid FIREBASE_SERVICE_ACCOUNT_JSON format.");
      return null;
    }
  }

  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n").trim();

  if (projectId && clientEmail && privateKey) {
    return {
      projectId,
      clientEmail,
      privateKey,
    };
  }

  return null;
}

export function isFirebaseAdminConfigured(): boolean {
  return resolveServiceAccount() !== null;
}

export function getAdminDb(): Firestore | null {
  if (adminDb) return adminDb;

  const serviceAccount = resolveServiceAccount();
  if (!serviceAccount) {
    return null;
  }

  try {
    const existing = getApps();
    adminApp =
      existing.length > 0
        ? existing[0]
        : initializeApp({
            credential: cert(serviceAccount),
          });
    adminDb = getFirestore(adminApp);
    return adminDb;
  } catch (err) {
    console.error("[Tati/Firebase] Failed to initialize Firebase Admin SDK:", err);
    return null;
  }
}
