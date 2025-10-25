import '../globals.css'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { AuthProvider } from '@/components/AuthProvider'
import { notFound } from 'next/navigation'
import { locales } from '@/i18n'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const locale = params.locale
  
  // Validate locale
  if (!locales.includes(locale as any)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <div className="mx-auto max-w-5xl p-4 pb-12">
              <div className="flex justify-end mb-4">
                <LanguageSwitcher currentLocale={locale} />
              </div>
              {children}
            </div>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

