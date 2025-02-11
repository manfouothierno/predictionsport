import { getDictionary } from '@/lib/get-dictionary'
import { LanguageProvider } from '@/contexts/LanguageContext'
import {i18n, Locale} from "@/i18n-config";
import {Metadata} from "next";
import Navbar from "@/app/[lang]/langing/Navbar";
import Footer from "@/app/[lang]/langing/Footer";
import { Poppins } from 'next/font/google'

export type LayoutProps = {
    children: React.ReactNode;
    params: {
        lang: Locale;
    };
};

const poppins = Poppins({ subsets: ['latin'], weight: '300' })


export const metadata: Metadata = {
    metadataBase: new URL('https://predictionsport.com'),
    title: {
        default: 'Expert Football Predictions & Betting Tips',
        template: '%s'
    },
    description: 'Get expert football predictions, live scores, and betting tips. Daily match [match] and predictions for Premier League, Champions League and more.',
    keywords: ['football predictions', 'betting tips', 'soccer predictions', 'match [match]', 'live scores'],
    authors: [{ name: 'PredictionSport' }],
    creator: 'Manfouo Thierno',
    publisher: 'PredictionSport',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    alternates: {
        canonical: `https://predictionsport.com/en/page-not-found-test`,
        languages: {
            'en': 'https://predictionsport.com/en/page-not-found-test',
            'fr': 'https://predictionsport.com/fr/page-not-found-test',
            'de': 'https://predictionsport.com/de/page-not-found-test',
            'es': 'https://predictionsport.com/es/page-not-found-test',
        }
    },
    robots: {
        index: true,
        follow: true,
        nocache: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png',
        other: {
            rel: 'apple-touch-icon-precomposed',
            url: '/apple-touch-icon-precomposed.png',
        },
    },
    manifest: '/manifest.json',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://predictionsport.com',
        siteName: 'PredictionSport',
        title: 'PredictionSport - Expert Football Predictions & Betting Tips',
        description: 'Get expert football predictions, live scores, and betting tips.',
        images: [{
            url: '/og-image.jpg',
            width: 1200,
            height: 630,
            alt: 'PredictionSport Preview'
        }],
    },
    twitter: {
        card: 'summary_large_image',
        site: '@predictionsport',
        creator: '@predictionsport',
        title: 'PredictionSport - Expert Football Predictions',
        description: 'Expert football predictions and betting tips',
        images: ['/twitter-image.jpg'],
    },
    verification: {
        google: 'your-google-verification-code',
        yandex: 'your-yandex-verification-code',
    },
    category: 'Sports'
}

export async function generateStaticParams() {
    return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({ children, params }: LayoutProps) {
    const lang = await  params.lang;
    const dictionary = await getDictionary(lang);

    return (
        <html lang={lang} className={poppins.className}>
        <body>
        <LanguageProvider
            initialLocale={lang}
            initialDictionary={dictionary}
        >

            {children}
            <Footer/>
        </LanguageProvider>
        </body>
        </html>
    )
}