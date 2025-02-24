// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  pages: true,

  nitro: {
    headers: {
      'cross-origin-embedder-policy': 'require-corp',
      'cross-origin-opener-policy': 'same-origin',
      'cross-origin-resource-policy': 'cross-origin'
    }
  },

  modules: ['@nuxtjs/tailwindcss'],

  runtimeConfig: {
    replicateToken: '',
    deepgramKey: '',
    supabaseUrl: '',
    supabaseKey: ''
  }
});