import React from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { CollectionSection } from "@/components/sections/CollectionSection";
import { CharmsSection } from "@/components/sections/CharmsSection";
import { StorySection } from "@/components/sections/StorySection";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CollectionSection />
      <CharmsSection />
      <StorySection />
      <NewsletterSection />
    </>
  );
}
