// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { i18n } from '@/i18n-config'

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    // Check if request is for robots.txt or sitemaps
    if (
        pathname === '/robots.txt' ||
        pathname === '/sitemap.xml' ||
        pathname === '/news-sitemap.xml' ||
        pathname === '/blog-sitemap.xml'
    ) {
        // Remove language prefix for these paths
        return NextResponse.rewrite(new URL(pathname, request.url))
    }

    // Rest of your i18n middleware logic
    const pathnameIsMissingLocale = i18n.locales.every(
        locale => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    )

    if (pathnameIsMissingLocale) {
        const locale = request.cookies.get('NEXT_LOCALE')?.value || i18n.defaultLocale
        const response = NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url))

        // Add HSTS header
        response.headers.set(
            'Strict-Transport-Security',
            'max-age=31536000; includeSubDomains; preload'
        )

        return response
    }

    // For all other requests
    const response = NextResponse.next()

    // Add HSTS header to all responses
    response.headers.set(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload'
    )

    return response
}

export const config = {
    matcher: [
        // Skip all internal paths (_next, api)
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
        // Include robots.txt and sitemaps
        '/robots.txt',
        '/sitemap.xml',
        '/news-sitemap.xml',
        '/blog-sitemap.xml'
    ]
}