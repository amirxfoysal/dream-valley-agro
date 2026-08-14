import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext.jsx';
import { useUserAuth } from '../context/UserAuthContext.jsx';
import { apiGet, apiPost, auth } from '../api/client.js';
import styles from './Checkout.module.css';

function formatBDT(n) {
  return `৳${Number(n || 0).toLocaleString('en-IN')}`;
}

export default function Checkout() {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language?.startsWith('bn');
  const { user } = useUserAuth();
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: '',
  });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);

  const loadProfile = useCallback(async () => {
    setLoadingProfile(true);
    try {
      const token = await auth.currentUser.getIdToken();
      const profile = await apiGet(token, '/profile');
      setForm((prev) => ({
        ...prev,
        name: profile.name || user?.name || '',
        email: (profile.email || user?.email || '').toLowerCase(),
        phone: profile.phone || '',
        address: profile.address?.street || '',
        city: profile.address?.city || '',
        postalCode: profile.address?.postalCode || '',
      }));
    } catch {
      setForm((prev) => ({ ...prev, name: user?.name || '', email: user?.email || '' }));
    } finally {
      setLoadingProfile(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) loadProfile();
  }, [user, loadProfile]);

  useEffect(() => {
    if (items.length === 0 && !placedOrder) navigate('/cart', { replace: true });
  }, [items, placedOrder, navigate]);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const token = await auth.currentUser.getIdToken();
      const order = await apiPost(token, '/orders', {
        items: items.map((item) => ({ product: item.id, quantity: item.quantity })),
        customer: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          postalCode: form.postalCode,
        },
        payment: { method: 'cod' },
        notes: form.notes,
      });
      clearCart();
      setPlacedOrder(order);
    } catch (err) {
      setError(err.body?.error || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (placedOrder) {
    return (
      <main className={styles.page}>
        <div className={styles.successCard}>
          <span className={styles.successIcon}>✓</span>
          <h1>{t('checkout.success')}</h1>
          <p className={styles.orderNumber}>
            {t('checkout.orderNumber')}: <strong>{placedOrder.orderNumber}</strong>
          </p>
          <p className={styles.successText}>{t('checkout.successText')}</p>
          <div className={styles.successActions}>
            <Link to="/shop" className={styles.primary}>
              {t('checkout.continueShopping')}
            </Link>
            <Link to="/orders" className={styles.secondary}>
              {t('checkout.viewOrders')}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1>{t('pages.checkout.title')}</h1>
        <p>{t('pages.checkout.subtitle')}</p>
      </header>

      <form className={styles.layout} onSubmit={onSubmit}>
        <div className={styles.card}>
          <h2>{t('checkout.delivery')}</h2>
          <div className={styles.grid}>
            <label className={styles.field}>
              <span>{t('auth.name')} *</span>
              <input
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                autoComplete="name"
                required
              />
            </label>
            <label className={styles.field}>
              <span>{t('auth.email')} *</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                autoComplete="email"
                required
              />
            </label>
            <label className={styles.field}>
              <span>{t('profile.phone')} *</span>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                placeholder={isBn ? '+৮৮০…' : '+880…'}
                autoComplete="tel"
                required
              />
            </label>
            <label className={`${styles.field} ${styles.full}`}>
              <span>{t('profile.street')} *</span>
              <input
                value={form.address}
                onChange={(e) => set('address', e.target.value)}
                autoComplete="street-address"
                required
              />
            </label>
            <label className={styles.field}>
              <span>{t('profile.city')}</span>
              <input
                value={form.city}
                onChange={(e) => set('city', e.target.value)}
                autoComplete="address-level2"
              />
            </label>
            <label className={styles.field}>
              <span>{t('profile.postal')}</span>
              <input
                value={form.postalCode}
                onChange={(e) => set('postalCode', e.target.value)}
                autoComplete="postal-code"
              />
            </label>
            <label className={`${styles.field} ${styles.full}`}>
              <span>{t('checkout.notes')}</span>
              <textarea
                value={form.notes}
                onChange={(e) => set('notes', e.target.value)}
                rows="3"
              />
            </label>
          </div>
          {error && <div className={styles.error}>{error}</div>}
        </div>

        <aside className={styles.summary}>
          <h2>{t('pages.cart.summary')}</h2>
          {loadingProfile ? (
            <p className={styles.loading}>{t('checkout.loading')}</p>
          ) : (
            <>
              <div className={styles.items}>
                {items.map((item) => (
                  <div className={styles.item} key={item.id}>
                    <span>{isBn ? item.nameBn || item.name : item.name}</span>
                    <span>
                      {item.quantity} × {formatBDT(item.price)}
                    </span>
                  </div>
                ))}
              </div>
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
              <div className={styles.pay}>
                <span className={styles.payLabel}>{t('checkout.payment')}</span>
                <span className={styles.payValue}>{t('checkout.cod')}</span>
              </div>
              <button type="submit" className={styles.placeBtn} disabled={submitting}>
                {submitting ? t('checkout.placing') + '…' : t('checkout.placeOrder')}
              </button>
            </>
          )}
        </aside>
      </form>
    </main>
  );
}