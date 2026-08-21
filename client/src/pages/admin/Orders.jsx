import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiGet, apiPatch, apiPost, getAdminToken } from '../../api/client.js';
import styles from './admin.module.css';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const statusClass = (status) => {
  const map = {
    pending: styles.statusPending,
    processing: styles.statusProcessing,
    shipped: styles.statusShipped,
    delivered: styles.statusDelivered,
    cancelled: styles.statusCancelled,
  };
  return map[status] || '';
};

function formatBDT(n) {
  return `৳${Number(n || 0).toLocaleString('en-IN')}`;
}

export default function Orders() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2600);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getAdminToken();
      const qs = filter ? `?status=${filter}` : '';
      const data = await apiGet(token, `/admin/orders${qs}`);
      setOrders(data);
    } catch (err) {
      showToast(err.message);
    } finally {
      setLoading(false);
    }
  }, [filter, showToast]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (order, status) => {
    try {
      const token = await getAdminToken();
      const updated = await apiPatch(token, `/admin/orders/${order._id}/status`, { status });
      setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
      showToast(t('admin.orders.statusUpdated', {
        number: order.orderNumber,
        status: t(`admin.status.${status}`),
      }));
    } catch (err) {
      showToast(err.message);
    }
  };

  const sendToSteadfast = async (order) => {
    try {
      const token = await getAdminToken();
      const updated = await apiPost(token, `/admin/orders/${order._id}/courier/steadfast`, {});
      setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
      showToast(
        t('admin.orders.consignmentCreated', {
          number: order.orderNumber,
          id: updated.courier?.consignmentId,
        })
      );
    } catch (err) {
      showToast(err.body?.error || err.message);
    }
  };

  const itemCount = (order) => order.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1>{t('admin.nav.orders')}</h1>
          <p className={styles.sub}>{t('admin.orders.count', { count: orders.length })}</p>
        </div>
        <select
          className={styles.statusSelect}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">{t('admin.orders.allStatuses')}</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {t(`admin.status.${s}`)}
            </option>
          ))}
        </select>
      </div>

      {toast && <div className={styles.toast}>{toast}</div>}

      <div className={styles.panel}>
        {loading ? (
          <div className={styles.empty}>{t('admin.orders.loading')}</div>
        ) : orders.length === 0 ? (
          <div className={styles.empty}>{t('admin.orders.empty')}</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t('admin.table.order')}</th>
                <th>{t('admin.table.customer')}</th>
                <th>{t('admin.table.location')}</th>
                <th>{t('admin.table.items')}</th>
                <th>{t('admin.table.total')}</th>
                <th>{t('admin.table.status')}</th>
                <th>{t('admin.orders.courier')}</th>
                <th>{t('admin.table.date')}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const c = order.customer || {};
                const locationCityPostal = [c.city, c.postalCode].filter(Boolean).join(', ');
                return (
                  <tr key={order._id}>
                    <td className={styles.price}>{order.orderNumber}</td>
                    <td>
                      <strong>{c.name || '—'}</strong>
                      {c.email && (
                        <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                          {c.email}
                        </div>
                      )}
                      {c.phone && (
                        <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                          {c.phone}
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>
                        {c.address || '—'}
                      </div>
                      {locationCityPostal && (
                        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                          {locationCityPostal}
                        </div>
                      )}
                    </td>
                    <td>{itemCount(order)}</td>
                    <td className={styles.price}>{formatBDT(order.total)}</td>
                    <td>
                      <select
                        className={styles.statusSelect}
                        value={order.status}
                        onChange={(e) => updateStatus(order, e.target.value)}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {t(`admin.status.${s}`)}
                          </option>
                        ))}
                      </select>
                      <div style={{ marginTop: 4 }}>
                        <span className={`${styles.badge} ${statusClass(order.status)}`}>
                          {t(`admin.status.${order.status}`)}
                        </span>
                      </div>
                    </td>
                    <td>
                      {order.courier?.consignmentId ? (
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary)' }}>
                            SteadFast
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                            {order.courier.consignmentId}
                          </div>
                          {order.courier.trackingStatus && (
                            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                              ↳ {t(`admin.trackingStatus.${order.courier.trackingStatus}`)}
                            </div>
                          )}
                        </div>
                      ) : order.status === 'cancelled' ? (
                        <span style={{ fontSize: 13, color: 'var(--muted)' }}>—</span>
                      ) : (
                        <button
                          type="button"
                          className={styles.courierBtn}
                          onClick={() => sendToSteadfast(order)}
                        >
                          {t('admin.orders.sendToSteadfast')}
                        </button>
                      )}
                    </td>
                    <td style={{ color: 'var(--muted)', fontSize: 13 }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}