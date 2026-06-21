import { useBundleStore } from "./store/bundleStore";
import { useInitCatalog } from "./hooks/useCatalog";
import { BundleBuilder } from "./components/builder/BundleBuilder";
import { ReviewPanel } from "./components/review/ReviewPanel";
import styles from "./App.module.css";

export default function App() {
  useInitCatalog();
  const status = useBundleStore((s) => s.status);

  return (
    <div className={styles.page}>
      <main className={styles.layout}>
        {status !== "ready" ? (
          <div className={styles.loading} role="status">
            Loading your builder…
          </div>
        ) : (
          <>
            <section className={styles.builderCol} aria-label="Bundle builder">
              <h1 className={styles.pageTitle}>Let&rsquo;s get started!</h1>
              <BundleBuilder />
            </section>
            <div className={styles.reviewCol}>
              <ReviewPanel />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
