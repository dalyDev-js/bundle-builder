import { useBundleStore } from "../../../store/bundleStore";
import { productQty } from "../../../store/selectors";
import { lineKey } from "../../../lib/lines";
import type { Product, Step } from "../../../lib/types";
import { Badge } from "../../ui/Badge/Badge";
import { PriceTag } from "../../ui/PriceTag/PriceTag";
import { QuantityStepper } from "../../ui/QuantityStepper/QuantityStepper";
import { Button } from "../../ui/Button/Button";
import { ProductImage } from "../../ui/ProductImage/ProductImage";
import { VariantSelector } from "./VariantSelector";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: Product;
  step: Step;
}

export function ProductCard({ product, step }: ProductCardProps) {
  const hasVariants = !!product.variants?.length;
  const isSingleSelect = step.selectionMode === "single";

  const activeVariantId = useBundleStore((s) =>
    hasVariants
      ? (s.activeVariant[product.id] ??
        product.defaultVariantId ??
        product.variants![0].id)
      : undefined,
  );
  const activeKey = lineKey(product.id, activeVariantId);
  const activeVariant = product.variants?.find(
    (variant) => variant.id === activeVariantId,
  );
  const qty = useBundleStore((s) => s.lines[activeKey] ?? 0);
  const totalQty = useBundleStore((s) => productQty(product.id, s.lines));

  const setActiveVariant = useBundleStore((s) => s.setActiveVariant);
  const increment = useBundleStore((s) => s.increment);
  const decrement = useBundleStore((s) => s.decrement);
  const selectExclusive = useBundleStore((s) => s.selectExclusive);

  const selected = totalQty > 0;
  const isFree = product.price === 0;

  return (
    <article
      className={styles.card}
      data-selected={selected || undefined}
      data-featured={product.featured || undefined}
      data-category={product.category}
      data-product={product.id}>
      {product.featured && (
        <span className={styles.recommendation}>Recommended</span>
      )}
      <div className={styles.mediaCol}>
        {product.badge && (
          <div className={styles.badgeSlot}>
            <Badge>{product.badge}</Badge>
          </div>
        )}
        <ProductImage
          src={activeVariant?.image ?? product.image}
          alt={product.title}
          className={styles.media}
        />
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>
          {product.title}
          {product.requiredLabel && (
            <span className={styles.required}> {product.requiredLabel}</span>
          )}
        </h3>

        {product.description && (
          <p className={styles.desc}>
            {product.description}{" "}
            {product.learnMoreUrl && (
              <a className={styles.learn} href={product.learnMoreUrl}>
                Learn More
              </a>
            )}
          </p>
        )}

        {hasVariants && (
          <VariantSelector
            product={product}
            activeVariantId={activeVariantId!}
            onSelect={(id) => setActiveVariant(product.id, id)}
          />
        )}

        <div className={styles.footer}>
          {isSingleSelect ? (
            <Button
              variant={selected ? "primary" : "outline"}
              onClick={() => selectExclusive(product.id)}
              aria-pressed={selected}>
              {selected ? "Selected" : "Select"}
            </Button>
          ) : (
            <QuantityStepper
              value={qty}
              onIncrement={() => increment(product.id, activeVariantId)}
              onDecrement={() => decrement(product.id, activeVariantId)}
              disabled={product.required}
              label={product.title}
            />
          )}

          <PriceTag
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            unit={product.unit}
            free={isFree}
            freeLabel={product.freeLabel}
            tone="card"
            stacked
            desktopInline={product.category === "Cameras"}
          />
        </div>
      </div>
    </article>
  );
}
