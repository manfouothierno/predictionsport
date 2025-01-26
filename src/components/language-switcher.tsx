'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import {i18n, Locale} from '@/i18n-config'

export default function LanguageSwitcher() {
    const { locale, setLocale } = useLanguage()

    return (
        <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as Locale)}
            className="border rounded-md px-2 py-1"
        >
            {i18n.locales.map((loc) => (
                <option key={loc} value={loc}>
                    {loc.toUpperCase()}
                </option>
            ))}
        </select>
    )
}