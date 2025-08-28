import { createClient } from '@supabase/supabase-js'

/**
 * Public Supabase client for static pages that don't need authentication
 * This client doesn't use cookies and can be used in static generation
 */
export function createPublicClient() {
  // Temporary hardcoded values - replace with environment variables when .env.local is set up
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bfegzdptzftdownucyje.supabase.co'
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmZWd6ZHB0emZ0ZG93bnVjeWplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI2MzI3NzIsImV4cCI6MjA0ODIxODc3Mn0.REPLACE_WITH_YOUR_ACTUAL_ANON_KEY'
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables')
  }
  
  return createClient(supabaseUrl, supabaseKey)
}
