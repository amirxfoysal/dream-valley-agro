import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';
import LanguageSwitcher from '../LanguageSwitcher.jsx';
import styles from './AdminLayout.module.css';

function DashboardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="7" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function PlantsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2C9 2 4.5 4 3 8c-1.5 4 .5 10 3 13 1.2 1.4 2.5-1 3.5-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 2c2.5 0 6 1.5 8 5 1.8 3.2 2 7 .5 10.5C19 20.8 16 21 13 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 2v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M3 8c4 2.5 8.5 4.5 14 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 4h2l2.4 12.2a1.5 1.5 0 0 0 1.47 1.2h7.86a1.5 1.5 0 0 0 1.46-1.16L20 8H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="21" r="1.4" fill="currentColor" />
      <circle cx="17" cy="21" r="1.4" fill="currentColor" />
    </svg>
  );
}

function TreeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 22V9M12 9l-3.5 4M12 9l3.5 4M12 7c0-1.7-1.3-3-2.6-4.6.6.2 1.8.2 2.6 0 .8.2 2 0 2.6 0C13.3 4 12 5.3 12 7ZM10 15c0-1.7-.9-3-1.8-4.4.5.2 1.4.2 1.8 0M14 16c0-1 .5-1.9 1-2.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 11V4a1 1 0 0 1 1-1h7l10 10-8 8L3 11Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="7.5" cy="7.5" r="1.4" fill="currentColor" />
    </svg>
  );
}

function CustomersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3.5 19c.6-3 3-5 5.5-5s4.9 2 5.5 5M16 5.5a3.2 3.2 0 0 1 0 5M17.5 14c1.4.8 2.6 2.3 3 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2 7h11v9H2zM13 10h4l3 3v3h-7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="6" cy="18" r="1.8" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16.5" cy="18" r="1.8" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

const navItems = [
  { to: '/admin', labelKey: 'admin.nav.dashboard', end: true, Icon: DashboardIcon },
  { to: '/admin/products', labelKey: 'admin.nav.products', end: false, Icon: PlantsIcon },
  { to: '/admin/trees', labelKey: 'admin.nav.trees', end: false, Icon: TreeIcon },
  { to: '/admin/categories', labelKey: 'admin.nav.categories', end: false, Icon: TagIcon },
  { to: '/admin/orders', labelKey: 'admin.nav.orders', end: false, Icon: OrdersIcon },
  { to: '/admin/courier', labelKey: 'admin.nav.courier', end: false, Icon: TruckIcon },
  { to: '/admin/customers', labelKey: 'admin.nav.customers', end: false, Icon: CustomersIcon },
];

export default function AdminLayout() {
  const { admin, logout } = useAdminAuth();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.shell}>
      <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <span className={styles.logo}>DVA</span>
          <div>
            <strong>{t('admin.panel')}</strong>
            <span className={styles.sub}>Dream Valley Agro</span>
          </div>
        </div>

        <nav className={styles.nav}>
          {navItems.map(({ to, labelKey, end, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              <Icon />
              {t(labelKey)}
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.adminInfo}>
            <span className={styles.avatar}>
              {(admin?.name || admin?.email || 'A').charAt(0).toUpperCase()}
            </span>
            <div className={styles.adminMeta}>
              <strong className={styles.adminName}>{admin?.name || 'Admin'}</strong>
              <span className={styles.adminEmail}>{admin?.email}</span>
            </div>
          </div>
          <button type="button" className={styles.logout} onClick={logout}>
            {t('admin.logout')}
          </button>
        </div>
      </aside>

      {open && (
        <button
          type="button"
          className={styles.backdrop}
          onClick={() => setOpen(false)}
          aria-label={t('admin.closeMenu')}
        />
      )}

      <div className={styles.main}>
        <div className={styles.topbar}>
          <button
            type="button"
            className={styles.menuBtn}
            onClick={() => setOpen((prev) => !prev)}
            aria-label={t('admin.toggleSidebar')}
          >
            <span />
            <span />
            <span />
          </button>
          <span className={styles.crumb}>{t('admin.panel')} /</span>
          <div className={styles.topbarActions}>
            <LanguageSwitcher />
          </div>
        </div>
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}