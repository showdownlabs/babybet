import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales } from '../i18n'

export default getRequestConfig(async ({ requestLocale }) => {
  // In next-intl 4.x, requestLocale extracts the locale from the URL pathname
  const locale = await requestLocale
  
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as any)) {
    notFound()
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})

