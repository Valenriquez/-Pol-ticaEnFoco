'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface SpeakerData {
  summary: string;
  fallacies: Array<string | { fallacy: string; description: string }>;
}

interface SpeakersData {
  [speaker: string]: string;
}

const SpeakersAnalysis = ({ data }: { data: SpeakersData | null }) => {
  if (!data) return null;

  const parseSpeakerData = (jsonString: string): SpeakerData => {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error parsing speaker data:', error);
      return { summary: 'Error parsing data', fallacies: [] };
    }
  };

  return (
    <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">Análisis de la Sesión</h3>
      {Object.entries(data).map(([speaker, jsonString]) => {
        const speakerData = parseSpeakerData(jsonString);
        return (
          <div key={speaker} className="mb-8 bg-white p-6 rounded-lg shadow">
            <h4 className="text-xl font-semibold mb-4 text-blue-600">{speaker}</h4>
            <div className="mb-4">
              <h5 className="text-lg font-medium mb-2 text-gray-700">Resumen:</h5>
              <p className="text-gray-600 leading-relaxed">{speakerData.summary || 'No hay resumen disponible.'}</p>
            </div>
            <div>
              <h5 className="text-lg font-medium mb-2 text-gray-700">Falacias detectadas:</h5>
              {speakerData.fallacies.length > 0 ? (
                <ul className="list-disc pl-5 space-y-2">
                  {speakerData.fallacies.map((fallacy, index) => (
                    <li key={index} className="text-gray-600">
                      {typeof fallacy === 'string' ? (
                        fallacy
                      ) : (
                        <>
                          <span className="font-medium">{fallacy.fallacy}:</span> {fallacy.description}
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-green-600 font-medium">No hay falacias detectadas</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default function AnalysisPage(){
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [showGraphics, setShowGraphics] = useState(false);
  const [speakersData, setSpeakersData] = useState<SpeakersData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/respuestas_speakers.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch speakers data');
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched data:', data); // Debug log
        setSpeakersData(data);
      })
      .catch(error => {
        console.error('Error loading speakers data:', error);
        setError('Failed to load speakers data. Please try again later.');
      });
  }, []);

  const videos = [
    { id: '1', title: 'Sesión Ordinaria del 13 de octubre del 2024', path: '/videos/video.mp4' },
    { id: '2', title: 'Sesión del Senado sobre seguridad pública' },
    { id: '3', title: 'Discusión sobre la Guardia Nacional' },
  ];

  const handleVideoSelect = (videoId: string) => {
    setSelectedVideo(videoId);
    setShowGraphics(false); // Reset graphics when a new video is selected
  };

  const handleShowGraphics = () => {
    setShowGraphics(!showGraphics); // Toggle the showGraphics state
  };

  const handleImageClick = (imagePath: string) => {
    setZoomedImage(imagePath);
  };

  const handleCloseZoom = () => {
    setZoomedImage(null);
  };

  const graphicsImages = [
    '/images/barra_tiempo.png',
    '/images/grafo_interacciones.png',
    '/images/linea_tiempo.png',
    '/images/lineas.png',
    '/images/pie_chart.png'
  ];

  const selectedVideoData = videos.find(v => v.id === selectedVideo);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <main className="flex-grow flex flex-col items-center justify-start px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Análisis de Videos</h1>

        <div className="w-full max-w-4xl">
          <h2 className="text-2xl font-semibold mb-4">Selecciona un video para analizar:</h2>
          <div className="space-y-4">
            {videos.map((video) => (
              <button
                key={video.id}
                onClick={() => handleVideoSelect(video.id)}
                className={`w-full text-left p-4 rounded-lg transition-colors duration-300 ${
                  selectedVideo === video.id
                    ? 'bg-black text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {video.title}
              </button>
            ))}
          </div>

          {selectedVideo && selectedVideoData?.path && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Video seleccionado:</h3>
              <video controls className="w-full max-w-3xl mx-auto">
                <source src={selectedVideoData.path} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {selectedVideo && (
            <button
              onClick={handleShowGraphics}
              className="mt-6 bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              {showGraphics ? 'Ocultar gráficas' : 'Mostrar gráficas'}
            </button>
          )}

          {showGraphics && (
            <div className="mt-8 p-6 bg-gray-100 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Gráficas del Análisis:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {graphicsImages.map((imagePath, index) => (
                  <div key={index} className="relative h-64 w-full cursor-pointer" onClick={() => handleImageClick(imagePath)}>
                    <Image
                      src={imagePath}
                      alt={`Gráfica ${index + 1}`}
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {zoomedImage && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={handleCloseZoom}>
              <div className="relative w-full h-full max-w-4xl max-h-4xl">
                <Image
                  src={zoomedImage}
                  alt="Zoomed graph"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="mt-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {!error && selectedVideo === '1' && <SpeakersAnalysis data={speakersData} />}
        </div>

        <Link href="/" className="mt-12 text-blue-600 hover:text-blue-800 transition-colors duration-300">
          ← Volver a la página principal
        </Link>
      </main>
    </div>
  );
}