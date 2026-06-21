import { CATEGORY_ORDER } from "../lib/types";
import type {
  Catalog,
  Category,
  Lines,
  Product,
  Step,
  Variant,
} from "../lib/types";
import { parseLineKey } from "../lib/lines";

export interface ReviewItem {
  key: string;
  product: Product;
  variant?: Variant;
  qty: number;
}

export interface ReviewGroup {
  category: Category;
  items: ReviewItem[];
}

export function productById(catalog: Catalog): Map<string, Product> {
  return new Map(catalog.products.map((p) => [p.id, p]));
}

export function productQty(productId: string, lines: Lines): number {
  let total = 0;
  for (const [key, qty] of Object.entries(lines)) {
    if (parseLineKey(key).productId === productId) total += qty;
  }
  return total;
}

export function stepSelectedCount(step: Step, lines: Lines): number {
  let count = 0;
  for (const productId of step.productIds) {
    if (productQty(productId, lines) > 0) count++;
  }
  return count;
}

export function reviewGroups(catalog: Catalog, lines: Lines): ReviewGroup[] {
  const byId = productById(catalog);
  const order = new Map(catalog.products.map((p, i) => [p.id, i]));

  const items: ReviewItem[] = [];
  for (const [key, qty] of Object.entries(lines)) {
    if (qty <= 0) continue;
    const { productId, variantId } = parseLineKey(key);
    const product = byId.get(productId);
    if (!product) continue;
    const variant = variantId
      ? product.variants?.find((v) => v.id === variantId)
      : undefined;
    items.push({ key, product, variant, qty });
  }

  items.sort((a, b) => {
    const pa = order.get(a.product.id) ?? 0;
    const pb = order.get(b.product.id) ?? 0;
    if (pa !== pb) return pa - pb;
    return variantIndex(a) - variantIndex(b);
  });

  return CATEGORY_ORDER.map((category) => ({
    category,
    items: items.filter((item) => item.product.category === category),
  })).filter((group) => group.items.length > 0);
}

function variantIndex(item: ReviewItem): number {
  if (!item.variant || !item.product.variants) return 0;
  return item.product.variants.findIndex((v) => v.id === item.variant!.id);
}
