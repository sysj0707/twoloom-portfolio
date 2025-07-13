import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendInquiryEmail } from '@/lib/resend';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, message } = body;

    // 입력값 검증
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '유효하지 않은 이메일 형식입니다.' },
        { status: 400 }
      );
    }

    // 메시지 길이 검증
    if (message.length < 10 || message.length > 1000) {
      return NextResponse.json(
        { error: '메시지는 10자 이상 1000자 이하로 입력해주세요.' },
        { status: 400 }
      );
    }

    // Rate limiting 체크 (간단한 구현)
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    
    // 지난 5분간 같은 IP에서의 문의 횟수 확인
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from('inquiries')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', fiveMinutesAgo)
      .eq('email', email);

    if (count && count >= 3) {
      return NextResponse.json(
        { error: '너무 많은 요청입니다. 잠시 후 다시 시도해주세요.' },
        { status: 429 }
      );
    }

    // 데이터베이스에 문의사항 저장
    const { data: inquiry, error: dbError } = await supabase
      .from('inquiries')
      .insert({
        name,
        email,
        company: company || null,
        message,
        status: 'new'
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: '문의사항 저장 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    // 이메일 발송
    const emailResult = await sendInquiryEmail({
      name,
      email,
      company,
      message
    });

    if (!emailResult.success) {
      console.error('Email error:', emailResult.error);
      // 이메일 실패해도 문의는 저장되었으므로 성공으로 처리
    }

    return NextResponse.json({ 
      success: true, 
      message: '문의사항이 정상적으로 접수되었습니다.',
      id: inquiry.id
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}