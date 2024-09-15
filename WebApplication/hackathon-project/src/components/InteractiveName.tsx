import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface InteractiveNameProps {
  name: string;
  wikiLink: string;
}

const InteractiveName: React.FC<InteractiveNameProps> = ({ name, wikiLink }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const nameRef = useRef<HTMLSpanElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const fetchSummary = async () => {
    setIsLoading(true);
    const apiUrl = `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`;
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setSummary(data.extract);
    } catch (error) {
      console.error('Error fetching summary:', error);
      setSummary('Failed to load summary.');
    }
    setIsLoading(false);
  };

  const handleClick = () => {
    if (!showPopup) {
      const rect = nameRef.current?.getBoundingClientRect();
      if (rect) {
        setPopupPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX
        });
      }
      if (!summary) {
        fetchSummary();
      }
    }
    setShowPopup(!showPopup);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node) && 
          nameRef.current && !nameRef.current.contains(event.target as Node)) {
        setShowPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <span 
        ref={nameRef}
        className="cursor-pointer hover:underline hover:text-blue-600 transition-colors duration-300"
        onClick={handleClick}
      >
        {name}
      </span>
      {showPopup && (
        <div 
          ref={popupRef}
          className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden"
          style={{
            width: '300px',
            height: '300px',
            top: `${popupPosition.top}px`,
            left: `${popupPosition.left}px`
          }}
        >
          <div className="p-4 h-full flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-lg">{name}</h3>
              <button onClick={() => setShowPopup(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-grow overflow-y-auto">
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                <p className="text-sm text-gray-700 mb-2">{summary}</p>
              )}
            </div>
            <Link href={wikiLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm mt-2">
              Read more on Wikipedia
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default InteractiveName;