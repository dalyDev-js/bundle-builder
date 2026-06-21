import { useBundleStore } from "../../store/bundleStore";
import { productById } from "../../store/selectors";
import { AccordionStep } from "./Accordion/AccordionStep";
import styles from "./BundleBuilder.module.css";

export function BundleBuilder() {
  const catalog = useBundleStore((s) => s.catalog);
  if (!catalog) return null;

  const products = productById(catalog);

  return (
    <div className={styles.builder}>
      {catalog.steps.map((step) => (
        <AccordionStep key={step.id} step={step} products={products} />
      ))}
    </div>
  );
}
