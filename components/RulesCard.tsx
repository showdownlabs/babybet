'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

export default function RulesCard({ locale }: { locale?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const t = useTranslations('rulesCard')

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-medium text-gray-700">
          {t('howItWorks')}
        </span>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="px-3 pb-3 space-y-3 border-t border-gray-200">
          <div className="space-y-2 text-sm text-gray-700 pt-3">
            <div className="flex items-start gap-2">
              <span className="font-bold min-w-[20px]">1.</span>
              <p><strong>{t('step1')}</strong> — {t('step1Description')}</p>
            </div>
            
            <div className="flex items-start gap-2">
              <span className="font-bold min-w-[20px]">2.</span>
              <p><strong>{t('step2')}</strong> — {t('step2Description')}</p>
            </div>
            
            <div className="flex items-start gap-2">
              <span className="font-bold min-w-[20px]">3.</span>
              <p><strong>{t('step3')}</strong> — {t('step3Description')}</p>
            </div>
            
            <div className="flex items-start gap-2">
              <span className="font-bold min-w-[20px]">4.</span>
              <p><strong>{t('step4')}</strong> — {t('step4Description')}</p>
            </div>
          </div>
          
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              {t('tip')}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

