import { config } from '@/lib/config'
import { formatISODate } from '@/lib/utils'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function RulesPage() {
  return (
    <main className="space-y-6 max-w-2xl">
      <div>
        <Link href="/" className="text-sm text-blue-600 hover:underline mb-2 inline-block">
          ← Back to betting
        </Link>
        <h1 className="text-3xl font-bold">Game Rules</h1>
        <p className="text-gray-600 mt-2">Everything you need to know about the baby arrival bet!</p>
      </div>

      {/* Quick Overview */}
      <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-6">
        <h2 className="text-xl font-bold text-blue-900 mb-3">🎯 Quick Summary</h2>
        <ul className="space-y-2 text-blue-800">
          <li>• <strong>$2 per date</strong> — Bet on as many days as you want!</li>
          <li>• <strong>Due date:</strong> {formatISODate(config.dueDate)}</li>
          <li>• <strong>Betting window:</strong> {formatISODate(config.windowStart)} to {formatISODate(config.windowEnd)}</li>
          <li>• <strong>Payment via Venmo or Cash</strong> — Bets aren't final until paid</li>
        </ul>
      </div>

      {/* Detailed Rules */}
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3">📅 How to Play</h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold text-gray-900">1. Choose Your Date(s)</h3>
              <p className="mt-1">
                Pick any date between <strong>{formatISODate(config.windowStart)}</strong> and{' '}
                <strong>{formatISODate(config.windowEnd)}</strong>. Want better odds? Bet on multiple dates!
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">2. Submit Your Guess</h3>
              <p className="mt-1">
                Enter your name and select your date. You'll receive a unique verification code (e.g., "JS-7K3M")
                that you'll use to track your bet.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">3. Choose Payment Method</h3>
              <p className="mt-1">
                <strong>Venmo:</strong> After submitting, you'll be redirected to Venmo. The payment note will include your name, 
                date, and verification code. Complete the ${config.venmoAmount} payment instantly.
              </p>
              <p className="mt-2">
                <strong>Cash:</strong> After submitting, save your verification code. Pay ${config.venmoAmount} in cash 
                in person and provide your code to confirm your bet.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">4. Wait for Baby!</h3>
              <p className="mt-1">
                Once payment is confirmed, your bet is locked in. The person who guesses closest to the 
                actual arrival date wins!
              </p>
            </div>
          </div>
        </section>

        <section className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-3">💰 Pricing</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-lg font-semibold text-gray-900">
              ${config.venmoAmount} per date
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Bet on multiple days? Each date is a separate ${config.venmoAmount} entry. 
              Just submit the form once for each date you want to bet on!
            </p>
          </div>
        </section>

        <section className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-3">✅ Payment & Confirmation</h2>
          <div className="space-y-3 text-gray-700">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="font-semibold text-yellow-900">⚠️ Important</p>
              <p className="text-sm text-yellow-800 mt-1">
                Your bet is <strong>NOT final</strong> until payment is received and confirmed. 
                Make sure to complete payment right after submitting your guess!
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900">💳 Venmo Payment</h3>
              <p className="mt-1">
                After you submit your guess, you'll be redirected to Venmo with all the payment details 
                pre-filled. Just tap "Pay" to complete the transaction.
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <strong>Can't find Venmo?</strong> Make sure the app is installed on your phone. 
                If you don't have Venmo, you'll be redirected to the website instead.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">💵 Cash Payment</h3>
              <p className="mt-1">
                After you submit your guess, save your verification code. Bring ${config.venmoAmount} cash 
                and your code to pay in person. Your bet will be marked as paid once received.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-3">🏆 Winning</h2>
          <div className="space-y-2 text-gray-700">
            <p>
              The winner is whoever guesses <strong>closest to the actual arrival date</strong>. 
              If multiple people guess the same winning date, the prize will be split.
            </p>
            <p className="text-sm text-gray-600">
              The winner will be announced after baby arrives!
            </p>
          </div>
        </section>

        <section className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-3">❓ FAQ</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900">Can I bet on the same date twice?</h3>
              <p className="text-sm text-gray-600 mt-1">
                Yes! Each bet is separate, so you can increase your chances on a specific date.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">Can I change my guess after paying?</h3>
              <p className="text-sm text-gray-600 mt-1">
                No, all bets are final once payment is confirmed. Choose wisely!
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">What if I forget to pay?</h3>
              <p className="text-sm text-gray-600 mt-1">
                Your guess won't be counted until payment is received. You can submit a new guess 
                and complete the payment at any time before the deadline.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">How do I know if my payment went through?</h3>
              <p className="text-sm text-gray-600 mt-1">
                Check your Venmo transaction history. Your verification code will be in the payment note.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* CTA */}
      <div className="border-t pt-6">
        <Link 
          href="/"
          className="block w-full rounded-xl bg-black px-4 py-3 text-center text-white font-medium hover:bg-gray-800 transition"
        >
          Ready to Play? Place Your Bet →
        </Link>
      </div>
    </main>
  )
}

