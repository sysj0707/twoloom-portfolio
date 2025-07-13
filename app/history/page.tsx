'use client';

import { useEffect, useState } from 'react';

interface HistoryItem {
  id: number;
  year: string;
  title: string;
  description: string;
  date: string;
}

export default function History() {
  const [milestones, setMilestones] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/history');
      const data = await response.json();
      if (data.history) {
        setMilestones(data.history);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
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
              <a href="/history" className="text-primary-600 font-medium">연혁</a>
              <a href="/contact" className="text-gray-700 hover:text-primary-600 transition-colors">연락처</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            회사 연혁
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Two Loom의 성장 과정과 주요 성과들을 확인해보세요
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : milestones.length > 0 ? (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary-200"></div>
              
              {milestones.map((milestone, index) => (
                <div key={milestone.id} className="relative flex items-start mb-12">
                  {/* Timeline dot */}
                  <div className="flex-shrink-0 w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {milestone.year.slice(-2)}
                  </div>
                  
                  {/* Content */}
                  <div className="ml-8 bg-white rounded-lg shadow-md p-6 flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {milestone.title}
                      </h3>
                      <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded">
                        {milestone.year}
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">연혁 정보가 없습니다.</p>
            </div>
          )}
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            미래 비전
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">혁신적 기술</h3>
              <p className="text-gray-600">
                최신 AI 기술을 활용한 혁신적인 솔루션 개발
              </p>
            </div>
            
            <div className="p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">글로벌 확장</h3>
              <p className="text-gray-600">
                해외 시장 진출을 통한 글로벌 기업으로 성장
              </p>
            </div>
            
            <div className="p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">고객 만족</h3>
              <p className="text-gray-600">
                고객의 성공을 위한 최고 품질의 서비스 제공
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
  );
}