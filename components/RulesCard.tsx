'use client'

import { useState } from 'react'

export default function RulesCard() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-medium text-gray-700">
          📋 How It Works
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
              <p><strong>Pick your date(s)</strong> — Choose any date(s) within the betting window</p>
            </div>
            
            <div className="flex items-start gap-2">
              <span className="font-bold min-w-[20px]">2.</span>
              <p><strong>$2 per day</strong> — You can bet on multiple days! Each date costs $2</p>
            </div>
            
            <div className="flex items-start gap-2">
              <span className="font-bold min-w-[20px]">3.</span>
              <p><strong>Pay via Venmo or Cash</strong> — Choose your payment method. Venmo redirects automatically, Cash is paid in person</p>
            </div>
            
            <div className="flex items-start gap-2">
              <span className="font-bold min-w-[20px]">4.</span>
              <p><strong>Payment = Final</strong> — Your bet isn't official until payment is received</p>
            </div>
          </div>
          
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              💡 <strong>Tip:</strong> Want more chances to win? Submit multiple dates! 
              Each guess gets you in the running.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

