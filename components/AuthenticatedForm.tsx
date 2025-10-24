'use client'
import { useEffect, useState } from 'react'
import { useFormState } from 'react-dom'
import type { ActionState } from '@/app/page'
import type { User } from '@supabase/supabase-js'
import DateCarousel from './DateCarousel'

export default function AuthenticatedForm({
  createGuess,
  windowStart,
  windowEnd,
  guessCounts,
  guessProfiles,
  dueDate,
  user,
}: {
  createGuess: (state: ActionState, formData: FormData) => Promise<ActionState>
  windowStart: Date
  windowEnd: Date
  guessCounts: Record<string, number>
  guessProfiles: Record<string, string[]>
  dueDate: Date
  user: User
}) {
  const [state, formAction] = useFormState(createGuess, { ok: false })
  const [paymentMethod, setPaymentMethod] = useState<'venmo' | 'cash'>('venmo')
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  useEffect(() => {
    if (state.ok) {
      if (state.paymentMethod === 'venmo' && state.venmoDeep && state.venmoWeb) {
        // Redirect to Venmo
        const t = setTimeout(() => (window.location.href = state.venmoWeb!), 1200)
        try { window.location.href = state.venmoDeep } catch {}
        return () => clearTimeout(t)
      }
      // For cash, success message is shown below
    }
  }, [state])

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border p-4 shadow-sm bg-blue-50 border-blue-200">
      <div className="pb-2 border-b border-blue-200">
        <h3 className="font-semibold text-lg">Authenticated Bet</h3>
        <p className="text-xs text-gray-600">Betting as {displayName}</p>
      </div>

      {/* Hidden input for name (auto-filled from user profile) */}
      <input type="hidden" name="name" value={displayName} />
      {/* Hidden input for user_id */}
      <input type="hidden" name="userId" value={user.id} />

      <div className="space-y-2">
        <span className="text-sm font-medium block">Payment method</span>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="venmo"
              checked={paymentMethod === 'venmo'}
              onChange={(e) => setPaymentMethod(e.target.value as 'venmo' | 'cash')}
              className="w-4 h-4"
            />
            <span className="text-sm">💳 Venmo</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="cash"
              checked={paymentMethod === 'cash'}
              onChange={(e) => setPaymentMethod(e.target.value as 'venmo' | 'cash')}
              className="w-4 h-4"
            />
            <span className="text-sm">💵 Cash</span>
          </label>
        </div>
      </div>

      <DateCarousel
        windowStart={windowStart}
        windowEnd={windowEnd}
        dueDate={dueDate}
        guessCounts={guessCounts}
        guessProfiles={guessProfiles}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />
      
      {/* Hidden input for selected date */}
      <input type="hidden" name="guessDate" value={selectedDate || ''} />

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      
      <button 
        type="submit" 
        disabled={!selectedDate}
        className="w-full rounded-xl bg-blue-600 px-4 py-2 text-white disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors hover:bg-blue-700"
      >
        {paymentMethod === 'venmo' ? 'Place bet & Pay with Venmo' : 'Place bet (Pay cash in person)'}
      </button>
      
      {state.ok && state.code && (
        <div className="text-sm p-3 rounded-lg bg-green-50 border border-green-200 text-green-800">
          <p className="font-semibold">✓ Bet placed! Your code: <strong>{state.code}</strong></p>
          {state.paymentMethod === 'venmo' && state.venmoWeb && (
            <p className="text-xs mt-1">
              If Venmo didn't open, <a className="underline" href={state.venmoWeb}>tap here</a>.
            </p>
          )}
          {state.paymentMethod === 'cash' && (
            <p className="text-xs mt-1">
              Remember to pay cash in person to finalize your bet!
            </p>
          )}
        </div>
      )}
    </form>
  )
}

