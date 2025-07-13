# Two Loom 포트폴리오 사이트 상세 명세서

## 🏢 프로젝트 개요
- **회사명**: Two Loom
- **사업분야**: AI 기반 소프트웨어/앱 개발, 유지보수
- **도메인**: https://www.twoloom.com
- **연락처**: one@twoloom.com

## 🎨 디자인 & UI/UX 추천

### 컬러 팔레트 (AI 테마)
```css
Primary: #6366F1 (Indigo) - 신뢰감, 기술력
Secondary: #8B5CF6 (Purple) - 창의성, AI
Accent: #06B6D4 (Cyan) - 혁신, 미래지향
Neutral: #1F2937 (Dark Gray) - 전문성
Background: #FFFFFF / #F9FAFB
```

### 폰트 추천
- **헤딩**: `Inter` / `Pretendard` (모던, 가독성)
- **본문**: `Noto Sans KR` (한글 최적화)
- **코드**: `JetBrains Mono` (기술적 요소)

### 홈 페이지 애니메이션
- **Hero Section**: Typing animation, Particle.js 배경
- **스크롤 애니메이션**: Framer Motion, AOS
- **로딩**: Lottie 애니메이션
- **호버 효과**: Micro-interactions

## 📱 반응형 브레이크포인트
```css
Mobile: 320px - 768px
Tablet: 768px - 1024px  
Desktop: 1024px+
```

## 🌍 다국어 지원
- **기본**: 한국어 (ko)
- **추가**: 영어 (en)
- **라이브러리**: next-intl (App Router 최적화)
- **번역 파일**: JSON 형태로 관리
- **라우팅**: /ko, /en 구조
- **미들웨어**: 자동 언어 감지 및 리다이렉트

## 🗄️ 데이터베이스 스키마 (Supabase)

### 테이블 생성
```sql
-- 관리자 프로필 (Supabase Auth 활용)
CREATE TABLE admin_profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 홈 콘텐츠
CREATE TABLE home_content (
  id SERIAL PRIMARY KEY,
  hero_title JSONB NOT NULL, -- {"ko": "title", "en": "title"}
  hero_subtitle JSONB,
  hero_description JSONB,
  services JSONB, -- 서비스 목록
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

-- 회사 연혁
CREATE TABLE company_history (
  id SERIAL PRIMARY KEY,
  year INTEGER NOT NULL,
  month INTEGER CHECK (month >= 1 AND month <= 12),
  title JSONB NOT NULL,
  description JSONB,
  image_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_milestone BOOLEAN DEFAULT false, -- 중요 마일스톤 표시
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 연락처 문의
CREATE TABLE contact_inquiries (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  is_spam BOOLEAN DEFAULT false,
  replied_at TIMESTAMP WITH TIME ZONE,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 회사 정보
CREATE TABLE company_info (
  id SERIAL PRIMARY KEY,
  company_name JSONB NOT NULL,
  address JSONB,
  phone TEXT,
  email TEXT,
  social_links JSONB DEFAULT '{}', -- {"github": "url", "linkedin": "url"}
  business_hours JSONB, -- 영업시간
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SEO 메타데이터
CREATE TABLE seo_metadata (
  id SERIAL PRIMARY KEY,
  page_path TEXT UNIQUE NOT NULL, -- "/", "/portfolio", etc.
  title JSONB NOT NULL,
  description JSONB NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  og_image TEXT,
  og_type TEXT DEFAULT 'website',
  canonical_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 파일 업로드 추적
CREATE TABLE file_uploads (
  id SERIAL PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  table_name TEXT, -- 어느 테이블에서 사용되는지
  record_id INTEGER, -- 해당 테이블의 레코드 ID
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 인덱스 생성
```sql
-- 성능 최적화를 위한 인덱스
CREATE INDEX idx_portfolios_category ON portfolios(category_id);
CREATE INDEX idx_portfolios_featured ON portfolios(featured);
CREATE INDEX idx_portfolios_status ON portfolios(status);
CREATE INDEX idx_portfolios_created_at ON portfolios(created_at DESC);
CREATE INDEX idx_contact_inquiries_created_at ON contact_inquiries(created_at DESC);
CREATE INDEX idx_contact_inquiries_is_read ON contact_inquiries(is_read);
CREATE INDEX idx_company_history_year_month ON company_history(year DESC, month DESC);
CREATE INDEX idx_file_uploads_table_record ON file_uploads(table_name, record_id);
```

### updated_at 자동 업데이트 함수
```sql
-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 설정
CREATE TRIGGER update_admin_profiles_updated_at BEFORE UPDATE ON admin_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_home_content_updated_at BEFORE UPDATE ON home_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_portfolio_categories_updated_at BEFORE UPDATE ON portfolio_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON portfolios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_company_history_updated_at BEFORE UPDATE ON company_history FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_company_info_updated_at BEFORE UPDATE ON company_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_seo_metadata_updated_at BEFORE UPDATE ON seo_metadata FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### RLS (Row Level Security) 정책
```sql
-- RLS 활성화
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 정책 (포트폴리오, 홈 콘텐츠 등)
CREATE POLICY "Enable read access for all users" ON portfolios FOR SELECT USING (status = 'published');
CREATE POLICY "Enable read access for all users" ON portfolio_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Enable read access for all users" ON home_content FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON company_history FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON company_info FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON seo_metadata FOR SELECT USING (true);

-- 관리자 전체 권한
CREATE POLICY "Enable all for authenticated users" ON portfolios FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON portfolio_categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON home_content FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON company_history FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON contact_inquiries FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON company_info FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON seo_metadata FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON admin_profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Enable all for authenticated users" ON file_uploads FOR ALL USING (auth.role() = 'authenticated');

-- 문의 등록 정책 (인증되지 않은 사용자도 문의 등록 가능)
CREATE POLICY "Enable insert for all users" ON contact_inquiries FOR INSERT WITH CHECK (true);
```

