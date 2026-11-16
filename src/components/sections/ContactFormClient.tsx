"use client";

import React, { useState } from "react";
import { CustomSelect } from "@/components/ui/CustomSelect";

const CONTACT_TOPICS = [
  { value: "Order & Styling Inquiry", label: "Styling & Collection Inquiry" },
  { value: "Bespoke Charm Combination", label: "Bespoke Charm Combination" },
  { value: "Press & Stockists", label: "Press & Stockists" },
  { value: "Shipping & Returns", label: "Launch & Availability" },
];

export function ContactFormClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("Order & Styling Inquiry");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, topic, message }),
      });

      const data = (await res.json()) as {
        ok?: boolean;
        message?: string;
        error?: string;
      };

      if (!res.ok || !data.ok) {
        setFeedback({
          type: "error",
          text: data.error || "Please complete all fields before sending.",
        });
      } else {
        setFeedback({
          type: "success",
          text: data.message || "Thank you — our studio concierge has received your note.",
        });
        setName("");
        setEmail("");
        setMessage("");
      }
    } catch {
      setFeedback({
        type: "error",
        text: "Unable to send your note right now. Please try again shortly.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="tati-summary-card"
      style={{ display: "flex", flexDirection: "column", gap: 18 }}
    >
      <div className="tati-eyebrow">Write to our studio concierge</div>

      <div className="tati-field">
        <label htmlFor="contact-name">Your Name</label>
        <input
          id="contact-name"
          type="text"
          required
          className="tati-input"
          placeholder="Clara Bennett"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="tati-field">
        <label htmlFor="contact-email">Email Address</label>
        <input
          id="contact-email"
          type="email"
          required
          className="tati-input"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="tati-field">
        <label htmlFor="contact-topic">Topic</label>
        <CustomSelect
          id="contact-topic"
          label="Inquiry Topic"
          value={topic}
          options={CONTACT_TOPICS}
          onChange={setTopic}
        />
      </div>

      <div className="tati-field">
        <label htmlFor="contact-message">Message</label>
        <textarea
          id="contact-message"
          rows={5}
          required
          className="tati-textarea"
          placeholder="Tell us how we can assist with your Tati bag or order…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <button type="submit" className="tati-btn-primary" disabled={submitting}>
        {submitting ? "Sending Note…" : "Send Message ↗"}
      </button>

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
    </form>
  );
}
