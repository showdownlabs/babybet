import { config } from '@/lib/config'
import { supabaseServer } from '@/lib/supabaseServer'
import { buildVenmoNote, venmoLinks } from '@/lib/venmo'
import { clampName, genCode, formatISODate } from '@/lib/utils'
import BetFormContainer from '@/components/BetFormContainer'
import RulesCard from '@/components/RulesCard'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export type ActionState = {
  ok: boolean
  error?: string
  venmoDeep?: string
  venmoWeb?: string
  code?: string
  paymentMethod?: 'venmo' | 'cash'
}

export default async function Page() {
  // Fetch guess counts per date  
  const sb = supabaseServer()
  
  // Fetch ALL guesses with profile data
  const { data: guesses } = await sb
    .from('guesses')
    .select('guess_date, user_id, profiles(avatar_url)')
  
  // Count guesses per date and group profiles
  const guessCounts: Record<string, number> = {}
  const guessProfiles: Record<string, string[]> = {}
  
  guesses?.forEach((g: any) => {
    const date = g.guess_date
    guessCounts[date] = (guessCounts[date] || 0) + 1
    
    // Add avatar URL if user is authenticated and has one
    const profile = g.profiles
    if (g.user_id && profile?.avatar_url) {
      if (!guessProfiles[date]) {
        guessProfiles[date] = []
      }
      // Only add unique avatars (in case user has multiple bets on same day)
      if (!guessProfiles[date].includes(profile.avatar_url)) {
        guessProfiles[date].push(profile.avatar_url)
      }
    }
  })

  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">When will Baby arrive?</h1>
        <p className="text-sm text-gray-600 mt-1">
          Due date: <strong>{formatISODate(config.dueDate)}</strong>
        </p>
      </div>

      <RulesCard />

      <div className="text-center">
        <Link href="/rules" className="text-sm text-blue-600 hover:underline">
          Read detailed rules & FAQ →
        </Link>
      </div>

      <BetFormContainer 
        createGuess={createGuess} 
        windowStart={config.windowStart} 
        windowEnd={config.windowEnd}
        guessCounts={guessCounts}
        guessProfiles={guessProfiles}
        dueDate={config.dueDate}
      />
      
      <div className="text-xs text-gray-500 space-y-1">
        <p>
          💳 Choose Venmo or Cash payment • Venmo redirects automatically • Cash requires in-person confirmation
        </p>
        <p>
          📝 Want to bet on multiple days? Submit the form once per date!
        </p>
      </div>
    </main>
  )
}

async function createGuess(_: ActionState, formData: FormData): Promise<ActionState> {
  'use server'
  const name = clampName(String(formData.get('name') || ''))
  const guessDateStr = String(formData.get('guessDate') || '')
  const paymentMethod = String(formData.get('paymentMethod') || 'venmo')
  const userId = String(formData.get('userId') || '')

  if (!name) return { ok: false, error: 'Please enter your name.' }
  if (!['venmo', 'cash'].includes(paymentMethod)) {
    return { ok: false, error: 'Invalid payment method.' }
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(guessDateStr)) return { ok: false, error: 'Pick a valid date.' }

  const guessDate = new Date(guessDateStr)
  if (isNaN(guessDate.getTime())) return { ok: false, error: 'Invalid date.' }
  if (guessDate < config.windowStart || guessDate > config.windowEnd) {
    return { ok: false, error: 'Date out of range.' }
  }

  const code = genCode(name)
  const note = buildVenmoNote(name, guessDateStr, code)

  const sb = supabaseServer()
  const insertData: any = {
    name,
    guess_date: guessDateStr,
    code,
    payment_provider: paymentMethod,
  }
  
  // Add user_id if provided (authenticated user)
  if (userId) {
    insertData.user_id = userId
  }

  const { error } = await sb.from('guesses').insert(insertData)
  if (error) return { ok: false, error: 'Could not save your guess. Please try again.' }

  // Only generate Venmo links if payment method is venmo
  if (paymentMethod === 'venmo') {
    const { deep, web } = venmoLinks(note)
    return { ok: true, venmoDeep: deep, venmoWeb: web, code, paymentMethod: 'venmo' }
  } else {
    return { ok: true, code, paymentMethod: 'cash' }
  }
}

