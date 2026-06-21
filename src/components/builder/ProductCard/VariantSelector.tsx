import type { Product } from "../../../lib/types";
import styles from "./VariantSelector.module.css";

interface VariantSelectorProps {
  product: Product;
  activeVariantId: string;
  onSelect: (variantId: string) => void;
}

export function VariantSelector({
  product,
  activeVariantId,
  onSelect,
}: VariantSelectorProps) {
  return (
    <div
      className={styles.variants}
      role="radiogroup"
      aria-label={`${product.title} color`}
    >
      {product.variants?.map((variant) => {
        const active = variant.id === activeVariantId;
        const thumbnail = variant.thumbnail ?? variant.image;
        return (
          <button
            key={variant.id}
            type="button"
            role="radio"
            aria-checked={active}
            className={styles.chip}
            data-active={active || undefined}
            onClick={() => onSelect(variant.id)}
          >
            {thumbnail ? (
              <img
                className={styles.thumb}
                src={thumbnail}
                alt=""
                aria-hidden="true"
              />
            ) : variant.swatch ? (
              <span
                className={styles.swatch}
                style={{ background: variant.swatch }}
                aria-hidden="true"
              />
            ) : null}
            <span>{variant.label}</span>
          </button>
        );
      })}
    </div>
  );
}
