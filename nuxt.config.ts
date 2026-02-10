export default defineNuxtConfig({
  compatibilityDate: '2025-05-01',

  modules: ['@nuxt/ui'],

  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  devServer: {
    host: '0.0.0.0',
    port: 3000,
  },

  vite: {
    server: {
      hmr: {
        port: 24678,
        clientPort: 24678,
      },
      watch: {
        usePolling: true,
      },
    },
  },
})
