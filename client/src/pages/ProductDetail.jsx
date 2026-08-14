import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext.jsx';
import { BASE_URL } from '../api/client.js';
import styles from './ProductDetail.module.css';

function formatBDT(n) {
  return `৳${Number(n || 0).toLocaleString('en-IN')}`;
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const bn = i18n.resolvedLanguage === 'bn';
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive(0);
  }, [id]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    fetch(`${BASE_URL}/products/${id}`, { signal: controller.signal })
      .then((res) => {
        if (res.status === 404) {
          navigate('/shop', { replace: true });
          throw new Error('Product not found');
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setProduct(data))
      .catch((err) => {
        if (err.name !== 'AbortError' && err.message !== 'Product not found') {
          setError(t('shop.error'));
        }
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [id, navigate, t]);

  if (loading) {
    return <main className={styles.page}><p className={styles.status}>{t('shop.loading')}</p></main>;
  }
  if (error) {
    return (
      <main className={styles.page}>
        <p className={`${styles.status} ${styles.error}`}>{error}</p>
        <Link to="/shop" className={styles.back}>{t('home.featured.viewAll')}</Link>
      </main>
    );
  }
  if (!product) return null;

  const outOfStock = product.stock <= 0;
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;
  const name = bn ? product.nameBn || product.name : product.name;
  const description = bn
    ? product.descriptionBn || product.description
    : product.description;
  const gallery = Array.from(
    new Set([product.image, ...(product.images || [])].filter(Boolean))
  );
  const safeActive = Math.min(active, Math.max(gallery.length - 1, 0));

  const handleAdd = () => {
    if (outOfStock) return;
    addItem(
      {
        id: product._id,
        name: product.name,
        nameBn: product.nameBn,
        image: product.image,
        price: product.price,
      },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const handleBuyNow = () => {
    if (outOfStock) return;
    addItem(
      {
        id: product._id,
        name: product.name,
        nameBn: product.nameBn,
        image: product.image,
        price: product.price,
      },
      qty
    );
    navigate('/checkout');
  };

  const care = [
    { label: t('product.light'), value: product.care?.light },
    { label: t('product.water'), value: product.care?.water },
    { label: t('product.soil'), value: product.care?.soil },
  ].filter((c) => c.value);

  return (
    <main className={styles.page}>
      <Link to="/shop" className={styles.back}>
        ← {t('product.back')}
      </Link>

      <div className={styles.layout}>
        <div className={styles.gallery}>
          <div className={styles.heroWrap}>
            {gallery[safeActive] ? (
              <img className={styles.hero} src={gallery[safeActive]} alt={product.name} />
            ) : (
              <div className={`${styles.hero} ${styles.fallback}`}>{name}</div>
            )}
            {discount > 0 && <span className={styles.badgeHot}>-{discount}%</span>}
            {product.featured && <span className={styles.badge}>{t('shop.featured')}</span>}
          </div>

          {gallery.length > 1 && (
            <div className={styles.thumbs}>
              {gallery.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  type="button"
                  className={`${styles.thumb} ${i === safeActive ? styles.thumbActive : ''}`}
                  onClick={() => setActive(i)}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.info}>
          <span className={styles.category}>
            {t(`shop.categories.${product.category}`, { defaultValue: product.category })}
          </span>
          <h1 className={styles.title}>{name}</h1>
          {product.tree?.name && (
            <Link to="/shop" className={styles.tree}>
              {bn ? product.tree.nameBn || product.tree.name : product.tree.name}
            </Link>
          )}
          {description && <p className={styles.desc}>{description}</p>}

          <div className={styles.priceRow}>
            <span className={styles.price}>{formatBDT(product.price)}</span>
            {product.oldPrice && (
              <span className={styles.oldPrice}>{formatBDT(product.oldPrice)}</span>
            )}
          </div>

          <p className={outOfStock ? `${styles.stock} ${styles.stockOut}` : styles.stock}>
            {outOfStock
              ? t('shop.outOfStock')
              : t('product.inStock', { count: product.stock })}
          </p>

          <div className={styles.actions}>
            <div className={styles.qty}>
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="−"
              >
                −
              </button>
              <span>{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(product.stock || 1, q + 1))}
                aria-label="+"
              >
                +
              </button>
            </div>

            <button
              type="button"
              className={`${styles.addBtn} ${added ? styles.added : ''}`}
              onClick={handleAdd}
              disabled={outOfStock}
            >
              {outOfStock ? t('shop.outOfStock') : added ? t('shop.added') : t('product.addToCart')}
            </button>

            <button
              type="button"
              className={styles.buyBtn}
              onClick={handleBuyNow}
              disabled={outOfStock}
            >
              {t('product.buyNow')}
            </button>
          </div>

          {care.length > 0 && (
            <div className={styles.care}>
              <h2>{t('product.care')}</h2>
              <div className={styles.careGrid}>
                {care.map((c) => (
                  <div className={styles.careItem} key={c.label}>
                    <span className={styles.careLabel}>{c.label}</span>
                    <span className={styles.careValue}>{c.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}