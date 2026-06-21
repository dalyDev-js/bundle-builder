import { useId } from "react";
import { useBundleStore } from "../../../store/bundleStore";
import { stepSelectedCount } from "../../../store/selectors";
import type { Product, Step } from "../../../lib/types";
import { Icon } from "../../ui/Icon/Icon";
import { iconByName, caretUp, caretDown } from "../../ui/Icon/icons";
import { Button } from "../../ui/Button/Button";
import { ProductCard } from "../ProductCard/ProductCard";
import styles from "./AccordionStep.module.css";

interface AccordionStepProps {
  step: Step;
  products: Map<string, Product>;
}

export function AccordionStep({ step, products }: AccordionStepProps) {
  const open = useBundleStore((s) => s.openStepId === step.id);
  const count = useBundleStore((s) => stepSelectedCount(step, s.lines));
  const openStep = useBundleStore((s) => s.openStep);

  const headerId = useId();
  const panelId = useId();

  return (
    <section className={styles.step} data-open={open || undefined}>
      <p className={styles.stepLabel}>{step.label}</p>

      <button
        type="button"
        id={headerId}
        className={styles.header}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => openStep(step.id)}
      >
        <span className={styles.titleWrap}>
          <Icon
            icon={iconByName[step.icon]}
            size={26}
            className={styles.stepIcon}
          />
          <span className={styles.title}>{step.title}</span>
        </span>

        <span className={styles.state}>
          {open && <span className={styles.count}>{count} selected</span>}
          <Icon icon={open ? caretUp : caretDown} size={12} className={styles.caret} />
        </span>
      </button>

      {open && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={headerId}
          className={styles.panel}
        >
          <div className={styles.grid}>
            {step.productIds.map((id) => {
              const product = products.get(id);
              return product ? (
                <ProductCard key={id} product={product} step={step} />
              ) : null;
            })}
          </div>

          {step.nextStepId && step.nextLabel && (
            <div className={styles.nextRow}>
              <Button
                variant="outline"
                className={styles.nextButton}
                onClick={() => openStep(step.nextStepId!)}
              >
                {step.nextLabel}
              </Button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
