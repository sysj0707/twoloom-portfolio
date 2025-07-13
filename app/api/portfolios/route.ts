import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const lang = searchParams.get('lang') || 'ko';

    let query = supabase
      .from('portfolios')
      .select(`
        *,
        portfolio_categories (
          id,
          name,
          slug
        )
      `)
      .eq('status', 'published')
      .order('order_index', { ascending: true });

    // 카테고리 필터링 (전체가 아닌 경우)
    if (category && category !== 'all') {
      const { data: categoryData } = await supabase
        .from('portfolio_categories')
        .select('id')
        .eq('slug', category)
        .single();

      if (categoryData) {
        query = query.eq('category_id', categoryData.id);
      }
    }

    const { data: portfolios, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: '포트폴리오 데이터를 가져오는 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    // 다국어 처리
    const processedPortfolios = portfolios?.map(portfolio => ({
      ...portfolio,
      title: portfolio.title?.[lang] || portfolio.title?.ko || '',
      description: portfolio.description?.[lang] || portfolio.description?.ko || '',
      short_description: portfolio.short_description?.[lang] || portfolio.short_description?.ko || '',
      category_name: portfolio.portfolio_categories?.name?.[lang] || portfolio.portfolio_categories?.name?.ko || ''
    })) || [];

    return NextResponse.json({ portfolios: processedPortfolios });

  } catch (error) {
    console.error('Portfolio API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}