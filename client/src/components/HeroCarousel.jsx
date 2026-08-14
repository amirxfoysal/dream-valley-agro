import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './HeroCarousel.module.css';

const slides = [
  {
    id: 1,
    tKey: 'banner1',
    plant: 'monstera',
    grad: 'linear-gradient(135deg, #0a3a1c 0%, #1c7a3e 55%, #3aa84d 100%)',
    accent: '#86efac',
    leafA: '#4cc472',
    leafB: '#1f8a3f',
    leafDark: '#0f5a26',
    light: '#a7f3c8',
    soil: '#5a3a22',
    pot: ['#eebd86', '#cf8e54', '#a35f2c'],
    pot2: ['#c8853f', '#94591f'],
  },
  {
    id: 2,
    tKey: 'banner2',
    plant: 'fiddle',
    grad: 'linear-gradient(135deg, #11361f 0%, #2a6e4f 60%, #41a37a 100%)',
    accent: '#b6f0c2',
    leafA: '#62d186',
    leafB: '#2a8f57',
    leafDark: '#16643a',
    light: '#d4f7db',
    soil: '#4a3526',
    pot: ['#f4eee2', '#ddd2bf', '#b7a98f'],
    pot2: ['#cdc1a8', '#9c8e72'],
  },
  {
    id: 3,
    tKey: 'banner3',
    plant: 'herbs',
    grad: 'linear-gradient(135deg, #3a2a12 0%, #7a5427 55%, #bd8a3e 100%)',
    accent: '#f3d488',
    leafA: '#86cf6f',
    leafB: '#4a9a3a',
    leafDark: '#2c6b22',
    light: '#cdeea0',
    soil: '#5a3a22',
    pot: ['#e6a76d', '#c4783e', '#93521f'],
    pot2: ['#b9763f', '#7e4614'],
  },
];

function Lobe({ a, l, w, fill, vein }) {
  return (
    <g transform={`rotate(${a})`}>
      <path
        d={`M0 0 Q${w} ${-l * 0.55} 0 ${-l} Q${-w} ${-l * 0.55} 0 0 Z`}
        fill={fill}
      />
      <path d={`M0 0 L0 ${-l * 0.9}`} stroke={vein} strokeWidth="0.5" opacity="0.4" />
    </g>
  );
}

function MonsteraLeaf({ x, y, rot, scale, pal }) {
  const lobes = [
    { a: -68, l: 32, w: 10 },
    { a: -46, l: 46, w: 12 },
    { a: -23, l: 54, w: 13 },
    { a: 0, l: 56, w: 13 },
    { a: 23, l: 50, w: 12 },
    { a: 46, l: 40, w: 11 },
    { a: 68, l: 28, w: 9 },
  ];
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`}>
      {lobes.map((lb, i) => (
        <Lobe key={i} a={lb.a} l={lb.l} w={lb.w} vein={pal.leafDark} fill={i % 2 ? pal.leafA : pal.leafB} />
      ))}
      <ellipse cx="-3" cy="-30" rx="3.2" ry="6" fill={pal.leafDark} opacity="0.55" transform="rotate(-30 -3 -30)" />
      <ellipse cx="4" cy="-22" rx="2.8" ry="5" fill={pal.leafDark} opacity="0.5" transform="rotate(25 4 -22)" />
      <circle cx="0" cy="0" r="3.4" fill={pal.leafDark} />
    </g>
  );
}

function MonsteraArt({ pal }) {
  const gid = 'mon';
  return (
    <svg className={styles.art} viewBox="0 0 220 220" aria-hidden="true">
      <defs>
        <radialGradient id={`${gid}glow`} cx="50%" cy="38%" r="62%">
          <stop offset="0%" stopColor={pal.accent} stopOpacity="0.5" />
          <stop offset="100%" stopColor={pal.accent} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${gid}pot`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={pal.pot[0]} />
          <stop offset="55%" stopColor={pal.pot[1]} />
          <stop offset="100%" stopColor={pal.pot[2]} />
        </linearGradient>
        <linearGradient id={`${gid}rim`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={pal.pot2[0]} />
          <stop offset="100%" stopColor={pal.pot2[1]} />
        </linearGradient>
      </defs>

      <circle cx="110" cy="92" r="98" fill={`url(#${gid}glow)`} />
      <ellipse cx="110" cy="200" rx="50" ry="9" fill="#000" opacity="0.24" />

      <path d="M110 170 C104 150 101 136 103 120" stroke={pal.leafDark} strokeWidth="3.6" fill="none" strokeLinecap="round" />
      <path d="M110 170 C117 150 121 132 122 116" stroke={pal.leafDark} strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M110 170 C110 150 110 138 110 124" stroke={pal.leafDark} strokeWidth="3.2" fill="none" strokeLinecap="round" />

      <MonsteraLeaf x={110} y={122} rot={0} scale={1} pal={pal} />
      <MonsteraLeaf x={100} y={134} rot={-44} scale={0.74} pal={pal} />
      <MonsteraLeaf x={122} y={132} rot={42} scale={0.7} pal={pal} />

      <path d="M70 168 h80 l-7 40 c-5 9 -61 9 -66 0 z" fill={`url(#${gid}pot)`} />
      <path d="M65 164 a45 9.5 0 0 0 90 0 v5 a45 9.5 0 0 1 -90 0 z" fill={`url(#${gid}rim)`} />
      <ellipse cx="110" cy="164" rx="45" ry="9" fill={pal.soil} />
      <ellipse cx="100" cy="162" rx="14" ry="3" fill="#000" opacity="0.18" />
    </svg>
  );
}

