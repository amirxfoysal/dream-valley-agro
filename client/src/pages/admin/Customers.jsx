import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiGet, getAdminToken } from '../../api/client.js';
import styles from './admin.module.css';

function formatBDT(n) {
  return `৳${Number(n || 0).toLocaleString('en-IN')}`;
}

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString();
}

function avatarInitial(name, email) {
  const src = name.trim() ? name : email;
  return (src || '?').charAt(0).toUpperCase();
}

function HistoryIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 4v4h4M12 8v4l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Customers() {
  const { t } = useTranslation();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(true);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2600);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getAdminToken();
      const data = await apiGet(token, '/admin/customers');
      setCustomers(data);
    } catch (err) {
      showToast(err.message);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    load();
  }, [load]);

  const openHistory = async (customer) => {
    setHistory(customer);
    setHistoryLoading(true);
    try {
      const token = await getAdminToken();
      const orders = await apiGet(token, `/admin/customers/${customer.firebaseUid}/orders`);
      setHistory({ ...customer, orders });
    } catch (err) {
      showToast(err.message);
      setHistory(null);
    } finally {
      setHistoryLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        (c.name || '').toLowerCase().includes(q) ||
        (c.email || '').toLowerCase().includes(q) ||
        (c.phone || '').toLowerCase().includes(q)
    );
  }, [customers, query]);

  const itemCount = (order) => order.items?.reduce((s, i) => s + i.quantity, 0) || 0;

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1>{t('admin.nav.customers')}</h1>
          <p className={styles.sub}>{t('admin.customers.count', { count: customers.length })}</p>
        </div>
        <input
          className={styles.searchInput}
          type="search"
          placeholder={t('admin.customers.search')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {toast && <div className={styles.toast}>{toast}</div>}

      <div className={styles.panel}>
        {loading ? (
          <div className={styles.empty}>{t('admin.customers.loading')}</div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>{t('admin.customers.empty')}</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t('admin.table.customer')}</th>
                <th>{t('admin.customers.contact')}</th>
                <th>{t('admin.customers.ordersCol')}</th>
                <th>{t('admin.customers.totalSpent')}</th>
                <th>{t('admin.customers.lastOrder')}</th>
                <th>{t('admin.customers.joined')}</th>
                <th>{t('admin.customers.history')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span className={styles.placeholderImg}>{avatarInitial(c.name, c.email)}</span>
                      <div>
                        <strong>{c.name || '—'}</strong>
                        {c.address?.city && (
                          <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                            {c.address.city}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: 13 }}>{c.email || '—'}</div>
                    {c.phone && (
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>{c.phone}</div>
                    )}
                  </td>
                  <td>
                    <span className={styles.badge} style={{ background: 'rgba(84,148,235,0.16)', color: '#3f7fd6' }}>
                      {c.stats.orders}
                    </span>
                  </td>
                  <td className={styles.price}>{formatBDT(c.stats.totalSpent)}</td>
                  <td style={{ color: 'var(--muted)', fontSize: 13 }}>
                    {formatDate(c.stats.lastOrder)}
                  </td>
                  <td style={{ color: 'var(--muted)', fontSize: 13 }}>
                    {formatDate(c.createdAt)}
                  </td>
                  <td>
                    <button
                      type="button"
                      className={styles.actionBtn}
                      onClick={() => openHistory(c)}
                      aria-label={t('admin.customers.orderHistory')}
                    >
                      <HistoryIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {history && (
        <div className={styles.overlay} onClick={() => setHistory(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2>{history.name || t('admin.customers.customerTitle')}</h2>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
                  {t('admin.customers.ordersSummary', {
                    email: history.email,
                    count: history.stats.orders,
                    total: formatBDT(history.stats.totalSpent),
                  })}
                </div>
              </div>
              <button type="button" className={styles.closeBtn} onClick={() => setHistory(null)} aria-label={t('admin.customers.close')}>
                ×
              </button>
            </div>

            {historyLoading ? (
              <div className={styles.empty}>{t('admin.customers.loadingHistory')}</div>
            ) : history.orders.length === 0 ? (
              <div className={styles.empty}>{t('admin.customers.noOrders')}</div>
            ) : (
              <div className={styles.historyList}>
                {history.orders.map((order) => (
                  <div className={styles.historyItem} key={order._id}>
                    <div className={styles.historyHead}>
                      <strong>{order.orderNumber}</strong>
                      <span className={`${styles.badge} ${styles.statusPending}`}>{t(`admin.status.${order.status}`)}</span>
                    </div>
                    <div className={styles.historyMeta}>
                      <span>{formatDate(order.createdAt)}</span>
                      <span className={styles.price}>{formatBDT(order.total)}</span>
                      <span>{t('admin.customers.items', { count: itemCount(order) })}</span>
                    </div>
                    <div className={styles.historyItems}>
                      {order.items.map((item, idx) => (
                        <div className={styles.historyLine} key={idx}>
                          <span>{item.name}</span>
                          <span>
                            {item.quantity} × {formatBDT(item.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                    {order.customer?.address && (
                      <div className={styles.historyAddress}>
                        {t('admin.customers.deliverTo', {
                          address: `${order.customer.address}${order.customer.city ? `, ${order.customer.city}` : ''}`,
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}