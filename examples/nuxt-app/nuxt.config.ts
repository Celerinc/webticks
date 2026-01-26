// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@webticks/nuxt'],
  runtimeConfig: {
    public: {
      webticks: {
        serverUrl: 'http://localhost:3002/api/track',
        appId: '97069816-8b25-4640-833f-f17259208a42'
      }
    }
  }
})
