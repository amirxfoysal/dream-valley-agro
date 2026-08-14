import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext.jsx';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  const { t, i18n } = useTranslation();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const bn = i18n.resolvedLanguage === 'bn';

  const outOfStock = product.stock <= 0;
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const handleAdd = (e) => {
    e.preventDefault();
    if (outOfStock) return;
    addItem(
      {
        id: product._id,
        name: product.name,
        nameBn: product.nameBn,
        image: product.image,
        price: product.price,
      },
      1
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <Link to={`/product/${product._id}`} className={styles.cardLink}>
      <article className={styles.card}>
        <div className={styles.media}>
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className={styles.img}
            />
          ) : (
            <div className={`${styles.img} ${styles.fallback}`}>
              {product.nameBn || product.name}
            </div>
          )}
          <div className={styles.badges}>
            {product.featured && <span className={styles.badge}>{t('shop.featured')}</span>}
            {discount > 0 && <span className={styles.badgeHot}>-{discount}%</span>}
          </div>
        </div>

        <div className={styles.body}>
          <h3 className={styles.name}>{bn ? product.nameBn || product.name : product.name}</h3>
          <p className={styles.category}>
            {t(`shop.categories.${product.category}`, { defaultValue: product.category })}
          </p>
          <div className={styles.priceRow}>
            <span className={styles.price}>
              {product.price} <small>{t('shop.currency')}</small>
            </span>
            {product.oldPrice && (
              <span className={styles.oldPrice}>
                {product.oldPrice} <small>{t('shop.currency')}</small>
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          className={`${styles.addBtn} ${added ? styles.added : ''} ${
            outOfStock ? styles.disabled : ''
          }`}
          onClick={handleAdd}
          disabled={outOfStock}
        >
          {outOfStock
            ? t('shop.outOfStock')
            : added
              ? t('shop.added')
              : t('shop.addToCart')}
        </button>
      </article>
    </Link>
  );
}