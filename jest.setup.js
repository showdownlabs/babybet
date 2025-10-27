// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'
process.env.DUE_DATE = '2026-02-25'
process.env.WINDOW_START = '2026-02-15'
process.env.WINDOW_END = '2026-03-10'
process.env.VENMO_RECIPIENT = '@test-user'
process.env.VENMO_AMOUNT = '5'
process.env.ADMIN_PASSCODE = 'test-passcode'

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key) => key,
  NextIntlClientProvider: ({ children }) => children,
}))

jest.mock('next-intl/server', () => ({
  getTranslations: () => async (key) => key,
  getMessages: () => async () => ({}),
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/en',
  useSearchParams: () => new URLSearchParams(),
  notFound: jest.fn(),
}))

// Mock Supabase client
jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(),
  createBrowserClient: jest.fn(),
}))

// Mock scrollIntoView (not available in JSDOM)
Element.prototype.scrollIntoView = jest.fn()

