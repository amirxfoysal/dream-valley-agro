import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUserAuth } from '../../context/UserAuthContext.jsx';
import styles from './auth.module.css';

export function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.4 12.2c0-.8-.1-1.5-.2-2.2H12v4.4h5.8c-.3 1.3-1.1 2.5-2.3 3.2v2.7h3.7c2.2-2 3.2-4.9 3.2-8.1z" />
      <path fill="#34A853" d="M12 23c2.9 0 5.4-1 7.2-2.7l-3.7-2.7c-1 .7-2.3 1.1-3.5 1.1-2.7 0-5-1.8-5.9-4.3H2.3v2.8C4 20.8 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M6.1 14.4c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9V7.8H2.3C1.5 9.1 1 10.6 1 12s.5 2.9 1.3 4.2l3.8-1.8z" />
      <path fill="#EA4335" d="M12 5.4c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.4 2.3 14.9 1.2 12 1.2 7.7 1.2 4 3.4 2.3 7.8l3.8 2.8C7 8.2 9.3 5.4 12 5.4z" />
    </svg>
  );
}

export default function Login() {
  const { user, loading, login, loginWithGoogle } = useUserAuth();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (!loading && user) {
    return <Navigate to={location.state?.from || '/'} replace />;
  }

  const redirect = () => navigate(location.state?.from || '/', { replace: true });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login({ email, password });
      redirect();
    } catch (err) {
      const code = err?.code || '';
      if (code === 'auth/invalid-email') setError(t('auth.invalidEmail'));
      else if (['auth/user-not-found', 'auth/wrong-password', 'auth/invalid-credential'].includes(code)) {
        setError(t('auth.wrongCredentials'));
      } else {
        setError(t('auth.unknownError'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const onGoogle = async () => {
    setError('');
    setGoogleSubmitting(true);
    try {
      await loginWithGoogle();
      redirect();
    } catch (err) {
      const code = err?.code || '';
      if (['auth/popup-closed-by-user', 'auth/cancelled-popup-request'].includes(code)) {
        setError('');
      } else if (code === 'auth/popup-blocked') {
        setError(t('auth.popupBlocked'));
      } else if (code === 'auth/unauthorized-domain') {
        setError(t('auth.unauthorizedDomain'));
      } else {
        setError(t('auth.unknownError'));
      }
    } finally {
      setGoogleSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.heading}>
          <h1 className={styles.title}>{t('auth.welcome')}</h1>
          <p className={styles.subtitle}>{t('auth.subtitleLogin')}</p>
        </div>

        <button
          type="button"
          className={styles.googleBtn}
          onClick={onGoogle}
          disabled={googleSubmitting}
        >
          <GoogleIcon />
          {googleSubmitting ? t('auth.signingIn') + '…' : t('auth.continueGoogle')}
        </button>

        <div className={styles.orDivider}>{t('auth.or')}</div>

        <form className={styles.form} onSubmit={onSubmit}>
          <label className={styles.field}>
            <span>{t('auth.email')}</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label className={styles.field}>
            <span>{t('auth.password')}</span>
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
            {submitting ? t('auth.signIn') + '…' : t('auth.signIn')}
          </button>
        </form>

        <p className={styles.switch}>
          {t('auth.noAccount')} <Link to="/register">{t('auth.signUpLink')}</Link>
        </p>
      </div>
    </div>
  );
}