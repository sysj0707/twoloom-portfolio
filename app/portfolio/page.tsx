'use client';

import { useEffect, useState } from 'react';

interface Portfolio {
  id: number;
  title: string;
  description: string;
  short_description?: string;
  thumbnail_url?: string;
  tech_stack?: string[];
  category_name: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function Portfolio() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchPortfolios();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.categories) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchPortfolios = async (category = 'all') => {
    try {
      setLoading(true);
      const response = await fetch(`/api/portfolios?category=${category}`);
      const data = await response.json();
      if (data.portfolios) {
        setPortfolios(data.portfolios);
      }
    } catch (error) {
      console.error('Failed to fetch portfolios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    fetchPortfolios(categorySlug);
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
                key={category.slug}
                onClick={() => handleCategoryChange(category.slug)}
                className={`px-6 py-2 rounded-full transition-colors ${
                  selectedCategory === category.slug
                    ? "bg-primary-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : portfolios.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolios.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <img
                    src={item.thumbnail_url || "https://via.placeholder.com/400x250/6366f1/ffffff?text=Portfolio"}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                        {item.category_name}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {item.short_description || item.description}
                    </p>
                    {item.tech_stack && item.tech_stack.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.tech_stack.map((tech) => (
                          <span
                            key={tech}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    <button className="w-full bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors">
                      자세히 보기
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">해당 카테고리에 포트폴리오가 없습니다.</p>
            </div>
          )}
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