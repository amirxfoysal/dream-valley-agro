import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { timeoutFetch, BASE_URL } from '../api/client.js';
import styles from './Track.module.css';

const FALLBACK_IMG =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M12 2C9 2 4.5 4 3 8c-1.5 4 .5 10 3 13 1.2 1.4 2.5-1 3.5-3M12 2c2.5 0 6 1.5 8 5 1.8 3.2 2 7 .5 10.5C19 20.8 16 21 13 20M3 8c4 2.5 8.5 4.5 14 4M12 2v9" stroke="#2d8a3e" stroke-width="1.6" stroke-linecap="round"/></svg>'
  );

const STEP_INDEX = {
  pending: 0,
  in_review: 0,
  unknown: 0,
  in_progress: 1,
  shipped: 2,
  delivered: 3,
  partial: 3,
  returned: -1,
  cancelled: -1,
};

function BoxIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 8l9-5 9 5v8l-9 5-9-5V8z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M3 8l9 5 9-5M12 13v8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export default function Track() {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language?.startsWith('bn');
  const [searchParams, setSearchParams] = useSearchParams();
  const [input, setInput] = useState(searchParams.get('id') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const track = useCallback(
    async (identifier) => {
      const id = String(identifier || '').trim();
      if (!id) return;
      setLoading(true);
      setError('');
      setResult(null);
      try {
        const data = await timeoutFetch(`${BASE_URL}/tracking/${encodeURIComponent(id)}`);
        setResult(data);
      } catch (err) {
        if (err.status === 404) setError(t('track.notFound'));
        else if (err.status === 503) setError(t('track.notConfigured'));
        else setError(err.message || t('track.error'));
      } finally {
        setLoading(false);
      }
    },
    [t]
  );

  useEffect(() => {
    const initial = searchParams.get('id');
    if (initial) track(initial);
  }, [searchParams, track]);

  const onSubmit = (e) => {
    e.preventDefault();
    const id = input.trim();
    if (!id) return;
    setSearchParams({ id });
  };

  const consignment = result?.consignment;
  const history = result?.history;
  const historyItems = history?.items || [];
  const statusKey = result?.source === 'steadfast'
    ? consignment?.status
    : result?.status || 'pending';
  const stepIndex = STEP_INDEX[statusKey] ?? 0;
  const isFailed = stepIndex === -1;

  const steps = [
    { key: 'placed', label: t('track.steps.placed') },
    { key: 'packed', label: t('track.steps.packed') },
    { key: 'shipped', label: t('track.steps.shipped') },
    { key: 'delivered', label: t('track.steps.delivered') },
  ];

  const details = [
    result?.orderNumber && { label: t('track.invoice'), value: result.orderNumber },
    consignment?.consignmentId && {
      label: t('track.consignment'),
      value: consignment.consignmentId,
    },
    consignment && consignment.codAmount > 0 && {
      label: t('track.cod'),
      value: `৳${Number(consignment.codAmount).toLocaleString('en-IN')}`,
    },
    consignment && consignment.receivedAmount > 0 && {
      label: t('track.received'),
      value: `৳${Number(consignment.receivedAmount).toLocaleString('en-IN')}`,
    },
    result?.placedAt && {
      label: t('track.placedAt'),
      value: new Date(result.placedAt).toLocaleDateString(),
    },
  ].filter(Boolean);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.icon}>
          <BoxIcon />
        </span>
        <h1 className={styles.title}>{t('track.title')}</h1>
        <p className={styles.subtitle}>{t('track.subtitle')}</p>
      </section>

      <form className={styles.form} onSubmit={onSubmit}>
        <input
          className={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('track.placeholder')}
          aria-label={t('track.title')}
          maxLength={64}
          required
        />
        <button type="submit" className={styles.button} disabled={loading || !input.trim()}>
          {loading ? t('track.searching') : t('track.button')}
        </button>
      </form>

      {error && <div className={styles.error}>{error}</div>}

      {result && (
        <section className={styles.result}>
          <div className={styles.resultHead}>
            <span className={`${styles.badge} ${isFailed ? styles.badgeFailed : ''}`}>
              {t(`track.status.${statusKey}`, { defaultValue: statusKey })}
            </span>
            <span className={styles.courier}>
              {t('track.courier')}: <strong>{result.courier || t('track.steadfast')}</strong>
            </span>
          </div>

          {result.source === 'order' && !consignment && (
            <p className={styles.note}>{t('track.orderPlaced')}</p>
          )}
          {result.note && <p className={styles.note}>{result.note}</p>}

          {!isFailed && (
            <ol className={styles.steps}>
              {steps.map((step, i) => (
                <li
                  key={step.key}
                  className={`${styles.step} ${i <= stepIndex ? styles.stepDone : ''} ${
                    i === stepIndex ? styles.stepActive : ''
                  }`}
                >
                  <span className={styles.stepDot} />
                  <span className={styles.stepLabel}>{step.label}</span>
                </li>
              ))}
            </ol>
          )}

          {details.length > 0 && (
            <dl className={styles.details}>
              {details.map((d) => (
                <div className={styles.detailRow} key={d.label}>
                  <dt>{d.label}</dt>
                  <dd>{d.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {historyItems.length > 0 && (
            <section className={styles.history}>
              <h2 className={styles.historyTitle}>{t('track.history.title')}</h2>
              <ul className={styles.historyList}>
                {historyItems.map((item, i) => (
                  <li className={styles.historyItem} key={`${item.name}-${i}`}>
                    <img
                      className={styles.historyThumb}
                      src={item.image || FALLBACK_IMG}
                      alt={isBn ? item.nameBn || item.name : item.name}
                      loading="lazy"
                    />
                    <div className={styles.historyInfo}>
                      <span className={styles.historyName}>
                        {isBn ? item.nameBn || item.name : item.name}
                      </span>
                      <span className={styles.historyMeta}>
                        {t('track.history.qty')} {item.quantity} × ৳
                        {Number(item.price).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <strong className={styles.historyLine}>
                      ৳{Number(item.price * item.quantity).toLocaleString('en-IN')}
                    </strong>
                  </li>
                ))}
              </ul>
              <div className={styles.historyTotals}>
                <div className={styles.historyRow}>
                  <span>{t('track.history.subtotal')}</span>
                  <span>৳{Number(history.subtotal).toLocaleString('en-IN')}</span>
                </div>
                <div className={styles.historyRow}>
                  <span>{t('track.history.shipping')}</span>
                  <span>
                    {history.shipping > 0
                      ? `৳${Number(history.shipping).toLocaleString('en-IN')}`
                      : t('pages.cart.free')}
                  </span>
                </div>
                <div className={`${styles.historyRow} ${styles.historyTotal}`}>
                  <span>{t('track.history.total')}</span>
                  <span>৳{Number(history.total).toLocaleString('en-IN')}</span>
                </div>
                <div className={styles.historyRow}>
                  <span>{t('track.history.payment')}</span>
                  <span>
                    {t(`checkout.${history.paymentMethod}`, {
                      defaultValue: history.paymentMethod,
                    })}
                  </span>
                </div>
              </div>
            </section>
          )}

          <p className={styles.poweredBy}>{t('track.poweredBy')}</p>
        </section>
      )}
    </main>
  );
}
