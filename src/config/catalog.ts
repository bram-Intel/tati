export type CurrencyCode = "GBP" | "USD" | "EUR";

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rateFromGbp: number;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  GBP: { code: "GBP", symbol: "£", rateFromGbp: 1 },
  USD: { code: "USD", symbol: "$", rateFromGbp: 1.28 },
  EUR: { code: "EUR", symbol: "€", rateFromGbp: 1.18 },
};

export function formatPrice(priceGbp: number, currency: CurrencyCode = "GBP"): string {
  const cfg = CURRENCIES[currency];
  const converted = Math.round(priceGbp * cfg.rateFromGbp);
  return `${cfg.symbol}${converted}`;
}

export type BagSilhouette = "everyday" | "statement" | "classic" | "blossom";

export interface ColorwayOption {
  id: string;
  name: string;
  hex: string;
  accentHex: string;
}

export interface CharmProduct {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  symbol: "butterfly" | "heart" | "starburst" | "blossom" | "monogram";
  glyph: string;
  priceGbp: number;
  finish: string;
  colorHex: string;
  enamelHex: string;
  description: string;
  image: string;
}

export interface BagProduct {
  id: string;
  slug: string;
  name: string;
  editionNumber: string;
  tagline: string;
  description: string;
  priceGbp: number;
  silhouette: BagSilhouette;
  badge: string;
  featured: boolean;
  image: string;
  fallbackGradient: string;
  dimensions: string;
  materials: string;
  strapDrop: string;
  defaultColorwayId: string;
  colorways: ColorwayOption[];
  defaultCharmId: string;
}

export const CHARMS: CharmProduct[] = [
  {
    id: "charm-butterfly",
    slug: "papillon-butterfly-charm",
    name: "Papillon Butterfly Charm",
    shortName: "Butterfly",
    symbol: "butterfly",
    glyph: "🦋",
    priceGbp: 28,
    finish: "Champagne gold & mother-of-pearl inlay",
    colorHex: "#D9A078",
    enamelHex: "#FFF1DD",
    description:
      "Tati’s signature silhouette sculpted in soft champagne-gold plating with luminous creamy-ivory inlay and an articulated clasp.",
    image: "/images/charms-studio.jpg",
  },
  {
    id: "charm-heart",
    slug: "coeur-enamel-heart-charm",
    name: "Coeur Enamel Heart Charm",
    shortName: "Heart ♡",
    symbol: "heart",
    glyph: "♡",
    priceGbp: 24,
    finish: "Raspberry pink gloss enamel & champagne gold",
    colorHex: "#D9A078",
    enamelHex: "#DB2850",
    description:
      "Hand-poured raspberry-pink cloisonné enamel framed in polished champagne gold—playful, bold, and instantly uplifting.",
    image: "/images/charms-studio.jpg",
  },
  {
    id: "charm-starburst",
    slug: "soleil-starburst-charm",
    name: "Soleil Starburst Medallion",
    shortName: "Starburst ✦",
    symbol: "starburst",
    glyph: "✦",
    priceGbp: 26,
    finish: "Brushed champagne gold brass",
    colorHex: "#D9A078",
    enamelHex: "#F5D7B7",
    description:
      "A faceted eight-point celestial star that catches golden-hour light from every angle.",
    image: "/images/charms-studio.jpg",
  },
  {
    id: "charm-blossom",
    slug: "fleur-coral-blossom-charm",
    name: "Fleur Coral Blossom Charm",
    shortName: "Blossom ✿",
    symbol: "blossom",
    glyph: "✿",
    priceGbp: 26,
    finish: "Warm coral enamel & champagne gold",
    colorHex: "#D9A078",
    enamelHex: "#F57971",
    description:
      "Five sculpted petals glazed in warm coral-tangerine with a tactile champagne-gold centre bead.",
    image: "/images/charms-studio.jpg",
  },
  {
    id: "charm-monogram",
    slug: "tati-script-monogram-charm",
    name: "Tati Script Medallion",
    shortName: "Tati T",
    symbol: "monogram",
    glyph: "T",
    priceGbp: 24,
    finish: "Creamy ivory enamel & italic gold relief",
    colorHex: "#D9A078",
    enamelHex: "#FFF1DD",
    description:
      "Our signature italic ‘T’ embossed over warm creamy-ivory enamel, finished with a hinged swivel ring.",
    image: "/images/charms-studio.jpg",
  },
];

