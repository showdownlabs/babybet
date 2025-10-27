import { supabaseServer } from '@/lib/supabaseServer'
import { createClient as createAuthClient } from '@/lib/supabaseServerAuth'
import { buildVenmoNote, venmoLinks } from '@/lib/venmo'
import { clampName, genCode, formatISODate, parseLocalDate } from '@/lib/utils'
import BetFormContainer from '@/components/BetFormContainer'
import RulesCard from '@/components/RulesCard'
import RecentGuesses from '@/components/RecentGuesses'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { headers } from 'next/headers'

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

export default async function BabyPage({ 
  params 
}: { 
  params: { baby_slug: string; locale: string } 
}) {
  const t = await getTranslations('babyPage')
  const tCommon = await getTranslations('common')
  
  // Check if user is authenticated using cookie-based auth client
  const authClient = createAuthClient()
  const { data: { user } } = await authClient.auth.getUser()
  const isAuthenticated = !!user
  
  // Use service role client for data fetching
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
  
  // Fetch ALL guesses for this baby with detailed information
  const { data: guesses, error: guessesError } = await sb
    .from('guesses')
    .select('id, name, guess_date, paid, created_at, payment_provider, country, user_id')
    .eq('baby_id', babyData.id)
    .order('created_at', { ascending: false })
  
  // Fetch profiles separately for users with guesses
  const userIds = [...new Set(guesses?.map(g => g.user_id).filter(Boolean) || [])]
  const { data: profiles } = userIds.length > 0 
    ? await sb.from('profiles').select('id, avatar_url').in('id', userIds)
    : { data: [] }
  
  const profileMap = new Map(profiles?.map(p => [p.id, p.avatar_url]) || [])
  
  // Count guesses per date, group profiles, and organize by date
  const guessCounts: Record<string, number> = {}
  const guessProfiles: Record<string, string[]> = {}
  const guessesByDate: Record<string, any[]> = {}
  
  guesses?.forEach((g: any) => {
    const date = g.guess_date
    guessCounts[date] = (guessCounts[date] || 0) + 1
    
    // Add avatar URL if user is authenticated and has one
    if (g.user_id) {
      const avatarUrl = profileMap.get(g.user_id)
      if (avatarUrl) {
        if (!guessProfiles[date]) {
          guessProfiles[date] = []
        }
        // Only add unique avatars (in case user has multiple bets on same day)
        if (!guessProfiles[date].includes(avatarUrl)) {
          guessProfiles[date].push(avatarUrl)
        }
      }
    }
    
    // Group guesses by date for detailed view and attach profile
    if (!guessesByDate[date]) {
      guessesByDate[date] = []
    }
    const guessWithProfile = {
      ...g,
      profiles: g.user_id && profileMap.has(g.user_id) 
        ? { avatar_url: profileMap.get(g.user_id) }
        : null
    }
    guessesByDate[date].push(guessWithProfile)
  })
  
  // Get recent guesses (last 15) with proper type casting and attach profiles
  const recentGuesses = (guesses?.slice(0, 15).map(g => ({
    ...g,
    profiles: g.user_id && profileMap.has(g.user_id) 
      ? { avatar_url: profileMap.get(g.user_id) }
      : null
  })) || []) as any[]

  // Convert date strings to Date objects (using local timezone)
  const dueDate = parseLocalDate(babyData.due_date)
  const windowStart = parseLocalDate(babyData.window_start)
  const windowEnd = parseLocalDate(babyData.window_end)

  // Display baby name
  const babyName = babyData.firstname 
    ? `${babyData.firstname} ${babyData.lastname}` 
    : babyData.lastname

  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('whenWillArrive', { babyName })}</h1>
        <p className="text-sm text-gray-600 mt-1">
          {t('dueDate')}: <strong>{formatISODate(babyData.due_date)}</strong>
        </p>
      </div>

      <BetFormContainer 
        createGuess={createGuess.bind(null, babyData.id)} 
        windowStart={babyData.window_start} 
        windowEnd={babyData.window_end}
        guessCounts={guessCounts}
        guessProfiles={guessProfiles}
        guessesByDate={guessesByDate}
        dueDate={babyData.due_date}
        locale={params.locale}
      />

      {/* Recent Guesses Feed */}
      <RecentGuesses guesses={recentGuesses} locale={params.locale} isAuthenticated={isAuthenticated} />

      <RulesCard locale={params.locale} />
      
      <div className="text-xs text-gray-500 space-y-1">
        <p>{t('venmoOrCash')}</p>
        <p>{t('multipleDays')}</p>
      </div>

      <div className="text-center pt-2">
        <Link href={`/${params.locale}/rules`} className="text-sm text-gray-500 hover:text-blue-600 hover:underline">
          {tCommon('readDetailedRules')}
        </Link>
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

  // Get country from IP address using Cloudflare headers (or X-Forwarded-For)
  const headersList = headers()
  let country = headersList.get('cf-ipcountry') || 
                headersList.get('x-vercel-ip-country') || 
                'US' // Default to US if we can't detect
  
  // Normalize country code
  country = country.toUpperCase()

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

  const guessDate = parseLocalDate(guessDateStr)
  const windowStart = parseLocalDate(baby.window_start)
  const windowEnd = parseLocalDate(baby.window_end)

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
    country, // Add country to the guess
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

