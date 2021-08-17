import webpack from 'webpack';

export default {
  server: {
    port: 3000,
    host: '0.0.0.0'
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Vue Storefront',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'crossorigin'
      },
      {
        rel: 'preload',
        href: 'https://fonts.googleapis.com/css?family=Raleway:300,400,400i,500,600,700|Roboto:300,300i,400,400i,500,700&display=swap',
        as: 'style'
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Raleway:300,400,400i,500,600,700|Roboto:300,300i,400,400i,500,700&display=swap',
        media: 'print',
        onload: 'this.media=\'all\'',
        once: true
      }
    ]
  },
  loading: { color: '#fff' },
  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],
  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // to core
    '@nuxt/typescript-build',
    '@nuxtjs/style-resources',
    ['@vue-storefront/nuxt', {
      // @core-development-only-start
      coreDevelopment: true,
      // @core-development-only-end
      useRawSource: {
        dev: [
          '@vue-storefront/<% INTEGRATION %>',
          '@vue-storefront/core'
        ],
        prod: [
          '@vue-storefront/<% INTEGRATION %>',
          '@vue-storefront/core'
        ]
      }
    }],
    // @core-development-only-start
    ['@vue-storefront/nuxt-theme', {
      generate: {
        replace: {
          apiClient: '@vue-storefront/<% INTEGRATION %>-api',
          composables: '@vue-storefront/<% INTEGRATION %>'
        }
      }
    }],
    // @core-development-only-end
    /* project-only-start
    ['@vue-storefront/nuxt-theme'],
    project-only-end */
    ['@vue-storefront/<% INTEGRATION %>/nuxt', {}]
  ],
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    'nuxt-i18n',
    'cookie-universal-nuxt',
    'vue-scrollto/nuxt',
    '@vue-storefront/middleware/nuxt'
  ],
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
    strategy: 'no_prefix',
    vueI18n: {
      fallbackLocale: 'en',
      messages: {
        en: {
          welcome: 'Welcome 1'
        },
        de: {
          welcome: 'Welcome 2'
        }
      }
    }
  },
  styleResources: {
    scss: [require.resolve('@storefront-ui/shared/styles/_helpers.scss', { paths: [process.cwd()] })]
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    babel: {
      plugins: [
        ['@babel/plugin-proposal-private-property-in-object', { loose: true }]
      ]
    },
    transpile: [
      'vee-validate/dist/rules'
    ],
    plugins: [
      new webpack.DefinePlugin({
        'process.VERSION': JSON.stringify({
          // eslint-disable-next-line global-require
          version: require('./package.json').version,
          lastCommit: process.env.LAST_COMMIT || ''
        })
      })
    ],
    extend(config, ctx) {
      // eslint-disable-next-line no-param-reassign
      config.devtool = ctx.isClient ? 'eval-source-map' : 'inline-source-map';

      if (ctx && ctx.isClient) {
        // eslint-disable-next-line no-param-reassign
        config.optimization = {
          ...config.optimization,
          mergeDuplicateChunks: true,
          splitChunks: {
            ...config.optimization.splitChunks,
            chunks: 'all',
            automaticNameDelimiter: '.',
            maxSize: 128_000,
            maxInitialRequests: Number.POSITIVE_INFINITY,
            minSize: 0,
            maxAsyncRequests: 10,
            cacheGroups: {
              vendor: {
                test: /[/\\]node_modules[/\\]/,
                name: (module) => `${module
                  .context
                  .match(/[/\\]node_modules[/\\](.*?)([/\\]|$)/)[1]
                  .replace(/[.@_]/gm, '')}`
              }
            }
          }
        };
      }
    }
  }
};
