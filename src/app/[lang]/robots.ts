// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: [
                    '/',
                    '/news/',
                    '/blog/',
                    '/predictions/',
                    '/live-scores/'
                ],
                disallow: [
                    '/admin/',
                    '/api/',
                    '/private/',
                    '/backend/',
                    '/auth/',
                    '/user/',
                    '/*.json$',
                    '/*?*'
                ],
                crawlDelay: 10
            },
            {
                userAgent: ['Googlebot', 'Bingbot'],
                allow: [
                    '/*.js$',
                    '/*.css$',
                    '/*.png$',
                    '/*.jpg$',
                    '/*.gif$',
                    '/*.svg$'
                ]
            }
        ],
        sitemap: [
            'https://predictionsport.com/sitemap.xml',
            'https://predictionsport.com/news-sitemap.xml',
            'https://predictionsport.com/blog-sitemap.xml'
        ],
        host: 'https://predictionsport.com'
    }
}