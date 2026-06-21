import type { Catalog } from "../lib/types";
import catalogJson from "./catalog.json";

// JSON import widens unions (e.g. category -> string), so cast to our types.
const bundledCatalog = catalogJson as unknown as Catalog;

export async function loadCatalog(): Promise<Catalog> {
  try {
    const res = await fetch("/api/catalog");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as Catalog;
  } catch {
    return bundledCatalog;
  }
}

export { bundledCatalog };
