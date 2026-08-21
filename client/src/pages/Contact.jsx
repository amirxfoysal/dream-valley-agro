import { useTranslation } from 'react-i18next';
import styles from './Contact.module.css';

function InfoIcon({ id }) {
  if (id === 'phone') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M5 4h3l1.5 5-2 1.5a12 12 0 0 0 6 6l1.5-2 5 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (id === 'email') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (id === 'address') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SocialIcon({ id }) {
  if (id === 'facebook') {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6c-.3-.04-1.3-.13-2.45-.13-2.4 0-4.05 1.47-4.05 4.17v2.33H7.4V13h2.3v8h3.8z" />
      </svg>
    );
  }
  if (id === 'instagram') {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
      </svg>
    );
  }
  if (id === 'youtube') {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26.2 26.2 0 0 0 2 12a26.2 26.2 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26.2 26.2 0 0 0 22 12a26.2 26.2 0 0 0-.4-4.8zM10 15.2V8.8l5.2 3.2-5.2 3.2z" />
      </svg>
    );
  }
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 1.8a8.2 8.2 0 0 1 0 16.4 8.1 8.1 0 0 1-4.2-1.15l-.3-.18-2.95.77.79-2.87-.2-.31A8.2 8.2 0 0 1 12 3.8zm-3.4 4.3c-.2 0-.5.07-.72.3-.25.24-.8.78-.8 1.86 0 1.08.8 2.13.9 2.28.12.15 1.55 2.5 3.8 3.4 1.87.74 2.25.6 2.66.56.4-.04 1.3-.53 1.5-1.05.18-.52.18-.96.13-1.05-.06-.1-.2-.15-.42-.26-.22-.11-1.3-.64-1.5-.71-.2-.08-.35-.11-.5.1-.15.22-.58.73-.71.88-.13.15-.26.17-.48.06-.22-.11-.93-.34-1.77-1.1-.65-.58-1.1-1.3-1.22-1.51-.13-.22-.02-.34.1-.45.1-.1.22-.26.33-.4.11-.13.15-.22.22-.37.08-.15.04-.28-.02-.4-.05-.1-.47-1.18-.66-1.6-.16-.37-.33-.38-.48-.39h-.36z" />
    </svg>
  );
}

const SOCIALS = [
  {
    id: 'facebook',
    url: 'https://www.facebook.com/share/1Dpf69Syxa/',
  },
  {
    id: 'instagram',
    url: 'https://www.instagram.com/mahmudulhasan08?igsi=MXh5bHUzemxtMmtvdA==',
  },
  {
    id: 'youtube',
    url: 'https://youtube.com/@dreamvalleyagro2.00?si=BGz3Snsmp7E6p4ri',
  },
  {
    id: 'whatsapp',
    url: 'https://wa.me/message/RGNQODK37ZLJH1',
  },
];

export default function Contact() {
  const { t } = useTranslation();

  const info = [
    { id: 'phone', label: t('pages.contact.phoneLabel'), value: t('pages.contact.phone') },
    { id: 'email', label: t('pages.contact.emailLabel'), value: t('pages.contact.email') },
    { id: 'address', label: t('pages.contact.addressLabel'), value: t('pages.contact.address') },
    { id: 'hours', label: t('pages.contact.hoursLabel'), value: t('pages.contact.hours') },
  ];

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>{t('nav.contact')}</span>
        <h1 className={styles.title}>{t('pages.contact.subtitle')}</h1>
      </section>

      <div className={styles.layout}>
        <div className={styles.infoCol}>
          {info.map((item) => (
            <div className={styles.infoCard} key={item.id}>
              <span className={styles.infoIcon}>
                <InfoIcon id={item.id} />
              </span>
              <div>
                <span className={styles.infoLabel}>{item.label}</span>
                <span className={styles.infoValue}>{item.value}</span>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.socialPanel}>
          <h2 className={styles.socialTitle}>{t('pages.contact.socialTitle')}</h2>
          <p className={styles.socialText}>{t('pages.contact.socialText')}</p>
          <div className={styles.socialGrid}>
            {SOCIALS.map((social) => (
              <a
                key={social.id}
                href={social.url}
                className={`${styles.socialCard} ${styles[social.id]}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className={styles.socialIcon}>
                  <SocialIcon id={social.id} />
                </span>
                <span className={styles.socialName}>{t(`pages.contact.${social.id}`)}</span>
                <span className={styles.socialHandle}>{t(`pages.contact.${social.id}Handle`)}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