### 초기 데이터 삽입
```sql
-- 기본 포트폴리오 카테고리
INSERT INTO portfolio_categories (name, slug, order_index) VALUES
('{"ko": "웹 개발", "en": "Web Development"}', 'web-development', 1),
('{"ko": "모바일 앱", "en": "Mobile App"}', 'mobile-app', 2),
('{"ko": "AI 솔루션", "en": "AI Solution"}', 'ai-solution', 3),
('{"ko": "UI/UX 디자인", "en": "UI/UX Design"}', 'ui-ux-design', 4);

-- 기본 회사 정보
INSERT INTO company_info (company_name, email, social_links) VALUES
('{"ko": "Two Loom", "en": "Two Loom"}', 'one@twoloom.com', '{"github": "", "linkedin": ""}');

-- 기본 SEO 메타데이터
INSERT INTO seo_metadata (page_path, title, description, keywords) VALUES
('/', '{"ko": "Two Loom - AI 기반 소프트웨어 개발", "en": "Two Loom - AI-powered Software Development"}', 
'{"ko": "Two Loom은 AI 기반 소프트웨어 및 앱 개발 전문 회사입니다.", "en": "Two Loom specializes in AI-powered software and app development."}', 
'{ai, software, development, twoloom}'),
('/portfolio', '{"ko": "포트폴리오 - Two Loom", "en": "Portfolio - Two Loom"}',
'{"ko": "Two Loom의 다양한 프로젝트와 포트폴리오를 확인해보세요.", "en": "Check out Two Loom''s various projects and portfolio."}',
'{portfolio, projects, development}');
```

## 🔒 보안 & 인증 추천

### 관리자 인증
- **Supabase Auth** 활용
- **2FA 추천**: Google Authenticator 연동
- **역할 기반 접근 제어** (RBAC)

### 보안 강화 방안

