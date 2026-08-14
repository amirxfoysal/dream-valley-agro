import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import bn from '../locales/bn.json';

export const LANG_KEY = 'dva-lang';
export const SUPPORTED_LANGS = ['en', 'bn'];

export const getInitialLang = () => {
  const saved = localStorage.getItem(LANG_KEY);
  if (saved && SUPPORTED_LANGS.includes(saved)) return saved;
  const browser = (navigator.language || 'en').toLowerCase().split('-')[0];
  return SUPPORTED_LANGS.includes(browser) ? browser : 'en';
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    bn: { translation: bn },
  },
  lng: getInitialLang(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

i18n.on('languageChanged', (lang) => {
  document.documentElement.lang = lang;
  document.title = i18n.t('brand');
});

export default i18n;