require('dotenv').config()

export default {
  ssr: false,

  globalName: 'tennis',
  components: true,

  /*
   ** Headers of the page
   */
  head: {
    title: 'Prostori.plus',
    titleTemplate: '%s | Tennis.plus',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'Tennis.plus',
      },
      { property: 'og:site_name', content: 'Tenis.plus' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      {
        hid: 'og:url',
        property: 'og:url',
        content: 'https://tenis.plus',
      },
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'Tenis.plus',
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: 'Upravljanje teniskim klubom, rezervacije terena, izrada natjecanja, praćenje rezultata...',
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: '/tennis-plus_og.jpg',
      },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '627' },
      { name: 'apple-itunes-app', content: 'app-id=1619337469' },
      {
        httpEquiv: 'Content-Security-Policy',
        content:
          'default-src "self"; ' +
          'content-src https://api.stripe.com https://maps.googleapis.com; ' +
          'frame-src https://js.stripe.com https://hooks.stripe.com tennisplus://app.tenis.plus' +
          'script-src https://js.stripe.com https://maps.googleapis.com',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      {
        hid: 'stripe',
        src: 'https://js.stripe.com/v3/',
      },
    ],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: '~/components/loading.vue',
  /*
   ** Global CSS
   */
  css: ['@/assets/app.scss'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~plugins/vee-laravel', ssr: false },
    { src: '~plugins/vee-validate', ssr: false },
    { src: '~plugins/vue-api-query', ssr: false },
    { src: '~/plugins/axios.js', ssr: false },
    { src: '~plugins/filters', ssr: false },
    { src: '~plugins/vue-chat-scroll', ssr: false },
    { src: '~plugins/vue2-touch-events', ssr: false },
    { src: '~plugins/vuex-persist', ssr: false },
    { src: '~plugins/fontawesome' },
    { src: '~plugins/deeplinks', ssr: false },
    { src: '~plugins/currency', ssr: false },
    { src: '~plugins/lang', ssr: false },
    { src: '~plugins/tinymce', ssr: false },
    { src: '~plugins/user' },
    { src: '~/plugins/vue2-google-maps', ssr: true },
    // { src: '~plugins/vue-apexcharts', ssr: false },
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxtjs/eslint-module',
    [
      '@nuxtjs/laravel-echo',
      {
        broadcaster: 'pusher',
        httpHost: process.env.PUSHER_HOST,
        wsHost: process.env.PUSHER_HOST,
        wsPort: process.env.PUSHER_PORT,
        wssPort: process.env.PUSHER_PORT,
        key: process.env.PUSHER_KEY,
        authEndpoint: 'https://' + process.env.API_HOST + '/broadcasting/auth',
        disableStats: true,
        authModule: true,
        connectOnLogin: true,
        disconnectOnLogout: true,
        plugins: ['~/plugins/echo.js'],
      },
    ],
    '@nuxtjs/style-resources',
  ],
  styleResources: {
    scss: ['./assets/_colors.scss', '~bulma/sass/utilities/_all', '~bulma', '~buefy/src/scss/buefy'],
  },
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    [
      '@nuxtjs/moment',
      {
        ignoreInvalidLocales: true,
        defaultLocale: 'hr',
        locales: ['sl', 'hr', 'en-gb', 'fr', 'de', 'pt', 'es', 'it', 'sr', 'mk', 'cs', 'el', 'pt-br'],
      },
    ],
    [
      'nuxt-buefy',
      {
        css: false,
        defaultIconPack: 'fal',
        defaultIconComponent: 'font-awesome-icon',
        materialDesignIcons: false,
      },
    ],
    [
      'nuxt-i18n',
      {
        locales: [
          {
            code: 'en',
            file: 'en-US.json',
          },
          {
            code: 'sl',
            file: 'sl-SI.json',
          },
          {
            code: 'sr',
            file: 'sr-Latn.json',
          },
          {
            code: 'mk',
            file: 'mk-MK.json',
          },
          {
            code: 'it',
            file: 'it-IT.json',
          },
          {
            code: 'es',
            file: 'es-ES.json',
          },
          {
            code: 'de',
            file: 'de-DE.json',
          },
          {
            code: 'pt',
            file: 'pt-BR.json',
          },
          {
            code: 'fr',
            file: 'fr-FR.json',
          },
          {
            code: 'cs-CZ',
            file: 'cs-CZ.json',
          },
          {
            code: 'el',
            file: 'el-GR.json',
          },
          {
            code: 'pt-BR',
            file: 'pt-BR.json',
          },
          {
            code: 'hr',
            file: 'hr-HR.json',
          },
        ],
        defaultLocale: 'hr',
        lazy: false,
        langDir: 'lang/',
        detectBrowserLanguage: false,
      },
    ],
    ['@nuxtjs/pwa', { onesignal: false }],
    '@nuxtjs/firebase',
  ],
  pwa: {
    manifest: {
      name: 'Tenis.plus',
      short_name: 'Tenis.plus',
      lang: 'hr',
      description: 'Upravljanje teniskim klubom, rezervacije terena, izrada natjecanja, praćenje rezultata...',
    },
    meta: {
      name: 'Tennis.plus',
      description: 'Upravljanje teniskim klubom, rezervacije terena, izrada natjecanja, praćenje rezultata...',
      lang: 'hr',
      ogHost: 'tenis.plus',
      nativeUI: true,
    },
    workbox: false,
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    https: process.env.API_PORT === '443',
  },

  auth: {
    redirect: false,
    strategies: {
      password_grant: {
        _scheme: '~/auth/schemes/PassportScheme.js',
        client_id: process.env.PASSPORT_ID,
        client_secret: process.env.PASSPORT_SECRET,
        endpoints: {
          login: {
            url: '/oauth/token',
            method: 'post',
            propertyName: 'access_token',
          },
          logout: false,
          user: {
            url: 'v2/me',
            method: 'get',
            propertyName: 'user',
          },
        },
      },
    },
    plugins: ['~/plugins/auth.js'],
    cookie: {
      options: {
        domain: '.inspirium.hr',
        expires: 365,
      },
    },
  },

  firebase: {
    config: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID,
    },
    services: {
      messaging: {
        createServiceWorker: false,
        fcmPublicVapidKey: process.env.FIREBASE_VAPID,
        actions: [
          {
            action: 'open',
            url: 'https://cmrok.tenis.plus',
          },
        ],
      },
      analytics: {
        collectionEnabled: true,
      },
    },
  },

  router: {
    middleware: [],
  },

  env: {
    api_host: process.env.API_HOST,
  },
  /*
   ** Build configuration
   */
  build: {
    // Add exception
    transpile: ['vee-validate/dist/rules', /^vue2-google-maps($|\/)/],
    // quiet: true,
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
  },
}
