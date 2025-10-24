import { isAdminAuthed } from '@/lib/config'
import AdminAuthGate from '@/components/AdminAuthGate'
import AdminTable from '@/components/AdminTable'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const authed = await isAdminAuthed()
  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold">Admin</h1>
      {!authed ? (
        <AdminAuthGate />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">View and reconcile guesses</p>
            <a
              href="/api/export"
              className="rounded-xl bg-black px-3 py-2 text-sm text-white"
            >
              Export CSV
            </a>
          </div>
          <AdminTable />
        </>
      )}
    </main>
  )
}

