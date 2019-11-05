export const configuration = Object.freeze(
  {
    api: process.env.NODE_ENV === 'production' ? '/api/v1' : 'http://localhost:5000/api/v1',
    WEB_SITE_URL: process.env.WEB_SITE_URL || 'https://www.site.com',
  }
)
