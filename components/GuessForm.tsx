'use client'
import { useEffect } from 'react'
import { useFormState } from 'react-dom'
import type { ActionState } from '@/app/page'

export default function GuessForm({
  createGuess,
  windowStart,
  windowEnd,
}: {
  createGuess: (state: ActionState, formData: FormData) => Promise<ActionState>
  windowStart: Date
  windowEnd: Date
}) {
  const [state, formAction] = useFormState(createGuess, { ok: false })

  useEffect(() => {
    if (state.ok && state.venmoDeep && state.venmoWeb) {
      // Try deep link, then fallback to web
      const t = setTimeout(() => (window.location.href = state.venmoWeb!), 1200)
      try { window.location.href = state.venmoDeep } catch {}
      return () => clearTimeout(t)
    }
  }, [state])

  const min = windowStart.toISOString().slice(0,10)
  const max = windowEnd.toISOString().slice(0,10)

  return (
    <form action={formAction} className="space-y-3 rounded-2xl border p-4 shadow-sm">
      <label className="block">
        <span className="text-sm font-medium">Your name</span>
        <input name="name" required placeholder="Alex" className="mt-1 w-full rounded-lg border px-3 py-2" />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Your date guess</span>
        <input type="date" name="guessDate" required min={min} max={max} className="mt-1 w-full rounded-lg border px-3 py-2" />
        <span className="mt-1 block text-xs text-gray-500">Window: {min} → {max}</span>
      </label>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button type="submit" className="w-full rounded-xl bg-black px-4 py-2 text-white">Place bet & Venmo</button>
      {state.ok && state.code && (
        <p className="text-xs text-gray-500">If Venmo didn't open, <a className="underline" href={state.venmoWeb}>tap here</a>. Your code: <strong>{state.code}</strong></p>
      )}
    </form>
  )
}

