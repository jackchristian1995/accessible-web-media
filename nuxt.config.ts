// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  pages: true,

  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],

  app: {
    head: {
      title: 'Accessible Web Media',
      meta: [
        { key: 'description', content: 'Your all-in-one web media accessibility platform. Describe images, caption videos and transcribe audio here.' }
      ],
      htmlAttrs: {
        lang: 'en'
      }
    }
  },

  runtimeConfig: {
    replicateToken: '',
    deepgramKey: '',
    supabaseUrl: '',
    supabaseKey: '',
    supabaseServiceKey: ''
  }
});