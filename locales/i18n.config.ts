import { en } from './langs/en';
import { ko } from './langs/ko';

export default defineI18nConfig(() => ({
  legacy: false,
  globalInjection: true,
  locale: 'ko',
  fallbackLocale: 'ko',
  messages: {
    en,
    ko
  }
}));
