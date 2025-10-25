'use client'

import { usePathname, useRouter } from 'next/navigation'
import { locales } from '@/i18n'

export default function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const pathname = usePathname()
  const router = useRouter()

  const switchLocale = (newLocale: string) => {
    // Replace the locale in the current path
    const segments = pathname.split('/')
    segments[1] = newLocale
    const newPath = segments.join('/')
    router.push(newPath)
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => switchLocale(locale)}
          className={`px-2 py-1 rounded transition-colors ${
            currentLocale === locale
              ? 'bg-blue-600 text-white font-medium'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

