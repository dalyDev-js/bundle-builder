import { useBundleStore } from "../../store/bundleStore";
import { reviewGroups, type ReviewGroup } from "../../store/selectors";
import { computeTotals } from "../../lib/pricing";
import { ReviewLine, PlanLine } from "./ReviewLine";
import { ShippingLine, SummaryFooter } from "./SummaryFooter";
import styles from "./ReviewPanel.module.css";

function ReviewSection({ group }: { group: ReviewGroup }) {
  return (
    <div className={styles.section}>
      <p className={styles.subhead}>{group.category}</p>
      {group.items.map((item) =>
        item.product.type === "plan" ? (
          <PlanLine key={item.key} product={item.product} />
        ) : (
          <ReviewLine key={item.key} item={item} />
        ),
      )}
    </div>
  );
}

export function ReviewPanel() {
  const catalog = useBundleStore((s) => s.catalog);
  const lines = useBundleStore((s) => s.lines);
  if (!catalog) return null;

  const groups = reviewGroups(catalog, lines);
  const totals = computeTotals(lines, catalog);

  return (
    <aside className={styles.panel} aria-label="Your security system summary">
      <div className={styles.reviewMain}>
        <p className={styles.eyebrow}>Review</p>
        <h2 className={styles.heading}>Your security system</h2>
        <p className={styles.subtitle}>
          Review your personalized protection system designed to keep what matters
          most safe.
        </p>

        <div className={styles.sections}>
          {groups.length === 0 ? (
            <p className={styles.empty}>
              Your system is empty. Add cameras and sensors to get started.
            </p>
          ) : (
            groups.map((group) => (
              <ReviewSection key={group.category} group={group} />
            ))
          )}
        </div>

        <ShippingLine config={catalog.config} />
      </div>

      <SummaryFooter catalog={catalog} totals={totals} />
    </aside>
  );
}
