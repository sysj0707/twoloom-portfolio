import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'ko';

    const { data: categories, error } = await supabase
      .from('portfolio_categories')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: '카테고리 데이터를 가져오는 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    // 다국어 처리
    const processedCategories = categories?.map(category => ({
      ...category,
      name: category.name?.[lang] || category.name?.ko || ''
    })) || [];

    return NextResponse.json({ categories: processedCategories });

  } catch (error) {
    console.error('Categories API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}