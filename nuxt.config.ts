// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  pages: true,

  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', 'nuxt-gtag'],

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

  gtag: {
    id: 'G-JJMBDHZK6R',
    initCommands: [
      // Setup up consent mode
      ['consent', 'default', {
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        ad_storage: 'denied',
        analytics_storage: 'denied',
        wait_for_update: 500,
      }]
    ]
  },

  runtimeConfig: {
    replicateToken: '',
    deepgramKey: '',
    supabaseUrl: '',
    supabaseKey: '',
    supabaseServiceKey: ''
  }
});