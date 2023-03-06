import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      reactions: {
        Row: {
          contentful_id: string
          count: number
          created_at: string | null
          ip_address: string
          reaction_variant: string
        }
        Insert: {
          contentful_id: string
          count?: number
          created_at?: string | null
          ip_address: string
          reaction_variant: string
        }
        Update: {
          contentful_id?: string
          count?: number
          created_at?: string | null
          ip_address?: string
          reaction_variant?: string
        }
      }
    }
    Views: {
      reaction_counts: {
        Row: {
          contentful_id: string | null
          reaction_variant: string | null
          sum: number | null
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
