'use client'

import { useTranslations } from 'next-intl'
import { useAuth } from './AuthProvider'

type Guess = {
  id: string
  name: string
  guess_date: string
  paid: boolean
  created_at: string
  payment_provider: string
  country: string | null
  user_id: string | null
  profiles?: {
    avatar_url: string | null
  } | null
}

type RecentGuessesProps = {
  guesses: Guess[]
  locale: string
  isAuthenticated: boolean
}

export default function RecentGuesses({ guesses, locale, isAuthenticated }: RecentGuessesProps) {
  const t = useTranslations('recentGuesses')
  const { signInWithGoogle } = useAuth()
  
  // Show teaser for non-authenticated users
  if (!isAuthenticated) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">{t('title')}</h2>
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600 font-medium">
            {guesses.length}
          </span>
        </div>
        
        <div className="relative overflow-hidden rounded-lg border-2 border-dashed border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50 p-8">
          {/* Blurred preview */}
          <div className="absolute inset-0 flex flex-col gap-2 p-4 blur-sm opacity-40">
            {guesses.slice(0, 3).map((guess, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Sign-in CTA */}
          <div className="relative z-10 text-center space-y-4">
            <div className="text-4xl mb-2">🔒</div>
            <h3 className="text-xl font-bold text-gray-900">{t('signInToView')}</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {t('signInDescription')}
            </p>
            
            {/* Sign in button */}
            <button
              onClick={signInWithGoogle}
              className="inline-flex items-center gap-3 px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path>
              </svg>
              {t('signInWithGoogle')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const getTimeAgo = (dateStr: string) => {
    const now = new Date()
    const then = new Date(dateStr)
    const diffMs = now.getTime() - then.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return t('justNow')
    if (diffMins < 60) return t('minutesAgo', { count: diffMins })
    if (diffHours < 24) return t('hoursAgo', { count: diffHours })
    return t('daysAgo', { count: diffDays })
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold">{t('title')}</h2>
        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600 font-medium">
          {guesses.length}
        </span>
      </div>

      {guesses.length === 0 ? (
        <div className="text-center py-8 border rounded-lg bg-gray-50">
          <div className="text-4xl mb-2">🎯</div>
          <p className="text-gray-600">{t('noGuessesYet')}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {guesses.map((guess) => (
            <div
              key={guess.id}
              className="flex items-center gap-3 p-3 border rounded-lg bg-white hover:shadow-md transition-shadow"
            >
              {guess.profiles?.avatar_url ? (
                <img
                  src={guess.profiles.avatar_url}
                  alt={guess.name}
                  className="w-12 h-12 rounded-full border-2 border-gray-200 flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {guess.name.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium">{guess.name}</p>
                  {!guess.user_id && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      {t('guest')}
                    </span>
                  )}
                  {guess.country && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-semibold">
                      {guess.country}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {t('guessed')} <strong>{formatDate(guess.guess_date)}</strong>
                </p>
                <p className="text-xs text-gray-400">{getTimeAgo(guess.created_at)}</p>
              </div>

              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="text-lg">
                  {guess.payment_provider === 'venmo' ? '💳' : '💵'}
                </span>
                {guess.paid ? (
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 font-medium whitespace-nowrap">
                    ✓ {t('paid')}
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 font-medium whitespace-nowrap">
                    ⏳ {t('pending')}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

