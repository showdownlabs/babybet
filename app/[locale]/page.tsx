import { supabaseServer } from '@/lib/supabaseServer'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { parseLocalDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

type Baby = {
  id: string
  firstname: string | null
  lastname: string
  status: 'active' | 'inactive'
  url_path: string
  due_date: string
}

export default async function Page({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('home')
  const sb = supabaseServer()
  
  // Fetch all active babies
  const { data: babies } = await sb
    .from('babies')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  const activeBabies = babies as Baby[] || []

  // If there's only one active baby, redirect to it
  if (activeBabies.length === 1) {
    redirect(`/${locale}/${activeBabies[0].url_path}`)
  }

  return (
    <main className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-4 py-8">
        <h1 className="text-5xl font-bold tracking-tight">
          {t('hero')}
        </h1>
        <p className="text-2xl text-gray-700 font-medium">
          {t('tagline')}
        </p>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t('description')}
        </p>
      </section>

      {/* How It Works Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-center">{t('howItWorksTitle')}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center space-y-3 p-6 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="text-4xl">{t('step1').split(' ')[0]}</div>
            <h3 className="text-xl font-semibold">{t('step1').substring(3)}</h3>
            <p className="text-gray-600">{t('step1Description')}</p>
          </div>
          <div className="text-center space-y-3 p-6 rounded-lg bg-gradient-to-br from-green-50 to-green-100">
            <div className="text-4xl">{t('step2').split(' ')[0]}</div>
            <h3 className="text-xl font-semibold">{t('step2').substring(3)}</h3>
            <p className="text-gray-600">{t('step2Description')}</p>
          </div>
          <div className="text-center space-y-3 p-6 rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
            <div className="text-4xl">{t('step3').split(' ')[0]}</div>
            <h3 className="text-xl font-semibold">{t('step3').substring(3)}</h3>
            <p className="text-gray-600">{t('step3Description')}</p>
          </div>
        </div>
      </section>

      {/* Why Play Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-center">{t('whyPlayTitle')}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex gap-4 p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="text-3xl flex-shrink-0">{t('feature1').split(' ')[0]}</div>
            <div>
              <h3 className="text-lg font-semibold mb-1">{t('feature1').substring(3)}</h3>
              <p className="text-gray-600 text-sm">{t('feature1Description')}</p>
            </div>
          </div>
          <div className="flex gap-4 p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="text-3xl flex-shrink-0">{t('feature2').split(' ')[0]}</div>
            <div>
              <h3 className="text-lg font-semibold mb-1">{t('feature2').substring(3)}</h3>
              <p className="text-gray-600 text-sm">{t('feature2Description')}</p>
            </div>
          </div>
          <div className="flex gap-4 p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="text-3xl flex-shrink-0">{t('feature3').split(' ')[0]}</div>
            <div>
              <h3 className="text-lg font-semibold mb-1">{t('feature3').substring(3)}</h3>
              <p className="text-gray-600 text-sm">{t('feature3Description')}</p>
            </div>
          </div>
          <div className="flex gap-4 p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="text-3xl flex-shrink-0">{t('feature4').split(' ')[0]}</div>
            <div>
              <h3 className="text-lg font-semibold mb-1">{t('feature4').substring(2)}</h3>
              <p className="text-gray-600 text-sm">{t('feature4Description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Active Bets Section */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">{t('activeBetsTitle')}</h2>
          <p className="text-gray-600">{t('activeBetsDescription')}</p>
        </div>
        
        {activeBabies.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="text-6xl">👶</div>
            <h3 className="text-xl font-semibold text-gray-700">{t('noActiveBets')}</h3>
            <p className="text-gray-600">{t('noActiveBetsDescription')}</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {activeBabies.map((baby) => {
              const babyName = baby.firstname 
                ? `${baby.firstname} ${baby.lastname}` 
                : baby.lastname
              
              return (
                <Link
                  key={baby.id}
                  href={`/${locale}/${baby.url_path}`}
                  className="group block p-8 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-xl transition-all"
                >
                  <div className="space-y-3">
                    <div className="text-4xl">👶</div>
                    <h3 className="text-2xl font-bold group-hover:text-blue-600 transition-colors">
                      {babyName}
                    </h3>
                    <p className="text-gray-600">
                      {t('dueDate')}: <strong>{parseLocalDate(baby.due_date).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US')}</strong>
                    </p>
                    <div className="pt-2">
                      <span className="inline-flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all">
                        {t('clickToPlaceBet')}
                        <span className="group-hover:translate-x-1 transition-transform inline-block ml-1">→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}