#### 문의 양식 스팸 방지
```typescript
// reCAPTCHA v3 구현
- 클라이언트: @google-cloud/recaptcha-enterprise
- 서버: 점수 기반 검증 (0.5 이상 통과)
- 백업: Honeypot 필드 추가

// Rate Limiting (Upstash Redis)
- 동일 IP: 5분당 3회 제한
- 동일 이메일: 1시간당 5회 제한
- 글로벌: 1분당 100회 제한

// 콘텐츠 필터링
- 스팸 키워드 검사
- 이메일 도메인 블랙리스트
- 메시지 길이 검증 (최소 10자, 최대 1000자)
```

#### API 보안
```typescript
// CORS 설정
- 허용 도메인: twoloom.com, localhost
- 허용 메서드: GET, POST, PUT, DELETE
- 허용 헤더: Content-Type, Authorization

// CSRF 보호
- SameSite 쿠키 설정
- CSRF 토큰 검증 (관리자 영역)

// XSS 방지
- Content Security Policy (CSP)
- 입력값 sanitization
- HTML escape 처리
```

#### 인증 보안
```typescript
// Supabase Auth 설정
- 세션 만료: 24시간
- Refresh Token: 30일
- 2FA: TOTP (Time-based OTP)
- 패스워드 정책: 8자 이상, 특수문자 포함

// 관리자 접근 제어
- IP 화이트리스트 (선택사항)
- 로그인 시도 제한: 5회 실패 시 15분 잠금
- 활동 로그 기록
```

## 📧 이메일 발송 시스템

### 추천 서비스
- **Resend** (개발자 친화적, Next.js 최적화)
- **SendGrid** (안정적, 대용량)
- **Nodemailer** + SMTP (직접 구현)

### 이메일 템플릿 및 구현

#### 템플릿 종류
```typescript
// 고객용 이메일
1. 문의 접수 확인 메일
   - 다국어 지원 (ko/en)
   - 회사 브랜딩 포함
   - 자동 응답 안내

2. 뉴스레터 (향후 확장)
   - 포트폴리오 업데이트 알림
   - 회사 소식

// 관리자용 이메일  
1. 새 문의 알림 메일
   - 문의 요약 정보
   - 관리자 패널 링크
   - 긴급도 표시

2. 시스템 알림
   - 에러 발생 알림
   - 보안 이벤트 알림
```

#### 구현 방법
```typescript
// React Email + Resend
- React Email: 컴포넌트 기반 템플릿
- Tailwind CSS: 이메일 스타일링
- 미리보기 기능: 개발 환경에서 확인

// 큐 시스템 (선택사항)
- BullMQ + Redis: 대량 이메일 처리
- 재시도 로직: 실패 시 자동 재시도
- 배치 발송: 성능 최적화
```

## 🚀 성능 & 최적화 추천

### 파일 업로드 & 이미지 최적화

#### Supabase Storage 설정
```typescript
// Storage Bucket 정책
- portfolio-images: 포트폴리오 이미지 (공개)
- company-assets: 회사 로고, 연혁 이미지 (공개)
- admin-uploads: 관리자 업로드 파일 (비공개)

// 파일 크기 제한
- 일반 이미지: 5MB
- 포트폴리오 이미지: 10MB
- 문서 파일: 20MB

// 허용 파일 형식
- 이미지: jpg, jpeg, png, webp, svg
- 문서: pdf, doc, docx
```

#### 이미지 최적화 전략
- **Next.js Image 컴포넌트** 활용
- **WebP/AVIF 포맷** 자동 변환
- **Lazy Loading** 기본 적용
- **이미지 리사이징**: Sharp 라이브러리 사용
- **CDN 캐싱**: Vercel 자동 최적화
- **Placeholder**: Base64 blur 이미지

#### 업로드 보안
```typescript
// 파일 검증
- MIME 타입 검증
- 파일 확장자 화이트리스트
- 파일 크기 검증
- 이미지 메타데이터 제거
- 바이러스 스캔 (선택사항)
```

### CDN & 호스팅
- **Vercel Edge Network** (자동 제공)
- **Supabase Storage** (이미지/파일)
- **이미지 압축**: TinyPNG API 연동

### 성능 목표
- **LCP**: < 2.5초
- **FID**: < 100ms
- **CLS**: < 0.1
- **Lighthouse Score**: 90+ 목표

