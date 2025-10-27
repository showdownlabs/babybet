'use client'
import { useEffect, useState, useRef } from 'react'
import { useFormState } from 'react-dom'
import type { User } from '@supabase/supabase-js'
import DateCarousel from './DateCarousel'
import ConfirmBetModal from './ConfirmBetModal'
import { useTranslations } from 'next-intl'
import { parseLocalDate } from '@/lib/utils'

type ActionState = {
  ok: boolean
  error?: string
  venmoDeep?: string
  venmoWeb?: string
  code?: string
  paymentMethod?: 'venmo' | 'cash'
}

export default function AuthenticatedForm({
  createGuess,
  windowStart,
  windowEnd,
  guessCounts,
  guessProfiles,
  guessesByDate,
  dueDate,
  user,
  locale,
}: {
  createGuess: (state: ActionState, formData: FormData) => Promise<ActionState>
  windowStart: string
  windowEnd: string
  guessCounts: Record<string, number>
  guessProfiles: Record<string, string[]>
  guessesByDate: Record<string, any[]>
  dueDate: string
  user: User
  locale: string
}) {
  // Parse date strings to Date objects
  const windowStartDate = parseLocalDate(windowStart)
  const windowEndDate = parseLocalDate(windowEnd)
  const dueDateObj = parseLocalDate(dueDate)
  const [state, formAction] = useFormState(createGuess, { ok: false })
  // Hide Venmo for Spanish locale (Mexico) since Venmo isn't available there
  const showVenmo = locale !== 'es'
  const [paymentMethod, setPaymentMethod] = useState<'venmo' | 'cash'>(showVenmo ? 'venmo' : 'cash')
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const t = useTranslations('form')
  
  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'

  useEffect(() => {
    if (state.ok) {
      setIsSubmitting(false)
      setShowConfirmModal(false)
      if (state.paymentMethod === 'venmo' && state.venmoDeep && state.venmoWeb) {
        // Redirect to Venmo
        const timer = setTimeout(() => (window.location.href = state.venmoWeb!), 1200)
        try { window.location.href = state.venmoDeep } catch {}
        return () => clearTimeout(timer)
      }
      // For cash, success message is shown below
    }
  }, [state])

  const handleSubmit = (e: React.FormEvent) => {
    // If already confirmed, let the form submit normally
    if (isConfirmed) {
      return
    }
    
    e.preventDefault()
    
    // Validate form
    if (!selectedDate) {
      return
    }
    
    // Show confirmation modal
    setShowConfirmModal(true)
  }

  const handleConfirm = () => {
    setIsSubmitting(true)
    setIsConfirmed(true)
    setShowConfirmModal(false)
    
    // Submit the form after state updates
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.requestSubmit()
      }
    }, 0)
  }

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'

  return (
    <>
      <form ref={formRef} action={formAction} onSubmit={handleSubmit} className="space-y-4 rounded-2xl border p-4 shadow-sm bg-blue-50 border-blue-200">
        <div className="pb-2 border-b border-blue-200">
          <h3 className="font-semibold text-lg">{t('authenticatedBet')}</h3>
          <p className="text-xs text-gray-600">{t('bettingAs')} {displayName}</p>
        </div>

        {/* Hidden input for name (auto-filled from user profile) */}
      <input type="hidden" name="name" value={displayName} />
      {/* Hidden input for user_id */}
      <input type="hidden" name="userId" value={user.id} />

      <div className="space-y-2">
        <span className="text-sm font-medium block">{t('paymentMethod')}</span>
        <div className="flex gap-4">
          {showVenmo && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="venmo"
                checked={paymentMethod === 'venmo'}
                onChange={(e) => setPaymentMethod(e.target.value as 'venmo' | 'cash')}
                className="w-4 h-4"
              />
              <span className="text-sm">{t('venmo')}</span>
            </label>
          )}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="cash"
              checked={paymentMethod === 'cash'}
              onChange={(e) => setPaymentMethod(e.target.value as 'venmo' | 'cash')}
              className="w-4 h-4"
            />
            <span className="text-sm">{t('cash')}</span>
          </label>
        </div>
      </div>

      <DateCarousel
        windowStart={windowStartDate}
        windowEnd={windowEndDate}
        dueDate={dueDateObj}
        guessCounts={guessCounts}
        guessProfiles={guessProfiles}
        guessesByDate={guessesByDate}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        locale={locale}
        isAuthenticated={true}
      />
      
      {/* Hidden input for selected date */}
      <input type="hidden" name="guessDate" value={selectedDate || ''} />

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      
      <button 
        type="submit" 
        disabled={!selectedDate}
        className="w-full rounded-xl bg-blue-600 px-4 py-2 text-white disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors hover:bg-blue-700"
      >
        {paymentMethod === 'venmo' ? t('submitBetVenmo') : t('submitBetCash')}
      </button>
      
      {state.ok && state.code && (
        <div className="text-sm p-3 rounded-lg bg-green-50 border border-green-200 text-green-800">
          <p className="font-semibold">{t('betPlaced')} <strong>{state.code}</strong></p>
          {state.paymentMethod === 'venmo' && state.venmoWeb && (
            <p className="text-xs mt-1">
              {t('venmoDidntOpen')} <a className="underline" href={state.venmoWeb}>{t('tapHere')}</a>.
            </p>
          )}
          {state.paymentMethod === 'cash' && (
            <p className="text-xs mt-1">
              {t('rememberCash')}
            </p>
          )}
        </div>
      )}
      </form>

      {/* Confirmation Modal */}
      {selectedDate && (
        <ConfirmBetModal
          isOpen={showConfirmModal}
          name={userName}
          selectedDate={selectedDate}
          paymentMethod={paymentMethod}
          locale={locale}
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirmModal(false)}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  )
}
