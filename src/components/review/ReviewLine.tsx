import { useBundleStore } from "../../store/bundleStore";
import type { ReviewItem } from "../../store/selectors";
import type { Product } from "../../lib/types";
import { QuantityStepper } from "../ui/QuantityStepper/QuantityStepper";
import { PriceTag } from "../ui/PriceTag/PriceTag";
import { ProductImage } from "../ui/ProductImage/ProductImage";
import { Icon } from "../ui/Icon/Icon";
import { iconByName, shield } from "../ui/Icon/icons";
import styles from "./ReviewLine.module.css";

interface ReviewLineProps {
  item: ReviewItem;
}

export function ReviewLine({ item }: ReviewLineProps) {
  const { product, variant, qty } = item;
  const increment = useBundleStore((s) => s.increment);
  const decrement = useBundleStore((s) => s.decrement);
  const isFree = product.price === 0;

  return (
    <div className={styles.line}>
      <ProductImage
        src={
          variant?.thumbnail ??
          variant?.image ??
          product.thumbnail ??
          product.image
        }
        alt={variant ? `${product.title}, ${variant.label}` : product.title}
        className={styles.thumb}
      />
      <div className={styles.info}>
        <span className={styles.name}>
          {product.title}
          {product.requiredLabel && (
            <span className={styles.req}> {product.requiredLabel}</span>
          )}
        </span>
        {variant && <span className={styles.variant}>{variant.label}</span>}
      </div>

      <QuantityStepper
        size="sm"
        value={qty}
        disabled={product.required}
        onIncrement={() => increment(product.id, variant?.id)}
        onDecrement={() => decrement(product.id, variant?.id)}
        label={product.title}
      />

      <PriceTag
        price={product.price * qty}
        compareAtPrice={
          product.compareAtPrice != null
            ? product.compareAtPrice * qty
            : undefined
        }
        free={isFree}
        freeLabel={product.freeLabel}
        tone="review"
      />
    </div>
  );
}

export function PlanLine({ product }: { product: Product }) {
  const [first, ...rest] = product.title.split(" ");
  const planIcon = (product.icon && iconByName[product.icon]) || shield;
  return (
    <div className={styles.planLine}>
      <span className={styles.planName}>
        <Icon icon={planIcon} size={31} className={styles.planLogo} />
        <span className={styles.planTitle}>
          {first}{" "}
          {rest.length > 0 && (
            <span className={styles.planAccent}>{rest.join(" ")}</span>
          )}
        </span>
      </span>
      <PriceTag
        price={product.price}
        compareAtPrice={product.compareAtPrice}
        unit={product.unit}
        tone="review"
      />
    </div>
  );
}
