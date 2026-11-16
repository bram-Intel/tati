import React from "react";
import type { Metadata } from "next";
import { StorySection } from "@/components/sections/StorySection";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Style should feel like you. Tati is a celebration of personal style, colour and the little details that make an outfit yours.",
};

export default function StoryPage() {
  return (
    <>
      <StorySection mode="page" />
      <NewsletterSection />
    </>
  );
}
