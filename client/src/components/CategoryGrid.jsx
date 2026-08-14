import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CATEGORIES } from '../constants/categories.js';
import styles from './CategoryGrid.module.css';

function FruitTreeIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <radialGradient id="ic-ft-body" cx="35%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#ff9e93" />
          <stop offset="45%" stopColor="#e5394a" />
          <stop offset="100%" stopColor="#a31226" />
        </radialGradient>
        <linearGradient id="ic-ft-leaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7ac142" />
          <stop offset="100%" stopColor="#2e7d32" />
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="43" rx="13" ry="2.6" fill="#000" opacity="0.12" />
      <path d="M24.6 11c3.4-4 8.2-4.5 12.2-2-1.6 4.6-6.3 6.4-11 4.3z" fill="url(#ic-ft-leaf)" />
      <path d="M24 12.5c1.2-3.6-.2-6.4-3-8.2-.5 3.1.6 5.6 2.7 7.4z" fill="#5da333" />
      <rect x="23.1" y="7" width="1.9" height="7" rx="0.95" fill="#795548" />
      <path d="M24 12.5c-7.5 0-12.5 5-12.5 12.2C11.5 33.5 17 40.5 24 40.5s12.5-7 12.5-15.8c0-7.2-5-12.2-12.5-12.2z" fill="url(#ic-ft-body)" />
      <ellipse cx="18.6" cy="21" rx="3.2" ry="5.2" fill="#fff" opacity="0.32" transform="rotate(-18 18.6 21)" />
    </svg>
  );
}

function NativeFruitIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="ic-nf-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e6ee9c" />
          <stop offset="55%" stopColor="#c0ca33" />
          <stop offset="100%" stopColor="#827717" />
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="43" rx="12" ry="2.6" fill="#000" opacity="0.12" />
      <path d="M15 17c0-4.5 4-7.5 9-7.5s9 3 9 7.5v13c0 5.5-4 8.5-9 8.5s-9-3-9-8.5z" fill="url(#ic-nf-body)" />
      <path d="M18.5 14.5c1-1.5 2.5-2.5 4.5-2.8" stroke="#f9fbe7" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.7" />
      {[
        [18, 20], [24, 18], [30, 20], [20, 26], [26, 24], [31, 27], [22, 32], [28, 31], [24, 38], [17.5, 33], [30, 36],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.5" fill="#6b6111" opacity="0.4" />
      ))}
      <path d="M24 9.5V6.5" stroke="#5b4a1f" strokeWidth="2" strokeLinecap="round" />
      <path d="M24 6.5c2-2 4.5-2.4 6.8-1.2C29.6 7.6 26.8 8.3 24 6.5z" fill="#7ac142" />
    </svg>
  );
}

function ExoticFruitIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <radialGradient id="ic-ef-body" cx="38%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#ff80ab" />
          <stop offset="55%" stopColor="#ec407a" />
          <stop offset="100%" stopColor="#ad1457" />
        </radialGradient>
        <linearGradient id="ic-ef-scale" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#81c784" />
          <stop offset="100%" stopColor="#388e3c" />
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="43" rx="11" ry="2.6" fill="#000" opacity="0.12" />
      <path d="M19 4.5C21 2.8 23 2.3 24.5 2.5c.4 2-.2 3.6-1.5 5z" fill="url(#ic-ef-scale)" />
      <path d="M10.5 11c-.4 2.6.3 4.6 2.3 6.2 1.8-2 2-4.4.6-7z" fill="url(#ic-ef-scale)" />
      <path d="M37.5 11c.4 2.6-.3 4.6-2.3 6.2-1.8-2-2-4.4-.6-7z" fill="url(#ic-ef-scale)" />
      <path d="M13 9.5c1.4-2.4 3.4-3.6 6-3.8.4 2.7-.5 4.9-2.6 6.6z" fill="url(#ic-ef-scale)" />
      <path d="M35 9.5c-1.4-2.4-3.4-3.6-6-3.8-.4 2.7.5 4.9 2.6 6.6z" fill="url(#ic-ef-scale)" />
      <ellipse cx="24" cy="27" rx="13" ry="15" fill="url(#ic-ef-body)" />
      <path d="M15 22c1.5-4 4.5-6.6 8.5-7.4" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.35" />
      {[[17, 30], [21, 34], [27, 31], [30, 25], [22, 25], [19, 22], [26, 21], [31, 33], [24, 39]].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="0.9" fill="#4e0022" opacity="0.55" />
      ))}
    </svg>
  );
}

function AllSeasonFruitIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="ic-as-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff59d" />
          <stop offset="55%" stopColor="#fdd835" />
          <stop offset="100%" stopColor="#f9a825" />
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="43" rx="13" ry="2.6" fill="#000" opacity="0.12" />
      <path d="M24 12c-6.5-1.5-11.5.5-14 5 2-1 3.8-1.2 5.5-.6-2.8 2.2-4.2 5-4.2 8.4 1.7-1.6 3.5-2.5 5.4-2.7-2.6 3.4-3.2 7-1.7 11 1.4-2.4 3.1-4 5.1-4.8-.8 3.8 0 7 2.4 9.7l1.5-1.2c-2.1-2.4-2.7-5.1-1.9-8.2-1.6 1.3-2.7 3.4-3.3 6.2-.8-3.4-.1-6.4 2.2-9-1.9.3-3.6 1.3-5 3 .1-2.8 1.3-5 3.7-6.7-2 .1-3.8.8-5.4 2.1.6-2.6 2.2-4.5 4.8-5.8-1.9-.6-3.7-.4-5.5.6 1.7-3.3 5-5 9.6-5z" fill="url(#ic-as-body)" stroke="#f57f17" strokeWidth="0.8" strokeLinejoin="round" />
      <path d="M24 12c6.5-1.5 11.5.5 14 5-2-1-3.8-1.2-5.5-.6 2.8 2.2 4.2 5 4.2 8.4-1.7-1.6-3.5-2.5-5.4-2.7 2.6 3.4 3.2 7 1.7 11-1.4-2.4-3.1-4-5.1-4.8.8 3.8 0 7-2.4 9.7l-1.5-1.2c2.1-2.4 2.7-5.1 1.9-8.2 1.6 1.3 2.7 3.4 3.3 6.2.8-3.4.1-6.4-2.2-9 1.9.3 3.6 1.3 5 3-.1-2.8-1.3-5-3.7-6.7 2 .1 3.8.8 5.4 2.1-.6-2.6-2.2-4.5-4.8-5.8 1.9-.6 3.7-.4 5.5.6-1.7-3.3-5-5-9.6-5z" fill="url(#ic-as-body)" stroke="#f57f17" strokeWidth="0.8" strokeLinejoin="round" />
      <rect x="23" y="8.5" width="2" height="4.5" rx="1" fill="#795548" />
      <path d="M24 9c2.5-2.6 5.5-3.1 8.5-1.7C30.4 10.2 27 10.9 24 9z" fill="#7ac142" />
    </svg>
  );
}

function FlowerPlantIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <radialGradient id="ic-fl-petal" cx="50%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#ff8a9b" />
          <stop offset="60%" stopColor="#f44352" />
          <stop offset="100%" stopColor="#c62828" />
        </radialGradient>
        <linearGradient id="ic-fl-leaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#66bb6a" />
          <stop offset="100%" stopColor="#2e7d32" />
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="43" rx="11" ry="2.6" fill="#000" opacity="0.12" />
      <path d="M24 26c1.8 4.5 1.2 9-2 13.5-3.2-4.5-3.8-9-2-13.5z" fill="url(#ic-fl-leaf)" />
      <path d="M24 30c-4.5 1-8.5-.5-12-4 4.5-2.5 8.6-2.2 12 .8z" fill="url(#ic-fl-leaf)" />
      <path d="M24 30c4.5 1 8.5-.5 12-4-4.5-2.5-8.6-2.2-12 .8z" fill="url(#ic-fl-leaf)" />
      {[
        'rotate(0 24 17)', 'rotate(72 24 17)', 'rotate(144 24 17)', 'rotate(216 24 17)', 'rotate(288 24 17)',
      ].map((tr) => (
        <ellipse key={tr} cx="24" cy="10.5" rx="5.4" ry="7.6" fill="url(#ic-fl-petal)" transform={tr} />
      ))}
      <circle cx="24" cy="17" r="4" fill="#8e0000" />
      <circle cx="24" cy="17" r="2.2" fill="#ffd54f" />
      <path d="M24 17c1.6 1 2.6 2.4 3 4.2" stroke="#ffd54f" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <circle cx="27.2" cy="21.8" r="1" fill="#ffd54f" />
    </svg>
  );
}

