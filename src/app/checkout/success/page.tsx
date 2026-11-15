import React, { Suspense } from "react";
import type { Metadata } from "next";
import { OrderSuccessClient } from "@/components/sections/OrderSuccessClient";

export const metadata: Metadata = {
  title: "Order Confirmed",
};

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="tati-section tati-container" style={{ textAlign: "center" }}>
          Loading order confirmation…
        </div>
      }
    >
      <OrderSuccessClient />
    </Suspense>
  );
}
