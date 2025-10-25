import { isAdminAuthed } from '@/lib/config'
import AdminAuthGate from '@/components/AdminAuthGate'
import AdminTable from '@/components/AdminTable'
import { supabaseServer } from '@/lib/supabaseServer'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

type Baby = {
  id: string
  firstname: string | null
  lastname: string
  status: 'active' | 'inactive'
  url_path: string
  due_date: string
  window_start: string
  window_end: string
  guess_count?: number
}

export default async function AdminPage() {
  const authed = await isAdminAuthed()
  
  if (!authed) {
    return (
      <main className="space-y-4">
        <h1 className="text-2xl font-bold">Admin</h1>
        <AdminAuthGate />
      </main>
    )
  }

  // Fetch all babies with guess counts
  const sb = supabaseServer()
  const { data: babies } = await sb
    .from('babies')
    .select('*, guesses(count)')
    .order('created_at', { ascending: false })

  const babiesWithCounts: Baby[] = babies?.map((baby: any) => ({
    ...baby,
    guess_count: baby.guesses?.[0]?.count || 0,
  })) || []

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-bold">Admin</h1>
      
      {/* Babies Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Babies</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="p-2">Name</th>
                <th className="p-2">URL Path</th>
                <th className="p-2">Status</th>
                <th className="p-2">Due Date</th>
                <th className="p-2">Window</th>
                <th className="p-2">Guesses</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {babiesWithCounts.map((baby) => {
                const babyName = baby.firstname 
                  ? `${baby.firstname} ${baby.lastname}` 
                  : baby.lastname
                return (
                  <tr key={baby.id} className="border-t">
                    <td className="p-2 font-medium">{babyName}</td>
                    <td className="p-2">
                      <code className="bg-gray-100 px-2 py-1 rounded">
                        /{baby.url_path}
                      </code>
                    </td>
                    <td className="p-2">
                      <span className={`inline-block px-2 py-1 text-xs rounded ${
                        baby.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {baby.status}
                      </span>
                    </td>
                    <td className="p-2">{baby.due_date}</td>
                    <td className="p-2 text-xs">
                      {baby.window_start} to {baby.window_end}
                    </td>
                    <td className="p-2">{baby.guess_count}</td>
                    <td className="p-2">
                      <Link 
                        href={`/en/${baby.url_path}`}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View Page
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Guesses Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">All Guesses</h2>
          <a
            href="/api/export"
            className="rounded-xl bg-black px-3 py-2 text-sm text-white"
          >
            Export CSV
          </a>
        </div>
        <AdminTable />
      </section>
    </main>
  )
}

