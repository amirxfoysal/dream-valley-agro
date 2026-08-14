import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUserAuth } from '../context/UserAuthContext.jsx';
import styles from './UserMenu.module.css';

const PALETTES = [
  ['#2d8a3e', '#7fbf5f'],
  ['#3a6fd6', '#7fa8e8'],
  ['#a85fd0', '#d39ae8'],
  ['#d68d3a', '#eec07f'],
  ['#d64545', '#ef8f8f'],
  ['#2e9e9e', '#7fdcdc'],
  ['#8a5fd0', '#c0a3ec'],
  ['#c0578a', '#ef9cc4'],
];

const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
};

function PersonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function UserMenu() {
  const { user, logout } = useUserAuth();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const seed = user?.email || user?.name || user?.uid || 'guest';
  const [c1, c2] = PALETTES[hashString(seed) % PALETTES.length];
  const initial = (user?.name || 'U').charAt(0).toUpperCase();
  const hasPhoto = Boolean(user?.photo) && !imgFailed;

  const avatar = (
    <span
      className={styles.avatar}
      style={hasPhoto ? undefined : { background: `linear-gradient(135deg, ${c1}, ${c2})` }}
    >
      {hasPhoto ? (
        <img className={styles.photo} src={user.photo} alt="" onError={() => setImgFailed(true)} />
      ) : (
        initial
      )}
    </span>
  );

  return (
    <div className={styles.wrap} ref={ref}>
      <button
        type="button"
        className={user ? styles.chip : styles.iconBtn}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Account"
      >
        {user ? avatar : <PersonIcon />}
      </button>

      {open && (
        <div className={styles.dropdown}>
          {user ? (
            <>
              <div className={styles.dropHeader}>
                {avatar}
                <strong>{user?.name || t('myAccount')}</strong>
              </div>
              <Link to="/profile" className={styles.item} onClick={() => setOpen(false)}>
                {t('profile.nav')}
              </Link>
              <Link to="/orders" className={styles.item} onClick={() => setOpen(false)}>
                {t('profile.orders')}
              </Link>
              <button
                type="button"
                className={`${styles.item} ${styles.logout}`}
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
              >
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <>
              <div className={styles.dropHeader}>
                <strong>{t('welcomeGuest')}</strong>
                <span> </span>
              </div>
              <Link to="/login" className={styles.item} onClick={() => setOpen(false)}>
                {t('nav.login')}
              </Link>
              <Link to="/register" className={`${styles.item} ${styles.register}`} onClick={() => setOpen(false)}>
                {t('nav.register')}
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}