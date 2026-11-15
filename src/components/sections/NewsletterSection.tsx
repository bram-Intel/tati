"use client";

import React, { useState } from "react";
import { BRAND } from "@/config/brand";
import { ScrollReveal } from "@/components/cinematic/ScrollReveal";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || submitting) return;

    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "homepage-newsletter" }),
      });

      const data = (await res.json()) as {
        ok?: boolean;
        message?: string;
        error?: string;
      };

      if (!res.ok || !data.ok) {
        setFeedback({
          type: "error",
          text: data.error || "Please check your email address and try again.",
        });
      } else {
        setFeedback({
          type: "success",
          text: data.message || "Welcome to Tati ♡",
        });
        setEmail("");
      }
    } catch {
      setFeedback({
        type: "error",
        text: "Network error — please try again in a moment.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="tati-newsletter" id="newsletter">
      <div className="tati-container">
        <ScrollReveal>
          <div className="tati-newsletter-card">
            <div className="tati-eyebrow">{BRAND.newsletter.eyebrow}</div>
            <h2>{BRAND.newsletter.heading}</h2>
            <p className="tati-lead">{BRAND.newsletter.supporting}</p>

            <form className="tati-newsletter-form" onSubmit={handleSubmit}>
              <label
                htmlFor="tati-newsletter-email"
                style={{ position: "absolute", width: 1, height: 1, overflow: "hidden" }}
              >
                Email address
              </label>
              <input
                id="tati-newsletter-email"
                type="email"
                required
                className="tati-newsletter-input"
                placeholder={BRAND.newsletter.placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
              />
              <button
                type="submit"
                className="tati-btn-primary"
                disabled={submitting}
              >
                {submitting ? "JOINING…" : BRAND.newsletter.buttonLabel}
              </button>
            </form>

            {feedback && (
              <div
                role="status"
                aria-live="polite"
                className={
                  feedback.type === "error"
                    ? "tati-status-pill tati-status-pill--error"
                    : "tati-status-pill"
                }
              >
                {feedback.text}
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