function FiddleLeaf({ x, y, rot, scale, pal }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`}>
      <path
        d="M0 0 C -25 -16 -31 -52 -12 -72 C -5 -78 5 -78 12 -72 C 31 -52 25 -16 0 0 Z"
        fill={pal.leafB}
      />
      <path
        d="M0 0 C -22 -14 -27 -46 -10 -64 C -4 -69 4 -69 10 -64 C 27 -46 22 -14 0 0 Z"
        fill={pal.leafA}
        opacity="0.55"
      />
      <path d="M0 -3 L0 -68" stroke={pal.leafDark} strokeWidth="1" opacity="0.45" />
      <path
        d="M0 -28 L-15 -42 M0 -28 L15 -42 M0 -48 L-12 -58 M0 -48 L12 -58 M0 -60 L-8 -66 M0 -60 L8 -66"
        stroke={pal.leafDark}
        strokeWidth="0.6"
        opacity="0.32"
      />
    </g>
  );
}

function FiddleArt({ pal }) {
  const gid = 'fid';
  return (
    <svg className={styles.art} viewBox="0 0 220 220" aria-hidden="true">
      <defs>
        <radialGradient id={`${gid}glow`} cx="50%" cy="36%" r="64%">
          <stop offset="0%" stopColor={pal.accent} stopOpacity="0.5" />
          <stop offset="100%" stopColor={pal.accent} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${gid}pot`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={pal.pot[0]} />
          <stop offset="55%" stopColor={pal.pot[1]} />
          <stop offset="100%" stopColor={pal.pot[2]} />
        </linearGradient>
        <linearGradient id={`${gid}rim`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={pal.pot2[0]} />
          <stop offset="100%" stopColor={pal.pot2[1]} />
        </linearGradient>
      </defs>

      <circle cx="110" cy="90" r="100" fill={`url(#${gid}glow)`} />
      <ellipse cx="110" cy="202" rx="48" ry="9" fill="#000" opacity="0.24" />

      <path d="M110 162 C 104 132 113 100 110 66" stroke={pal.leafDark} strokeWidth="4.2" fill="none" strokeLinecap="round" />

      <FiddleLeaf x={110} y={62} rot={-8} scale={0.78} pal={pal} />
      <FiddleLeaf x={94} y={92} rot={-58} scale={0.96} pal={pal} />
      <FiddleLeaf x={126} y={108} rot={54} scale={0.92} pal={pal} />
      <FiddleLeaf x={97} y={130} rot={-52} scale={1} pal={pal} />
      <FiddleLeaf x={125} y={146} rot={48} scale={0.84} pal={pal} />

      <path d="M68 160 h84 v42 a42 9.5 0 0 1 -84 0 z" fill={`url(#${gid}pot)`} />
      <ellipse cx="110" cy="160" rx="42" ry="8.5" fill={`url(#${gid}rim)`} />
      <ellipse cx="110" cy="160" rx="42" ry="8.5" fill={pal.soil} opacity="0.85" />
      <ellipse cx="100" cy="158" rx="13" ry="3" fill="#000" opacity="0.16" />
    </svg>
  );
}

