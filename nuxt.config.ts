// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/color-mode'
  ],

  app: {
    head: {
      title: 'Degen4Life DEX',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Degen4Life - The Ultimate Decentralized Exchange for Degens' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { 
          rel: 'stylesheet', 
          href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap'
        }
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      chainId: process.env.CHAIN_ID || '1',
      rpcUrl: process.env.RPC_URL || 'http://localhost:8545',
      factoryAddress: process.env.FACTORY_ADDRESS,
      memeDexFactoryAddress: process.env.MEME_DEX_FACTORY_ADDRESS,
      hydraAddress: process.env.HYDRA_ADDRESS,
      autoConnect: process.env.AUTO_CONNECT === 'true'
    }
  },

  tailwindcss: {
    configPath: '~/tailwind.config.js',
    cssPath: '~/assets/css/main.css',
    exposeConfig: true
  },

  colorMode: {
    preference: 'system',
    fallback: 'dark',
    classSuffix: ''
  },

  compatibilityDate: '2025-01-22'
})