import { cookies } from 'next/headers'
import { config } from '@/lib/config'

export default function PasscodeGate() {
  async function setPasscode(formData: FormData) {
    'use server'
    const v = String(formData.get('passcode') || '')
    if (v === config.adminPasscode) {
      cookies().set('admin_auth', 'ok', {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: config.sessionTtlHours * 3600,
        path: '/',
      })
    }
  }

  return (
    <form action={setPasscode} className="mx-auto max-w-xs space-y-3 rounded-2xl border p-4">
      <h2 className="text-lg font-semibold">Admin access</h2>
      <input name="passcode" type="password" placeholder="Passcode" className="w-full rounded-lg border px-3 py-2" />
      <button className="w-full rounded-xl bg-black px-4 py-2 text-white">Enter</button>
      <p className="text-xs text-gray-500">Reload after entering correct passcode.</p>
    </form>
  )
}

