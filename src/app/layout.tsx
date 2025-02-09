import type { Metadata } from "next";
import { Maven_Pro} from "next/font/google";
import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const mavenPro = Maven_Pro({
  subsets: ["latin"],
  variable: "--font-maven-pro",
  weight: ["400", "500", "600", "700", "800", "900"],
});


export const metadata: Metadata = {
    metadataBase: new URL('https://predictionsport.com'),
    title: {
        default: 'PredictionSport - Expert Football Predictions & Betting Tips',
        template: '%s | PredictionSport'
    },
    description: 'Get expert football predictions, live scores, and betting tips. Daily match [match] and predictions for Premier League, La Liga, Champions League and more.',
    keywords: ['football predictions', 'betting tips', 'soccer predictions', 'match [match]', 'live scores'],
    authors: [{ name: 'PredictionSport' }],
    creator: 'PredictionSport',
    publisher: 'PredictionSport',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased ${mavenPro.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
