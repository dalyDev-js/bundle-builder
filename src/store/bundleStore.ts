import { create } from "zustand";
import type { ActiveVariants, Catalog, Lines, SeedLine } from "../lib/types";
import { lineKey, parseLineKey } from "../lib/lines";
import {
  clearSaved,
  loadSaved,
  saveForLater as persistBundle,
} from "./persistence";

type Status = "loading" | "ready" | "error";

const MAX_QTY = 99;

interface BundleState {
  catalog: Catalog | null;
  status: Status;
  lines: Lines;
  activeVariant: ActiveVariants;
  openStepId: string | null;

  initialize: (catalog: Catalog) => void;
  setStatus: (status: Status) => void;
  setActiveVariant: (productId: string, variantId: string) => void;
  setQty: (
    productId: string,
    variantId: string | undefined,
    qty: number,
  ) => void;
  increment: (productId: string, variantId?: string) => void;
  decrement: (productId: string, variantId?: string) => void;
  selectExclusive: (productId: string) => void;
  openStep: (stepId: string) => void;
  saveForLater: () => boolean;
  resetToSeed: () => void;
}

function seedToLines(seed: SeedLine[]): Lines {
  const lines: Lines = {};
  for (const s of seed) lines[lineKey(s.productId, s.variantId)] = s.qty;
  return lines;
}

function defaultActiveVariants(
  catalog: Catalog,
  seed: SeedLine[],
): ActiveVariants {
  const active: ActiveVariants = {};
  for (const p of catalog.products) {
    if (p.variants?.length)
      active[p.id] = p.defaultVariantId ?? p.variants[0].id;
  }
  for (const s of seed) {
    if (s.variantId) active[s.productId] = s.variantId;
  }
  return active;
}

/** Drop saved lines that reference products no longer in the catalog. */
function sanitizeLines(lines: Lines, catalog: Catalog): Lines {
  const valid = new Set(catalog.products.map((p) => p.id));
  const out: Lines = {};
  for (const [key, qty] of Object.entries(lines)) {
    const { productId } = parseLineKey(key);
    if (valid.has(productId) && qty > 0) out[key] = Math.min(qty, MAX_QTY);
  }
  return out;
}

export const useBundleStore = create<BundleState>((set, get) => ({
  catalog: null,
  status: "loading",
  lines: {},
  activeVariant: {},
  openStepId: null,

  initialize: (catalog) => {
    const saved = loadSaved();
    const lines = saved
      ? sanitizeLines(saved.lines, catalog)
      : seedToLines(catalog.seed);
    const activeVariant = {
      ...defaultActiveVariants(catalog, catalog.seed),
      ...(saved?.activeVariant ?? {}),
    };
    set({
      catalog,
      lines,
      activeVariant,
      openStepId: catalog.steps[0]?.id ?? null,
      status: "ready",
    });
  },

  setStatus: (status) => set({ status }),

  setActiveVariant: (productId, variantId) =>
    set((state) => ({
      activeVariant: { ...state.activeVariant, [productId]: variantId },
    })),

  setQty: (productId, variantId, qty) => {
    const product = get().catalog?.products.find((p) => p.id === productId);
    if (product?.required) return; // required items have a locked quantity
    const key = lineKey(productId, variantId);
    const next = Math.max(0, Math.min(qty, MAX_QTY));
    set((state) => {
      const lines = { ...state.lines };
      if (next <= 0) delete lines[key];
      else lines[key] = next;
      return { lines };
    });
  },

  increment: (productId, variantId) => {
    const key = lineKey(productId, variantId);
    get().setQty(productId, variantId, (get().lines[key] ?? 0) + 1);
  },

  decrement: (productId, variantId) => {
    const key = lineKey(productId, variantId);
    get().setQty(productId, variantId, (get().lines[key] ?? 0) - 1);
  },

  selectExclusive: (productId) => {
    const catalog = get().catalog;
    if (!catalog) return;
    const step = catalog.steps.find((s) => s.productIds.includes(productId));
    if (!step) return;
    set((state) => {
      const lines = { ...state.lines };
      for (const siblingId of step.productIds) delete lines[siblingId];
      lines[productId] = 1;
      return { lines };
    });
  },

  openStep: (stepId) =>
    set((state) => ({
      openStepId: state.openStepId === stepId ? null : stepId,
    })),

  saveForLater: () => {
    const { lines, activeVariant } = get();
    return persistBundle({ lines, activeVariant });
  },

  resetToSeed: () => {
    const catalog = get().catalog;
    if (!catalog) return;
    clearSaved();
    set({
      lines: seedToLines(catalog.seed),
      activeVariant: defaultActiveVariants(catalog, catalog.seed),
    });
  },
}));
