import { createBrowserClient } from '@supabase/ssr'
import { createServerClient } from '@supabase/ssr'

// 클라이언트용 Supabase 클라이언트
export const createClientClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// 서버용 Supabase 클라이언트 (cookies는 호출 시점에 import)
export const createSupabaseServerClient = async () => {
  const { cookies } = await import('next/headers')
  const cookieStore = cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}

// 관리자 권한 확인
export const isAdmin = async (userId: string) => {
  const supabase = await createSupabaseServerClient()
  
  const { data: profile } = await supabase
    .from('admin_profiles')
    .select('role')
    .eq('id', userId)
    .single()
  
  return profile?.role === 'admin' || profile?.role === 'super_admin'
}

// 로그인 상태 확인
export const getUser = async () => {
  const supabase = await createSupabaseServerClient()
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch (error) {
    return null
  }
}

// 관리자 프로필 생성/업데이트
export const createAdminProfile = async (userId: string, fullName: string) => {
  const supabase = await createSupabaseServerClient()
  
  const { error } = await supabase
    .from('admin_profiles')
    .upsert({
      id: userId,
      full_name: fullName,
      role: 'admin'
    })
  
  return { error }
}