function OrnamentalIcon() {
  const leaf = (x, y, rot, len) => (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={`M0 0C-4 -${len * 0.35} -3.4 -${len * 0.8} 0 -${len}C3.4 -${len * 0.8} 4 -${len * 0.35} 0 0Z`} fill="url(#ic-or-leaf)" />
      <path d={`M0 -2L0 -${len * 0.85}`} stroke="#e8f5e9" strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />
    </g>
  );
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="ic-or-leaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#81c784" />
          <stop offset="100%" stopColor="#1b5e20" />
        </linearGradient>
        <linearGradient id="ic-or-pot" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e58e5a" />
          <stop offset="100%" stopColor="#a3552a" />
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="43" rx="12" ry="2.6" fill="#000" opacity="0.12" />
      {leaf(24, 26, 0, 17)}
      {leaf(18, 26, 38, 15)}
      {leaf(30, 26, -38, 15)}
      {leaf(15, 26, 62, 12)}
      {leaf(33, 26, -62, 12)}
      <path d="M13 26h22l-2.2 14.5a3 3 0 0 1-3 2.5H18.2a3 3 0 0 1-3-2.5z" fill="url(#ic-or-pot)" />
      <path d="M12.4 22.5h23.2a1.6 1.6 0 0 1 0 3.5H12.4a1.6 1.6 0 0 1 0-3.5z" fill="#c0632f" />
      <ellipse cx="24" cy="27.4" rx="11" ry="1.6" fill="#4e342e" opacity="0.55" />
      <path d="M15 29h18l1.2 8H13.8z" fill="#000" opacity="0.08" />
    </svg>
  );
}

function SpicePlantIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="ic-sp-red" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff6b57" />
          <stop offset="60%" stopColor="#e53935" />
          <stop offset="100%" stopColor="#a31515" />
        </linearGradient>
        <linearGradient id="ic-sp-green" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9ccc65" />
          <stop offset="100%" stopColor="#558b2f" />
        </linearGradient>
        <linearGradient id="ic-sp-stem" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8bc34a" />
          <stop offset="100%" stopColor="#33691e" />
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="43" rx="12" ry="2.6" fill="#000" opacity="0.12" />
      <path d="M20 12c-1.5 5-1.8 12-.5 21 .3 1.8 1 3.2 2.2 4.2 1-1.6 1.4-3.4 1.2-5.4C22.6 24.4 22 17.6 20 12z" fill="url(#ic-sp-red)" />
      <path d="M18.6 22.2c-.2 3.4 0 7 .6 10.8.2 1.5.7 2.7 1.5 3.6.6-1.2.8-2.6.6-4.2-.6-3.6-1.5-7-2.7-10.2z" fill="#fff" opacity="0.25" />
      <path d="M20 12c-3-.6-5.4-2-7-4.4 2.9-1 5.4-.6 7.2 1.2z" fill="url(#ic-sp-stem)" />
      <path d="M30 18c-1.2 4-1.4 9.6-.4 16.4.3 1.5.8 2.7 1.7 3.6.9-1.4 1.2-3 1-4.8C31.8 27.4 31.2 22.2 30 18z" fill="url(#ic-sp-green)" />
      <path d="M30 18c-2.4-.5-4.4-1.7-5.7-3.6 2.4-.8 4.4-.5 5.8.9z" fill="url(#ic-sp-stem)" />
    </svg>
  );
}

