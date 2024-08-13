// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4
  },
  compatibilityDate: '2024-04-03',
  modules: ['nuxt-quasar-ui', '@nuxtjs/i18n'],
  i18n: {
    vueI18n: './locales/i18n.config.ts',
    locales: ['en', 'ko']
  },
  devtools: { enabled: true }
});
