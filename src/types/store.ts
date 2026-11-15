import type { CurrencyCode } from "@/config/catalog";

export interface CartBagItem {
  kind: "bag";
  lineId: string;
  bagId: string;
  bagSlug: string;
  bagName: string;
  image: string;
  colorwayId: string;
  colorwayName: string;
  colorwayHex: string;
  complimentaryCharmId: string;
  complimentaryCharmName: string;
  extraCharmIds: string[];
  unitPriceGbp: number;
  extraCharmsPriceGbp: number;
  quantity: number;
}

export interface CartCharmItem {
  kind: "charm";
  lineId: string;
  charmId: string;
  charmName: string;
  image: string;
  finish: string;
  unitPriceGbp: number;
  quantity: number;
}

export type CartItem = CartBagItem | CartCharmItem;

export interface OrderShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postcode: string;
  country: string;
  giftNote?: string;
}

export interface CreateOrderRequest {
  items: CartItem[];
  shipping: OrderShippingDetails;
  shippingMethod: "standard" | "express";
  currency: CurrencyCode;
}

export interface OrderRecord {
  orderNumber: string;
  createdAt: string;
  status: "confirmed";
  currency: CurrencyCode;
  subtotalGbp: number;
  shippingGbp: number;
  totalGbp: number;
  shipping: OrderShippingDetails;
  shippingMethod: "standard" | "express";
  items: CartItem[];
}
