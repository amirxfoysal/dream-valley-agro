import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BASE_URL } from '../api/client.js';
import { CATEGORIES, categoryMatches } from '../constants/categories.js';
import { useSubcategories } from '../context/SubcategoriesContext.jsx';
import ProductCard from './ProductCard.jsx';
import ProductSkeleton from './ProductSkeleton.jsx';
import styles from './CategoryProducts.module.css';

const PRODUCTS_PER_CATEGORY = 4;

export default function CategoryProducts() {
  const { t, i18n } = useTranslation();
  const bn = i18n.resolvedLanguage === 'bn';
  useSubcategories();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${BASE_URL}/products`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((err) => {
        if (err.name !== 'AbortError') setError(t('shop.error'));
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [t]);

  const grouped = useMemo(
    () =>
      CATEGORIES.map((category) => ({
        category,
        products: products.filter((p) => categoryMatches(p.category, category.slug)).slice(
          0,
          PRODUCTS_PER_CATEGORY
        ),
      })).filter((group) => group.products.length > 0),
    [products]
  );

  if (loading || error) {
    return (
      <section className={styles.section}>
        <div className={styles.header}>
          <h2>{t('home.categoryProducts.title')}</h2>
          <p>{t('home.categoryProducts.subtitle')}</p>
        </div>
        {loading ? (
          <div className={styles.grid}>
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          <p className={`${styles.status} ${styles.error}`}>{error}</p>
        )}
      </section>
    );
  }

  if (grouped.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2>{t('home.categoryProducts.title')}</h2>
        <p>{t('home.categoryProducts.subtitle')}</p>
      </div>

      {grouped.map(({ category, products: categoryProducts }) => (
        <div key={category.slug} className={styles.group}>
          <div className={styles.groupHeader}>
            <h3 className={styles.groupTitle}>{bn ? category.bn : category.en}</h3>
            <Link to={`/shop?category=${category.slug}`} className={styles.seeAll}>
              {t('home.categoryProducts.seeAll')}
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

          <div className={styles.grid}>
            {categoryProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
