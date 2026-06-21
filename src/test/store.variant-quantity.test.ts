import { beforeEach, describe, expect, it } from "vitest";
import { useBundleStore } from "../store/bundleStore";
import {
  productQty,
  reviewGroups,
  stepSelectedCount,
} from "../store/selectors";
import { bundledCatalog } from "../data/catalogClient";
import { lineKey } from "../lib/lines";

const catalog = bundledCatalog;
const state = () => useBundleStore.getState();

beforeEach(() => {
  // Use jsdom's storage explicitly (Node 24's experimental global localStorage
  // can shadow it in the test runner).
  try {
    window.localStorage.clear();
  } catch {
    /* ignore */
  }
  useBundleStore.getState().initialize(catalog);
});

describe("variant quantities", () => {
  it("tracks each variant independently; the active variant drives the stepper", () => {
    // Seeded: Wyze Cam v4 White = 1.
    expect(state().lines[lineKey("wyze-cam-v4", "white")]).toBe(1);

    // Add 2 of Black; White must be untouched.
    state().setActiveVariant("wyze-cam-v4", "black");
    state().setQty("wyze-cam-v4", "black", 2);

    expect(state().lines[lineKey("wyze-cam-v4", "black")]).toBe(2);
    expect(state().lines[lineKey("wyze-cam-v4", "white")]).toBe(1);
    expect(productQty("wyze-cam-v4", state().lines)).toBe(3);
  });

  it("shows every variant with qty > 0 as its own review line", () => {
    state().setQty("wyze-cam-v4", "black", 2);
    const groups = reviewGroups(catalog, state().lines);
    const cameras = groups.find((g) => g.category === "Cameras");
    const v4Lines = cameras?.items.filter((i) => i.product.id === "wyze-cam-v4");
    expect(v4Lines).toHaveLength(2); // White x1 + Black x2
  });

  it("counts distinct products per step, not variants or quantities", () => {
    const cameras = catalog.steps.find((s) => s.id === "cameras")!;
    // Seed: v4 + pan v3 selected => 2 distinct.
    expect(stepSelectedCount(cameras, state().lines)).toBe(2);
    // Adding another v4 variant must not bump the count.
    state().setQty("wyze-cam-v4", "black", 2);
    expect(stepSelectedCount(cameras, state().lines)).toBe(2);
  });

  it("locks the quantity of required items", () => {
    state().setQty("wyze-sense-hub", undefined, 5);
    expect(state().lines["wyze-sense-hub"]).toBe(1);
  });

  it("single-select replaces the chosen plan", () => {
    expect(state().lines["cam-unlimited"]).toBe(1);
    state().selectExclusive("cam-plus");
    expect(state().lines["cam-plus"]).toBe(1);
    expect(state().lines["cam-unlimited"]).toBeUndefined();
  });

  it("decrement never goes below zero and clears the line", () => {
    state().setQty("wyze-cam-v4", "white", 1);
    state().decrement("wyze-cam-v4", "white");
    state().decrement("wyze-cam-v4", "white");
    expect(state().lines[lineKey("wyze-cam-v4", "white")]).toBeUndefined();
  });
});
