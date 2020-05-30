const path = require('path')

export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [
    // {
    //   src: '.scss',
    //   lang: 'scss'
    // }
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~plugins/iconfont.js', ssr:false},
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    ['@nuxt/typescript-build', {
      typeCheck: true,
      ignoreNotFoundWarnings: true
    }]
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    [
      '@nuxtjs/component-cache',
      {
        max: 10000,
        maxAge: 1000 * 60 * 60
      },
      '@nuxtjs/axios',
      '@nuxtjs/proxy',
      'nuxt-svg-loader',
      '@nuxtjs/style-resources'
    ]
  ],

  styleResources: {
    scss: [
      '~assets/style/_var.scss',
      '~assets/style/_mixins.scss',
    ]
  },
  axios: {
    proxy: true
  },

  proxy: {
    '/api': {
      target: '',
      pathRewrite: {
        '^/api': '/'
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, {isDev, isClient}) {
      if (isDev && isClient) {
        config.module.rules.push( 
          {
            test: /\.ts$/,
            exclude: [/node_modules/, /vendor/, /\.nuxt/],
            loader: 'ts-loader',
            options: {
              appendTsSuffixTo: [/\.vue$/],
              transpileOnly: true
            }
          },
          {
            enforce: 'pre',
            test: /\.(js|vue)$/,
            loader: 'eslint-loader',
            exclude: /(node_modules)|(\.svg$)/
          }  
        );
      }

      if(isClient) { // web workers are only availabel client-side
        config.module.rules.push({
          test: /\.worker\.js&/,
          loader: 'worker-loader',
          exclude: /(node_modules)/
        });
      }

    },
    node: {
      fs: 'empty'
    },
  },
  router: {
    base: '/nuxt-ts'
  },
  // generate: {
  //   dir: 'docs',
  //   subFolders: false
  // }
}
