const HttpBackend = require('i18next-http-backend/cjs')

module.exports = {
  i18n: {
    defaultLocale: 'nb-NO',
    locales: ['nb-NO', 'en-US',]
  },
  fallbackLng: {
    'nb-NO': ['nb', 'nn'],
    default: ['nb-NO']
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