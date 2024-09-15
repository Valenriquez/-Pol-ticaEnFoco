'use client'
import React, { useState, useEffect } from 'react';

interface NewsItem {
  id: number;
  title: string;
  description: string;
  url: string;
  date: string;
}

const mockNewsData: NewsItem[] = [
  {
    id: 1,
    title: "Reforma Judicial en México",
    description: "Protestas y votación masiva sobre la reforma judicial en México.",
    url: "https://cnnespanol.cnn.com/2024/09/12/ultimas-noticias-reforma-judicial-mexico-protestas-votacion-mas-orix/",
    date: "2024-09-12"
  },
  {
    id: 2,
    title: "Elecciones en México",
    description: "Resultados de las elecciones en México.",
    url: "https://cnnespanol.cnn.com/2024/09/12/ultimas-noticias-elecciones-mexico/",
    date: "2024-09-12"
  },
  // Add more mock news items as needed
];

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setNews(mockNewsData);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Últimas Noticias</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <div key={item.id} className="bg-white overflow-hidden shadow rounded-lg relative transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 cursor-pointer">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">{item.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900 mt-2 block">Read more</a>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <span className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}