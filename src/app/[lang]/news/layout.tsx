// app/[lang]/blog/layout.tsx
import { Metadata } from 'next'

// Get supported languages from config
import { i18n } from '@/i18n-config'

interface LayoutProps {
    children: React.ReactNode
    params: {
        lang: string
    }
}

// Generate metadata
export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
    return {
        title: {
            template: '%s | PredictionSport Blog',
            default: 'Football News & Insights ',
        },
        description: 'Expert football analysis, tactical insights, and predictions from top analysts. Stay updated with the latest football trends and strategies.',
        keywords: [
            'fooball news',
            'sports news',
            'sports news',
            'football analysis',
            'soccer predictions',
            'tactical analysis',
            'football insights',
            'betting tips',
            'football strategy'
        ],
        authors: [{ name: 'PredictionSport Team' }],
        openGraph: {
            title: 'Football Analysis & Insights | PredictionSport Blog',
            description: 'Expert football analysis, tactical insights, and predictions from top analysts.',
            url: 'https://predictionsport.com/blog',
            siteName: 'PredictionSport Blog',
            images: [
                {
                    url: 'https://predictionsport.com/pexels-pixabay-274422.jpg',
                    width: 1200,
                    height: 630,
                    alt: 'PredictionSport Blog'
                }
            ],
            locale: params.lang,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: 'Football Analysis & Insights | PredictionSport Blog',
            description: 'Expert football analysis and predictions from top analysts.',
            images: ['https://predictionsport.com/twitter-blog.jpg'],
        },
        alternates: {
            canonical: `https://predictionsport.com/${params.lang}/blog`,
            languages: {
                'en': 'https://predictionsport.com/en/news',
                'fr': 'https://predictionsport.com/fr/news',
                'de': 'https://predictionsport.com/de/news',
                'es': 'https://predictionsport.com/es/news',
            }
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        }
    }
}

// Generate static params for supported languages
export async function generateStaticParams() {
    return i18n.locales.map((locale) => ({ lang: locale }))
}

export default function BlogLayout({ children, params }: LayoutProps) {
    return (
            <main className="">
                {children}
            </main>
    )
}