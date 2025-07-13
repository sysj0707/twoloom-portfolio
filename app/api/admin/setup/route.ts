import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json();

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: '모든 필드가 필요합니다.' },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerClient();

    // 기존 관리자 계정이 있는지 확인
    const { count } = await supabase
      .from('admin_profiles')
      .select('*', { count: 'exact', head: true });

    if (count && count > 0) {
      return NextResponse.json(
        { error: '이미 관리자 계정이 존재합니다.' },
        { status: 409 }
      );
    }

    // Supabase Auth에 사용자 생성
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (authError) {
      console.error('Auth creation error:', authError);
      return NextResponse.json(
        { error: '사용자 생성 실패: ' + authError.message },
        { status: 500 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: '사용자 생성 실패' },
        { status: 500 }
      );
    }

    // 관리자 프로필 생성
    const { error: profileError } = await supabase
      .from('admin_profiles')
      .insert({
        id: authData.user.id,
        full_name: fullName,
        role: 'admin'
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // 인증 사용자는 생성되었지만 프로필 생성 실패 시 사용자 삭제
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: '관리자 프로필 생성 실패: ' + profileError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: '관리자 계정이 성공적으로 생성되었습니다.',
      userId: authData.user.id
    });

  } catch (error) {
    console.error('Admin setup error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}