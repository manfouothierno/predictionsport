// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {i18n} from "@/i18n-config";


export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    // Check if the request is for robots1.txt or sitemaps
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
        return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
        '/robots1.txt',
        '/sitemap1.xml',
        '/news-sitemap1.xml',
        '/blog-sitemap1.xml'
    ]
}