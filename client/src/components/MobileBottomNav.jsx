import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext.jsx';
import styles from './MobileBottomNav.module.css';

function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 10.5 12 3l9 7.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 9.5V21h5v-6h4v6h5V9.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CategoryIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="7.5" height="7.5" rx="2" stroke="currentColor" strokeWidth="1.9" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" stroke="currentColor" strokeWidth="1.9" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" stroke="currentColor" strokeWidth="1.9" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" stroke="currentColor" strokeWidth="1.9" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 4h2l2.4 12.2a1.5 1.5 0 0 0 1.47 1.2h7.86a1.5 1.5 0 0 0 1.46-1.16L20 8H6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="21" r="1.4" fill="currentColor" />
      <circle cx="17" cy="21" r="1.4" fill="currentColor" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.9" />
      <path d="M4.5 20c.8-3.4 3.9-5.5 7.5-5.5s6.7 2.1 7.5 5.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

const items = [
  { to: '/', labelKey: 'nav.home', Icon: HomeIcon, end: true },
  { to: '/shop', labelKey: 'mobileNav.category', Icon: CategoryIcon },
  { to: '/cart', labelKey: 'nav.cart', Icon: CartIcon, badge: true },
  { to: '/profile', labelKey: 'mobileNav.profile', Icon: ProfileIcon },
];

export default function MobileBottomNav() {
  const { t } = useTranslation();
  const { count } = useCart();

  return (
    <nav className={styles.bottomNav} aria-label={t('mobileNav.ariaLabel')}>
      {items.map(({ to, labelKey, Icon, end, badge }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) => `${styles.tab} ${isActive ? styles.tabActive : ''}`}
        >
          <span className={styles.iconWrap}>
            <Icon />
            {badge && count > 0 && <span className={styles.badge}>{count > 99 ? '99+' : count}</span>}
          </span>
          <span className={styles.label}>{t(labelKey)}</span>
        </NavLink>
      ))}
    </nav>
  );
}
