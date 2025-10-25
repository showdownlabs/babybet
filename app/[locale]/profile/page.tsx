import { supabaseServer } from '@/lib/supabaseServer'
import { createClient } from '@/lib/supabaseServerAuth'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

type Guess = {
  id: string
  name: string
  guess_date: string
  code: string
  paid: boolean
  paid_at: string | null
  payment_provider: string
  country: string | null
  created_at: string
  babies: {
    firstname: string | null
    lastname: string
    url_path: string
    due_date: string
  }
}

export default async function ProfilePage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('profile')
  const tCommon = await getTranslations('common')
  
  // Check if user is authenticated
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect(`/${locale}`)
  }

  // Fetch user's guesses
  const sb = supabaseServer()
  const { data: guesses } = await sb
    .from('guesses')
    .select('id, name, guess_date, code, paid, paid_at, payment_provider, country, created_at, babies(firstname, lastname, url_path, due_date)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Transform the data to match our Guess type (babies comes as array from Supabase)
  const userGuesses: Guess[] = (guesses || []).map((g: any) => ({
    ...g,
    babies: Array.isArray(g.babies) && g.babies.length > 0 ? g.babies[0] : g.babies
  }))
  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'

  return (
    <main className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {user.user_metadata?.avatar_url && (
            <img 
              src={user.user_metadata.avatar_url} 
              alt={displayName}
              className="w-16 h-16 rounded-full border-2 border-gray-200"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold">{t('title')}</h1>
            <p className="text-gray-600">{displayName}</p>
          </div>
        </div>
        <Link
          href={`/${locale}`}
          className="text-sm text-gray-600 hover:text-blue-600 hover:underline"
        >
          {tCommon('backToBetting')}
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{userGuesses.length}</div>
          <div className="text-sm text-gray-600">{t('totalGuesses')}</div>
        </div>
        <div className="p-4 rounded-lg bg-green-50 border border-green-200">
          <div className="text-2xl font-bold text-green-600">
            {userGuesses.filter(g => g.paid).length}
          </div>
          <div className="text-sm text-gray-600">{t('paidGuesses')}</div>
        </div>
        <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
          <div className="text-2xl font-bold text-yellow-600">
            {userGuesses.filter(g => !g.paid).length}
          </div>
          <div className="text-sm text-gray-600">{t('unpaidGuesses')}</div>
        </div>
        <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
          <div className="text-2xl font-bold text-purple-600">
            ${userGuesses.filter(g => g.paid).length * 2}
          </div>
          <div className="text-sm text-gray-600">{t('totalSpent')}</div>
        </div>
      </div>

      {/* Guesses List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{t('yourGuesses')}</h2>
        
        {userGuesses.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-gray-50">
            <div className="text-4xl mb-3">🎯</div>
            <p className="text-gray-600">{t('noGuesses')}</p>
            <Link 
              href={`/${locale}`}
              className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('placeFirstGuess')}
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {userGuesses.map((guess) => {
              const baby = guess.babies
              const babyName = baby.firstname 
                ? `${baby.firstname} ${baby.lastname}` 
                : baby.lastname
              
              return (
                <div 
                  key={guess.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-white"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1 min-w-[200px]">
                      <div className="flex items-center gap-2 mb-2">
                        <Link 
                          href={`/${locale}/${baby.url_path}`}
                          className="font-semibold text-lg hover:text-blue-600 transition-colors"
                        >
                          {babyName}
                        </Link>
                        {guess.paid ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-green-100 text-green-800 font-medium">
                            ✓ {t('paid')}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800 font-medium">
                            ⏳ {t('pending')}
                          </span>
                        )}
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>
                          <strong>{t('guessDate')}:</strong> {new Date(guess.guess_date).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                        <p>
                          <strong>{t('dueDate')}:</strong> {new Date(baby.due_date).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US')}
                        </p>
                        <p>
                          <strong>{t('code')}:</strong> <code className="px-2 py-0.5 bg-gray-100 rounded font-mono">{guess.code}</code>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">{t('payment')}:</span>
                        <span className="inline-flex items-center gap-1 capitalize">
                          {guess.payment_provider === 'venmo' ? '💳' : '💵'}
                          {guess.payment_provider}
                        </span>
                      </div>
                      {guess.country && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">{t('country')}:</span>
                          <span className="px-2 py-1 bg-blue-50 border border-blue-200 rounded font-semibold text-xs">
                            {guess.country}
                          </span>
                        </div>
                      )}
                      <div className="text-xs text-gray-400">
                        {new Date(guess.created_at).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US')}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

