import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QuantityStepper } from "../components/ui/QuantityStepper/QuantityStepper";

describe("QuantityStepper", () => {
  it("fires increment and decrement callbacks", async () => {
    const onIncrement = vi.fn();
    const onDecrement = vi.fn();
    render(
      <QuantityStepper
        value={2}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
        label="Wyze Cam v4"
      />,
    );

    await userEvent.click(screen.getByLabelText("Increase quantity"));
    await userEvent.click(screen.getByLabelText("Decrease quantity"));

    expect(onIncrement).toHaveBeenCalledOnce();
    expect(onDecrement).toHaveBeenCalledOnce();
  });

  it("disables decrement at the minimum", () => {
    render(
      <QuantityStepper value={0} onIncrement={() => {}} onDecrement={() => {}} />,
    );
    expect(screen.getByLabelText("Decrease quantity")).toBeDisabled();
    expect(screen.getByLabelText("Increase quantity")).toBeEnabled();
  });

  it("locks both buttons when disabled (required item)", () => {
    render(
      <QuantityStepper
        value={1}
        disabled
        onIncrement={() => {}}
        onDecrement={() => {}}
      />,
    );
    expect(screen.getByLabelText("Decrease quantity")).toBeDisabled();
    expect(screen.getByLabelText("Increase quantity")).toBeDisabled();
  });
});
