// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // temporary set to `false` so that image generation doesn't show devtools
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@vueuse/nuxt', 'shadcn-nuxt', '@nuxtjs/google-fonts', 'nuxt-auth-utils'],
  shadcn: {
    prefix: 'Ui',
  },
  runtimeConfig: {
    browserlessApiKey: '',
    github: {
      clientId: '',
      clientSecret: '',
    },
    session: {
      name: 'nuxt-session',
      password: '',
    },
  },
  hooks: {
    'vite:extendConfig': (config, { isClient }) => {
      if (isClient)
      // @ts-expect-error it has alias of vue
        config.resolve.alias.vue = 'vue/dist/vue.esm-bundler.js'
    },
  },
  nitro: {
    vercel: {
      functions: {
        maxDuration: 300, // 5mins maximum possible for Vercel Pro
      },
    },
  },
  googleFonts: {
    families: {
      Inter: '400..800',
    },
  },
  routeRules: {
    '/api/image/**': { cache: { maxAge: 31536000 } },
  },
})
