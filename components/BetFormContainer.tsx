'use client'

import { useAuth } from '@/components/AuthProvider'
import GuestForm from '@/components/GuestForm'
import AuthenticatedForm from '@/components/AuthenticatedForm'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

type ActionState = {
  ok: boolean
  error?: string
  venmoDeep?: string
  venmoWeb?: string
  code?: string
  paymentMethod?: 'venmo' | 'cash'
}

type Props = {
  createGuess: (_: ActionState, formData: FormData) => Promise<ActionState>
  windowStart: Date
  windowEnd: Date
  guessCounts: Record<string, number>
  guessProfiles: Record<string, string[]>
  dueDate: Date
  locale: string
}

export default function BetFormContainer(props: Props) {
  const { user, loading, signInWithGoogle, signOut } = useAuth()
  const tCommon = useTranslations('common')

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">{tCommon('loading')}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Form */}
      {user ? (
        <AuthenticatedForm {...props} user={user} />
      ) : (
        <GuestForm {...props} />
      )}

      {/* Auth Status - Subtle Footer */}
      <div className="text-center pt-2 space-y-2">
        {user ? (
          <>
            <Link
              href={`/${props.locale}/profile`}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {tCommon('viewProfile')}
            </Link>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              {user.user_metadata?.avatar_url && (
                <img 
                  src={user.user_metadata.avatar_url} 
                  alt={user.user_metadata?.full_name || user.email || 'User'}
                  className="w-5 h-5 rounded-full"
                />
              )}
              <span>{tCommon('signedInAs')} {user.user_metadata?.full_name || user.email}</span>
              <span>•</span>
              <button
                onClick={signOut}
                className="text-blue-600 hover:underline"
              >
                {tCommon('signOut')}
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={signInWithGoogle}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {tCommon('signInWithGoogle')}
          </button>
        )}
      </div>
    </div>
  )
}

