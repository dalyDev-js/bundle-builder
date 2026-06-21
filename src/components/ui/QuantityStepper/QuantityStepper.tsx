import { Icon } from "../Icon/Icon";
import { minus, plus } from "../Icon/icons";
import styles from "./QuantityStepper.module.css";

interface QuantityStepperProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  disabled?: boolean;
  min?: number;
  size?: "sm" | "md";
  label?: string;
}

export function QuantityStepper({
  value,
  onIncrement,
  onDecrement,
  disabled = false,
  min = 0,
  size = "md",
  label,
}: QuantityStepperProps) {
  const decreaseDisabled = disabled || value <= min;

  return (
    <div
      className={`${styles.stepper} ${size === "sm" ? styles.sm : ""}`}
      role="group"
      aria-label={label ? `Quantity for ${label}` : "Quantity"}>
      <button
        type="button"
        className={styles.btn}
        onClick={onDecrement}
        disabled={decreaseDisabled}
        aria-label="Decrease quantity">
        <Icon icon={minus} />
      </button>
      <span className={styles.value} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={styles.btn}
        onClick={onIncrement}
        disabled={disabled}
        aria-label="Increase quantity">
        <Icon icon={plus} />
      </button>
    </div>
  );
}
