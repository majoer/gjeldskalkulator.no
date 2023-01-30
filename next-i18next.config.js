const HttpBackend = require('i18next-http-backend/cjs')
const path = require('path')

module.exports = {
  i18n: {
    defaultLocale: 'nb',
    locales: ['nb', 'en-US',]
  },
  localePath: path.resolve('./public/locales'),
  ...(typeof window !== 'undefined'
    ? {
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },
    }
    : {}),
  use: typeof window !== 'undefined' ? [HttpBackend] : [],
}