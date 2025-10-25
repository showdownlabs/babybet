import { config } from '@/lib/config'
import { formatISODate } from '@/lib/utils'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

export const dynamic = 'force-dynamic'

export default async function RulesPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('rulesPage')
  const tCommon = await getTranslations('common')

  return (
    <main className="space-y-6 max-w-2xl">
      <div>
        <Link href={`/${locale}`} className="text-sm text-blue-600 hover:underline mb-2 inline-block">
          {tCommon('backToBetting')}
        </Link>
        <h1 className="text-3xl font-bold">{t('gameRules')}</h1>
        <p className="text-gray-600 mt-2">{t('subtitle')}</p>
      </div>

      {/* Quick Overview */}
      <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-6">
        <h2 className="text-xl font-bold text-blue-900 mb-3">{t('quickSummary')}</h2>
        <ul className="space-y-2 text-blue-800">
          <li>• <strong>{t('pricePerDate')}</strong></li>
          <li>• <strong>{t('dueDate', { date: formatISODate(config.dueDate) })}</strong></li>
          <li>• <strong>{t('bettingWindow', { start: formatISODate(config.windowStart), end: formatISODate(config.windowEnd) })}</strong></li>
          <li>• <strong>{t('paymentMethods')}</strong></li>
        </ul>
      </div>

      {/* Detailed Rules */}
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3">{t('howToPlay')}</h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold text-gray-900">{t('step1Title')}</h3>
              <p className="mt-1">
                {t('step1Description', { start: formatISODate(config.windowStart), end: formatISODate(config.windowEnd) })}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">{t('step2Title')}</h3>
              <p className="mt-1">{t('step2Description')}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">{t('step3Title')}</h3>
              <p className="mt-1">
                <strong>Venmo:</strong> {t('step3VenmoDescription', { amount: config.venmoAmount })}
              </p>
              <p className="mt-2">
                <strong>{locale === 'es' ? 'Efectivo' : 'Cash'}:</strong> {t('step3CashDescription', { amount: config.venmoAmount })}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">{t('step4Title')}</h3>
              <p className="mt-1">{t('step4Description')}</p>
            </div>
          </div>
        </section>

        <section className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-3">{t('pricing')}</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-lg font-semibold text-gray-900">
              {t('pricePerDateDetail', { amount: config.venmoAmount })}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {t('multipleEntriesDescription', { amount: config.venmoAmount })}
            </p>
          </div>
        </section>

        <section className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-3">{t('paymentConfirmation')}</h2>
          <div className="space-y-3 text-gray-700">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="font-semibold text-yellow-900">{t('importantWarning')}</p>
              <p className="text-sm text-yellow-800 mt-1">
                {t('notFinalWarning')}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900">{t('venmoPaymentTitle')}</h3>
              <p className="mt-1">{t('venmoPaymentDescription')}</p>
              <p className="text-sm text-gray-600 mt-1">
                <strong>{locale === 'es' ? '¿No encuentras Venmo?' : 'Can\'t find Venmo?'}</strong> {t('cantFindVenmo')}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">{t('cashPaymentTitle')}</h3>
              <p className="mt-1">{t('cashPaymentDescription', { amount: config.venmoAmount })}</p>
            </div>
          </div>
        </section>

        <section className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-3">{t('winning')}</h2>
          <div className="space-y-2 text-gray-700">
            <p>{t('winningDescription')}</p>
            <p className="text-sm text-gray-600">{t('winnerAnnouncement')}</p>
          </div>
        </section>

        <section className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-3">{t('faq')}</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900">{t('faqQ1')}</h3>
              <p className="text-sm text-gray-600 mt-1">{t('faqA1')}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">{t('faqQ2')}</h3>
              <p className="text-sm text-gray-600 mt-1">{t('faqA2')}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">{t('faqQ3')}</h3>
              <p className="text-sm text-gray-600 mt-1">{t('faqA3')}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">{t('faqQ4')}</h3>
              <p className="text-sm text-gray-600 mt-1">{t('faqA4')}</p>
            </div>
          </div>
        </section>
      </div>

      {/* CTA */}
      <div className="border-t pt-6">
        <Link 
          href={`/${locale}`}
          className="block w-full rounded-xl bg-black px-4 py-3 text-center text-white font-medium hover:bg-gray-800 transition"
        >
          {t('readyToPlay')}
        </Link>
      </div>
    </main>
  )
}