export const BAGS: BagProduct[] = [
  {
    id: "bag-everyday",
    slug: "the-everyday",
    name: "The Everyday",
    editionNumber: "001",
    tagline: "A little bag, a lot of character.",
    description:
      "Structured enough to hold its poise from morning espresso to late evening drinks, yet compact and playful enough to lift every look. Crafted in tactile grained leather with our signature champagne-gold arched handle and detachable crossbody strap.",
    priceGbp: 185,
    silhouette: "everyday",
    badge: "Signature Silhouette",
    featured: true,
    image: "/images/bag-everyday.jpg",
    fallbackGradient: "linear-gradient(130deg, #DB2850, #F57971)",
    dimensions: "23cm W × 17cm H × 9.5cm D",
    materials: "Full-grain pebbled Italian leather, micro-suede ivory lining, champagne-gold brass hardware",
    strapDrop: "9cm arched top handle · 52cm adjustable crossbody strap",
    defaultColorwayId: "raspberry",
    defaultCharmId: "charm-butterfly",
    colorways: [
      { id: "raspberry", name: "Raspberry Pink", hex: "#DB2850", accentHex: "#D9A078" },
      { id: "coral", name: "Warm Coral", hex: "#F57971", accentHex: "#D9A078" },
      { id: "ivory", name: "Creamy Ivory", hex: "#FFF1DD", accentHex: "#D9A078" },
    ],
  },
  {
    id: "bag-statement",
    slug: "the-statement",
    name: "The Statement",
    editionNumber: "002",
    tagline: "For days that deserve colour.",
    description:
      "A sculptural crescent profile designed to curve comfortably beneath the arm or drape cleanly on its champagne-gold chain. Finished in saturated tangerine-coral leather with a precision turn-clasp and dedicated charm D-ring.",
    priceGbp: 210,
    silhouette: "statement",
    badge: "Atelier Favourite",
    featured: true,
    image: "/images/bag-statement.jpg",
    fallbackGradient: "linear-gradient(130deg, #F27F49, #F57971)",
    dimensions: "26cm W × 18cm H × 8cm D",
    materials: "Smooth aniline calfskin, warm cotton-twill interior, custom champagne-gold curb chain",
    strapDrop: "26cm shoulder chain · 54cm leather strap included",
    defaultColorwayId: "tangerine",
    defaultCharmId: "charm-starburst",
    colorways: [
      { id: "tangerine", name: "Tangerine Orange", hex: "#F27F49", accentHex: "#D9A078" },
      { id: "raspberry", name: "Raspberry Pink", hex: "#DB2850", accentHex: "#D9A078" },
      { id: "coral", name: "Warm Coral", hex: "#F57971", accentHex: "#D9A078" },
    ],
  },
  {
    id: "bag-classic",
    slug: "the-classic",
    name: "The Classic",
    editionNumber: "003",
    tagline: "An effortless everyday favourite.",
    description:
      "Luminous creamy ivory meets crisp architectural tailoring. Designed as an understated canvas that lets your complimentary charm—or a layered trio of charms—take centre stage from desk to dinner.",
    priceGbp: 195,
    silhouette: "classic",
    badge: "Interactive 3D Edition",
    featured: true,
    image: "/images/bag-classic.png",
    fallbackGradient: "linear-gradient(130deg, #E9CDB0, #FFF1DD)",
    dimensions: "25cm W × 19cm H × 10cm D",
    materials: "Supple creamy-ivory pebbled leather, double-stitched gussets, champagne-gold lock",
    strapDrop: "11cm twin rolled handles · 50cm detachable shoulder strap",
    defaultColorwayId: "ivory",
    defaultCharmId: "charm-heart",
    colorways: [
      { id: "ivory", name: "Creamy Ivory", hex: "#FFF1DD", accentHex: "#D9A078" },
      { id: "champagne", name: "Champagne Sand", hex: "#D9A078", accentHex: "#432C2A" },
      { id: "raspberry", name: "Raspberry Pink", hex: "#DB2850", accentHex: "#D9A078" },
    ],
  },
  {
    id: "bag-blossom",
    slug: "the-blossom",
    name: "The Blossom Crossbody",
    editionNumber: "004",
    tagline: "Soft coral poise, tailored to move with you.",
    description:
      "A featherlight day-to-night companion with rounded corners, concealed magnetic closure, and generous charm rings built for playful personal combinations.",
    priceGbp: 165,
    silhouette: "blossom",
    badge: "Limited Drop",
    featured: false,
    image: "/images/bag-blossom.png",
    fallbackGradient: "linear-gradient(130deg, #F57971, #F27F49)",
    dimensions: "20cm W × 14.5cm H × 7.5cm D",
    materials: "Soft-touch coral calfskin, warm ivory leather trim, champagne-gold clasp",
    strapDrop: "54cm braided chain & leather strap",
    defaultColorwayId: "coral",
    defaultCharmId: "charm-blossom",
    colorways: [
      { id: "coral", name: "Warm Coral", hex: "#F57971", accentHex: "#D9A078" },
      { id: "tangerine", name: "Tangerine Orange", hex: "#F27F49", accentHex: "#D9A078" },
      { id: "ivory", name: "Creamy Ivory", hex: "#FFF1DD", accentHex: "#D9A078" },
    ],
  },
];

export function getBagBySlug(slug: string): BagProduct | undefined {
  return BAGS.find((bag) => bag.slug === slug);
}

export function getCharmById(id: string): CharmProduct | undefined {
  return CHARMS.find((charm) => charm.id === id);
}
