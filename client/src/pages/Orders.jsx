import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUserAuth } from '../context/UserAuthContext.jsx';
import { apiGet, auth } from '../api/client.js';
import styles from './Orders.module.css';

function formatBDT(n) {
  return `৳${Number(n || 0).toLocaleString('en-IN')}`;
}

export default function Orders() {
  const { user } = useUserAuth();
  const { t, i18n } = useTranslation();
  const isBn = i18n.language?.startsWith('bn');

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      const token = await auth.currentUser.getIdToken();
      const myOrders = await apiGet(token, '/orders');
      setOrders(myOrders);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>{t('profile.orders')}</h1>
        <p className={styles.sub}>{t('pages.orders.subtitle')}</p>
      </div>

      {loading ? (
        <div className={styles.skeletons}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div className={`${styles.skeleton} ${styles.shimmer}`} key={i} aria-hidden="true">
              <div className={styles.skeletonHead}>
                <span className={styles.skLine} />
                <span className={`${styles.skLine} ${styles.skShort}`} />
              </div>
              <span className={`${styles.skLine} ${styles.skLong}`} />
              <span className={`${styles.skLine} ${styles.skMid}`} />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className={styles.card}>
          <p className={styles.error}>{error}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className={styles.card}>
          <p className={styles.hint}>{t('profile.noOrders')}</p>
          <Link to="/shop" className={styles.shopLink}>
            {t('pages.cart.goShop')}
          </Link>
        </div>
      ) : (
        <div className={styles.orders}>
          {orders.map((order) => (
            <div className={styles.order} key={order._id}>
              <div className={styles.orderHead}>
                <strong className={styles.orderId}>{order.orderNumber}</strong>
                <Link
                  to={`/track?id=${encodeURIComponent(order.orderNumber)}`}
                  className={styles.trackLink}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M2 7h11v9H2zM13 10h4l3 3v3h-7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                    <circle cx="6" cy="18" r="1.8" stroke="currentColor" strokeWidth="1.8" />
                    <circle cx="16.5" cy="18" r="1.8" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                  {t('profile.track')}
                </Link>
                <span className={styles.orderDate}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className={styles.orderRow}>
                <span>
                  {isBn
                    ? order.items.map((i) => i.nameBn || i.name).join(', ')
                    : order.items.map((i) => i.name).join(', ')}
                </span>
                <strong>{formatBDT(order.total)}</strong>
              </div>
              <div className={styles.orderRow}>
                <span className={styles.orderStatus}>
                  {t(`profile.status.${order.status}`, { defaultValue: order.status })}
                </span>
                <span>{order.items.reduce((s, i) => s + i.quantity, 0)} items</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
