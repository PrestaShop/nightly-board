/* eslint-disable no-param-reassign */
const pkg = require('./package')

module.exports = {
  mode: 'universal',
  env: {
    ga: process.env.QANB_GA || 'UA-XXXXXXXX-X',
    DOMAIN_URL: process.env.QANB_API_DOMAIN || 'http://www.qa.local/'
  },

  /*
   ** Headers of the page
   */
  head: {
    title: 'PrestaShop Nightly Board',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Montserrat|Open+Sans:400,600,700'
      }
    ]
  },

  /**
   * Customize the progress-bar color
   */
  loading: { color: '#fff' },

  /**
   * Global CSS
   */
  css: [],

  /**
   * Plugins to load before mounting the App
   */
  plugins: [{ src: '~plugins/ga.js', mode: 'client' }],

  /**
   * Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/pwa',
    '@nuxtjs/axios',
    '@nuxtjs/vuetify',
    '@nuxtjs/moment',
    'cookie-universal-nuxt',
    [
      'vue-scrollto/nuxt',
      {
        offset: -70
      }
    ],
    [
      '@nuxtjs/fontawesome',
      {
        icons: {
          brands: ['faSafari', 'faChrome', 'faFirefox', 'faEdge'],
          solid: ['faTerminal']
        }
      }
    ],
    'nuxt-healthcheck',
  ],

  vuetify: {
    theme: {
      themes: {
        light: {
          primary: '#011638',
          color: {
            green: '#53D572',
            red: '#F54C3E',
            blue: '#25B9D7',
            skipped: '#442ac6'
          }
        }
      }
    }
  },
  /**
   * Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
   ** Build configuration
   */
  build: {
    styleResources: {
      scss: './assets/scss/config.scss'
    },
    /*
     ** Fix safari infinit reload
     */
    filenames: {
      app: ({ isDev }) => (isDev ? '[name].[hash].js' : '[chunkhash].js'),
      chunk: ({ isDev }) => (isDev ? '[name].[hash].js' : '[chunkhash].js')
    },
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  healthcheck: {
    path: '/healthcheck',
    contentType: 'application/json',
    healthy: () => {
      return JSON.stringify({ build: true })
    }
  }  
}
