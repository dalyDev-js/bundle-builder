import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { bundledCatalog } from "../data/catalogClient";
import { lineKey } from "../lib/lines";
import { useBundleStore } from "../store/bundleStore";

function memoryStorage(): Storage {
  const values = new Map<string, string>();

  return {
    get length() {
      return values.size;
    },
    clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null,
    key: (index) => [...values.keys()][index] ?? null,
    removeItem: (key) => values.delete(key),
    setItem: (key, value) => values.set(key, value),
  };
}

describe("saved bundle persistence", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", memoryStorage());
    useBundleStore.getState().initialize(bundledCatalog);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("restores quantities and the active variant after reinitialization", () => {
    const store = useBundleStore.getState();
    store.setActiveVariant("wyze-cam-v4", "black");
    store.setQty("wyze-cam-v4", "black", 2);

    expect(store.saveForLater()).toBe(true);

    store.setQty("wyze-cam-v4", "black", 0);
    useBundleStore.getState().initialize(bundledCatalog);

    expect(
      useBundleStore.getState().lines[lineKey("wyze-cam-v4", "black")],
    ).toBe(2);
    expect(useBundleStore.getState().activeVariant["wyze-cam-v4"]).toBe(
      "black",
    );
  });

  it("reports a storage write failure", () => {
    vi.stubGlobal("localStorage", {
      ...memoryStorage(),
      setItem: () => {
        throw new Error("Storage unavailable");
      },
    });

    expect(useBundleStore.getState().saveForLater()).toBe(false);
  });
});
