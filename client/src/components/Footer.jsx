import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CATEGORIES } from '../constants/categories.js';
import styles from './Footer.module.css';

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

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/shop', label: t('nav.shop') },
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
    { to: '/track', label: t('footer.track') },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandCol}>
          <Link to="/" className={styles.brand}>
            <span className={styles.leafWrap}>
              <LeafIcon />
            </span>
            <span>Dream Valley Agro</span>
          </Link>
          <p className={styles.tagline}>{t('footer.tagline')}</p>
          <div className={styles.socials}>
            <a
              href="https://www.facebook.com/share/1Dpf69Syxa/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className={styles.social}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M14 8.5V7a1.5 1.5 0 0 1 1.5-1.5H17V2.8h-2.3A4.2 4.2 0 0 0 10.5 7v1.5H8V12h2.5v9H14v-9h2.6l.4-3.5H14z"
                  fill="currentColor"
                />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/mahmudulhasan08?igsi=MXh5bHUzemxtMmtvdA=="
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className={styles.social}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
              </svg>
            </a>
            <a
              href="https://youtube.com/@dreamvalleyagro2.00?si=BGz3Snsmp7E6p4ri"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className={styles.social}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="2.5" y="5.5" width="19" height="13" rx="4" stroke="currentColor" strokeWidth="1.8" />
                <path d="M10.5 9.5v5l4.5-2.5-4.5-2.5z" fill="currentColor" />
              </svg>
            </a>
            <a
              href="https://wa.me/message/RGNQODK37ZLJH1"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className={styles.social}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 8.5c-.5 2.5 3.5 6.5 6 6l.5-2-2-.8-.8.9c-1-.4-2.1-1.5-2.5-2.5l.9-.8-.9-2-1.2.2z"
                  fill="currentColor"
                />
              </svg>
            </a>
          </div>
        </div>

        <div className={styles.col}>
          <h4>{t('footer.quickLinks')}</h4>
          <ul>
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className={styles.link}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.col}>
          <h4>{t('home.categories.title')}</h4>
          <ul>
            {CATEGORIES.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link to={`/shop?category=${c.slug}`} className={styles.link}>
                  {t(`shop.categories.${c.slug}`, { defaultValue: c.en })}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.col}>
          <h4>{t('footer.contact')}</h4>
          <ul className={styles.contactList}>
            <li>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M4 5c0-.6.4-1 1-1h3l2 5-2.2 1.6a13 13 0 0 0 5.6 5.6L15 14l5 2v3c0 .6-.4 1-1 1h-1C10.6 20 4 13.4 4 6V5z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
              <a href="tel:+8801731320934" className={styles.link}>
                {t('pages.contact.phone')}
              </a>
            </li>
            <li>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.6" />
                <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <a href="mailto:mahmudulhasan1937@gmail.com" className={styles.link}>
                {t('pages.contact.email')}
              </a>
            </li>
            <li>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" />
              </svg>
              <span>{t('pages.contact.address')}</span>
            </li>
            <li>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <span>{t('pages.contact.hours')}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>
          © {year} Dream Valley Agro. {t('footer.rights')}
        </p>
        <p className={styles.madeWith}>{t('footer.madeWith')}</p>
        <a
          href="https://wa.me/qr/3VT6IKHM4JMLA1"
          target="_blank"
          rel="noreferrer"
          className={styles.dev}
        >
          <span>{t('footer.developedBy')}</span>
          <strong>Amir Foysal</strong>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path
              d="M9 8.5c-.5 2.5 3.5 6.5 6 6l.5-2-2-.8-.8.9c-1-.4-2.1-1.5-2.5-2.5l.9-.8-.9-2-1.2.2z"
              fill="currentColor"
            />
          </svg>
        </a>
      </div>
    </footer>
  );
}
