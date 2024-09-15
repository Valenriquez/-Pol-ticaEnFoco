'use client'

import React, { useState } from 'react';

export default function Explainer() {
  const [text, setText] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleExplain = async () => {
    if (!text.trim()) {
      alert('Please enter some text to explain.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to get explanation');
      }

      const data = await response.json();
      setExplanation(data.explanation);
    } catch (error) {
      console.error('Error:', error);
      setExplanation('Failed to get explanation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 border-b pb-2">Explainer</h1>
      <div className="mb-6">
        <label htmlFor="explainText" className="block text-xl font-semibold mb-2 text-gray-800">
          Text to explain:
        </label>
        <textarea
          id="explainText"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter the text you want explained..."
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-indigo-500"
          rows={4}
        />
      </div>
      <button
        onClick={handleExplain}
        disabled={isLoading || !text.trim()}
        className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Generating Explanation...' : 'Explain'}
      </button>
      {explanation && (
        <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Explanation:</h3>
          <p className="text-gray-700 leading-relaxed">{explanation}</p>
        </div>
      )}
    </div>
  );
}