-- Two Loom 포트폴리오 사이트 데이터베이스 스키마

-- 관리자 프로필 (Supabase Auth 활용)
CREATE TABLE admin_profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 포트폴리오 카테고리
CREATE TABLE portfolio_categories (
  id SERIAL PRIMARY KEY,
  name JSONB NOT NULL, -- {"ko": "웹개발", "en": "Web Development"}
  slug TEXT UNIQUE NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 포트폴리오 프로젝트
CREATE TABLE portfolios (
  id SERIAL PRIMARY KEY,
  title JSONB NOT NULL,
  description JSONB NOT NULL,
  short_description JSONB, -- 카드용 짧은 설명
  thumbnail_url TEXT,
  images TEXT[] DEFAULT '{}',
  tech_stack TEXT[] DEFAULT '{}',
  demo_url TEXT,
  github_url TEXT,
  category_id INTEGER REFERENCES portfolio_categories(id) ON DELETE SET NULL,
  featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 문의사항
CREATE TABLE inquiries (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'closed')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 회사 정보
CREATE TABLE company_info (
  id SERIAL PRIMARY KEY,
  company_name JSONB NOT NULL,
  description JSONB,
  email TEXT NOT NULL,
  phone TEXT,
  address JSONB,
  social_links JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 연혁 정보
CREATE TABLE company_history (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  title JSONB NOT NULL,
  description JSONB,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_portfolios_category_id ON portfolios(category_id);
CREATE INDEX idx_portfolios_status ON portfolios(status);
CREATE INDEX idx_portfolios_featured ON portfolios(featured);
CREATE INDEX idx_portfolios_created_at ON portfolios(created_at DESC);
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_created_at ON inquiries(created_at DESC);

-- RLS (Row Level Security) 정책 설정
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_history ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 정책 (포트폴리오, 카테고리, 회사정보, 연혁)
CREATE POLICY "Portfolio categories are viewable by everyone" 
  ON portfolio_categories FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Published portfolios are viewable by everyone" 
  ON portfolios FOR SELECT 
  USING (status = 'published');

CREATE POLICY "Company info is viewable by everyone" 
  ON company_info FOR SELECT 
  USING (true);

CREATE POLICY "Active company history is viewable by everyone" 
  ON company_history FOR SELECT 
  USING (is_active = true);

-- 관리자 전체 권한 정책
CREATE POLICY "Admin full access to all tables" 
  ON admin_profiles FOR ALL 
  USING (auth.uid() = id);

CREATE POLICY "Admin can manage portfolio categories" 
  ON portfolio_categories FOR ALL 
  USING (auth.uid() IN (SELECT id FROM admin_profiles));

CREATE POLICY "Admin can manage portfolios" 
  ON portfolios FOR ALL 
  USING (auth.uid() IN (SELECT id FROM admin_profiles));

CREATE POLICY "Admin can manage inquiries" 
  ON inquiries FOR ALL 
  USING (auth.uid() IN (SELECT id FROM admin_profiles));

CREATE POLICY "Admin can manage company info" 
  ON company_info FOR ALL 
  USING (auth.uid() IN (SELECT id FROM admin_profiles));

CREATE POLICY "Admin can manage company history" 
  ON company_history FOR ALL 
  USING (auth.uid() IN (SELECT id FROM admin_profiles));

-- 문의사항 삽입 정책 (누구나 문의 가능)
CREATE POLICY "Anyone can create inquiries" 
  ON inquiries FOR INSERT 
  WITH CHECK (true);

-- 기본 데이터 삽입
INSERT INTO portfolio_categories (name, slug, order_index) VALUES
('{"ko": "전체", "en": "All"}', 'all', 0),
('{"ko": "웹 개발", "en": "Web Development"}', 'web', 1),
('{"ko": "모바일 앱", "en": "Mobile App"}', 'mobile', 2),
('{"ko": "AI 솔루션", "en": "AI Solution"}', 'ai', 3);

INSERT INTO company_info (company_name, description, email, social_links) VALUES
('{"ko": "Two Loom", "en": "Two Loom"}', 
 '{"ko": "혁신적인 AI 기술로 더 나은 소프트웨어를 만듭니다.", "en": "Creating better software with innovative AI technology."}',
 'one@twoloom.com', 
 '{"github": "https://github.com/twoloom", "linkedin": ""}');

INSERT INTO company_history (date, title, description, order_index) VALUES
('2024-01-01', '{"ko": "회사 설립", "en": "Company Founded"}', 
 '{"ko": "AI 기반 소프트웨어 개발을 목표로 Two Loom 설립", "en": "Two Loom founded with a focus on AI-based software development"}', 1),
('2024-03-01', '{"ko": "첫 번째 AI 솔루션 출시", "en": "First AI Solution Launch"}', 
 '{"ko": "고객 서비스 자동화를 위한 AI 챗봇 솔루션 개발 및 출시", "en": "Developed and launched AI chatbot solution for customer service automation"}', 2),
('2024-06-01', '{"ko": "모바일 앱 개발 확장", "en": "Mobile App Development Expansion"}', 
 '{"ko": "React Native 기반 모바일 앱 개발 서비스 확장", "en": "Expanded React Native-based mobile app development services"}', 3),
('2024-09-01', '{"ko": "기업 파트너십", "en": "Corporate Partnerships"}', 
 '{"ko": "다양한 기업과의 파트너십을 통한 프로젝트 확장", "en": "Project expansion through partnerships with various companies"}', 4);

-- 더미 포트폴리오 데이터
INSERT INTO portfolios (title, description, short_description, thumbnail_url, tech_stack, category_id, featured, order_index, status) VALUES
('{"ko": "AI 챗봇 솔루션", "en": "AI Chatbot Solution"}',
 '{"ko": "고객 서비스 자동화를 위한 지능형 챗봇 시스템", "en": "Intelligent chatbot system for customer service automation"}',
 '{"ko": "AI 기반 고객 서비스 자동화", "en": "AI-powered customer service automation"}',
 'https://via.placeholder.com/400x250/6366f1/ffffff?text=AI+Chatbot',
 ARRAY['Next.js', 'Python', 'OpenAI API', 'PostgreSQL'],
 (SELECT id FROM portfolio_categories WHERE slug = 'ai'),
 true, 1, 'published'),

('{"ko": "모바일 커머스 앱", "en": "Mobile Commerce App"}',
 '{"ko": "사용자 친화적인 쇼핑 앱 개발", "en": "User-friendly shopping app development"}',
 '{"ko": "React Native 기반 쇼핑 앱", "en": "React Native-based shopping app"}',
 'https://via.placeholder.com/400x250/8b5cf6/ffffff?text=Mobile+App',
 ARRAY['React Native', 'Node.js', 'MongoDB', 'Stripe'],
 (SELECT id FROM portfolio_categories WHERE slug = 'mobile'),
 true, 2, 'published'),

('{"ko": "기업 웹사이트", "en": "Corporate Website"}',
 '{"ko": "반응형 기업 홈페이지 및 관리자 시스템", "en": "Responsive corporate homepage and admin system"}',
 '{"ko": "반응형 기업 웹사이트", "en": "Responsive corporate website"}',
 'https://via.placeholder.com/400x250/06b6d4/ffffff?text=Web+Development',
 ARRAY['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase'],
 (SELECT id FROM portfolio_categories WHERE slug = 'web'),
 false, 3, 'published');