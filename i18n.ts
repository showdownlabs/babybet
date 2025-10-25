// Shared i18n configuration
export const locales = ['en', 'es'] as const
export type Locale = (typeof locales)[number]

