import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import type { DelegationRecord } from '../lib/supabase'

export const useSupabase = (walletAddress?: string | null) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const profileCreatedRef = useRef<string | null>(null)

  // Test Supabase connection on hook initialization
  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('🧪 Testing Supabase connection...')
        const { error } = await supabase
          .from('user_profiles')
          .select('count')
          .limit(1)
        
        if (error) {
          console.error('❌ Supabase connection test failed:', error)
          if (error.message.includes('relation "public.user_profiles" does not exist')) {
            console.error('🚨 Tables do not exist! Please run the SQL from supabase-schema.sql')
          }
        } else {
          console.log('✅ Supabase connection test successful')
        }
      } catch (err) {
        console.error('❌ Supabase connection error:', err)
      }
    }
    
    testConnection()
  }, [])

  // Save delegation record to Supabase
  const saveDelegationRecord = async (record: Omit<DelegationRecord, 'id' | 'created_at'>) => {
    if (!walletAddress) return { success: false, error: 'No wallet address' }

    try {
      setIsLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('delegation_records')
        .insert([
          {
            ...record,
            delegator: walletAddress
          }
        ])
        .select()

      if (error) throw error

      return { success: true, data }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      return { success: false, error: message }
    } finally {
      setIsLoading(false)
    }
  }

  // Get delegation history from Supabase
  const getDelegationHistory = async () => {
    if (!walletAddress) return { success: false, error: 'No wallet address' }

    try {
      setIsLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('delegation_records')
        .select('*')
        .eq('delegator', walletAddress)
        .order('created_at', { ascending: false })

      if (error) throw error

      return { success: true, data }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      return { success: false, error: message }
    } finally {
      setIsLoading(false)
    }
  }

  // Create or update user profile
  const upsertUserProfile = useCallback(async () => {
    if (!walletAddress) return { success: false, error: 'No wallet address' }

    console.log('🔄 Attempting to create/update user profile for:', walletAddress)

    try {
      setIsLoading(true)
      setError(null)

      // Use upsert with onConflict to properly handle duplicates
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert(
          {
            wallet_address: walletAddress,
            updated_at: new Date().toISOString()
          },
          {
            onConflict: 'wallet_address',
            ignoreDuplicates: false
          }
        )
        .select()

      if (error) {
        console.error('❌ Supabase error:', error)
        throw error
      }

      console.log('✅ User profile created/updated successfully:', data)
      return { success: true, data }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      console.error('❌ Failed to create user profile:', message)
      setError(message)
      return { success: false, error: message }
    } finally {
      setIsLoading(false)
    }
  }, [walletAddress])

  // Get user profile
  const getUserProfile = async () => {
    if (!walletAddress) return { success: false, error: 'No wallet address' }

    try {
      setIsLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('wallet_address', walletAddress)
        .single()

      if (error && error.code !== 'PGRST116') throw error // Ignore not found error

      return { success: true, data }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      return { success: false, error: message }
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-create user profile when wallet connects
  useEffect(() => {
    console.log('📡 useSupabase useEffect triggered, walletAddress:', walletAddress)
    if (walletAddress && profileCreatedRef.current !== walletAddress) {
      console.log('🚀 Calling upsertUserProfile for wallet:', walletAddress)
      profileCreatedRef.current = walletAddress
      // Call upsertUserProfile directly to avoid dependency issues
      const createProfile = async () => {
        if (!walletAddress) return { success: false, error: 'No wallet address' }

        console.log('🔄 Attempting to create/update user profile for:', walletAddress)

        try {
          setIsLoading(true)
          setError(null)

          // Use upsert with onConflict to properly handle duplicates
          const { data, error } = await supabase
            .from('user_profiles')
            .upsert(
              {
                wallet_address: walletAddress,
                updated_at: new Date().toISOString()
              },
              {
                onConflict: 'wallet_address',
                ignoreDuplicates: false
              }
            )
            .select()

          if (error) {
            console.error('❌ Supabase error:', error)
            throw error
          }

          console.log('✅ User profile created/updated successfully:', data)
          return { success: true, data }
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Unknown error'
          console.error('❌ Failed to create user profile:', message)
          setError(message)
          return { success: false, error: message }
        } finally {
          setIsLoading(false)
        }
      }
      createProfile()
    } else if (!walletAddress) {
      console.log('⏳ Waiting for wallet connection...')
      profileCreatedRef.current = null
    }
  }, [walletAddress])

  return {
    isLoading,
    error,
    saveDelegationRecord,
    getDelegationHistory,
    getUserProfile,
    upsertUserProfile
  }
}
