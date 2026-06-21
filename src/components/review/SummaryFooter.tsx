import { useEffect, useId, useRef, useState } from "react";
import type { Catalog, CatalogConfig } from "../../lib/types";
import type { Totals } from "../../lib/pricing";
import { currency } from "../../lib/format";
import { useBundleStore } from "../../store/bundleStore";
import { Button } from "../ui/Button/Button";
import { Icon } from "../ui/Icon/Icon";
import { iconByName, check } from "../ui/Icon/icons";
import { PriceTag } from "../ui/PriceTag/PriceTag";
import styles from "./SummaryFooter.module.css";

interface SummaryFooterProps {
  catalog: Catalog;
  totals: Totals;
}

export function SummaryFooter({ catalog, totals }: SummaryFooterProps) {
  const { config } = catalog;
  const saveForLater = useBundleStore((s) => s.saveForLater);

  const [toast, setToast] = useState<string | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const toastTimer = useRef<number | undefined>(undefined);
  const dialogTitleId = useId();

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  function handleSave() {
    const saved = saveForLater();
    setToast(
      saved
        ? "System saved — it'll be here when you return."
        : "Unable to save your system. Check your browser storage settings.",
    );
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 3000);
  }

  const savingsText = config.savingsMessage.replace(
    "{amount}",
    currency(totals.savings),
  );

  return (
    <div className={styles.summary}>
      <div className={styles.guaranteeBlock}>
        <GuaranteeSeal guarantee={config.guarantee} />
        <div className={styles.guaranteeCopy}>
          <h3>{config.guarantee.headline}</h3>
          <p>{config.guarantee.body}</p>
        </div>
      </div>

      <div className={styles.totalsBlock}>
        <span className={styles.financing}>
          {config.financing.label} {currency(totals.monthly)}/mo
        </span>
        <div className={styles.totalsRight}>
          <PriceTag
            price={totals.total}
            compareAtPrice={totals.preDiscount}
            tone="review"
          />
        </div>
      </div>

      {totals.savings > 0 && <p className={styles.savings}>{savingsText}</p>}

      <Button
        variant="primary"
        size="lg"
        fullWidth
        className={styles.checkoutButton}
        onClick={() => setCheckoutOpen(true)}
      >
        Checkout
      </Button>

      <button type="button" className={styles.saveLink} onClick={handleSave}>
        Save my system for later
      </button>

      {toast && (
        <div className={styles.toast} role="status">
          {toast}
        </div>
      )}

      {checkoutOpen && (
        <CheckoutModal
          titleId={dialogTitleId}
          total={currency(totals.total)}
          onClose={() => setCheckoutOpen(false)}
        />
      )}
    </div>
  );
}

export function ShippingLine({ config }: { config: CatalogConfig }) {
  return (
    <div className={styles.shipping}>
      <span className={styles.shipName}>
        <span className={styles.truck}>
          <Icon icon={iconByName[config.shipping.icon]} size={22} />
        </span>
        {config.shipping.label}
      </span>
      <PriceTag
        price={config.shipping.free ? 0 : config.shipping.price}
        compareAtPrice={config.shipping.compareAtPrice}
        free={config.shipping.free}
        freeLabel="FREE"
        tone="review"
      />
    </div>
  );
}

interface CheckoutModalProps {
  titleId: string;
  total: string;
  onClose: () => void;
}

function CheckoutModal({ titleId, total, onClose }: CheckoutModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalIcon}>
          <Icon icon={check} size={28} />
        </div>
        <h3 id={titleId} className={styles.modalTitle}>
          Order confirmed
        </h3>
        <p className={styles.modalBody}>
          This is a prototype, so no payment was taken. Your system totals{" "}
          <strong>{total}</strong>.
        </p>
        <Button variant="primary" fullWidth autoFocus onClick={onClose}>
          Done
        </Button>
      </div>
    </div>
  );
}

/**
 * Satisfaction-guarantee seal. Renders the provided seal image, falling back to
 * a rendered CSS badge if no image is configured or the file fails to load.
 */
function GuaranteeSeal({ guarantee }: { guarantee: CatalogConfig["guarantee"] }) {
  const [failed, setFailed] = useState(false);
  const label = `${guarantee.percent} ${guarantee.title}`;

  if (guarantee.image && !failed) {
    return (
      <img
        className={styles.seal}
        src={guarantee.image}
        alt={label}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div className={styles.seal} role="img" aria-label={label}>
      <span className={styles.sealPercent}>{guarantee.percent}</span>
      <span className={styles.sealText}>{guarantee.title}</span>
    </div>
  );
}
