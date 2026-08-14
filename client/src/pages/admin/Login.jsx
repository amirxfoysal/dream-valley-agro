import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';
import styles from './Login.module.css';

export default function Login() {
  const { login, error, setError } = useAdminAuth();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(location.state?.from || '/admin', { replace: true });
    } catch (err) {
      const status = err?.status;
      const body = err?.body;
      if (status) {
        if (status === 502) {
          setError(t('admin.login.errorServer'));
        } else if (body?.error === 'Forbidden: not an admin') {
          setError(t('admin.login.errorNotAdmin'));
        } else {
          setError(t('admin.login.apiError', { status, message: body?.error || err.message }));
        }
        return;
      }
      const code = err?.code || '';
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError(t('admin.login.errorInvalid'));
      } else if (code === 'auth/invalid-email') {
        setError(t('admin.login.errorEmail'));
      } else {
        setError(err?.message || t('admin.login.errorGeneric'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <span className={styles.logo}>DVA</span>
          <div>
            <strong className={styles.title}>{t('admin.panel')}</strong>
            <span className={styles.sub}>Dream Valley Agro</span>
          </div>
        </div>

        <form className={styles.form} onSubmit={onSubmit}>
          <label className={styles.field}>
            <span>{t('admin.login.email')}</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@dreamvalleyagro.com"
              autoComplete="email"
              required
            />
          </label>

          <label className={styles.field}>
            <span>{t('admin.login.password')}</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </label>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.submit} disabled={submitting}>
            {submitting ? t('admin.login.signingIn') : t('admin.login.signIn')}
          </button>
        </form>

        <Link to="/" className={styles.back}>
          {t('admin.login.backToSite')}
        </Link>
      </div>
    </div>
  );
}