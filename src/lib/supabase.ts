import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types pour TypeScript
export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  provider?: string
  createdAt: string
}

export interface Product {
  id: number
  name: string
  price: number
  description: string
  image: string
  color: string
  category: string
  sale?: boolean
}