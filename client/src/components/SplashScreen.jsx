import { useTranslation } from 'react-i18next';
import styles from './SplashScreen.module.css';

export default function SplashScreen() {
  const { t } = useTranslation();

  return (
    <div className={styles.overlay} role="status" aria-live="polite">
      <div className={styles.inner}>
        <div className={styles.logo}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
        </div>
        <span className={styles.brand}>{t('brand')}</span>
        <div className={styles.bar}>
          <span className={styles.barFill} />
        </div>
        <span className={styles.hint}>{t('common.loadingSite')}</span>
      </div>
    </div>
  );
}
