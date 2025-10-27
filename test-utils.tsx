import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'

// Mock messages for testing
const mockMessages = {
  common: {
    loading: 'Loading...',
    error: 'Error',
    submit: 'Submit',
    cancel: 'Cancel',
  },
  babyPage: {
    whenWillArrive: 'When will {babyName} arrive?',
    dueDate: 'Due date',
    pickYourDate: 'Pick your date',
    placeBet: 'Place bet',
  },
}

interface AllTheProvidersProps {
  children: React.ReactNode
  locale?: string
  messages?: any
}

function AllTheProviders({ 
  children, 
  locale = 'en',
  messages = mockMessages 
}: AllTheProvidersProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  locale?: string
  messages?: any
}

const customRender = (
  ui: React.ReactElement,
  options?: CustomRenderOptions
) => {
  const { locale, messages, ...renderOptions } = options || {}
  
  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders locale={locale} messages={messages}>
        {children}
      </AllTheProviders>
    ),
    ...renderOptions,
  })
}

export * from '@testing-library/react'
export { customRender as render }

// Mock Supabase client factory
export function createMockSupabaseClient() {
  return {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
    })),
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
    },
  }
}

// Helper to create mock guess data
export function createMockGuess(overrides = {}) {
  return {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'John Doe',
    guess_date: '2026-02-25',
    code: 'JD-ABCD',
    created_at: new Date().toISOString(),
    paid: false,
    paid_at: null,
    payment_provider: 'venmo',
    payment_id: null,
    baby_id: '123e4567-e89b-12d3-a456-426614174001',
    user_id: null,
    country: 'US',
    ...overrides,
  }
}

// Helper to create mock baby data
export function createMockBaby(overrides = {}) {
  return {
    id: '123e4567-e89b-12d3-a456-426614174001',
    firstname: 'Baby',
    lastname: 'Flores-Castro',
    status: 'active' as const,
    url_path: 'flores-castro',
    due_date: '2026-02-25',
    window_start: '2026-02-15',
    window_end: '2026-03-10',
    ...overrides,
  }
}

