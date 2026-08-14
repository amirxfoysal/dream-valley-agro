import styles from './ProductSkeleton.module.css';

export default function ProductSkeleton() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={`${styles.media} ${styles.shimmer}`} />
      <div className={styles.body}>
        <div className={`${styles.line} ${styles.title} ${styles.shimmer}`} />
        <div className={`${styles.line} ${styles.short} ${styles.shimmer}`} />
        <div className={styles.priceRow}>
          <div className={`${styles.line} ${styles.price} ${styles.shimmer}`} />
          <div className={`${styles.line} ${styles.oldPrice} ${styles.shimmer}`} />
        </div>
      </div>
      <div className={`${styles.btn} ${styles.shimmer}`} />
    </div>
  );
}
