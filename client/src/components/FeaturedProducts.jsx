import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchPublicJson } from '../api/client.js';
import ProductCard from './ProductCard.jsx';
import ProductSkeleton from './ProductSkeleton.jsx';
import styles from './FeaturedProducts.module.css';

export default function FeaturedProducts() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setError('');
    fetchPublicJson('/products?featured=true', controller.signal)
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((err) => {
        if (err.name !== 'AbortError') setError(t('shop.error'));
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [t]);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2>{t('home.featured.title')}</h2>
        <p>{t('home.featured.subtitle')}</p>
      </div>

      {loading ? (
        <div className={styles.grid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <p className={`${styles.status} ${styles.error}`}>{error}</p>
      ) : products.length === 0 ? (
        <p className={styles.status}>{t('home.featured.empty')}</p>
      ) : (
        <div className={styles.grid}>
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      <div className={styles.footer}>
        <Link to="/shop?featured=true" className={styles.link}>
          {t('home.featured.viewAll')}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 12h14M13 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}