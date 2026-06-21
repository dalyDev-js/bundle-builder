/** Review-panel grouping categories, in display order. */
export type Category = "Cameras" | "Sensors" | "Accessories" | "Plan";

export const CATEGORY_ORDER: Category[] = [
  "Cameras",
  "Sensors",
  "Accessories",
  "Plan",
];

export interface Variant {
  id: string;
  label: string;
  swatch?: string;
  thumbnail?: string;
  image?: string;
}

export interface Product {
  id: string;
  title: string;
  description?: string;
  learnMoreUrl?: string;
  badge?: string;
  featured?: boolean;
  image: string;
  thumbnail?: string;
  price: number;
  compareAtPrice?: number;
  category: Category;
  variants?: Variant[];
  defaultVariantId?: string;
  unit?: string;
  type?: "product" | "plan";
  icon?: string;
  required?: boolean;
  requiredLabel?: string;
  freeLabel?: string;
}

export interface Step {
  id: string;
  index: number;
  label: string;
  title: string;
  icon: string;
  category: Category;

  selectionMode?: "single" | "multi";
  nextStepId?: string;
  nextLabel?: string;
  productIds: string[];
}

export interface SeedLine {
  productId: string;
  variantId?: string;
  qty: number;
}

export interface CatalogConfig {
  shipping: {
    label: string;
    price: number;
    free: boolean;
    compareAtPrice?: number;
    icon: string;
  };
  guarantee: {
    percent: string;
    title: string;
    headline: string;
    body: string;
    image?: string;
  };
  financing: {
    monthlyFactor: number;
    label: string;
  };
  savingsMessage: string;
}

export interface Catalog {
  steps: Step[];
  products: Product[];
  config: CatalogConfig;
  seed: SeedLine[];
}

export type Lines = Record<string, number>;
export type ActiveVariants = Record<string, string>;
