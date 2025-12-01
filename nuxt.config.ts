export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@nuxtjs/supabase',
    '@nuxtjs/sitemap',

  ],

  supabase: {
    redirect: false
  },
  // nuxt.config.ts
  sitemap: {
    hostname: 'https://hwztsurf.com',
    gzip: true,
    sources: ['/api/__sitemap__/urls']
  },


  //css: ['~/assets/css/main.css'],
  googleFonts: {
    families: {
      // Display font - Condensed headlines
      'Bebas Neue': true,
      // Body font - Clean geometric
      'DM Sans': [400, 500, 600, 700],
      // Mono for data display
      'JetBrains Mono': [400, 500, 600],
    },
    display: 'swap',
    preload: true,
  },
  components: {
    dirs: [
      {
        path: '~/components',
        pathPrefix: false,
        extensions: ['vue']
      }


    ]
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