function HerbLeaf({ cx, cy, rot, l, pal }) {
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rot})`}>
      <path d={`M0 0 Q${l * 0.4} ${-l * 0.5} 0 ${-l} Q${-l * 0.4} ${-l * 0.5} 0 0 Z`} fill={pal.leafB} />
      <path d={`M0 0 Q${l * 0.32} ${-l * 0.46} 0 ${-l * 0.92} Q${-l * 0.32} ${-l * 0.46} 0 0 Z`} fill={pal.leafA} opacity="0.6" />
      <path d={`M0 0 L0 ${-l * 0.88}`} stroke={pal.leafDark} strokeWidth="0.5" opacity="0.35" />
    </g>
  );
}

function HerbPot({ x, pal }) {
  return (
    <g transform={`translate(${x} 178)`}>
      <path d="M-18 0 h36 l-3 22 c-2 6 -28 6 -30 0 z" fill={pal.pot[1]} />
      <path d="M-20 -3 a18 4.5 0 0 0 40 0 a18 4.5 0 0 1 -40 0 z" fill={pal.pot[2]} />
      <ellipse cx="0" cy="-3" rx="18" ry="4.5" fill={pal.soil} />
      <path
        d="M0 -4 C -2 -22 -4 -38 -6 -54 M0 -4 C 2 -22 4 -38 6 -52 M0 -4 C -8 -18 -14 -30 -16 -40 M0 -4 C 8 -18 13 -28 15 -38"
        stroke={pal.leafDark}
        strokeWidth="0.9"
        fill="none"
        strokeLinecap="round"
      />
      <HerbLeaf cx={-6} cy={-54} rot={-12} l={14} pal={pal} />
      <HerbLeaf cx={6} cy={-52} rot={18} l={15} pal={pal} />
      <HerbLeaf cx={0} cy={-46} rot={0} l={13} pal={pal} />
      <HerbLeaf cx={-16} cy={-40} rot={-48} l={12} pal={pal} />
      <HerbLeaf cx={15} cy={-38} rot={44} l={12} pal={pal} />
      <HerbLeaf cx={-9} cy={-32} rot={-30} l={10} pal={pal} />
      <HerbLeaf cx={9} cy={-30} rot={28} l={10} pal={pal} />
    </g>
  );
}

function HerbsArt({ pal }) {
  const gid = 'her';
  return (
    <svg className={styles.art} viewBox="0 0 220 220" aria-hidden="true">
      <defs>
        <radialGradient id={`${gid}glow`} cx="50%" cy="40%" r="64%">
          <stop offset="0%" stopColor={pal.accent} stopOpacity="0.5" />
          <stop offset="100%" stopColor={pal.accent} stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="110" cy="100" r="100" fill={`url(#${gid}glow)`} />
      <circle cx="150" cy="60" r="34" fill={pal.accent} opacity="0.18" />
      <ellipse cx="110" cy="208" rx="78" ry="8" fill="#000" opacity="0.22" />

      <HerbPot x={70} pal={pal} />
      <HerbPot x={110} pal={pal} />
      <HerbPot x={150} pal={pal} />
    </svg>
  );
}

const PLANTS = {
  monstera: MonsteraArt,
  fiddle: FiddleArt,
  herbs: HerbsArt,
};