## 📊 SEO 최적화 전략

### 기술적 SEO
- **Next.js App Router** Metadata API
- **구조화된 데이터**: JSON-LD
- **Sitemap.xml** 자동 생성
- **Robots.txt** 설정

### 콘텐츠 SEO
- **다국어 hreflang** 태그
- **OpenGraph** 메타데이터
- **Twitter Card** 지원
- **포트폴리오별 상세 페이지**

## 📈 애널리틱스 & 모니터링

### Google Analytics 4
- **환경변수**: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- **이벤트 추적**: 포트폴리오 조회, 문의 제출
- **목표 설정**: 문의 전환율

### 모니터링 & 로깅 시스템

#### 에러 추적 및 성능 모니터링
```typescript
// Sentry 설정
- 에러 자동 수집 및 알림
- 성능 트레이싱 (페이지 로딩, API 응답)
- 사용자 세션 재생
- 릴리즈 추적

// Vercel Analytics
- 실시간 트래픽 모니터링
- Core Web Vitals 추적
- 지역별 성능 분석
- 함수 실행 시간 추적
```

#### 로깅 전략
```typescript
// 구조화된 로깅
- Winston 또는 Pino 사용
- JSON 형태 로그
- 로그 레벨: error, warn, info, debug

// 로그 수집
- Vercel 기본 로깅
- 중요 이벤트: 데이터베이스 저장
- 보안 이벤트: 별도 테이블 관리

// 알림 설정
- 크리티컬 에러: 즉시 슬랙/이메일 알림
- 성능 저하: 임계값 초과 시 알림
- 보안 이벤트: 실시간 알림
```

#### 사용자 행동 분석 (선택사항)
```typescript
// 개인정보 보호 중심
- 쿠키 없는 분석: Plausible Analytics
- 사용자 동의 관리: Cookie Banner
- 데이터 최소화: 필수 데이터만 수집
```

## 🔧 개발 환경 구성

