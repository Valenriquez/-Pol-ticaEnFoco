'use client'
import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';

interface Resource {
  id: number;
  title: string;
  description: string;
  url: string;
  category: string;
}

const resources: Resource[] = [
  { id: 1, title: "Constitución Nacional", description: "Texto completo de la Constitución", url: `/${generateSlug("Constitución Nacional")}`, category: "Documentos Oficiales" },
  { id: 2, title: "Proceso Legislativo", description: "Guía sobre cómo se crean las leyes", url: `/${generateSlug("Proceso Legislativo")}`, category: "Educación Cívica" },
  { id: 3, title: "Registro Electoral", description: "Información sobre cómo registrarse para votar", url: `/${generateSlug("Registro Electoral")}`, category: "Participación Ciudadana" },
  // Add more resources as needed
];

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/á/g, 'a')
    .replace(/é/g, 'e')
    .replace(/í/g, 'i')
    .replace(/ó/g, 'o')
    .replace(/ú/g, 'u')
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function ResourceCard({ resource }: { resource: Resource }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <Link href={`/${generateSlug(resource.title)}`} passHref>
      <div
        ref={cardRef}
        className="bg-white overflow-hidden shadow rounded-lg relative transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
      >
        <div className="px-4 py-5 sm:p-6 relative z-10">
          <h3 className="text-lg leading-6 font-medium text-gray-900">{resource.title}</h3>
          <p className="mt-1 text-sm text-gray-500">{resource.description}</p>
        </div>
        <div className="bg-gray-50 px-4 py-4 sm:px-6 relative z-10">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            {resource.category}
          </span>
        </div>
        {isHovered && (
          <div
            className="absolute inset-0 bg-gradient-to-br from-gray-700 to-black opacity-10 transition-opacity duration-300 ease-in-out"
            style={{
              maskImage: `radial-gradient(circle 120px at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
              WebkitMaskImage: `radial-gradient(circle 120px at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
            }}
          />
        )}
      </div>
    </Link>
  );
}

export default function RecursosPoliticos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = Array.from(new Set(resources.map(r => r.category)));

  const filteredResources = resources.filter(resource =>
    (resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     resource.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedCategory === '' || resource.category === selectedCategory)
  );

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Recursos Políticos</h1>
        
        <div className="mb-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <input
            type="text"
            placeholder="Buscar recursos..."
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="relative">
            <select
              className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M7 10l5 5 5-5H7z"/></svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map(resource => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>

        {filteredResources.length === 0 && (
          <p className="text-center text-gray-500 mt-8">No se encontraron recursos que coincidan con tu búsqueda.</p>
        )}
      </div>
    </div>
  );
}