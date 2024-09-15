'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import InteractiveName from '../../components/InteractiveName';
import React from 'react';

export default function ConstitucionNacional() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [text3, setText3] = useState('');
  const [showFullText, setShowFullText] = useState(false);
  const fullText1 = "Los Primeros Pasos: Cuando México empieza su camino hacia la independencia, {{José María Morelos y Pavón}} nos presenta un documento clave: “Sentimientos de la Nación.” Aunque no era una Constitución, este texto marcó el rumbo al proclamar principios como la igualdad de todos los mexicanos y la abolición de la esclavitud. ¡Un gran primer paso hacia un país libre!";
  const fullText2 = "Algunos de los participantes fueron: {{José María Morelos y Pavón}}, {{Mariano Otero}}, {{Benito Juárez}}, {{Francisco I. Madero}}, {{Emiliano Zapata}} y {{Venustiano Carranza}}.";
  const fullText3 = "La Independencia de México Cuando México comienza su periodo de Independencia, {{José María Morelos y Pavón}} plasma en su célebre documento Sentimientos de la Nación, los principios fundamentales del México Independiente, aunque no fue una Constitución, sirvió como un documento rector para el país naciente, proclamaba la igualdad de los mexicanos y la abolición de la esclavitud. Constitución de Apatzingán En 1814, los miembros más destacados del movimiento insurgente se reunieron en Chilpancingo, luego, al ser perseguidos por los realistas, es decir, los que querían un gobierno de monarcas en México, mudaron el Congreso encargado de hacer la Constitución a Apatzingán, en el estado de Guerrero, en donde se creó la Constitución de Apatzingán, aunque nunca entró en vigor, reunía los siguientes derechos: igualdad, seguridad, propiedad y libertad. Así como un inicio de la división del poder en tres funciones.";
  const index1 = useRef(0);
  const index2 = useRef(0);
  const index3 = useRef(0);

  useEffect(() => {
    if (showFullText) return;

    function typeWriter1() {
      if (index1.current < fullText1.length) {
        setText1((prev) => prev + fullText1.charAt(index1.current));
        index1.current++;
        requestAnimationFrame(typeWriter1);
      } else if (index2.current === 0) {
        setTimeout(() => requestAnimationFrame(typeWriter2), 500);
      }
    }

    function typeWriter2() {
      if (index2.current < fullText2.length) {
        setText2((prev) => prev + fullText2.charAt(index2.current));
        index2.current++;
        requestAnimationFrame(typeWriter2);
      } else if (index3.current === 0) {
        setTimeout(() => requestAnimationFrame(typeWriter3), 500);
      }
    }

    function typeWriter3() {
      if (index3.current < fullText3.length) {
        setText3((prev) => prev + fullText3.charAt(index3.current));
        index3.current++;
        requestAnimationFrame(typeWriter3);
      }
    }

    const timeoutId = setTimeout(() => {
      requestAnimationFrame(typeWriter1);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [showFullText]);

  const renderInteractiveText = (text: string) => {
    const names = [
      { name: 'José María Morelos y Pavón', link: 'https://es.wikipedia.org/wiki/José_María_Morelos' },
      { name: 'Mariano Otero', link: 'https://es.wikipedia.org/wiki/Mariano_Otero' },
      { name: 'Benito Juárez', link: 'https://es.wikipedia.org/wiki/Benito_Juárez' },
      { name: 'Francisco I. Madero', link: 'https://es.wikipedia.org/wiki/Francisco_I._Madero' },
      { name: 'Emiliano Zapata', link: 'https://es.wikipedia.org/wiki/Emiliano_Zapata' },
      { name: 'Venustiano Carranza', link: 'https://es.wikipedia.org/wiki/Venustiano_Carranza' },
    ];

    return (
      <>
        {text.split(/(\{\{.*?\}\})/g).map((part, index) => {
          if (part.startsWith('{{') && part.endsWith('}}')) {
            const name = part.slice(2, -2);
            const nameObj = names.find(n => n.name === name);
            return nameObj ? (
              <InteractiveName
                key={index}
                name={nameObj.name}
                wikiLink={nameObj.link}
              />
            ) : name;
          }
          return part;
        })}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 animate-slideDown">Registro Electoral</h1>
          <button 
            onClick={() => setShowFullText(!showFullText)}
            className="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300"
          >
            {showFullText ? 'Ver animación' : 'Ver texto completo'}
          </button>
        </div>
        
        <p className="text-lg text-gray-700 mb-4 h-24 overflow-y-auto">
          {showFullText ? renderInteractiveText(fullText1) : (
            <>
              {renderInteractiveText(text1)}
              {index1.current < fullText1.length && <span className="animate-blink">|</span>}
            </>
          )}
        </p>

        <p className="text-lg text-gray-700 mb-8 h-48 overflow-y-auto">
          {showFullText ? renderInteractiveText(fullText2) : (
            <>
              {renderInteractiveText(text2)}
              {index2.current < fullText2.length && <span className="animate-blink">|</span>}
            </>
          )}
        </p>
        
        <div className="flex justify-center items-center my-6">
          <div className="overflow-hidden">
            <Image
              src="/images/thrid-image.jpg"
              alt="Description of the image"
              width={600}
              height={900}
              className="max-w-full h-auto transition-transform duration-300 ease-in-out hover:scale-110"
            />
          </div>
        </div>
        
        <p className="text-lg text-gray-700 mb-8 h-48 overflow-y-auto">
          {showFullText ? renderInteractiveText(fullText3) : (
            <>
              {renderInteractiveText(text3)}
              {index3.current < fullText3.length && <span className="animate-blink">|</span>}
            </>
          )}
        </p>

        <div className="flex justify-center mt-8">
          <a 
            href="https://www.diputados.gob.mx/LeyesBiblio/pdf/CPEUM.pdf" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-block"
          >
            <button className="w-24 h-24 bg-blue-500 rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex flex-col items-center justify-center">
              <svg className="w-10 h-10 text-white mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="text-white text-xs font-semibold">PDF</span>
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}