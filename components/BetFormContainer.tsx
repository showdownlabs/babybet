'use client'

import { useAuth } from '@/components/AuthProvider'
import GuestForm from '@/components/GuestForm'
import AuthenticatedForm from '@/components/AuthenticatedForm'
import { useTranslations } from 'next-intl'

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

      {/* Auth Status Hint - Optional */}
      {!user && (
        <div className="text-center pt-2">
          <p className="text-xs text-gray-500">
            💡 {tCommon('signInWithGoogle')} to save your profile picture with your bets!
          </p>
        </div>
      )}
    </div>
  )
}

