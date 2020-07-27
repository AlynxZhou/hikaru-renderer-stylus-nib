const path = require('path')
const stylus = require('stylus')
const nib = require('nib')

module.exports = (hikaru) => {
  const stylConfig = hikaru.site['siteConfig']['stylus'] || {}
  hikaru.renderer.register('.styl', '.css', (file) => {
    return new Promise((resolve, reject) => {
      stylus(file['text']).use(nib()).use((style) => {
        style.define('getSiteConfig', (data) => {
          const keys = data['val'].toString().trim().split('.')
          let res = hikaru.site['siteConfig']
          for (const k of keys) {
            if (res[k] == null) {
              return null
            }
            res = res[k]
          }
          return res
        })
      }).use((style) => {
        style.define('getThemeConfig', (data) => {
          const keys = data['val'].toString().trim().split('.')
          let res = hikaru.site['themeConfig']
          for (const k of keys) {
            if (res[k] == null) {
              return null
            }
            res = res[k]
          }
          return res
        })
      }).set('filename', path.join(
        hikaru.site['siteConfig']['themeSrcDir'], file['srcPath']
      )).set('sourcemap', stylConfig['sourcemap'])
      .set('compress', stylConfig['compress'])
      .set('include css', true).render((error, result) => {
        if (error != null) {
          return reject(error)
        }
        file['content'] = result
        return resolve(file)
      })
    })
  })
}
