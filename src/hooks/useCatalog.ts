import { useEffect } from "react";
import { loadCatalog } from "../data/catalogClient";
import { useBundleStore } from "../store/bundleStore";

export function useInitCatalog(): void {
  const initialize = useBundleStore((s) => s.initialize);
  const setStatus = useBundleStore((s) => s.setStatus);

  useEffect(() => {
    let active = true;
    loadCatalog()
      .then((catalog) => {
        if (active) initialize(catalog);
      })
      .catch(() => {
        if (active) setStatus("error");
      });
    return () => {
      active = false;
    };
  }, [initialize, setStatus]);
}
