import { useState } from "react";
import styles from "./ProductImage.module.css";

interface ProductImageProps {
  src?: string;
  alt: string;
  className?: string;
}

export function ProductImage({ src, alt, className }: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !src || failed;

  if (showPlaceholder) {
    return (
      <div
        className={`${styles.wrap} ${styles.placeholder} ${className ?? ""}`}
        role="img"
        aria-label={alt}
      />
    );
  }

  return (
    <div className={`${styles.wrap} ${className ?? ""}`}>
      <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
    </div>
  );
}
