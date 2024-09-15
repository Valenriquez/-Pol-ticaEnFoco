'use client'

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

type ChecklistResults = Record<number, number>;

export default function PoliticaEnFoco() {
  const [isVisible1, setIsVisible1] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  const [countdown, setCountdown] = useState('');
  const imageRef1 = useRef<HTMLDivElement | null>(null);
  const imageRef2 = useRef<HTMLDivElement | null>(null);
  const [checklistResults, setChecklistResults] = useState<ChecklistResults>({});
  const [interpretation, setInterpretation] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === imageRef1.current) {
              setIsVisible1(true);
            } else if (entry.target === imageRef2.current) {
              setIsVisible2(true);
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (imageRef1.current) observer.observe(imageRef1.current);
    if (imageRef2.current) observer.observe(imageRef2.current);

    return () => {
      if (imageRef1.current) observer.unobserve(imageRef1.current);
      if (imageRef2.current) observer.unobserve(imageRef2.current);
    };
  }, []);

  useEffect(() => {
    const targetDate = new Date('2024-09-30T00:00:00');
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      if (difference <= 0) {
        clearInterval(interval);
        setCountdown('¡El evento ha comenzado!');
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setCountdown(`${days} días, ${hours} horas, ${minutes} minutos, ${seconds} segundos`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCheckboxChange = (questionIndex: number, optionIndex: number) => {
    setChecklistResults(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };
  
  const generateResults = () => {
    const checkedCount = Object.values(checklistResults).filter(value => value === 0).length;
    let result = '';
    if (checkedCount >= 10) {
      result = 'Participación alta: Estás muy involucrado en tu comunidad y participas activamente en los asuntos ciudadanos.';
    } else if (checkedCount >= 5) {
      result = 'Participación moderada: Participas en algunos aspectos, pero podrías involucrarte más en temas importantes.';
    } else {
      result = 'Participación baja: Es posible que no estés participando activamente en tu comunidad o en los temas ciudadanos. Considera informarte y ser más proactivo.';
    }
    setInterpretation(result);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <main className="flex-grow flex flex-col items-center justify-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-16 mt-16 text-center">#PolíticaEnFoco</h1>
        <div className="text-2xl font-semibold mb-8 text-center">
          {countdown}
        </div>
        <div className="text-lg font-medium mb-8 text-center text-gray-600">
          <div className="inline-block">
            Para aprobar Extensión de la prisión preventiva oficiosa, <br/>
            Transferencia de la Guardia Nacional, <br/>
            Eliminación de órganos autónomos del Estado
          </div>
        </div>

        <div className="flex flex-col space-y-6 p-4 max-w-3xl mx-auto">
          <Link href="/analysis" legacyBehavior>
            <a>
              <button className="flex items-center justify-start w-full bg-black text-white px-12 py-4 rounded-full hover:bg-gray-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 shadow-lg">
                <svg className="w-8 h-8 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xl font-semibold ml-6">Análisis de Noticias</span>
              </button>
            </a>
          </Link>
          
          <Link href="https://www.hcnl.gob.mx/organizacion/distritos.php" legacyBehavior>
            <a className="flex items-center justify-start w-full bg-black text-white px-12 py-4 rounded-full hover:bg-gray-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 shadow-lg">
              <svg className="w-8 h-8 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="text-xl font-semibold ml-6">Conoce a tu senado y diputados</span>
            </a>
          </Link>
          
          <Link href="/resources" legacyBehavior>
            <a className="flex items-center justify-start w-full bg-black text-white px-12 py-4 rounded-full hover:bg-gray-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 shadow-lg">
              <svg className="w-8 h-8 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <span className="text-xl font-semibold ml-6">Recursos</span>
            </a>
          </Link>

          <Link href="/news" legacyBehavior>
            <a className="flex items-center justify-start w-full bg-black text-white px-12 py-4 rounded-full hover:bg-gray-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 shadow-lg">
              <svg className="w-8 h-8 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xl font-semibold ml-6">Noticias</span>
            </a>
          </Link>
        </div>

        <div className="mt-10 p-6 bg-gray-100 rounded-lg shadow-md max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">Checklist de Participación Ciudadana en México</h2>
          <form>
            {[
              { question: "Registro para votar en el INE", options: ["Sí", "No"] },
              { question: "Participación en elecciones (locales, estatales o federales)", options: ["Siempre voto", "A veces voto", "Nunca voto"] },
              { question: "He asistido a reuniones comunitarias o vecinales", options: ["Sí, frecuentemente", "Rara vez", "Nunca"] },
              { question: "He participado en manifestaciones o protestas pacíficas", options: ["Sí", "No"] },
              { question: "Estoy inscrito en alguna organización de la sociedad civil (ONG)", options: ["Sí", "No"] },
              { question: "He participado en consultas públicas organizadas por el gobierno (como el presupuesto participativo, etc.)", options: ["Sí", "No"] },
              { question: "He firmado peticiones en línea o físicas para cambios en políticas públicas", options: ["Sí, varias veces", "Una o dos veces", "Nunca"] },
              { question: "He participado en actividades voluntarias para mejorar mi comunidad", options: ["Sí, frecuentemente", "A veces", "Nunca"] },
              { question: "He colaborado con proyectos o iniciativas ciudadanas (ejemplo: recolección de basura, campañas de reciclaje, etc.)", options: ["Sí", "No"] },
              { question: "He informado o denunciado problemas locales (como seguridad, infraestructura) a las autoridades o a la comunidad", options: ["Sí", "No"] },
              { question: "He asistido a debates o foros sobre temas políticos o sociales", options: ["Sí", "No"] },
              { question: "Sigo y me informo constantemente sobre noticias políticas y sociales del país", options: ["Sí", "No"] },
              { question: "He utilizado medios electrónicos o redes sociales para expresar opiniones políticas", options: ["Sí, frecuentemente", "A veces", "Nunca"] },
              { question: "He colaborado o participado en actividades escolares o de mi lugar de trabajo relacionadas con temas ciudadanos", options: ["Sí", "No"] },
            ].map((item, index) => (
              <div key={index} className="mb-4">
                <p className="font-semibold mb-2">{item.question}</p>
                {item.options.map((option, optionIndex) => (
                  <label key={optionIndex} className="block mb-1">
                    <input 
                      type="checkbox" 
                      className="mr-2"
                      checked={checklistResults[index] === optionIndex}
                      onChange={() => handleCheckboxChange(index, optionIndex)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            ))}
          </form>
          <button 
            onClick={generateResults}
            className="mt-4 bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            Generar Resultados
          </button>
          {interpretation && (
            <div className="mt-4 p-4 bg-white rounded-lg">
              <h3 className="text-xl font-bold mb-2">Interpretación del resultado:</h3>
              <p>{interpretation}</p>
            </div>
          )}
        </div>
        
        <div className="mt-20 pb-20 space-y-20">
          <div ref={imageRef1} className={`max-w-md mx-auto transition-all duration-1000 ease-in-out ${isVisible1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <img
              src="/path-to-your-image1.jpg"
              alt="Descriptive alt text for image 1"
              className="w-full h-auto rounded-lg shadow-lg"
            />
            <p className="mt-4 text-center text-gray-600">
              This is a description of the first image. It provides context and explains what the image represents.
            </p>
          </div>

          <div ref={imageRef2} className={`max-w-md mx-auto transition-all duration-1000 ease-in-out ${isVisible2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <img
              src="/path-to-your-image2.jpg"
              alt="Descriptive alt text for image 2"
              className="w-full h-auto rounded-lg shadow-lg"
            />
            <p className="mt-4 text-center text-gray-600">
              This is a description of the second image. It provides context and explains what the image represents.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}