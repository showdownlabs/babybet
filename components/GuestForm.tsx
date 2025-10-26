'use client'
import { useEffect, useState, useRef } from 'react'
import { useFormState } from 'react-dom'
import DateCarousel from './DateCarousel'
import ConfirmBetModal from './ConfirmBetModal'
import { useTranslations } from 'next-intl'

type ActionState = {
  ok: boolean
  error?: string
  venmoDeep?: string
  venmoWeb?: string
  code?: string
  paymentMethod?: 'venmo' | 'cash'
}

export default function GuestForm({
  createGuess,
  windowStart,
  windowEnd,
  guessCounts,
  guessProfiles,
  guessesByDate,
  dueDate,
  locale,
}: {
  createGuess: (state: ActionState, formData: FormData) => Promise<ActionState>
  windowStart: Date
  windowEnd: Date
  guessCounts: Record<string, number>
  guessProfiles: Record<string, string[]>
  guessesByDate: Record<string, any[]>
  dueDate: Date
  locale: string
}) {
  const [state, formAction] = useFormState(createGuess, { ok: false })
  // Hide Venmo for Spanish locale (Mexico) since Venmo isn't available there
  const showVenmo = locale !== 'es'
  const [paymentMethod, setPaymentMethod] = useState<'venmo' | 'cash'>(showVenmo ? 'venmo' : 'cash')
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [guestName, setGuestName] = useState('')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const t = useTranslations('form')

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
    if (!guestName.trim()) {
      return
    }
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

  return (
    <>
      <form ref={formRef} action={formAction} onSubmit={handleSubmit} className="space-y-4 rounded-2xl border p-4 shadow-sm">
        <div className="pb-2 border-b">
          <h3 className="font-semibold text-lg">{t('guestBet')}</h3>
          <p className="text-xs text-gray-500">{t('guestBetDescription')}</p>
        </div>

        <label className="block">
          <span className="text-sm font-medium">{t('yourName')}</span>
          <input 
            name="name" 
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            required 
            placeholder={t('enterYourName')} 
            className="mt-1 w-full rounded-lg border px-3 py-2" 
          />
        </label>

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
        windowStart={windowStart}
        windowEnd={windowEnd}
        dueDate={dueDate}
        guessCounts={guessCounts}
        guessProfiles={guessProfiles}
        guessesByDate={guessesByDate}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        locale={locale}
        isAuthenticated={false}
      />
      
      {/* Hidden input for selected date */}
      <input type="hidden" name="guessDate" value={selectedDate || ''} />

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      
      <button 
        type="submit" 
        disabled={!selectedDate}
        className="w-full rounded-xl bg-black px-4 py-2 text-white disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
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
          name={guestName}
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