### 상세 폴더 구조
```
portfolio_app/
├── app/                          # Next.js App Router
│   ├── [locale]/                # 다국어 라우팅 (/ko, /en)
│   │   ├── page.tsx            # 홈페이지
│   │   ├── portfolio/          # 포트폴리오
│   │   │   ├── page.tsx       # 목록 페이지
│   │   │   └── [id]/          # 상세 페이지
│   │   ├── history/           # 연혁 페이지
│   │   ├── contact/           # 연락처 페이지
│   │   └── layout.tsx         # 공통 레이아웃
│   ├── admin/                   # 관리자 영역
│   │   ├── layout.tsx          # 관리자 레이아웃
│   │   ├── page.tsx           # 대시보드
│   │   ├── portfolio/         # 포트폴리오 관리
│   │   ├── history/           # 연혁 관리
│   │   ├── contact/           # 문의 관리
│   │   └── settings/          # 설정
│   ├── api/                     # API 라우트
│   │   ├── contact/           # 문의 처리
│   │   ├── portfolio/         # 포트폴리오 CRUD
│   │   ├── upload/           # 파일 업로드
│   │   └── auth/             # 인증 관련
│   ├── globals.css             # 글로벌 스타일
│   ├── layout.tsx              # 루트 레이아웃
│   └── middleware.ts           # 다국어 미들웨어
├── components/                  # 재사용 컴포넌트
│   ├── ui/                     # 기본 UI 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── index.ts
│   ├── layout/                 # 레이아웃 컴포넌트
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx
│   │   └── index.ts
│   ├── portfolio/              # 포트폴리오 관련
│   │   ├── PortfolioCard.tsx
│   │   ├── PortfolioFilter.tsx
│   │   └── index.ts
│   ├── forms/                  # 폼 컴포넌트
│   │   ├── ContactForm.tsx
│   │   ├── LoginForm.tsx
│   │   └── index.ts
│   └── admin/                  # 관리자 전용 컴포넌트
├── lib/                        # 라이브러리 설정
│   ├── supabase/              # Supabase 관련
│   │   ├── client.ts          # 클라이언트
│   │   ├── server.ts          # 서버사이드
│   │   └── types.ts           # 타입 정의
│   ├── email/                 # 이메일 관련
│   │   ├── templates/         # 이메일 템플릿
│   │   ├── sender.ts          # 발송 로직
│   │   └── types.ts
│   ├── auth/                  # 인증 관련
│   ├── utils/                 # 유틸리티 함수
│   └── validations/           # 검증 스키마
├── types/                      # TypeScript 타입
│   ├── portfolio.ts           # 포트폴리오 타입
│   ├── contact.ts             # 연락처 타입
│   ├── auth.ts                # 인증 타입
│   └── global.ts              # 글로벌 타입
├── hooks/                      # 커스텀 훅
│   ├── usePortfolio.ts        # 포트폴리오 훅
│   ├── useAuth.ts             # 인증 훅
│   ├── useLocalStorage.ts     # 로컬스토리지 훅
│   └── index.ts
├── styles/                     # 스타일 파일
│   ├── components.css         # 컴포넌트 스타일
│   └── animations.css         # 애니메이션
├── public/                     # 정적 파일
│   ├── images/                # 이미지
│   │   ├── logos/            # 로고
│   │   ├── icons/            # 아이콘
│   │   └── placeholders/     # 플레이스홀더
│   ├── locales/               # 번역 파일
│   │   ├── ko/               # 한국어
│   │   │   ├── common.json   # 공통
│   │   │   ├── home.json     # 홈
│   │   │   ├── portfolio.json # 포트폴리오
│   │   │   └── contact.json  # 연락처
│   │   └── en/               # 영어
│   ├── robots.txt             # SEO
│   ├── sitemap.xml           # 사이트맵
│   └── manifest.json         # PWA 매니페스트
├── .env.local                 # 환경변수 (개발)
├── .env.example              # 환경변수 템플릿
├── .gitignore                # Git 제외 파일
├── next.config.js            # Next.js 설정
├── tailwind.config.js        # Tailwind 설정
├── tsconfig.json             # TypeScript 설정
├── package.json              # 의존성 관리
└── README.md                 # 프로젝트 문서
```

### 환경변수

#### .env.local (개발용 - Git에서 제외)
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://cbffjurmygdhwlchemxg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNiZmZqdXJteWdkaHdsY2hlbXhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MTgzODQsImV4cCI6MjA2NzA5NDM4NH0.QXEjRw9A11PqNLQn-uy60fkv80L2H-1OciK63j6urAM
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# 이메일
RESEND_API_KEY=re_cz4K7L27_GFmNSnVkqPfTpba9RJz7qWEk
CONTACT_EMAIL=one@twoloom.com

# Analytics (나중에 등록할 예정 - 키만 넣으면 바로 동작)
NEXT_PUBLIC_GA_MEASUREMENT_ID=

# reCAPTCHA (나중에 등록할 예정 - 키만 넣으면 바로 동작)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=

# Rate Limiting
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

#### .env.example (Git에 포함)
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# 이메일
RESEND_API_KEY=your_resend_key_here
CONTACT_EMAIL=your_contact_email_here

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_ga_id_here

# reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
RECAPTCHA_SECRET_KEY=your_secret_key_here

# Rate Limiting (선택사항)
UPSTASH_REDIS_REST_URL=your_redis_url_here
UPSTASH_REDIS_REST_TOKEN=your_redis_token_here
```

## 📝 코드 주석 및 문서화 규칙

### 파일 헤더 주석 템플릿
```typescript
/**
 * 파일명: page.tsx
 * 설명: Two Loom 포트폴리오 사이트 - 홈 페이지
 * 작성자: Two Loom Dev Team
 * 작성일: 2024-12-xx
 * 마지막 수정: 2024-12-xx
 * 
 * 기능:
 * - 회사 소개 Hero 섹션
 * - 주요 서비스 소개
 * - 포트폴리오 미리보기
 * - CTA(Call to Action) 버튼
 * 
 * 의존성:
 * - Framer Motion (애니메이션)
 * - Next.js Image (이미지 최적화)
 * - Supabase (데이터 조회)
 */
