import { describe, expect, it } from "vitest";
import { computeTotals } from "../lib/pricing";
import { bundledCatalog } from "../data/catalogClient";
import { lineKey } from "../lib/lines";
import type { Lines } from "../lib/types";

const catalog = bundledCatalog;

function seedLines(): Lines {
  const lines: Lines = {};
  for (const s of catalog.seed) lines[lineKey(s.productId, s.variantId)] = s.qty;
  return lines;
}

describe("computeTotals", () => {
  it("reconciles the seeded system to the design figures", () => {
    const t = computeTotals(seedLines(), catalog);
    expect(t.total).toBe(187.89);
    expect(t.preDiscount).toBe(238.81);
    expect(t.savings).toBe(50.92);
    expect(t.monthly).toBeCloseTo(19.19, 2);
  });

  it("recalculates the total when a quantity changes", () => {
    const lines = seedLines();
    lines[lineKey("wyze-cam-pan-v3", "white")] = 4; // +2 units @ 23.99
    const t = computeTotals(lines, catalog);
    expect(t.total).toBeCloseTo(187.89 + 2 * 23.99, 2); // 235.87
  });

  it("treats compare-at as the price when there is no discount", () => {
    const t = computeTotals({ "wyze-sense-motion": 2 }, catalog);
    expect(t.total).toBe(59.98);
    expect(t.savings).toBe(0);
  });

  it("counts a free required item as $0 but keeps its compare-at in savings", () => {
    const t = computeTotals({ "wyze-sense-hub": 1 }, catalog);
    expect(t.total).toBe(0);
    expect(t.preDiscount).toBe(29.92);
    expect(t.savings).toBe(29.92);
  });
});
