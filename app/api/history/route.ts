import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'ko';

    const { data: history, error } = await supabase
      .from('company_history')
      .select('*')
      .eq('is_active', true)
      .order('date', { ascending: true });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: '연혁 데이터를 가져오는 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    // 다국어 처리 및 날짜 포맷팅
    const processedHistory = history?.map(item => ({
      ...item,
      title: item.title?.[lang] || item.title?.ko || '',
      description: item.description?.[lang] || item.description?.ko || '',
      year: new Date(item.date).getFullYear().toString()
    })) || [];

    return NextResponse.json({ history: processedHistory });

  } catch (error) {
    console.error('History API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}