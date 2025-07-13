export default function Portfolio() {
  // 임시 포트폴리오 데이터
  const portfolioItems = [
    {
      id: 1,
      title: "AI 챗봇 솔루션",
      description: "고객 서비스 자동화를 위한 지능형 챗봇 시스템",
      tech: ["Next.js", "Python", "OpenAI API", "PostgreSQL"],
      image: "https://via.placeholder.com/400x250/6366f1/ffffff?text=AI+Chatbot",
      category: "AI 솔루션"
    },
    {
      id: 2,
      title: "모바일 커머스 앱",
      description: "사용자 친화적인 쇼핑 앱 개발",
      tech: ["React Native", "Node.js", "MongoDB", "Stripe"],
      image: "https://via.placeholder.com/400x250/8b5cf6/ffffff?text=Mobile+App",
      category: "모바일 앱"
    },
    {
      id: 3,
      title: "기업 웹사이트",
      description: "반응형 기업 홈페이지 및 관리자 시스템",
      tech: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase"],
      image: "https://via.placeholder.com/400x250/06b6d4/ffffff?text=Web+Development",
      category: "웹 개발"
    },
    {
      id: 4,
      title: "데이터 분석 대시보드",
      description: "실시간 비즈니스 인텔리전스 대시보드",
      tech: ["React", "D3.js", "Python", "FastAPI"],
      image: "https://via.placeholder.com/400x250/10b981/ffffff?text=Dashboard",
      category: "웹 개발"
    },
    {
      id: 5,
      title: "AI 이미지 분석 시스템",
      description: "의료 영상 자동 분석 AI 솔루션",
      tech: ["TensorFlow", "Python", "AWS", "Docker"],
      image: "https://via.placeholder.com/400x250/f59e0b/ffffff?text=AI+Vision",
      category: "AI 솔루션"
    },
    {
      id: 6,
      title: "IoT 모니터링 앱",
      description: "스마트 팩토리 센서 데이터 모니터링",
      tech: ["Flutter", "Firebase", "Arduino", "MQTT"],
      image: "https://via.placeholder.com/400x250/ef4444/ffffff?text=IoT+App",
      category: "모바일 앱"
    }
  ];

  const categories = ["전체", "웹 개발", "모바일 앱", "AI 솔루션"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <a href="/" className="text-xl font-bold text-primary-600">
                Two Loom
              </a>
            </div>
            <div className="flex items-center space-x-8">
              <a href="/" className="text-gray-700 hover:text-primary-600 transition-colors">홈</a>
              <a href="/portfolio" className="text-primary-600 font-medium">포트폴리오</a>
              <a href="/history" className="text-gray-700 hover:text-primary-600 transition-colors">연혁</a>
              <a href="/contact" className="text-gray-700 hover:text-primary-600 transition-colors">연락처</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            포트폴리오
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Two Loom이 구축한 다양한 프로젝트들을 확인해보세요
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-6 py-2 rounded-full transition-colors ${
                  category === "전체"
                    ? "bg-primary-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tech.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <button className="w-full bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors">
                    자세히 보기
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Two Loom</h3>
          <p className="text-gray-400 mb-6">
            혁신적인 AI 기술로 더 나은 소프트웨어를 만듭니다.
          </p>
          <p className="text-gray-500">
            © 2024 Two Loom. All rights reserved.
          </p>
          <p className="text-gray-500 mt-2">
            Contact: one@twoloom.com
          </p>
        </div>
      </footer>
    </div>
  );
}