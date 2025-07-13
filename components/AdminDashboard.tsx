'use client';

import { useState, useEffect } from 'react';
import { createClientClient } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email?: string;
}

interface Portfolio {
  id: number;
  title: any;
  description: any;
  short_description?: any;
  thumbnail_url?: string;
  tech_stack?: string[];
  status: string;
  created_at: string;
}

interface Inquiry {
  id: number;
  name: string;
  email: string;
  company?: string;
  message: string;
  status: string;
  created_at: string;
}

export default function AdminDashboard({ user }: { user: User }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientClient();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 포트폴리오 데이터 가져오기
      const { data: portfolioData } = await supabase
        .from('portfolios')
        .select('*')
        .order('created_at', { ascending: false });

      // 문의사항 데이터 가져오기
      const { data: inquiryData } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (portfolioData) setPortfolios(portfolioData);
      if (inquiryData) setInquiries(inquiryData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin');
  };

  const updateInquiryStatus = async (id: number, status: string) => {
    const { error } = await supabase
      .from('inquiries')
      .update({ status })
      .eq('id', id);

    if (!error) {
      setInquiries(prev => 
        prev.map(inquiry => 
          inquiry.id === id ? { ...inquiry, status } : inquiry
        )
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary-600">Two Loom Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user.email}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: '개요' },
              { id: 'portfolios', name: '포트폴리오' },
              { id: 'inquiries', name: '문의사항' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium text-gray-900 mb-2">총 포트폴리오</h3>
              <p className="text-3xl font-bold text-primary-600">{portfolios.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium text-gray-900 mb-2">새 문의</h3>
              <p className="text-3xl font-bold text-red-600">
                {inquiries.filter(i => i.status === 'new').length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium text-gray-900 mb-2">처리 중 문의</h3>
              <p className="text-3xl font-bold text-yellow-600">
                {inquiries.filter(i => i.status === 'in_progress').length}
              </p>
            </div>
          </div>
        )}

        {/* Portfolios Tab */}
        {activeTab === 'portfolios' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">포트폴리오 관리</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      제목
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      기술 스택
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      생성일
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {portfolios.map((portfolio) => (
                    <tr key={portfolio.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {portfolio.title?.ko || portfolio.title}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {portfolio.tech_stack?.slice(0, 3).map((tech, index) => (
                            <span
                              key={index}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                            >
                              {tech}
                            </span>
                          ))}
                          {portfolio.tech_stack && portfolio.tech_stack.length > 3 && (
                            <span className="text-xs text-gray-500">+{portfolio.tech_stack.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          portfolio.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {portfolio.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(portfolio.created_at).toLocaleDateString('ko-KR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Inquiries Tab */}
        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">문의사항 관리</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {inquiries.map((inquiry) => (
                <div key={inquiry.id} className="px-6 py-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {inquiry.name} ({inquiry.email})
                      </h3>
                      {inquiry.company && (
                        <p className="text-sm text-gray-500">{inquiry.company}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(inquiry.status)}`}>
                        {inquiry.status === 'new' ? '새 문의' : 
                         inquiry.status === 'in_progress' ? '처리 중' : '완료'}
                      </span>
                      <select
                        value={inquiry.status}
                        onChange={(e) => updateInquiryStatus(inquiry.id, e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="new">새 문의</option>
                        <option value="in_progress">처리 중</option>
                        <option value="closed">완료</option>
                      </select>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{inquiry.message}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(inquiry.created_at).toLocaleString('ko-KR')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}