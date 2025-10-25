import '../globals.css'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { AuthProvider } from '@/components/AuthProvider'
import { notFound } from 'next/navigation'
import { locales } from '@/i18n'
import Navbar from '@/components/Navbar'

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
            <div className="mx-auto max-w-5xl px-4 py-4 pb-12">
              <Navbar locale={locale} />
              {children}
            </div>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