```

### 컴포넌트 주석 규칙
```typescript
/**
 * @component PortfolioCard
 * @description 포트폴리오 프로젝트를 표시하는 카드 컴포넌트
 * @param {Portfolio} portfolio - 포트폴리오 데이터 객체
 * @param {boolean} featured - 피처드 프로젝트 여부
 * @param {string} locale - 현재 언어 설정 (ko/en)
 * @returns JSX.Element
 * 
 * @example
 * <PortfolioCard 
 *   portfolio={portfolioData} 
 *   featured={true}
 *   locale="ko"
 * />
 */
```

### 함수 주석 규칙
```typescript
/**
 * @function sendContactEmail
 * @description 연락처 폼에서 이메일을 발송하는 함수
 * @param {ContactFormData} formData - 폼 데이터 (이름, 이메일, 메시지 등)
 * @param {string} locale - 언어 설정 (이메일 템플릿 선택용)
 * @returns {Promise<{success: boolean, message: string}>} 발송 결과
 * 
 * @throws {Error} Resend API 오류 시 발생
 * @throws {ValidationError} 폼 데이터 검증 실패 시 발생
 * 
 * @example
 * const result = await sendContactEmail({
 *   name: "홍길동",
 *   email: "test@example.com",
 *   message: "문의드립니다"
 * }, "ko");
 */
```

### API 라우트 주석 규칙
```typescript
/**
 * @api {POST} /api/contact
 * @apiName SendContactMessage
 * @apiGroup Contact
 * @apiDescription 연락처 문의 메시지를 처리하고 이메일로 발송
 * 
 * @apiParam {string} name 문의자 이름 (필수)
 * @apiParam {string} email 문의자 이메일 (필수)
 * @apiParam {string} company 회사명 (선택)
 * @apiParam {string} subject 문의 제목 (필수)
 * @apiParam {string} message 문의 내용 (필수)
 * @apiParam {string} recaptcha reCAPTCHA 토큰 (필수)
 * 
 * @apiSuccess {boolean} success 성공 여부
 * @apiSuccess {string} message 결과 메시지
 * 
 * @apiError {boolean} success=false 실패 여부
 * @apiError {string} error 에러 메시지
 * @apiError {number} status HTTP 상태 코드
 */
```

### 페이지별 주석 가이드

#### 홈 페이지 (`app/page.tsx`)
```typescript
/**
 * Two Loom 포트폴리오 사이트 - 메인 홈 페이지
 * 
 * 주요 섹션:
 * 1. Hero Section - 회사 소개 및 주요 메시지
 * 2. Services Section - 제공 서비스 소개
 * 3. Featured Portfolio - 주요 프로젝트 미리보기
 * 4. About Section - 회사 간단 소개
 * 5. CTA Section - 연락하기 버튼
 * 
 * 애니메이션:
 * - Typing animation (Hero)
 * - Scroll-triggered animations (Framer Motion)
 * - Parallax effects (선택사항)
 */
```

#### 포트폴리오 페이지 (`app/portfolio/page.tsx`)
```typescript
/**
 * 포트폴리오 목록 및 필터링 페이지
 * 
 * 기능:
 * - 카테고리별 필터링
 * - 검색 기능
 * - 무한 스크롤 또는 페이지네이션
 * - 그리드/리스트 뷰 전환
 * 
 * 데이터 소스: Supabase portfolios 테이블
 * 캐싱: Next.js App Router 캐싱 전략 활용
 */
```

#### 관리자 페이지 (`app/admin/layout.tsx`)
```typescript
/**
 * 관리자 레이아웃 컴포넌트
 * 
 * 인증:
 * - Supabase Auth 세션 확인
 * - 관리자 권한 검증
 * - 미인증 시 로그인 페이지로 리다이렉트
 * 
 * 네비게이션:
 * - 사이드바 메뉴
 * - 로그아웃 기능
 * - 현재 페이지 하이라이트
 */
