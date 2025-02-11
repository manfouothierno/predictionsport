// app/[lang]/predictions/today/layout.tsx
import { Metadata } from 'next'
import { i18n } from '@/i18n-config'

interface LayoutProps {
    children: React.ReactNode
    params: {
        lang: string
    }
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {

    // Base URL without trailing slash
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://predictionsport.com'

    // Default language is canonical
    const canonicalLang = i18n.defaultLocale
    const canonicalPath = `/predictions`
    const canonicalUrl = `${baseUrl}/${canonicalLang}${canonicalPath}`

    // Generate language alternates
    const languages: Record<string, string> = {}
    i18n.locales.forEach(locale => {
        languages[locale] = `${baseUrl}/${locale}${canonicalPath}`
    })

    return {
        title: {
            template: '%s',
            default: "Expert Football Today's Predictions | PredictionSport",
        },
        description: 'Get accurate football predictions, match analysis, and expert betting tips. Daily predictions for Premier League, Champions League, and other top competitions.',
        keywords: [
            'football predictions',
            'soccer predictions',
            'betting tips',
            'match predictions',
            'football analysis',
            'predictionsport tips',
            'betting predictions'
        ],
        authors: [{ name: 'PredictionSport Analysts' }],
        openGraph: {
            title: 'Expert Football Predictions & Analysis | PredictionSport',
            description: 'Get accurate football predictions and expert betting tips.',
            url: `https://predictionsport.com/${params.lang}/predictions`,
            siteName: 'PredictionSport',
            images: [
                {
                    url: 'https://predictionsport.com/og-predictions.jpg',
                    width: 1200,
                    height: 630,
                    alt: 'PredictionSport Predictions'
                }
            ],
            locale: params.lang,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: 'Football Predictions & Analysis',
            description: 'Expert football predictions and betting tips.',
            images: ['https://predictionsport.com/twitter-predictions.jpg'],
        },
        alternates: {
            canonical: `https://predictionsport.com/${params.lang}/predictions/today`,
            languages: {
                'en': 'https://predictionsport.com/en/predictions/today',
                'fr': 'https://predictionsport.com/fr/predictions/today',
                'de': 'https://predictionsport.com/de/predictions/today',
                'es': 'https://predictionsport.com/es/predictions/today',
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
        },

    }
}

export async function generateStaticParams() {
    return i18n.locales.map((locale) => ({ lang: locale }))
}

export default function PredictionsLayout({ children, params }: LayoutProps) {
    return (
            <main className="">
                {/* Content */}
                {children}
            </main>
    )
}