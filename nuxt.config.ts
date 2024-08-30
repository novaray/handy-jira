// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4
  },
  compatibilityDate: '2024-04-03',
  modules: ['nuxt-quasar-ui', '@nuxtjs/i18n', '@pinia/nuxt'],
  quasar: {
    plugins: ['Notify', 'Loading'],
    config: {
      notify: {
        position: 'top'
      }
    }
  },
  i18n: {
    vueI18n: './locales/i18n.config.ts',
    locales: ['en', 'ko'],
    strategy: 'prefix' // 해당 설정이 없으면 No match found for location 경고가 계속 발생. https://github.com/nuxt-modules/i18n/pull/2894/files
  },
  pinia: {
    storesDirs: ['./app/stores/**']
  },
  css: ['@/assets/scss/main.scss'],
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      r2AccountId: process.env.R2_ACCOUNT_ID,
      r2BucketName: process.env.R2_BUCKET_NAME,
      r2AccessKey: process.env.R2_ACCESS_KEY,
      r2SecretKey: process.env.R2_SECRET_KEY
    }
  }
});
