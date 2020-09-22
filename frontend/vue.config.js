module.exports = {
  pwa: {
    manifestOptions: {
      display: 'fullscreen'
    },
    name: 'FitnessHub',
    themeColor: '#000',
    msTileColor: '#ffffff',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black-translucent',
    iconPaths: {
      favicon32: 'pwa/favicon-32.png',
      favicon16: 'pwa/favicon-16.png',
      appleTouchIcon: 'pwa/splash/manifest-icon-512.jpg',
      maskIcon: 'pwa/maskIcon.svg',
      msTileImage: 'pwa/msTileImage-144.png'
    },
  },
  css: {
    loaderOptions: {
      sass: {
        prependData:
          "@import '@/scss/_variables.scss';\n@import '@/scss/_mixins.scss';"
      }
    }
  }
};
