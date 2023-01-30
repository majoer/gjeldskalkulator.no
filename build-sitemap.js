const { SitemapStream, streamToPromise } = require('sitemap')
const { Readable } = require('stream')
const fs = require('fs')

const extraLanguages = ['en-US']
const links = [
  { url: '/', changefreq: 'daily', priority: 1 },
  { url: '/kalkulator/', changefreq: 'daily', priority: 1 },
  { url: '/guide/bil/', changefreq: 'daily', priority: 0.7 },
  { url: '/guide/bolig/', changefreq: 'daily', priority: 0.7 },
  { url: '/guide/budsjett/', changefreq: 'daily', priority: 0.7 },
  { url: '/guide/kreditt/', changefreq: 'daily', priority: 0.7 },
  { url: '/guide/refinansiering/', changefreq: 'daily', priority: 0.7 },
  { url: '/kontakt-oss/', changefreq: 'daily', priority: 0 },
  { url: '/takk-til/', changefreq: 'daily', priority: 0 },
  // { url: '/guide', changefreq: 'daily', priority: 1 },
  // { url: '/guide/dnb', changefreq: 'daily', priority: 1 },
  // { url: '/guide/dnb/hent-budsjett', changefreq: 'daily', priority: 1 },
  // { url: '/guide/dnb/importer-budsjett', changefreq: 'daily', priority: 1 },
]

const sitemapLocs = links
  .map(link => ({ ...link, lastmod: new Date() }))
  .map(link => ({
    url: link.url,
    links: [
      { ...link, lang: 'nb' },
      ...extraLanguages.map(lang => ({ ...link, url: `${lang}${link.url}`, lang }))
    ]
  }))

console.log(JSON.stringify(sitemapLocs, null, 2))


// Create a stream to write to
const stream = new SitemapStream({ hostname: 'https://www.gjeldskalkulator.no' })

// Return a promise that resolves with your XML string
streamToPromise(Readable.from(sitemapLocs).pipe(stream)).then((data) =>
  fs.writeFileSync("public/sitemap.xml", data)
)