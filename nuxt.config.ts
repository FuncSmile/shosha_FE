// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/icon',
    '@vee-validate/nuxt',
  ],

  // Pinia configuration
  pinia: {
    storesDirs: ['stores/**'],
  },

  // VeeValidate configuration
  veeValidate: {
    autoImports: true,
    componentNames: {
      Form: 'VeeForm',
      Field: 'VeeField',
      FieldArray: 'VeeFieldArray',
      ErrorMessage: 'VeeErrorMessage',
    },
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001/api',
    },
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'ShoshaMart - Internal Marketplace',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'ShoshaMart Internal Marketplace Platform' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  typescript: {
    strict: true,
    typeCheck: true,
  },

  nitro: {
    preset: 'cloudflare-pages',
    routeRules: {
      '/api/**': { cors: true },
    },
  },

  // Cloudflare Pages configuration
  experimental: {
    payloadExtraction: false, // Disable payload extraction for Cloudflare
  },

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
})
