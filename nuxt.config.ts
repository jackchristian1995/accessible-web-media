// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  pages: true,

  modules: ['@nuxtjs/tailwindcss'],

  runtimeConfig: {
    replicateToken: '',
    deepgramKey: '',
    supabaseUrl: '',
    supabaseKey: ''
  }
});