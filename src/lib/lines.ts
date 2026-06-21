export function lineKey(productId: string, variantId?: string | null): string {
  return variantId ? `${productId}:${variantId}` : productId;
}

export function parseLineKey(key: string): {
  productId: string;
  variantId?: string;
} {
  const idx = key.indexOf(":");
  if (idx === -1) return { productId: key };
  return { productId: key.slice(0, idx), variantId: key.slice(idx + 1) };
}
