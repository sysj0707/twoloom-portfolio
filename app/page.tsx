export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary-600">
                Two Loom
              </h1>
            </div>
            <div className="flex items-center space-x-8">
              <a href="/" className="text-primary-600 font-medium">홈</a>
              <a href="/portfolio" className="text-gray-700 hover:text-primary-600 transition-colors">포트폴리오</a>
              <a href="/history" className="text-gray-700 hover:text-primary-600 transition-colors">연혁</a>
              <a href="/contact" className="text-gray-700 hover:text-primary-600 transition-colors">연락처</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            AI 기반 소프트웨어 개발
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            혁신적인 AI 기술로 더 나은 소프트웨어를 만듭니다.
          </p>
          <button className="btn-primary text-lg">
            프로젝트 시작하기
          </button>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            우리의 서비스
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* 웹 개발 */}
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                웹 개발
              </h3>
              <p className="text-gray-600">
                현대적이고 반응형 웹사이트 개발
              </p>
            </div>

            {/* 모바일 앱 */}
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                모바일 앱
              </h3>
              <p className="text-gray-600">
                iOS/Android 네이티브 및 크로스플랫폼 앱
              </p>
            </div>

            {/* AI 솔루션 */}
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                AI 솔루션
              </h3>
              <p className="text-gray-600">
                맞춤형 AI 모델 및 자동화 시스템
              </p>
            </div>
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
  )
}