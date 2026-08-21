import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiGet, apiPost, getAdminToken } from '../../api/client.js';
import styles from './admin.module.css';

const trackingBadge = (status) => {
  const map = {
    pending: styles.statusPending,
    in_review: styles.statusPending,
    in_progress: styles.statusProcessing,
    shipped: styles.statusShipped,
    delivered: styles.statusDelivered,
    partial: styles.statusDelivered,
    returned: styles.statusCancelled,
    cancelled: styles.statusCancelled,
  };
  return map[status] || '';
};

const orderBadge = (status) => {
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

export default function Courier() {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncingAll, setSyncingAll] = useState(false);
  const [busyId, setBusyId] = useState('');
  const [toast, setToast] = useState('');
  const [toastError, setToastError] = useState(false);

  const showToast = useCallback((msg, isError = false) => {
    setToast(msg);
    setToastError(isError);
    setTimeout(() => setToast(''), 3200);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getAdminToken();
      const status = await apiGet(token, '/admin/courier/status');
      setData(status);
    } catch (err) {
      showToast(err.message, true);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    load();
  }, [load]);

  const sendOrder = async (order) => {
    setBusyId(`send-${order._id}`);
    try {
      const token = await getAdminToken();
      const updated = await apiPost(token, `/admin/courier/${order._id}/send`, {});
      showToast(t('admin.courier.sent', {
        number: order.orderNumber,
        id: updated.courier?.consignmentId,
      }));
      await load();
    } catch (err) {
      showToast(err.body?.error || err.message, true);
    } finally {
      setBusyId('');
    }
  };

  const syncOne = async (order) => {
    setBusyId(`sync-${order._id}`);
    try {
      const token = await getAdminToken();
      const result = await apiPost(token, `/admin/courier/${order._id}/sync`, {});
      showToast(t('admin.courier.syncedOne', {
        number: result.orderNumber,
        status: t(`admin.trackingStatus.${result.trackingStatus}`) || result.trackingStatus,
      }));
      await load();
    } catch (err) {
      showToast(err.body?.error || err.message, true);
    } finally {
      setBusyId('');
    }
  };

  const syncAll = async () => {
    setSyncingAll(true);
    try {
      const token = await getAdminToken();
      const result = await apiPost(token, '/admin/courier/sync', {});
      const errMsg = result.errors?.length ? t('admin.courier.failed', { count: result.errors.length }) : '';
      showToast(`${t('admin.courier.syncedAll', { count: result.synced })}${errMsg}`, result.errors?.length > 0);
      await load();
    } catch (err) {
      showToast(err.body?.error || err.message, true);
    } finally {
      setSyncingAll(false);
    }
  };

  const consignments = data?.consignments || [];
  const pending = data?.pending || [];

  const stats = [
    { label: t('admin.courier.statTotal'), value: consignments.length },
    {
      label: t('admin.courier.statOnWay'),
      value: consignments.filter((o) => ['shipped', 'in_progress'].includes(o.courier?.trackingStatus)).length,
    },
    {
      label: t('admin.courier.statAwaiting'),
      value: consignments.filter((o) => ['pending', 'in_review', 'unknown', ''].includes(o.courier?.trackingStatus || '')).length,
    },
    { label: t('admin.courier.statDelivered'), value: consignments.filter((o) => ['delivered', 'partial'].includes(o.courier?.trackingStatus)).length },
    {
      label: t('admin.courier.statReturned'),
      value: consignments.filter((o) => ['returned', 'cancelled'].includes(o.courier?.trackingStatus)).length,
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1>{t('admin.courier.title')}</h1>
          <p className={styles.sub}>
            {data?.configured === false ? t('admin.courier.notConfigured') : t('admin.courier.subtitle')}
          </p>
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.ghostBtn} onClick={load} disabled={loading}>
            {loading ? t('admin.courier.refreshing') : t('admin.courier.refresh')}
          </button>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={syncAll}
            disabled={syncingAll || consignments.length === 0 || data?.configured === false}
          >
            {syncingAll ? t('admin.courier.syncing') : t('admin.courier.syncAll')}
          </button>
        </div>
      </div>

      {toast && <div className={`${styles.toast} ${toastError ? styles.toastError : ''}`}>{toast}</div>}

      {loading && !data ? (
        <div className={styles.panel}>
          <div className={styles.empty}>{t('admin.courier.loading')}</div>
        </div>
      ) : (
        <>
          {data?.balance !== null && data?.balance !== undefined && (
            <div className={styles.panel}>
              <div className={styles.panelHeader}>{t('admin.courier.balance', { amount: formatBDT(data.balance) })}</div>
            </div>
          )}

          <div className={styles.grid}>
            {stats.map((s) => (
              <div className={styles.card} key={s.label}>
                <span className={styles.cardLabel}>{s.label}</span>
                <span className={styles.cardValue}>{s.value}</span>
              </div>
            ))}
          </div>

          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              {t('admin.courier.awaitingTitle', { count: pending.length })}
            </div>
            {pending.length === 0 ? (
              <div className={styles.empty}>{t('admin.courier.noPending')}</div>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>{t('admin.table.order')}</th>
                    <th>{t('admin.table.customer')}</th>
                    <th>{t('admin.courier.delivery')}</th>
                    <th>{t('admin.table.total')}</th>
                    <th>{t('admin.table.status')}</th>
                    <th>{t('admin.courier.action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.map((order) => {
                    const c = order.customer || {};
                    return (
                      <tr key={order._id}>
                        <td className={styles.price}>{order.orderNumber}</td>
                        <td>
                          <strong>{c.name || '—'}</strong>
                          {c.phone && (
                            <div style={{ fontSize: 12, color: 'var(--muted)' }}>{c.phone}</div>
                          )}
                        </td>
                        <td style={{ fontSize: 13, color: 'var(--muted)' }}>
                          {[c.address, c.city].filter(Boolean).join(', ') || '—'}
                        </td>
                        <td className={styles.price}>{formatBDT(order.total)}</td>
                        <td>
                          <span className={`${styles.badge} ${orderBadge(order.status)}`}>{t(`admin.status.${order.status}`)}</span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className={styles.courierBtn}
                            disabled={busyId === `send-${order._id}` || data?.configured === false}
                            onClick={() => sendOrder(order)}
                          >
                            {busyId === `send-${order._id}` ? t('admin.courier.sending') : t('admin.courier.sendToSteadfast')}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          <div className={styles.panel}>
            <div className={styles.panelHeader}>{t('admin.courier.consignments', { count: consignments.length })}</div>
            {consignments.length === 0 ? (
              <div className={styles.empty}>{t('admin.courier.noConsignments')}</div>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>{t('admin.table.order')}</th>
                    <th>{t('admin.table.customer')}</th>
                    <th>{t('admin.courier.consignmentId')}</th>
                    <th>{t('admin.courier.courierStatus')}</th>
                    <th>{t('admin.courier.orderStatus')}</th>
                    <th>{t('admin.table.total')}</th>
                    <th>{t('admin.courier.lastSynced')}</th>
                    <th>{t('admin.courier.action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {consignments.map((order) => {
                    const c = order.customer || {};
                    const ts = order.courier?.trackingStatus || 'unknown';
                    const synced = order.courier?.lastSyncedAt;
                    return (
                      <tr key={order._id}>
                        <td className={styles.price}>{order.orderNumber}</td>
                        <td>
                          <strong>{c.name || '—'}</strong>
                          {c.phone && (
                            <div style={{ fontSize: 12, color: 'var(--muted)' }}>{c.phone}</div>
                          )}
                        </td>
                        <td style={{ fontFamily: 'monospace', fontSize: 13 }}>
                          {order.courier?.consignmentId}
                        </td>
                        <td>
                          <span className={`${styles.badge} ${trackingBadge(ts)}`}>
                            {t(`admin.trackingStatus.${ts}`)}
                          </span>
                        </td>
                        <td>
                          <span className={`${styles.badge} ${orderBadge(order.status)}`}>{t(`admin.status.${order.status}`)}</span>
                        </td>
                        <td className={styles.price}>{formatBDT(order.total)}</td>
                        <td style={{ fontSize: 12.5, color: 'var(--muted)' }}>
                          {synced ? new Date(synced).toLocaleString() : t('admin.courier.never')}
                        </td>
                        <td>
                          <button
                            type="button"
                            className={styles.courierBtn}
                            disabled={busyId === `sync-${order._id}` || data?.configured === false}
                            onClick={() => syncOne(order)}
                          >
                            {busyId === `sync-${order._id}` ? t('admin.courier.syncing') : t('admin.courier.sync')}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
