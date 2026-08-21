import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import UserMenu from './UserMenu.jsx';
import styles from './Navbar.module.css';

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2C9 2 4.5 4 3 8c-1.5 4 .5 10 3 13 1.2 1.4 2.5-1 3.5-3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 2c2.5 0 6 1.5 8 5 1.8 3.2 2 7 .5 10.5C19 20.8 16 21 13 20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M3 8c4 2.5 8.5 4.5 14 4M12 2v9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 4h2l2.4 12.2a1.5 1.5 0 0 0 1.47 1.2h7.86a1.5 1.5 0 0 0 1.46-1.16L20 8H6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="21" r="1.4" fill="currentColor" />
      <circle cx="17" cy="21" r="1.4" fill="currentColor" />
    </svg>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { count } = useCart();
  const { t } = useTranslation();
  const links = [
    { to: '/', label: t('nav.home'), end: true },
    { to: '/shop', label: t('nav.shop'), end: false },
    { to: '/about', label: t('nav.about'), end: false },
    { to: '/contact', label: t('nav.contact'), end: false },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    const q = search.trim();
    navigate(q ? `/shop?search=${encodeURIComponent(q)}` : '/shop');
    setSearch('');
    setSearchOpen(false);
    setOpen(false);
  };

  const renderCart = (variant) => (
    <NavLink
      to="/cart"
      aria-label={t('nav.cart')}
      className={({ isActive }) =>
        `${styles.link} ${styles.cartLink} ${variant} ${isActive ? styles.linkActive : ''}`
      }
      onClick={() => setOpen(false)}
    >
      <CartIcon />
      {count > 0 && <span key={count} className={styles.badge}>{count}</span>}
    </NavLink>
  );

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.brand} onClick={() => setOpen(false)}>
          <span className={styles.leafWrap}>
            <LeafIcon />
          </span>
          <span>Dream Valley Agro</span>
        </Link>

        <form className={styles.searchForm} onSubmit={handleSearch} role="search">
          <span className={styles.searchIcon}>
            <SearchIcon />
          </span>
          <input
            type="search"
            className={styles.searchInput}
            placeholder={t('nav.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label={t('nav.searchPlaceholder')}
          />
        </form>

        <div className={styles.right}>
          <div className={`${styles.links} ${open ? styles.linksOpen : ''}`}>
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.linkActive : ''}`
                }
                onClick={() => setOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}

            <ThemeToggle />
            <LanguageSwitcher />

            {renderCart(styles.cartInline)}

            <UserMenu />
          </div>

          {renderCart(styles.cartFloat)}

          <div className={styles.compactSearch}>
            {searchOpen ? (
              <form className={styles.compactForm} onSubmit={handleSearch} role="search">
                <span className={styles.searchIcon}>
                  <SearchIcon />
                </span>
                <input
                  type="search"
                  autoFocus
                  className={styles.searchInput}
                  placeholder={t('nav.searchPlaceholder')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onBlur={() => {
                    if (!search.trim()) setSearchOpen(false);
                  }}
                  aria-label={t('nav.searchPlaceholder')}
                />
              </form>
            ) : (
              <button
                type="button"
                className={styles.compactButton}
                aria-label={t('nav.searchPlaceholder')}
                onClick={() => setSearchOpen(true)}
              >
                <SearchIcon />
              </button>
            )}
          </div>

          <button
            type="button"
            className={`${styles.toggle} ${open ? styles.toggleOpen : ''}`}
            aria-label={t('toggleMenu')}
            aria-expanded={open}
            onClick={() => setOpen((prev) => !prev)}
          >
            <span className={styles.toggleLine} />
            <span className={styles.toggleLine} />
            <span className={styles.toggleLine} />
          </button>
        </div>
      </nav>
    </header>
  );
}