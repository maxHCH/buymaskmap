module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/buymaskmap/'
    : '/',
  pwa: {
    name: '口罩地圖APP',
    themeColor: '#4DBA87',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    iconPaths: {
      favicon32: 'img/icons/mask.png',
      favicon16: 'img/icons/mask.png',
      appleTouchIcon: 'img/icons/mask.png',
      maskIcon: 'img/icons/mask.png',
      msTileImage: 'img/icons/mask.png'
    },
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
      importWorkboxFrom: 'local',
      importsDirectory: 'js',
      navigateFallback: '/',
      navigateFallbackBlacklist: [/\/api\//]
    }
  }  
}