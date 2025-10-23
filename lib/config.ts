import { cookies } from 'next/headers'

function required(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Missing env: ${name}`)
  return v
}

function optional(name: string, defaultValue: string): string {
  return process.env[name] || defaultValue
}

// Lazy initialization to avoid build-time errors
let _config: ReturnType<typeof getConfig> | null = null

function getConfig() {
  return {
    supabaseUrl: required('NEXT_PUBLIC_SUPABASE_URL'),
    supabaseServiceRole: required('SUPABASE_SERVICE_ROLE_KEY'),
    dueDate: new Date(optional('DUE_DATE', '2025-02-25')),
    windowStart: new Date(optional('WINDOW_START', '2025-02-15')),
    windowEnd: new Date(optional('WINDOW_END', '2025-03-10')),
    venmoRecipient: required('VENMO_RECIPIENT'),
    venmoAmount: optional('VENMO_AMOUNT', '5'),
    venmoNoteTemplate: optional('VENMO_NOTE_TEMPLATE', 'Baby Bet — {name} — {date} — {code} — Due {dueDate}'),
    adminPasscode: required('ADMIN_PASSCODE'),
    sessionTtlHours: Number(optional('SESSION_TTL_HOURS', '8')),
  }
}

export const config = new Proxy({} as ReturnType<typeof getConfig>, {
  get(_target, prop) {
    if (!_config) {
      _config = getConfig()
    }
    return _config[prop as keyof ReturnType<typeof getConfig>]
  }
})

export function isAdminAuthed() {
  const c = cookies().get('admin_auth')?.value
  return c === 'ok'
}

