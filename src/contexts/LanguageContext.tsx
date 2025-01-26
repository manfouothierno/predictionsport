
'use client'
// contexts/LanguageContext.tsx
import { createContext, useContext, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { i18n, type Locale } from '@/i18n-config'
import Cookies from 'js-cookie'

type LanguageContextType = {
    locale: Locale
    setLocale: (locale: Locale) => void
    dictionary: Record<string, any>
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({
                                     children,
                                     initialLocale,
                                     initialDictionary
                                 }: {
    children: React.ReactNode
    initialLocale: Locale
    initialDictionary: Record<string, any>
}) {
    const router = useRouter()
    const pathname = usePathname()

    const setLocale = (newLocale: Locale) => {
        if (newLocale === initialLocale) return

        // Save locale preference
        Cookies.set('NEXT_LOCALE', newLocale, { expires: 365 })

        // Redirect to new locale path
        const currentPath = pathname.replace(/^\/[a-z]{2}/, '')
        router.push(`/${newLocale}${currentPath}`)
    }

    useEffect(() => {
        // Check URL locale against stored preference
        const preferredLocale = Cookies.get('NEXT_LOCALE') as Locale
        if (preferredLocale && preferredLocale !== initialLocale) {
            setLocale(preferredLocale)
        }
    }, [])

    return (
        <LanguageContext.Provider
            value={{
                locale: initialLocale,
                setLocale,
                dictionary: initialDictionary
            }}
        >
            {children}
        </LanguageContext.Provider>
    )
}

// Custom hook for using the language context
export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context
}


