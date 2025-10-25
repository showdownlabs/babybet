import { supabaseServer } from '@/lib/supabaseServer'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'

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

  // If there are no active babies, show a message
  if (activeBabies.length === 0) {
    return (
      <main className="space-y-6 text-center">
        <div>
          <h1 className="text-2xl font-bold">{t('noActiveBets')}</h1>
          <p className="text-sm text-gray-600 mt-2">
            {t('noActiveBetsDescription')}
          </p>
        </div>
      </main>
    )
  }

  // If there are multiple active babies, show a list
  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('chooseBabyBet')}</h1>
        <p className="text-sm text-gray-600 mt-1">
          {t('selectBaby')}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {activeBabies.map((baby) => {
          const babyName = baby.firstname 
            ? `${baby.firstname} ${baby.lastname}` 
            : baby.lastname
          
          return (
            <Link
              key={baby.id}
              href={`/${locale}/${baby.url_path}`}
              className="block p-6 border rounded-lg hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{babyName}</h2>
              <p className="text-sm text-gray-600">
                {t('dueDate')}: {new Date(baby.due_date).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US')}
              </p>
              <p className="text-sm text-blue-600 mt-2">
                {t('clickToPlaceBet')}
              </p>
            </Link>
          )
        })}
      </div>
    </main>
  )
}

