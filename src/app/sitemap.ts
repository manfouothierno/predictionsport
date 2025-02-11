import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://predictionsport.com'

    // Common routes for all languages
    const routes = [
        '',
        '/predictions/today',
        '/predictions/tomorrow',
        '/live-scores',
        '/news',
        '/blog'
    ]

    // Languages we support
    const languages = ['en', 'fr', 'de', 'es']

    // Create sitemap entries for each route in each language
    const sitemapEntries = routes.flatMap((route) => {
        return languages.map((lang) => ({
            url: `${baseUrl}/${lang}${route}`,
            lastModified: new Date(),
            changeFrequency: route === '' ? 'daily' : 'hourly' as const,
            priority: route === '' ? 1 : 0.8,
            alternates: {
                languages: languages.reduce((acc, l) => ({
                    ...acc,
                    [l]: `${baseUrl}/${l}${route}`
                }), {})
            }
        }))
    })

    return sitemapEntries
}