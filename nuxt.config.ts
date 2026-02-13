export default defineNuxtConfig({
  compatibilityDate: '2025-05-01',

  modules: ['@nuxt/ui'],

  devtools: {
    enabled: true,
  },

  css: ['~/assets/css/main.css'],

  devServer: {
    host: '0.0.0.0',
    port: 3000,
  },

  vite: {
    server: {
      hmr: {
        protocol: 'ws',
        host: 'localhost',
        port: 3000,
        clientPort: 3000,
      },
      watch: {
        usePolling: true,
        interval: 1000,
      },
    },
  },
})
