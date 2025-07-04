import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_URL') {
  console.warn('⚠️ Supabase URL not configured. Using placeholder.')
} else {
  console.log('✅ Supabase URL configured:', supabaseUrl)
}

if (!supabaseAnonKey || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY') {
  console.warn('⚠️ Supabase Anon Key not configured. Using placeholder.')
} else {
  console.log('✅ Supabase Anon Key configured')
}

// Create client with fallback values for development
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

// Database types
export interface DelegationRecord {
  id: string
  delegator: string
  delegatee: string
  transaction_hash?: string
  block_number?: number
  created_at: string
  type: 'delegate' | 'undelegate'
}

export interface UserProfile {
  id: string
  wallet_address: string
  created_at: string
  updated_at: string
  total_delegations: number
  current_delegate?: string
}
