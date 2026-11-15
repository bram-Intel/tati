import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { BRAND } from "@/config/brand";
import { StoreProvider } from "@/components/layout/StoreContext";
import { SmoothScrollProvider } from "@/components/cinematic/SmoothScrollProvider";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { QuickAddModal } from "@/components/layout/QuickAddModal";
import { SiteFooter } from "@/components/layout/SiteFooter";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.url),
  title: {
    default: "Tati · Carry a little personality | bytatistudio.com",
    template: "%s · Tati (bytatistudio.com)",
  },
  description:
    "Everyday bags, made to make a statement. Discover distinctive Tati handbags, complimentary signature bag charms, and personal colour stories at bytatistudio.com.",
  openGraph: {
    title: "Tati · Carry a little personality.",
    description:
      "Everyday bags, made to make a statement. Colourful. Confident. Expressive.",
    url: BRAND.url,
    siteName: "Tati Studio",
    type: "website",
    images: [{ url: "/images/bag-everyday.jpg", width: 896, height: 1200 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jakarta.variable}`}>
      <body>
        <StoreProvider>
          <SmoothScrollProvider>
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter />
            <CartDrawer />
            <QuickAddModal />
          </SmoothScrollProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
