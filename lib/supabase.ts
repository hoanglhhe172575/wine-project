import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

if (!supabaseUrl || !supabaseAnonKey) {
  /* eslint-disable no-console */
  console.error(
    "[Supabase] Thiếu biến môi trường NEXT_PUBLIC_SUPABASE_URL hoặc NEXT_PUBLIC_SUPABASE_ANON_KEY.\n" +
      "• Cập nhật .env.local bằng URL và ANON KEY thực tế của dự án Supabase.\n" +
      "• Ví dụ:\n" +
      '  NEXT_PUBLIC_SUPABASE_URL="https://<PROJECT>.supabase.co"\n' +
      '  NEXT_PUBLIC_SUPABASE_ANON_KEY="<YOUR_ANON_KEY>"\n',
  )
  throw new Error("Supabase env vars not set – please update .env.local")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  name: string
  email: string
  password: string
  avatar?: string
  role: string
  phone?: string
  address?: string
  created_at: string
}

export interface Product {
  id: number
  name: string
  type: string
  category: string
  packaging: string
  volume: string
  price: string
  original_price?: string
  discount?: number
  rating: number
  image: string
  description: string
  details: any // JSON field
  story: string
  created_at: string
}

export interface Order {
  id: string
  user_id: string
  items: any // JSON field
  customer_info: any // JSON field
  total: number
  status: string
  created_at: string
}
