"use client";

import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import type { Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export function isFirebaseClientConfigured(): boolean {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);
}

let clientApp: FirebaseApp | null = null;
let clientDb: Firestore | null = null;
let clientAnalytics: Analytics | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === "undefined" || !isFirebaseClientConfigured()) {
    return null;
  }
  if (clientApp) return clientApp;
  clientApp = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
  return clientApp;
}

export function getClientDb(): Firestore | null {
  if (clientDb) return clientDb;
  const app = getFirebaseApp();
  if (!app) return null;
  clientDb = getFirestore(app);
  return clientDb;
}

let analyticsInitPromise: Promise<Analytics | null> | null = null;

export async function initFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined" || !firebaseConfig.measurementId) {
    return null;
  }
  if (clientAnalytics) return clientAnalytics;
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return null;
  }

  const app = getFirebaseApp();
  if (!app) return null;

  if (!analyticsInitPromise) {
    analyticsInitPromise = (async () => {
      try {
        const analyticsMod = await import("firebase/analytics");
        const supported = await analyticsMod.isSupported();
        if (!supported) return null;

        const { getInstallations, getId } = await import("firebase/installations");
        await getId(getInstallations(app));

        clientAnalytics = analyticsMod.getAnalytics(app);
        return clientAnalytics;
      } catch {
        return null;
      }
    })();
  }

  return analyticsInitPromise;
}

export async function trackTatiAnalyticsEvent(
  eventName: string,
  params?: Record<string, string | number>
): Promise<void> {
  const analytics = await initFirebaseAnalytics();
  if (!analytics) return;
  try {
    const { logEvent } = await import("firebase/analytics");
    logEvent(analytics, eventName, params);
  } catch {
    // ignore analytics errors cleanly
  }
}
