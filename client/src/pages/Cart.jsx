import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext.jsx';
import styles from './Cart.module.css';

function formatBDT(n) {
  return `৳${Number(n || 0).toLocaleString('en-IN')}`;
}

export default function Cart() {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language?.startsWith('bn');
  const { items, subtotal, shipping, total, setQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <main className={styles.page}>
        <div className={styles.empty}>
          <h1>{t('pages.cart.title')}</h1>
          <p>{t('pages.cart.empty')}</p>
          <Link to="/shop" className={styles.cta}>
            {t('pages.cart.goShop')}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1>{t('pages.cart.title')}</h1>
        <p>
          {items.reduce((s, i) => s + i.quantity, 0)} {t('pages.cart.items')}
        </p>
      </header>

      <div className={styles.layout}>
        <div className={styles.items}>
          {items.map((item) => (
            <div className={styles.item} key={item.id}>
              {item.image ? (
                <img className={styles.thumb} src={item.image} alt={item.name} />
              ) : (
                <span className={styles.thumbFallback}>{(item.name || 'P').charAt(0)}</span>
              )}
              <div className={styles.info}>
                <strong className={styles.name}>
                  {isBn ? item.nameBn || item.name : item.name}
                </strong>
                <span className={styles.unitPrice}>{formatBDT(item.price)}</span>
              </div>
              <div className={styles.qty}>
                <button
                  type="button"
                  onClick={() => setQuantity(item.id, item.quantity - 1)}
                  aria-label="−"
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(item.id, item.quantity + 1)}
                  aria-label="+"
                >
                  +
                </button>
              </div>
              <span className={styles.lineTotal}>{formatBDT(item.price * item.quantity)}</span>
              <button
                type="button"
                className={styles.remove}
                onClick={() => removeItem(item.id)}
                aria-label={t('pages.cart.remove')}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <aside className={styles.summary}>
          <h2>{t('pages.cart.summary')}</h2>
          <div className={styles.row}>
            <span>{t('pages.cart.subtotal')}</span>
            <span>{formatBDT(subtotal)}</span>
          </div>
          <div className={styles.row}>
            <span>{t('pages.cart.shipping')}</span>
            <span>{shipping === 0 ? t('pages.cart.free') : formatBDT(shipping)}</span>
          </div>
          <div className={`${styles.row} ${styles.total}`}>
            <span>{t('pages.cart.total')}</span>
            <span>{formatBDT(total)}</span>
          </div>
          <Link to="/checkout" className={styles.checkoutBtn}>
            {t('pages.cart.checkout')}
          </Link>
          <Link to="/shop" className={styles.continue}>
            {t('pages.cart.continue')}
          </Link>
        </aside>
      </div>
    </main>
  );
}