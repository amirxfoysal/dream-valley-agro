import { useState } from 'react';
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

export default function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const to = t('pages.contact.email');
    const subject = encodeURIComponent(form.subject || t('pages.contact.subject'));
    const body = encodeURIComponent(
      `${form.message}\n\n— ${form.name} (${form.email})`
    );
    setSent(true);
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  };

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

        <form className={styles.form} onSubmit={handleSubmit}>
          <h2 className={styles.formTitle}>{t('pages.contact.formTitle')}</h2>

          <label className={styles.field}>
            <span>{t('pages.contact.name')}</span>
            <input value={form.name} onChange={set('name')} required />
          </label>
          <label className={styles.field}>
            <span>{t('pages.contact.emailField')}</span>
            <input type="email" value={form.email} onChange={set('email')} required />
          </label>
          <label className={styles.field}>
            <span>{t('pages.contact.subject')}</span>
            <input value={form.subject} onChange={set('subject')} />
          </label>
          <label className={styles.field}>
            <span>{t('pages.contact.message')}</span>
            <textarea rows={5} value={form.message} onChange={set('message')} required />
          </label>

          <button type="submit" className={styles.submit} disabled={sent}>
            {sent ? t('pages.contact.sent') : t('pages.contact.send')}
          </button>
        </form>
      </div>
    </main>
  );
}
