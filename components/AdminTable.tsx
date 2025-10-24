import { supabaseServer } from '@/lib/supabaseServer'

export default async function AdminTable() {
  const sb = supabaseServer()
  const { data } = await sb
    .from('guesses')
    .select('id, created_at, name, guess_date, code, paid, paid_at, payment_provider')
    .order('created_at', { ascending: false })

  async function markPaid(formData: FormData) {
    'use server'
    const id = String(formData.get('id'))
    const paid = formData.get('paid') === 'true'
    const sb2 = supabaseServer()
    await sb2
      .from('guesses')
      .update({ paid, paid_at: paid ? new Date().toISOString() : null })
      .eq('id', id)
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto text-sm">
        <thead>
          <tr className="text-left text-gray-600">
            <th className="p-2">When</th>
            <th className="p-2">Name</th>
            <th className="p-2">Guess</th>
            <th className="p-2">Code</th>
            <th className="p-2">Payment</th>
            <th className="p-2">Paid?</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="p-2">{new Date(r.created_at!).toLocaleString()}</td>
              <td className="p-2">{r.name}</td>
              <td className="p-2">{r.guess_date}</td>
              <td className="p-2 font-mono">{r.code}</td>
              <td className="p-2">
                <span className="inline-flex items-center gap-1">
                  {r.payment_provider === 'venmo' ? '💳' : '💵'}
                  <span className="capitalize">{r.payment_provider || 'venmo'}</span>
                </span>
              </td>
              <td className="p-2">
                <form action={markPaid} className="inline-flex items-center gap-2">
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="paid" value={(!r.paid).toString()} />
                  <button className={`rounded-md px-3 py-1 text-white ${r.paid ? 'bg-green-600' : 'bg-gray-400'}`}>
                    {r.paid ? 'Paid' : 'Mark paid'}
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

