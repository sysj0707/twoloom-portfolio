import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      portfolios: {
        Row: {
          id: number
          title: any
          description: any
          short_description?: any
          thumbnail_url?: string
          images?: string[]
          tech_stack?: string[]
          demo_url?: string
          github_url?: string
          category_id?: number
          featured: boolean
          order_index: number
          status: string
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          title: any
          description: any
          short_description?: any
          thumbnail_url?: string
          images?: string[]
          tech_stack?: string[]
          demo_url?: string
          github_url?: string
          category_id?: number
          featured?: boolean
          order_index?: number
          status?: string
          view_count?: number
        }
        Update: {
          title?: any
          description?: any
          short_description?: any
          thumbnail_url?: string
          images?: string[]
          tech_stack?: string[]
          demo_url?: string
          github_url?: string
          category_id?: number
          featured?: boolean
          order_index?: number
          status?: string
          view_count?: number
        }
      }
      portfolio_categories: {
        Row: {
          id: number
          name: any
          slug: string
          order_index: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          name: any
          slug: string
          order_index?: number
          is_active?: boolean
        }
        Update: {
          name?: any
          slug?: string
          order_index?: number
          is_active?: boolean
        }
      }
      inquiries: {
        Row: {
          id: number
          name: string
          email: string
          company?: string
          message: string
          phone?: string
          status: string
          admin_notes?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          email: string
          company?: string
          message: string
          phone?: string
          status?: string
          admin_notes?: string
        }
        Update: {
          name?: string
          email?: string
          company?: string
          message?: string
          phone?: string
          status?: string
          admin_notes?: string
        }
      }
    }
  }
}