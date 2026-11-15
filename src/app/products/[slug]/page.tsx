import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BAGS, getBagBySlug } from "@/config/catalog";
import { ProductDetailClient } from "@/components/sections/ProductDetailClient";
import { NewsletterSection } from "@/components/sections/NewsletterSection";

export function generateStaticParams() {
  return BAGS.map((bag) => ({ slug: bag.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const bag = getBagBySlug(slug);
  if (!bag) {
    return { title: "Piece Not Found" };
  }
  return {
    title: `${bag.name}`,
    description: `${bag.tagline} — ${bag.description}`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const bag = getBagBySlug(slug);

  if (!bag) {
    notFound();
  }

  return (
    <>
      <ProductDetailClient bag={bag} />
      <NewsletterSection />
    </>
  );
}
