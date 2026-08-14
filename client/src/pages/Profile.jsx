import { useCallback, useEffect, useState } from 'react';
import { updateEmail, updateProfile } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import { useUserAuth } from '../context/UserAuthContext.jsx';
import { apiGet, apiPut, auth } from '../api/client.js';
import styles from './Profile.module.css';

export default function Profile() {
  const { user } = useUserAuth();
  const { t, i18n } = useTranslation();
  const isBn = i18n.language?.startsWith('bn');

  const isGoogle = user?.providerId === 'google.com';

  const [form, setForm] = useState({ name: '', email: '', phone: '', street: '', city: '', postalCode: '' });
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setError('');
    try {
      const token = await auth.currentUser.getIdToken();
      const profile = await apiGet(token, '/profile');
      setForm({
        name: profile.name || user?.name || '',
        email: profile.email || user?.email || '',
        phone: profile.phone || '',
        street: profile.address?.street || '',
        city: profile.address?.city || '',
        postalCode: profile.address?.postalCode || '',
      });
    } catch (err) {
      setError(err.message);
    }
  }, [user]);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('');
    setSaving(true);
    try {
      const token = await auth.currentUser.getIdToken();

      if (form.name !== user.name) {
        await updateProfile(auth.currentUser, { displayName: form.name });
      }

      if (!isGoogle && form.email !== user.email) {
        await updateEmail(auth.currentUser, form.email).catch((err) => {
          if (err.code === 'auth/requires-recent-login') {
            throw new Error(t('profile.recentLogin'));
          }
          throw err;
        });
      }

      await apiPut(token, '/profile', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: { street: form.street, city: form.city, postalCode: form.postalCode },
      });

      setStatus(t('profile.saved'));
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      const code = err?.code || '';
      if (code === 'auth/email-already-in-use') setError(t('auth.emailInUse'));
      else setError(err.message || t('auth.unknownError'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>{t('profile.title')}</h1>
        <p className={styles.sub}>{t('profile.subtitle')}</p>
      </div>

      <form className={styles.card} onSubmit={onSubmit}>
        <div className={styles.section}>
          <h2>{t('profile.basic')}</h2>
          <div className={styles.grid}>
            <label className={styles.field}>
              <span>{t('auth.name')} *</span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                autoComplete="name"
                required
              />
            </label>
            <label className={styles.field}>
              <span>{t('auth.email')}</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                autoComplete="email"
                disabled={isGoogle}
              />
              {isGoogle && <span className={styles.hint}>{t('profile.emailLocked')}</span>}
            </label>
            <label className={styles.field}>
              <span>{t('profile.phone')}</span>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                placeholder={isBn ? '+৮৮০…' : '+880…'}
                autoComplete="tel"
              />
            </label>
          </div>
        </div>

        <div className={styles.section}>
          <h2>{t('profile.address')}</h2>
          <div className={styles.grid}>
            <label className={`${styles.field} ${styles.full}`}>
              <span>{t('profile.street')}</span>
              <input
                type="text"
                value={form.street}
                onChange={(e) => set('street', e.target.value)}
                autoComplete="street-address"
              />
            </label>
            <label className={styles.field}>
              <span>{t('profile.city')}</span>
              <input
                type="text"
                value={form.city}
                onChange={(e) => set('city', e.target.value)}
                autoComplete="address-level2"
              />
            </label>
            <label className={styles.field}>
              <span>{t('profile.postal')}</span>
              <input
                type="text"
                value={form.postalCode}
                onChange={(e) => set('postalCode', e.target.value)}
                autoComplete="postal-code"
              />
            </label>
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {status && <div className={styles.success}>{status}</div>}

        <div className={styles.actions}>
          <button type="submit" className={styles.save} disabled={saving}>
            {saving ? t('profile.saving') + '…' : t('profile.save')}
          </button>
        </div>
      </form>
    </div>
  );
}