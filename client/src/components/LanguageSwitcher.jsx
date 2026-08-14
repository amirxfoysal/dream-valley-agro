import { useTranslation } from 'react-i18next';
import { LANG_KEY } from '../i18n/index.js';
import styles from './LanguageSwitcher.module.css';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const isBn = i18n.language?.startsWith('bn');

  const toggle = () => {
    const next = isBn ? 'en' : 'bn';
    i18n.changeLanguage(next);
    localStorage.setItem(LANG_KEY, next);
  };

  return (
    <button
      type="button"
      className={styles.switcher}
      onClick={toggle}
      aria-label="Switch language"
    >
      <span className={styles.track}>
        <span
          className={`${styles.thumb} ${isBn ? styles.thumbBn : ''}`}
        />
        <span className={styles.option}>EN</span>
        <span className={styles.option}>বাংলা</span>
      </span>
    </button>
  );
}