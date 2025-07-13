'use client';

import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 임시로 alert로 처리 (실제로는 API 호출 등)
    alert('문의가 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.');
    setFormData({ name: '', email: '', company: '', message: '' });
  };

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
              <a href="/portfolio" className="text-gray-700 hover:text-primary-600 transition-colors">포트폴리오</a>
              <a href="/history" className="text-gray-700 hover:text-primary-600 transition-colors">연혁</a>
              <a href="/contact" className="text-primary-600 font-medium">연락처</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            연락처
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            프로젝트 문의나 궁금한 점이 있으시면 언제든 연락해주세요
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">연락 정보</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">이메일</h3>
                    <p className="text-gray-600">one@twoloom.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">위치</h3>
                    <p className="text-gray-600">서울특별시</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">업무 시간</h3>
                    <p className="text-gray-600">평일 9:00 - 18:00</p>
                  </div>
                </div>
              </div>

              {/* Services */}
              <div className="mt-12">
                <h3 className="text-xl font-bold text-gray-900 mb-6">주요 서비스</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <h4 className="font-medium text-gray-900 mb-2">웹 개발</h4>
                    <p className="text-sm text-gray-600">반응형 웹사이트 및 웹앱 개발</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <h4 className="font-medium text-gray-900 mb-2">모바일 앱</h4>
                    <p className="text-sm text-gray-600">iOS/Android 앱 개발</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <h4 className="font-medium text-gray-900 mb-2">AI 솔루션</h4>
                    <p className="text-sm text-gray-600">맞춤형 AI 서비스 개발</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <h4 className="font-medium text-gray-900 mb-2">컨설팅</h4>
                    <p className="text-sm text-gray-600">기술 컨설팅 및 전략 수립</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">문의하기</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    이름 *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="이름을 입력해주세요"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    이메일 *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="이메일을 입력해주세요"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    회사명
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="회사명을 입력해주세요"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    문의 내용 *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="문의 내용을 자세히 입력해주세요"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-600 transition-colors"
                >
                  문의 보내기
                </button>
              </form>
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
  );
}