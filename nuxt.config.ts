// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4
  },
  compatibilityDate: '2024-04-03',
  modules: ['nuxt-quasar-ui', '@nuxtjs/i18n'],
  i18n: {
    vueI18n: './locales/i18n.config.ts',
    locales: ['en', 'ko'],
    strategy: 'prefix' // 해당 설정이 없으면 No match found for location 경고가 계속 발생. https://github.com/nuxt-modules/i18n/pull/2894/files
  },
  devtools: { enabled: true }
});
