import { cookies } from 'next/headers'
import { parseLocalDate } from './utils'

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
    supabaseAnonKey: required('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    supabaseServiceRole: required('SUPABASE_SERVICE_ROLE_KEY'),
    dueDate: parseLocalDate(optional('DUE_DATE', '2025-02-25')),
    windowStart: parseLocalDate(optional('WINDOW_START', '2025-02-15')),
    windowEnd: parseLocalDate(optional('WINDOW_END', '2025-03-10')),
    venmoRecipient: required('VENMO_RECIPIENT'),
    venmoAmount: optional('VENMO_AMOUNT', '5'),
    venmoNoteTemplate: optional('VENMO_NOTE_TEMPLATE', 'Baby Bet — {name} — {date} — {code} — Due {dueDate}'),
    adminPasscode: required('ADMIN_PASSCODE'),
    adminEmail: optional('ADMIN_EMAIL', ''),
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

export async function isAdminAuthed() {
  // Try new Google auth first
  try {
    const { createClient } = await import('./supabaseServerAuth')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user?.email === config.adminEmail) {
      return true
    }
  } catch (error) {
    // Fall through to legacy passcode check
  }
  
  // Legacy passcode auth (kept for backward compatibility)
  const c = cookies().get('admin_auth')?.value
  return c === 'ok'
}

