import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUserAuth } from '../../context/UserAuthContext.jsx';
import { GoogleIcon } from './Login.jsx';
import styles from './auth.module.css';

export default function Register() {
  const { user, loading, register, loginWithGoogle } = useUserAuth();
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const navigate = useNavigate();

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  const onGoogle = async () => {
    setError('');
    setGoogleSubmitting(true);
    try {
      await loginWithGoogle();
      navigate('/', { replace: true });
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

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError(t('auth.passwordMismatch'));
      return;
    }
    setSubmitting(true);
    try {
      await register({ name, email, password });
      navigate('/', { replace: true });
    } catch (err) {
      const code = err?.code || '';
      if (code === 'auth/invalid-email') setError(t('auth.invalidEmail'));
      else if (code === 'auth/email-already-in-use') setError(t('auth.emailInUse'));
      else if (code === 'auth/weak-password') setError(t('auth.weakPassword'));
      else setError(t('auth.unknownError'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.heading}>
          <h1 className={styles.title}>{t('auth.welcomeRegister')}</h1>
          <p className={styles.subtitle}>{t('auth.subtitleRegister')}</p>
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
            <span>{t('auth.name')}</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
            />
          </label>

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
              autoComplete="new-password"
              required
            />
          </label>

          <label className={styles.field}>
            <span>{t('auth.confirmPassword')}</span>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              required
            />
          </label>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.submit} disabled={submitting}>
            {submitting ? t('auth.createAccount') + '…' : t('auth.createAccount')}
          </button>
        </form>

        <p className={styles.switch}>
          {t('auth.haveAccount')} <Link to="/login">{t('auth.signInLink')}</Link>
        </p>
      </div>
    </div>
  );
}