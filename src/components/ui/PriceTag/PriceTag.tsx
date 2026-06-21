import { currency } from "../../../lib/format";
import styles from "./PriceTag.module.css";

interface PriceTagProps {
  price: number;
  compareAtPrice?: number;
  unit?: string;
  free?: boolean;
  freeLabel?: string;
  tone?: "card" | "review";
  stacked?: boolean;
  desktopInline?: boolean;
}

export function PriceTag({
  price,
  compareAtPrice,
  unit = "",
  free = false,
  freeLabel = "FREE",
  tone = "card",
  stacked = false,
  desktopInline = false,
}: PriceTagProps) {
  return (
    <span
      className={`${styles.tag} ${stacked ? styles.stacked : ""} ${desktopInline ? styles.desktopInline : ""}`}
      data-tone={tone}>
      {compareAtPrice != null && (
        <s
          className={styles.compare}
          aria-label={`Was ${currency(compareAtPrice)}${unit}`}>
          {currency(compareAtPrice)}
          {unit}
        </s>
      )}
      <span className={styles.active}>
        {free ? freeLabel : `${currency(price)}${unit}`}
      </span>
    </span>
  );
}
