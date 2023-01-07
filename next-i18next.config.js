const HttpBackend = require('i18next-http-backend/cjs')

module.exports = {
  i18n: {
    defaultLocale: 'en-US',
    locales: ['en-US'],
  },
  ...(typeof window !== 'undefined'
    ? {
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },
    }
    : {}),
  use: typeof window !== 'undefined' ? [HttpBackend] : [],
}