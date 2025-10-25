'use client'

import { useTranslations } from 'next-intl'

type ConfirmBetModalProps = {
  isOpen: boolean
  name: string
  selectedDate: string
  paymentMethod: 'venmo' | 'cash'
  locale: string
  onConfirm: () => void
  onCancel: () => void
  isSubmitting?: boolean
}

export default function ConfirmBetModal({
  isOpen,
  name,
  selectedDate,
  paymentMethod,
  locale,
  onConfirm,
  onCancel,
  isSubmitting = false,
}: ConfirmBetModalProps) {
  const t = useTranslations('confirmModal')

  if (!isOpen) return null

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 animate-fadeIn"
        onClick={onCancel}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slideUp">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🎯</div>
            <h2 className="text-2xl font-bold text-gray-900">{t('title')}</h2>
            <p className="text-sm text-gray-600 mt-1">{t('subtitle')}</p>
          </div>

          {/* Bet Details */}
          <div className="space-y-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-gray-600">{t('name')}</span>
                <span className="text-base font-semibold text-gray-900 text-right">{name}</span>
              </div>
              
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-gray-600">{t('yourGuess')}</span>
                <span className="text-base font-semibold text-blue-600 text-right">
                  {formatDate(selectedDate)}
                </span>
              </div>
              
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-gray-600">{t('paymentMethod')}</span>
                <span className="text-base font-semibold text-gray-900">
                  {paymentMethod === 'venmo' ? '💳 Venmo' : '💵 Cash'}
                </span>
              </div>
              
              <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">{t('amount')}</span>
                <span className="text-2xl font-bold text-green-600">$2</span>
              </div>
            </div>

            {/* Important note */}
            {paymentMethod === 'venmo' ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800">
                  💳 {t('venmoNote')}
                </p>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs text-amber-800">
                  💵 {t('cashNote')}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('goBack')}
            </button>
            <button
              onClick={onConfirm}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {isSubmitting ? t('submitting') : t('confirmBet')}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  )
}

