import type { Catalog, Lines } from "./types";
import { parseLineKey } from "./lines";

export interface Totals {
  preDiscount: number;
  total: number;
  savings: number;
  monthly: number;
}

/** Money math in integer cents to avoid floating-point drift. */
const toCents = (n: number) => Math.round(n * 100);

export function computeTotals(lines: Lines, catalog: Catalog): Totals {
  const byId = new Map(catalog.products.map((p) => [p.id, p]));
  let totalCents = 0;
  let preCents = 0;

  for (const [key, qty] of Object.entries(lines)) {
    if (qty <= 0) continue;
    const { productId } = parseLineKey(key);
    const product = byId.get(productId);
    if (!product) continue;
    const compare = product.compareAtPrice ?? product.price;
    totalCents += toCents(product.price) * qty;
    preCents += toCents(compare) * qty;
  }

  return {
    total: totalCents / 100,
    preDiscount: preCents / 100,
    savings: (preCents - totalCents) / 100,
    monthly: (totalCents / 100) * catalog.config.financing.monthlyFactor,
  };
}