function Decor({ slide }) {
  const items = Array.from({ length: 9 }, (_, i) => {
    const left = (i * 37 + 10) % 100;
    const top = (i * 53 + 6) % 84;
    const size = 7 + ((i * 7) % 16);
    const delay = (i * 0.8) % 5;
    const dur = 6 + (i % 5);
    const op = 0.12 + (i % 3) * 0.05;
    return { left, top, size, delay, dur, op, i };
  });
  return (
    <div className={styles.bgDecor} aria-hidden="true">
      <span
        className={styles.orbA}
        style={{ background: `radial-gradient(circle, ${slide.accent}66, transparent 70%)` }}
      />
      <span
        className={styles.orbB}
        style={{ background: `radial-gradient(circle, ${slide.light}55, transparent 70%)` }}
      />
      {items.map((it) => (
        <span
          key={it.i}
          className={styles.speck}
          style={{
            left: `${it.left}%`,
            top: `${it.top}%`,
            width: `${it.size}px`,
            height: `${it.size}px`,
            background: slide.accent,
            opacity: it.op,
            animationDuration: `${it.dur}s`,
            animationDelay: `${it.delay}s`,
          }}
        />
      ))}
      <svg className={styles.leafSilhouette} style={{ left: '-4%', top: '8%', color: slide.leafA }} viewBox="0 0 100 100" fill="none">
        <path
          d="M50 5C25 20 12 45 20 75c1 3 3 6 5 8 5-30 15-55 35-70 5-4-3-11-10-8zM25 83c15 8 40 10 60-3-18 3-40 1-52-6-4-2-9 6-8 9z"
          fill="currentColor"
        />
      </svg>
      <svg className={styles.leafSilhouette} style={{ right: '6%', top: '62%', color: slide.leafB, transform: 'rotate(160deg) scale(0.8)' }} viewBox="0 0 100 100" fill="none">
        <path
          d="M50 5C25 20 12 45 20 75c1 3 3 6 5 8 5-30 15-55 35-70 5-4-3-11-10-8zM25 83c15 8 40 10 60-3-18 3-40 1-52-6-4-2-9 6-8 9z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

function Slide({ slide, t }) {
  const Plant = PLANTS[slide.plant];
  return (
    <div className={styles.slide} style={{ background: slide.grad }}>
      <Decor slide={slide} />
      <div className={styles.slideInner}>
        <div className={styles.copy}>
          <span className={styles.eyebrow} style={{ color: slide.accent }}>
            <span className={styles.eyebrowDot} style={{ background: slide.accent }} />
            {t(`${slide.tKey}.eyebrow`)}
          </span>
          <h1 className={styles.title}>{t(`${slide.tKey}.title`)}</h1>
          <p className={styles.subtitle}>{t(`${slide.tKey}.subtitle`)}</p>
          <Link to="/shop" className={styles.cta}>
            {t(`${slide.tKey}.cta`)}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 12h14m0 0-6-6m6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <div className={styles.badges}>
            <span className={styles.badge}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 2l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 16.9 6.1 20l1.2-6.5L2.5 8.9 9.1 8 12 2z" fill="currentColor" />
              </svg>
              {t('banner.badges.quality')}
            </span>
            <span className={styles.badge}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                <circle cx="7" cy="18" r="1.8" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="17" cy="18" r="1.8" stroke="currentColor" strokeWidth="1.8" />
              </svg>
              {t('banner.badges.delivery')}
            </span>
            <span className={styles.badge}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 21s-8-4.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.5-8 11-8 11z" stroke="currentColor" strokeWidth="1.8" />
              </svg>
              {t('banner.badges.care')}
            </span>
          </div>
        </div>
        <div className={styles.artWrap}>
          <span className={styles.artRing} style={{ borderColor: `${slide.accent}55` }} />
          <span className={styles.artGlow} style={{ background: `radial-gradient(circle, ${slide.accent}40, transparent 70%)` }} />
          <Plant pal={slide} />
        </div>
      </div>
    </div>
  );
}

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef(null);
  const { t } = useTranslation();

  const goTo = (i) => setIndex((i + slides.length) % slides.length);
  const next = () => setIndex((prev) => (prev + 1) % slides.length);
  const prev = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (paused) return;
    timer.current = setTimeout(next, 5000);
    return () => clearTimeout(timer.current);
  }, [index, paused]);

  return (
    <section
      className={styles.carousel}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured plants"
    >
      <div className={styles.viewport} style={{ transform: `translateX(-${index * 100}%)` }}>
        {slides.map((slide) => (
          <div key={slide.id} className={styles.slideWrap}>
            <Slide slide={slide} t={t} />
          </div>
        ))}
      </div>

      <button type="button" className={styles.arrow} style={{ left: 16 }} onClick={prev} aria-label={t('prevSlide')}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button type="button" className={styles.arrow} style={{ right: 16 }} onClick={next} aria-label={t('nextSlide')}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className={styles.dots}>
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
            onClick={() => goTo(i)}
            aria-label={t('goToSlide', { n: i + 1 })}
          />
        ))}
      </div>
    </section>
  );
}
