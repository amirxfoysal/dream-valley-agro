import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './About.module.css';

function LeafGlyph() {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" className={styles.glyph}>
      <defs>
        <radialGradient id="aboutGlow" cx="50%" cy="42%" r="62%">
          <stop offset="0%" stopColor="#7fcf94" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#7fcf94" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="aboutLeaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4cc472" />
          <stop offset="100%" stopColor="#1f8a3f" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="92" r="92" fill="url(#aboutGlow)" />
      <g transform="translate(100 168)">
        <g transform="rotate(-46)"><path d="M0 0 Q14 -30 0 -78 Q-14 -30 0 0 Z" fill="url(#aboutLeaf)" /></g>
        <g transform="rotate(-15)"><path d="M0 0 Q16 -34 0 -88 Q-16 -34 0 0 Z" fill="url(#aboutLeaf)" /></g>
        <g transform="rotate(15)"><path d="M0 0 Q16 -34 0 -88 Q-16 -34 0 0 Z" fill="url(#aboutLeaf)" opacity="0.92" /></g>
        <g transform="rotate(46)"><path d="M0 0 Q14 -30 0 -78 Q-14 -30 0 0 Z" fill="url(#aboutLeaf)" opacity="0.8" /></g>
        <path d="M0 0 L0 -90" stroke="#0f5a26" strokeWidth="2.4" opacity="0.4" />
      </g>
      <path d="M70 168 h60 l-6 26 c-4 7 -44 7 -48 0 z" fill="#cf8e54" />
      <path d="M66 165 a34 7 0 0 0 68 0 v4 a34 7 0 0 1 -68 0 z" fill="#94591f" />
    </svg>
  );
}

function ValueIcon({ id }) {
  if (id === 'leaf') {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 19c0-8 6-13 14-14-1 9-6 14-14 14z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M5 19C7 14 11 11 16 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  if (id === 'drop') {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

export default function About() {
  const { t } = useTranslation();

  const values = [
    { id: 'leaf', title: t('pages.about.v1Title'), body: t('pages.about.v1') },
    { id: 'drop', title: t('pages.about.v2Title'), body: t('pages.about.v2') },
    { id: 'heart', title: t('pages.about.v3Title'), body: t('pages.about.v3') },
  ];
  const stats = [
    { value: t('pages.about.stat1'), label: t('pages.about.stat1Label') },
    { value: t('pages.about.stat2'), label: t('pages.about.stat2Label') },
    { value: t('pages.about.stat3'), label: t('pages.about.stat3Label') },
  ];

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>{t('nav.about')}</span>
        <h1 className={styles.heroTitle}>{t('brand')}</h1>
        <p className={styles.heroSub}>{t('pages.about.subtitle')}</p>
        <div className={styles.heroArt}>
          <LeafGlyph />
        </div>
      </section>

      <section className={styles.story}>
        <div className={styles.storyText}>
          <h2 className={styles.sectionTitle}>{t('pages.about.storyTitle')}</h2>
          <p>{t('pages.about.storyP1')}</p>
          <p>{t('pages.about.storyP2')}</p>
          <h3 className={styles.missionTitle}>{t('pages.about.missionTitle')}</h3>
          <p className={styles.mission}>{t('pages.about.mission')}</p>
        </div>
      </section>

      <section className={styles.stats}>
        {stats.map((s) => (
          <div className={styles.statCard} key={s.label}>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </section>

      <section className={styles.values}>
        <h2 className={styles.sectionTitle}>{t('pages.about.valuesTitle')}</h2>
        <div className={styles.valueGrid}>
          {values.map((v) => (
            <div className={styles.valueCard} key={v.title}>
              <span className={styles.valueIcon}>
                <ValueIcon id={v.id} />
              </span>
              <h3>{v.title}</h3>
              <p>{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <h2>{t('pages.about.ctaTitle')}</h2>
        <p>{t('pages.about.ctaText')}</p>
        <Link to="/shop" className={styles.ctaBtn}>
          {t('pages.about.cta')}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </section>
    </main>
  );
}
