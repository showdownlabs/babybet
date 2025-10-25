import { NextResponse } from 'next/server'
import { isAdminAuthed } from '@/lib/config'
import { supabaseServer } from '@/lib/supabaseServer'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!(await isAdminAuthed())) {
    return new NextResponse('Unauthorized', { status: 401 })
  }
  const sb = supabaseServer()
  const { data, error } = await sb
    .from('guesses')
    .select('id,created_at,name,guess_date,code,paid,paid_at,payment_provider,babies(firstname,lastname,url_path)')
    .order('created_at', { ascending: false })

  if (error) return new NextResponse('Error fetching data', { status: 500 })

  const header = 'id,created_at,baby,name,guess_date,code,paid,paid_at,payment_provider\n'
  const rows = (data || [])
    .map((r: any) => {
      const baby = r.babies
      const babyName = baby?.firstname 
        ? `${baby.firstname} ${baby.lastname}` 
        : baby?.lastname || 'Unknown'
      
      return [r.id, r.created_at, babyName, r.name, r.guess_date, r.code, r.paid, r.paid_at, r.payment_provider]
        .map((v) => (v === null || v === undefined ? '' : String(v).replace(/"/g, '""')))
        .map((v) => /,|\n|"/.test(v) ? `"${v}"` : v)
        .join(',')
    })
    .join('\n')

  const csv = header + rows + '\n'
  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="guesses.csv"',
    },
  })
}

