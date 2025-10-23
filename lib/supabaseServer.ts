import { createClient } from '@supabase/supabase-js'
import { config } from './config'

export function supabaseServer() {
  return createClient(config.supabaseUrl, config.supabaseServiceRole, {
    auth: { persistSession: false },
  })
}

