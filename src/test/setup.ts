import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Make the bare `localStorage` global resolve to jsdom's implementation so app
// code behaves the same in tests as in the browser (Node 24's experimental web
// storage can otherwise shadow it and throw).
try {
  if (typeof window !== "undefined" && window.localStorage) {
    Object.defineProperty(globalThis, "localStorage", {
      value: window.localStorage,
      configurable: true,
      writable: true,
    });
  }
} catch {
  /* ignore */
}

afterEach(() => {
  cleanup();
});