function MedicinalPlantIcon() {
  const aloeLeaf = (rot, len) => (
    <g transform={`rotate(${rot} 24 30)`}>
      <path d={`M24 30C20.5 ${30 - len * 0.4} 21 ${30 - len * 0.8} 24 ${30 - len}C27 ${30 - len * 0.8} 27.5 ${30 - len * 0.4} 24 30Z`} fill="url(#ic-md-leaf)" stroke="#5b8c3a" strokeWidth="0.7" />
      <path d={`M24 ${30 - len * 0.9}L24 30`} stroke="#c5e1a5" strokeWidth="1.1" strokeLinecap="round" opacity="0.8" />
      {[-3, 3].map((dx) => (
        <path key={dx} d={`M24 ${30 - len * 0.5}c${dx * 0.8} 1.5 ${dx * 0.8} 3.5 0 5`} stroke="#aed581" strokeWidth="0.8" fill="none" opacity="0.7" />
      ))}
    </g>
  );
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="ic-md-leaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#aed581" />
          <stop offset="100%" stopColor="#558b2f" />
        </linearGradient>
        <linearGradient id="ic-md-pot" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e58e5a" />
          <stop offset="100%" stopColor="#a3552a" />
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="43" rx="11" ry="2.6" fill="#000" opacity="0.12" />
      {aloeLeaf(0, 26)}
      {aloeLeaf(22, 22)}
      {aloeLeaf(-22, 22)}
      {aloeLeaf(44, 16)}
      {aloeLeaf(-44, 16)}
      <path d="M14.5 30h19l-1.8 12a2.6 2.6 0 0 1-2.6 2.2h-10.2a2.6 2.6 0 0 1-2.6-2.2z" fill="url(#ic-md-pot)" />
      <path d="M14 27h20a1.5 1.5 0 0 1 0 3H14a1.5 1.5 0 0 1 0-3z" fill="#c0632f" />
    </svg>
  );
}

function TimberTreeIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="ic-tm-bark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8d6e63" />
          <stop offset="100%" stopColor="#4e342e" />
        </linearGradient>
        <radialGradient id="ic-tm-face" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#f3c796" />
          <stop offset="100%" stopColor="#d7a86e" />
        </radialGradient>
      </defs>
      <ellipse cx="24" cy="43" rx="13" ry="2.6" fill="#000" opacity="0.12" />
      <rect x="12" y="16" width="24" height="22" rx="2.5" fill="url(#ic-tm-bark)" />
      <path d="M16 20l2 16M22 19l1 17M29 20l-1 16M34 21l-2 15" stroke="#3e2723" strokeWidth="1.3" strokeLinecap="round" opacity="0.5" />
      <ellipse cx="24" cy="15" rx="12" ry="8.6" fill="url(#ic-tm-bark)" />
      <ellipse cx="24" cy="14.2" rx="10.6" ry="7.6" fill="url(#ic-tm-face)" />
      <ellipse cx="24" cy="14.2" rx="7.6" ry="5.4" fill="none" stroke="#b07b45" strokeWidth="1.1" />
      <ellipse cx="24" cy="14.2" rx="4.9" ry="3.5" fill="none" stroke="#b07b45" strokeWidth="1" />
      <ellipse cx="24" cy="14.2" rx="2.4" ry="1.7" fill="none" stroke="#b07b45" strokeWidth="0.9" />
      <path d="M13 19c1.8 1.4 3.6 2.2 5.6 2.4" stroke="#a1887f" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.7" />
    </svg>
  );
}

function VegetablePlantIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <radialGradient id="ic-vg-body" cx="36%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#ff8a65" />
          <stop offset="45%" stopColor="#e53935" />
          <stop offset="100%" stopColor="#b71c1c" />
        </radialGradient>
        <linearGradient id="ic-vg-calyx" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#81c784" />
          <stop offset="100%" stopColor="#2e7d32" />
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="42.5" rx="12" ry="2.6" fill="#000" opacity="0.12" />
      <circle cx="24" cy="27" r="14" fill="url(#ic-vg-body)" />
      <ellipse cx="18" cy="20.5" rx="3.6" ry="6" fill="#fff" opacity="0.32" transform="rotate(-20 18 20.5)" />
      {[0, 60, 120, 180, 240, 300].map((rot) => (
        <path
          key={rot}
          d="M24 14c1.8-2.2 1.8-4.4 0-6.6-1.8 2.2-1.8 4.4 0 6.6z"
          fill="url(#ic-vg-calyx)"
          transform={`rotate(${rot} 24 14.5)`}
        />
      ))}
      <path d="M24 14.5V7" stroke="#33691e" strokeWidth="2" strokeLinecap="round" />
      <path d="M24 8.5c2.2-2.4 4.8-3 7.6-1.6-2.2 2.5-4.8 3.1-7.6 1.6z" fill="url(#ic-vg-calyx)" />
    </svg>
  );
}

function FertilizerIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="ic-fr-bottle" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#b2dfdb" />
          <stop offset="55%" stopColor="#4db6ac" />
          <stop offset="100%" stopColor="#00796b" />
        </linearGradient>
        <linearGradient id="ic-fr-liquid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#66bb6a" />
          <stop offset="100%" stopColor="#2e7d32" />
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="43" rx="12" ry="2.6" fill="#000" opacity="0.12" />
      <rect x="21.4" y="6" width="5.2" height="6" rx="1.4" fill="#00695c" />
      <path d="M18 12.5c0-1.4 1.1-2.5 2.5-2.5h7c1.4 0 2.5 1.1 2.5 2.5v3.5h-12z" fill="#00897b" />
      <rect x="16" y="16" width="16" height="24" rx="3.5" fill="url(#ic-fr-bottle)" />
      <rect x="18.2" y="24" width="11.6" height="10" rx="2" fill="#e0f2f1" />
      <path d="M24 32.5c-3 0-5-2.2-5-5.2 2.6-1 4.6-.4 5 .8.4-1.2 2.4-1.8 5-.8 0 3-2 5.2-5 5.2z" fill="url(#ic-fr-liquid)" />
      <path d="M24 32.5V26.9" stroke="#1b5e20" strokeWidth="1" strokeLinecap="round" />
      <path d="M33.5 12c2.8-1.6 5.4-1.4 7.8.6l-3.2 3.6c-1.8-.9-3.3-2.3-4.6-4.2z" fill="#90a4ae" />
      <circle cx="42.6" cy="10" r="1.3" fill="#546e7a" />
      <circle cx="44" cy="16" r="1" fill="#81c784" opacity="0.9" />
      <circle cx="41" cy="18.6" r="0.8" fill="#81c784" opacity="0.7" />
      <circle cx="44.6" cy="13" r="0.7" fill="#a5d6a7" opacity="0.8" />
    </svg>
  );
}

function PotsGeoBagsIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="ic-pg-pot" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e58e5a" />
          <stop offset="100%" stopColor="#a3552a" />
        </linearGradient>
        <linearGradient id="ic-pg-bag" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a1887f" />
          <stop offset="100%" stopColor="#5d4037" />
        </linearGradient>
        <linearGradient id="ic-pg-leaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#81c784" />
          <stop offset="100%" stopColor="#2e7d32" />
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="43" rx="15" ry="2.6" fill="#000" opacity="0.12" />
      <path d="M10 22.5h14l-1.6 10.5a2.4 2.4 0 0 1-2.4 2H14a2.4 2.4 0 0 1-2.4-2z" fill="url(#ic-pg-pot)" />
      <path d="M9.6 20h14.8a1.4 1.4 0 0 1 0 2.8H9.6a1.4 1.4 0 0 1 0-2.8z" fill="#c0632f" />
      <path d="M17 20c0-4 .8-6.8 2.4-8.6M17 20c-3.6-.4-6-2.4-7.2-6 3.8-.2 6.3 1.6 7.4 5M17 20c3.6-.4 6-2.4 7.2-6-3.8-.2-6.3 1.6-7.4 5" fill="none" stroke="url(#ic-pg-leaf)" strokeWidth="2" strokeLinecap="round" />
      <path d="M31.5 26.5c-2.6 0-4.5 1.8-4.5 4.4 0 2.8 1.9 5.2 4.5 5.2s4.5-2.4 4.5-5.2c0-2.6-1.9-4.4-4.5-4.4z" fill="url(#ic-pg-leaf)" />
      <path d="M28 30h11l-1.4 9.6a2.4 2.4 0 0 1-2.4 2h-3.4a2.4 2.4 0 0 1-2.4-2z" fill="url(#ic-pg-bag)" />
      <path d="M27.7 27.6h11.6a1.4 1.4 0 0 1 0 2.8H27.7a1.4 1.4 0 0 1 0-2.8z" fill="#795548" />
      {[[30.5, 34], [34, 33], [36.5, 36], [32, 37.5], [35.5, 31.8], [30, 31.5]].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="0.75" fill="#d7ccc8" opacity="0.6" />
      ))}
    </svg>
  );
}

function GardeningToolsIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="ic-gt-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#eceff1" />
          <stop offset="45%" stopColor="#b0bec5" />
          <stop offset="100%" stopColor="#78909c" />
        </linearGradient>
        <linearGradient id="ic-gt-wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0955b" />
          <stop offset="100%" stopColor="#8d4f21" />
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="43" rx="14" ry="2.6" fill="#000" opacity="0.12" />
      <g transform="rotate(-18 24 24)">
        <path d="M22.6 4.5h2.8l1 8.5h-4.8z" fill="url(#ic-gt-metal)" />
        <path d="M21.6 13h4.8c.6 0 1 .5 1 1l-.8 13.5c0 .6-.5 1-1 1h-3.2c-.5 0-1-.4-1-1L20.6 14c0-.5.4-1 1-1z" fill="url(#ic-gt-metal)" />
        <rect x="21" y="28" width="6" height="13" rx="2.4" fill="url(#ic-gt-wood)" />
        <rect x="20.4" y="27" width="7.2" height="2.6" rx="1.3" fill="#5d3a1a" />
        <path d="M22.8 15.2l-.4 11" stroke="#fff" strokeWidth="1.1" strokeLinecap="round" opacity="0.6" />
      </g>
      <g transform="rotate(20 24 24)">
        <path d="M27.5 4.5c1.6 0 2.6 1.4 2.6 3.4l-.4 6.6h-4.4L25 7.9c0-2 1-3.4 2.5-3.4z" fill="url(#ic-gt-metal)" />
        {[24.4, 27.6, 30.8].map((cx) => (
          <rect key={cx} x={cx - 0.9} y="13.5" width="1.8" height="11.5" rx="0.9" fill="url(#ic-gt-metal)" />
        ))}
        <rect x="23.6" y="24" width="8" height="2.4" rx="1.2" fill="#546e7a" />
        <rect x="26" y="26" width="3.4" height="15" rx="2" fill="url(#ic-gt-wood)" />
      </g>
    </svg>
  );
}

function CategoryIcon({ id }) {
  switch (id) {
    case 'fruit':
      return <FruitTreeIcon />;
    case 'native':
      return <NativeFruitIcon />;
    case 'exotic':
      return <ExoticFruitIcon />;
    case 'allseason':
      return <AllSeasonFruitIcon />;
    case 'flower':
      return <FlowerPlantIcon />;
    case 'ornamental':
      return <OrnamentalIcon />;
    case 'spice':
      return <SpicePlantIcon />;
    case 'medicinal':
      return <MedicinalPlantIcon />;
    case 'timber':
      return <TimberTreeIcon />;
    case 'vegetable':
      return <VegetablePlantIcon />;
    case 'fertilizer':
      return <FertilizerIcon />;
    case 'pots':
      return <PotsGeoBagsIcon />;
    case 'tools':
      return <GardeningToolsIcon />;
    default:
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="24" r="18" fill="#81c784" />
        </svg>
      );
  }
}

export default function CategoryGrid() {
  const { t, i18n } = useTranslation();
  const bn = i18n.resolvedLanguage === 'bn';

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2>{t('home.categories.title')}</h2>
        <p>{t('home.categories.subtitle')}</p>
      </div>

      <div className={styles.grid}>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            to={`/shop?category=${cat.slug}`}
            className={styles.card}
            aria-label={bn ? cat.bn : cat.en}
          >
            <span className={styles.icon}>
              <CategoryIcon id={cat.icon} />
            </span>
            <span className={styles.name}>{bn ? cat.bn : cat.en}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
