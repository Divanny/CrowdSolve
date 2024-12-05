
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { useSelector } from 'react-redux';
import es from './es.json';
import en from './en.json';

const resources = {
  en: { translation: en },
  es: { translation: es },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export const useLanguage = () => {
  const language = useSelector((state) => state.language.language);
  i18n.changeLanguage(language);
};

export default i18n;