```

### 유틸리티 함수 주석
```typescript
/**
 * @utils supabase.ts
 * @description Supabase 클라이언트 설정 및 헬퍼 함수들
 */

/**
 * @utils email.ts
 * @description 이메일 발송 관련 유틸리티 함수
 * - 템플릿 렌더링
 * - Resend API 연동
 * - 에러 핸들링
 */

/**
 * @utils validation.ts
 * @description 폼 검증 스키마 (Zod)
 * - 연락처 폼 검증
 * - 포트폴리오 데이터 검증
 * - 관리자 입력 검증
 */
```

### TypeScript 타입 정의 주석
```typescript
/**
 * @types portfolio.ts
 * @description 포트폴리오 관련 타입 정의
 */

/**
 * 포트폴리오 프로젝트 타입
 * @interface Portfolio
 */
export interface Portfolio {
  id: number
  title: Record<string, string> // 다국어 지원 {"ko": "제목", "en": "Title"}
  description: Record<string, string>
  thumbnail_url: string | null
  images: string[]
  tech_stack: string[]
  demo_url: string | null
  github_url: string | null
  category_id: number
  featured: boolean
  order_index: number
  status: 'draft' | 'published'
  created_at: string
  updated_at: string
}
```

### 주석 작성 규칙
1. **모든 페이지와 컴포넌트**에 파일 헤더 주석 필수
2. **public 함수**는 JSDoc 형식으로 주석 작성
3. **복잡한 로직**은 인라인 주석으로 설명
4. **TODO, FIXME, HACK** 태그 활용
5. **영어와 한글 혼용** 가능 (팀 내 일관성 유지)
6. **타입 정의**에는 용도와 예시 포함

## 🛠️ 기술 스택 상세

### Frontend
- **Next.js 14** (App Router, Server Actions)
- **TypeScript** (타입 안정성)
- **Tailwind CSS** (유틸리티 스타일링)
- **Framer Motion** (애니메이션)
- **React Hook Form** + **Zod** (폼 관리)
- **next-intl** (다국어, App Router 최적화)

### UI 라이브러리
- **Headless UI** (접근성 좋은 컴포넌트)
- **Heroicons** (아이콘)
- **React Hot Toast** (알림)

### 백업 & 복구 전략
- **Supabase 자동 백업** (Point-in-time recovery)
- **GitHub Actions** (코드 자동 배포)
- **환경변수 백업** (암호화된 문서 관리)

## 📄 페이지 구조

### 사용자 화면
- **홈** (`/`): 회사 소개, 주요 서비스
- **포트폴리오** (`/portfolio`): 프로젝트 목록 및 상세
- **연혁** (`/history`): 회사 연혁/마일스톤
- **연락처** (`/contact`): 연락처 정보, 문의 양식

### 관리자 화면
- **대시보드** (`/admin`): 전체 현황
- **홈 관리** (`/admin/home`): 홈 콘텐츠 편집
- **포트폴리오 관리** (`/admin/portfolio`): 프로젝트 CRUD
- **연혁 관리** (`/admin/history`): 연혁 CRUD
- **연락처 관리** (`/admin/contact`): 문의 관리

## 🏗️ 아키텍처

```
Frontend (Next.js) → Backend (Supabase) → Deployment (Vercel)
```

## 🎯 개발 우선순위 및 체크리스트

### Phase 1 (MVP) - 1-2주
**목표**: 기본 기능이 동작하는 포트폴리오 사이트

#### 1.1 프로젝트 기초 설정
- [ ] Next.js 프로젝트 초기화
- [ ] TypeScript, Tailwind CSS 설정
- [ ] 폴더 구조 생성
- [ ] Supabase 연결 설정
- [ ] 환경변수 설정

#### 1.2 데이터베이스 구축
- [ ] Supabase 테이블 생성
- [ ] RLS 정책 설정
- [ ] 초기 데이터 삽입
- [ ] 더미 포트폴리오 데이터 생성

#### 1.3 기본 UI 컴포넌트
- [ ] 레이아웃 컴포넌트 (Header, Footer)
- [ ] 기본 UI 컴포넌트 (Button, Input, Card)
- [ ] 포트폴리오 카드 컴포넌트
- [ ] 반응형 네비게이션

#### 1.4 핵심 페이지 개발
- [ ] 홈페이지 (기본 구조)
- [ ] 포트폴리오 목록 페이지
- [ ] 포트폴리오 상세 페이지
- [ ] 기본 SEO 설정

#### 1.5 관리자 시스템
- [ ] Supabase Auth 연동
- [ ] 로그인/로그아웃 기능
- [ ] 관리자 레이아웃
- [ ] 포트폴리오 CRUD 기능

### Phase 2 (기능 확장) - 2-3주
**목표**: 완전한 기능을 갖춘 다국어 사이트

#### 2.1 연락처 시스템
- [ ] 연락처 페이지 UI
- [ ] 문의 폼 구현
- [ ] reCAPTCHA 연동
- [ ] 이메일 발송 시스템 (Resend)
- [ ] 관리자 문의 관리 페이지

#### 2.2 연혁 페이지
- [ ] 연혁 페이지 UI
- [ ] 타임라인 컴포넌트
- [ ] 관리자 연혁 관리

#### 2.3 다국어 지원
- [ ] next-intl 설정
- [ ] 미들웨어 구현
- [ ] 번역 파일 작성
- [ ] 언어 전환 UI

#### 2.4 파일 업로드
- [ ] Supabase Storage 설정
- [ ] 이미지 업로드 컴포넌트
- [ ] 파일 검증 및 최적화
- [ ] 썸네일 생성

### Phase 3 (고도화) - 1-2주
**목표**: 프로덕션 레디 사이트

#### 3.1 UI/UX 향상
- [ ] 홈페이지 애니메이션 (Framer Motion)
- [ ] 스크롤 애니메이션
- [ ] 로딩 스테이트
- [ ] 마이크로 인터랙션

#### 3.2 성능 최적화
- [ ] 이미지 최적화 (Next.js Image)
- [ ] 코드 스플리팅
- [ ] 캐싱 전략
- [ ] Lighthouse 점수 최적화

#### 3.3 보안 강화
- [ ] Rate Limiting 구현
- [ ] CSRF 보호
- [ ] Input Sanitization
- [ ] 보안 헤더 설정

#### 3.4 모니터링 설정
- [ ] Google Analytics 연동
- [ ] Sentry 에러 추적
- [ ] Vercel Analytics
- [ ] 성능 모니터링

### Phase 4 (배포 및 운영) - 1주
**목표**: 프로덕션 배포 및 도메인 연결

#### 4.1 배포 준비
- [ ] 환경변수 Vercel 설정
- [ ] 빌드 최적화
- [ ] 프로덕션 테스트
- [ ] SEO 최종 점검

#### 4.2 도메인 연결
- [ ] DNS 설정 (twoloom.com)
- [ ] SSL 인증서 설정
- [ ] 리다이렉트 설정 (www → non-www)
- [ ] 최종 테스트

#### 4.3 런칭 후 작업
- [ ] 사이트맵 제출 (Google Search Console)
- [ ] 소셜미디어 메타태그 테스트
- [ ] 모니터링 알림 설정
- [ ] 백업 시스템 확인

### 우선순위별 중요도
🔴 **High**: Phase 1 - MVP 기능 (필수)
🟡 **Medium**: Phase 2 - 확장 기능 (중요)
🟢 **Low**: Phase 3-4 - 고도화 (선택적)

## 📝 더미 데이터 예시

### 회사 연혁
- 2023년 12월: Two Loom 설립
- 2024년 3월: AI 챗봇 솔루션 개발
- 2024년 6월: 첫 번째 클라이언트 프로젝트 완료
- 2024년 9월: 모바일 앱 개발 사업 확장
- 2024년 12월: 팀 확장 (직원 2명)

### 포트폴리오 카테고리
- 웹 개발 (Web Development)
- 모바일 앱 (Mobile App)
- AI 솔루션 (AI Solution)
- UI/UX 디자인 (UI/UX Design)