'use client'

import { useTranslations } from 'next-intl'

type Guess = {
  id: string
  name: string
  paid: boolean
  created_at: string
  payment_provider: string
  user_id: string | null
  profiles?: {
    avatar_url: string | null
  } | null
}

type DateGuessDetailsProps = {
  date: string
  guesses: Guess[]
  locale: string
  onClose: () => void
}

export default function DateGuessDetails({ date, guesses, locale, onClose }: DateGuessDetailsProps) {
  const t = useTranslations('dateDetails')
  
  const paidCount = guesses.filter(g => g.paid).length
  const pendingCount = guesses.filter(g => !g.paid).length

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
      weekday: 'long',
      month: 'long',
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
    <div className="mt-4 p-4 border-2 border-blue-200 rounded-lg bg-blue-50 animate-slideDown">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold text-lg">{formatDate(date)}</h3>
          <p className="text-sm text-gray-600">
            {guesses.length} {guesses.length === 1 ? t('guess') : t('guesses')} 
            {paidCount > 0 && ` • ${paidCount} ${t('paid')}`}
            {pendingCount > 0 && ` • ${pendingCount} ${t('pending')}`}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-blue-100 rounded-full transition-colors"
          aria-label={t('close')}
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {guesses.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">{t('noGuesses')}</p>
        ) : (
          guesses.map((guess) => (
            <div
              key={guess.id}
              className="flex items-center gap-3 p-2 bg-white rounded-lg hover:shadow-sm transition-shadow"
            >
              {guess.profiles?.avatar_url ? (
                <img
                  src={guess.profiles.avatar_url}
                  alt={guess.name}
                  className="w-10 h-10 rounded-full border-2 border-gray-200"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                  {guess.name.charAt(0).toUpperCase()}
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm truncate">{guess.name}</p>
                  {!guess.user_id && (
                    <span className="text-xs text-gray-500" title="Guest">🔒</span>
                  )}
                </div>
                <p className="text-xs text-gray-500">{getTimeAgo(guess.created_at)}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs">
                  {guess.payment_provider === 'venmo' ? '💳' : '💵'}
                </span>
                {guess.paid ? (
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 font-medium">
                    ✓ {t('paid')}
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 font-medium">
                    ⏳ {t('pending')}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

