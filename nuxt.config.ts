export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts'
  ],
  //css: ['~/assets/css/main.css'],
  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700, 800, 900]
    }
  },
  app: {
    head: {
      title: 'Howzit - Surf Forecasts That Don\'t Suck',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Real-time surf reports from locals in the water. No ads. No bloat. No BS.' }
      ]
    }
  }
})