import { createClient } from '@supabase/supabase-js'

// Reads from env. The anon key is PUBLIC by design (it ships in the browser);
// data is protected by Row Level Security in Supabase, not by hiding this key.
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// `supabase` is null until env vars are set, so the app still runs on demo data.
export const supabase = url && anonKey ? createClient(url, anonKey) : null
export const hasSupabase = !!supabase
