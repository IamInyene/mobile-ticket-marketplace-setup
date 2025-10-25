
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = 'https://lykarysdxrhrivkgknfm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5a2FyeXNkeHJocml2a2drbmZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNzY1NTksImV4cCI6MjA3Njg1MjU1OX0.L1HauBSJvxLflOpf132Ww1JtMlD7MEUsPg4YKgKG-Wg'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          verified: boolean
          rating: number | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          avatar_url?: string | null
          verified?: boolean
          rating?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          verified?: boolean
          rating?: number | null
          created_at?: string
        }
      }
    }
  }
}