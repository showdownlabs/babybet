import { supabaseServer } from '@/lib/supabaseServer'
import { buildVenmoNote, venmoLinks } from '@/lib/venmo'
import { clampName, genCode, formatISODate } from '@/lib/utils'
import BetFormContainer from '@/components/BetFormContainer'
import RulesCard from '@/components/RulesCard'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { config } from '@/lib/config'

export const dynamic = 'force-dynamic'

export type ActionState = {
  ok: boolean
  error?: string
  venmoDeep?: string
  venmoWeb?: string
  code?: string
  paymentMethod?: 'venmo' | 'cash'
}

type Baby = {
  id: string
  firstname: string | null
  lastname: string
  status: 'active' | 'inactive'
  url_path: string
  due_date: string
  window_start: string
  window_end: string
}

export default async function BabyPage({ params }: { params: { baby_slug: string } }) {
  const sb = supabaseServer()
  
  // Fetch the baby by url_path
  const { data: baby, error: babyError } = await sb
    .from('babies')
    .select('*')
    .eq('url_path', params.baby_slug)
    .eq('status', 'active')
    .single()

  if (babyError || !baby) {
    notFound()
  }

  const babyData = baby as Baby
  
  // Fetch ALL guesses for this baby with profile data
  const { data: guesses } = await sb
    .from('guesses')
    .select('guess_date, user_id, profiles(avatar_url)')
    .eq('baby_id', babyData.id)
  
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

  // Convert date strings to Date objects
  const dueDate = new Date(babyData.due_date)
  const windowStart = new Date(babyData.window_start)
  const windowEnd = new Date(babyData.window_end)

  // Display baby name
  const babyName = babyData.firstname 
    ? `${babyData.firstname} ${babyData.lastname}` 
    : babyData.lastname

  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">When will {babyName} arrive?</h1>
        <p className="text-sm text-gray-600 mt-1">
          Due date: <strong>{formatISODate(babyData.due_date)}</strong>
        </p>
      </div>

      <RulesCard />

      <div className="text-center">
        <Link href="/rules" className="text-sm text-blue-600 hover:underline">
          Read detailed rules & FAQ →
        </Link>
      </div>

      <BetFormContainer 
        createGuess={createGuess.bind(null, babyData.id)} 
        windowStart={windowStart} 
        windowEnd={windowEnd}
        guessCounts={guessCounts}
        guessProfiles={guessProfiles}
        dueDate={dueDate}
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

async function createGuess(babyId: string, _: ActionState, formData: FormData): Promise<ActionState> {
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

  const sb = supabaseServer()
  
  // Fetch baby to validate dates
  const { data: baby, error: babyError } = await sb
    .from('babies')
    .select('due_date, window_start, window_end')
    .eq('id', babyId)
    .eq('status', 'active')
    .single()

  if (babyError || !baby) {
    return { ok: false, error: 'Baby not found.' }
  }

  const guessDate = new Date(guessDateStr)
  const windowStart = new Date(baby.window_start)
  const windowEnd = new Date(baby.window_end)

  if (isNaN(guessDate.getTime())) return { ok: false, error: 'Invalid date.' }
  if (guessDate < windowStart || guessDate > windowEnd) {
    return { ok: false, error: 'Date out of range.' }
  }

  const code = genCode(name)
  const note = buildVenmoNote(name, guessDateStr, code)

  const insertData: any = {
    name,
    guess_date: guessDateStr,
    code,
    payment_provider: paymentMethod,
    baby_id: babyId,
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

