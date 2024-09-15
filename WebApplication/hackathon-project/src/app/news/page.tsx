'use client'
import React, { useState, useEffect } from 'react';

interface NewsItem {
  id: number;
  title: string;  
  description: string;
  url: string;
  date: string;
}

// Mock data
const mockNewsData: NewsItem[] = [
  {
    id: 1,
    title: "Reforma electoral propuesta en el Congreso",
    description: "El Congreso debate una nueva reforma electoral que podría cambiar el panorama político.",
    url: "https://example.com/news1",
    date: "2023-05-15"
  },
  {
    id: 2,
    title: "Nuevas políticas de seguridad nacional anunciadas",
    description: "El gobierno ha anunciado nuevas medidas de seguridad nacional que entrarán en vigor el próximo mes.",
    url: "https://example.com/news2",
    date: "2023-05-14"
  },
  {
    id: 3,
    title: "Debate sobre la autonomía de instituciones públicas",
    description: "Se intensifica el debate sobre la autonomía de ciertas instituciones públicas clave.",
    url: "https://example.com/news3",
    date: "2023-05-13"
  }
];

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [explanations, setExplanations] = useState<{[key: number]: string}>({});
  const [explaining, setExplaining] = useState<{[key: number]: boolean}>({});

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setNews(mockNewsData);
      setLoading(false);
    }, 1000);
  }, []);

  const handleExplain = async (id: number, title: string) => {
    if (explaining[id]) return; // Prevent multiple clicks

    setExplaining(prev => ({ ...prev, [id]: true }));
    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: title }),
      });

      if (!response.ok) {
        throw new Error('Failed to get explanation');
      }

      const data = await response.json();
      // Remove asterisks from the explanation
      const cleanedExplanation = data.explanation.replace(/\*\*/g, '');
      setExplanations(prev => ({ ...prev, [id]: cleanedExplanation }));
    } catch (error) {
      console.error('Error:', error);
      setExplanations(prev => ({ ...prev, [id]: 'Failed to get explanation. Please try again.' }));
    } finally {
      setExplaining(prev => ({ ...prev, [id]: false }));
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Últimas Noticias</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <div key={item.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{item.title}</h3>
                  <button
                    onClick={() => handleExplain(item.id, item.title)}
                    disabled={explaining[item.id]}
                    className="ml-2 flex-shrink-0 bg-indigo-600 text-white p-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Explain"
                  >
                    {explaining[item.id] ? (
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900 mt-2 block">Read more</a>
                {explanations[item.id] && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200 shadow-sm">
                    <h4 className="text-sm font-semibold mb-2 text-gray-700">Explicación mediante AI:</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{explanations[item.id]}</p>
                  </div>
                )}
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