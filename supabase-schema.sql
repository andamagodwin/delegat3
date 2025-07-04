-- Supabase Schema for Delegat3 App
-- Run these SQL commands in your Supabase SQL editor to set up the required tables

-- Enable RLS (Row Level Security)
-- This ensures users can only access their own data

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address text UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  total_delegations integer DEFAULT 0,
  current_delegate text
);

-- Create delegation_records table
CREATE TABLE IF NOT EXISTS delegation_records (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  delegator text NOT NULL,
  delegatee text NOT NULL,
  transaction_hash text,
  block_number bigint,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  type text NOT NULL CHECK (type IN ('delegate', 'undelegate'))
);

-- Enable RLS on both tables (DISABLED for development)
-- ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE delegation_records ENABLE ROW LEVEL SECURITY;

-- For development: Disable RLS to allow anonymous access
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE delegation_records DISABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
-- Users can only access their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid()::text = wallet_address OR wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- Create RLS policies for delegation_records
-- Users can only access their own delegation records
CREATE POLICY "Users can view own delegation records" ON delegation_records
  FOR SELECT USING (delegator = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Users can insert own delegation records" ON delegation_records
  FOR INSERT WITH CHECK (delegator = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- Note: If you're not using authentication (anonymous access), you can disable RLS:
-- ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE delegation_records DISABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_wallet_address ON user_profiles(wallet_address);
CREATE INDEX IF NOT EXISTS idx_delegation_records_delegator ON delegation_records(delegator);
CREATE INDEX IF NOT EXISTS idx_delegation_records_created_at ON delegation_records(created_at);
CREATE INDEX IF NOT EXISTS idx_delegation_records_delegatee ON delegation_records(delegatee);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON user_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
