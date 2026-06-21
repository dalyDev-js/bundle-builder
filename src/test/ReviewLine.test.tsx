import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReviewLine } from "../components/review/ReviewLine";
import { bundledCatalog } from "../data/catalogClient";
import { lineKey } from "../lib/lines";
import { useBundleStore } from "../store/bundleStore";

describe("ReviewLine variants", () => {
  beforeEach(() => {
    try {
      window.localStorage.clear();
    } catch {
      // Node's experimental localStorage may shadow jsdom in the test runner.
    }
    useBundleStore.getState().initialize(bundledCatalog);
  });

  it("always identifies the selected variant and uses its thumbnail", () => {
    const product = bundledCatalog.products.find(
      (candidate) => candidate.id === "wyze-cam-v4",
    )!;
    const variant = product.variants!.find(
      (candidate) => candidate.id === "white",
    )!;

    render(
      <ReviewLine
        item={{
          key: lineKey(product.id, variant.id),
          product,
          variant,
          qty: 1,
        }}
      />,
    );

    expect(screen.getByText("White")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Wyze Cam v4, White" }),
    ).toHaveAttribute("src", variant.thumbnail);
  });
});
