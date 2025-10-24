export default function RulesCard() {
  return (
    <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 space-y-3">
      <h2 className="text-lg font-semibold text-blue-900">📋 How It Works</h2>
      
      <div className="space-y-2 text-sm text-blue-800">
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
      
      <div className="pt-2 border-t border-blue-200">
        <p className="text-xs text-blue-700">
          💡 <strong>Tip:</strong> Want more chances to win? Submit multiple dates! 
          Each guess gets you in the running.
        </p>
      </div>
    </div>
  )
}

