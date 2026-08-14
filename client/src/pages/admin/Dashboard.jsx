import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiGet } from '../../api/client.js';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';
import styles from './admin.module.css';

function formatBDT(n) {
  return `৳${Number(n || 0).toLocaleString('en-IN')}`;
}

function StatCard({ label, value, Icon }) {
  return (
    <div className={styles.card}>
      <span className={styles.cardLabel}>
        <span className={styles.cardIcon}>
          <Icon />
        </span>
        {label}
      </span>
      <span className={styles.cardValue}>{value}</span>
    </div>
  );
}

function RevenueIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2v20M17 6.5C17 4.5 14.8 3 12 3S7 4.5 7 6.5 9 10 12 10s5 1.4 5 3.6-2.2 3.6-5 3.6-5-1.5-5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 4h2l2.4 12.2a1.5 1.5 0 0 0 1.47 1.2h7.86a1.5 1.5 0 0 0 1.46-1.16L20 8H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="21" r="1.4" fill="currentColor" />
      <circle cx="17" cy="21" r="1.4" fill="currentColor" />
    </svg>
  );
}

function PlantsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 8V3M12 8c-4 0-7 3-7 7h4c0 2.2 1.3 4 3 4s3-1.8 3-4h4c0-4-3-7-7-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function Dashboard() {
  const { admin } = useAdminAuth();
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    setError('');
    try {
      const token = localStorage.getItem('dva-admin-token');
      const data = await apiGet(token, '/admin/stats');
      setStats(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const statusFor = (status) => {
    const map = {
      pending: styles.statusPending,
      processing: styles.statusProcessing,
      shipped: styles.statusShipped,
      delivered: styles.statusDelivered,
      cancelled: styles.statusCancelled,
    };
    return map[status] || '';
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1>{t('admin.dashboard.title')}</h1>
          <p className={styles.sub}>{t('admin.dashboard.welcome', { name: admin?.name || admin?.email || '' })}</p>
        </div>
      </div>

      {error && <div className={`${styles.toast} ${styles.toastError}`}>{error}</div>}

      {stats ? (
        <>
          <div className={styles.grid}>
            <StatCard label={t('admin.dashboard.revenue')} value={formatBDT(stats.revenue)} Icon={RevenueIcon} />
            <StatCard label={t('admin.dashboard.totalOrders')} value={stats.orders} Icon={OrdersIcon} />
            <StatCard label={t('admin.dashboard.pendingOrders')} value={stats.pendingOrders} Icon={ClockIcon} />
            <StatCard label={t('admin.dashboard.products')} value={stats.products} Icon={PlantsIcon} />
          </div>

          <div className={styles.panel}>
            <div className={styles.panelHeader}>{t('admin.dashboard.recentOrders')}</div>
            {stats.recentOrders.length === 0 ? (
              <div className={styles.empty}>{t('admin.dashboard.noOrders')}</div>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>{t('admin.table.order')}</th>
                    <th>{t('admin.table.customer')}</th>
                    <th>{t('admin.table.location')}</th>
                    <th>{t('admin.table.total')}</th>
                    <th>{t('admin.table.status')}</th>
                    <th>{t('admin.table.date')}</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order) => {
                    const c = order.customer || {};
                    const locationCityPostal = [c.city, c.postalCode].filter(Boolean).join(', ');
                    return (
                      <tr key={order._id}>
                        <td className={styles.price}>{order.orderNumber}</td>
                        <td>
                          <strong>{c.name || '—'}</strong>
                          {c.phone && (
                            <div style={{ fontSize: 12, color: 'var(--muted)' }}>{c.phone}</div>
                          )}
                          {c.email && (
                            <div style={{ fontSize: 12, color: 'var(--muted)' }}>{c.email}</div>
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
                        <td className={styles.price}>{formatBDT(order.total)}</td>
                        <td>
                          <span className={`${styles.badge} ${statusFor(order.status)}`}>
                            {t(`admin.status.${order.status}`)}
                          </span>
                        </td>
                        <td className="muted">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </>
      ) : (
        <div className={styles.empty}>{t('admin.dashboard.loading')}</div>
      )}
    </div>
  );
}