"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import { products } from '@/data/products';

const CollectionPage: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showColorPalette, setShowColorPalette] = useState(false);

  const mainCategories = [
    { id: 'all', name: 'Tout' },
    { id: 'colors', name: 'Couleurs' }
  ];

  const colorPalettes = [
    { id: 'blanc', name: 'Blanc', color: '#ffffff' },
    { id: 'noir', name: 'Noir', color: '#000000' },
    { id: 'orange', name: 'Orange', color: '#ff6b35' }
  ];

  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === 'colors') {
      setShowColorPalette(!showColorPalette);
      setSelectedFilter('all');
    } else {
      setSelectedFilter(categoryId);
      setShowColorPalette(false);
    }
  };

  const handleColorClick = (colorId: string) => {
    setSelectedFilter(colorId);
  };

  const filteredItems = selectedFilter === 'all' 
    ? products 
    : products.filter(item => item.color === selectedFilter);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-light text-gray-900 tracking-tight mb-6">
            NOTRE
            <span className="block font-bold">COLLECTION</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez notre sélection exclusive de pièces mode, conçues pour vous sublimer en toute occasion
          </p>
        </div>
      </section>

      {/* Filtres */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Catégories principales */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {mainCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`px-6 py-3 rounded-full transition-all duration-300 font-medium ${
                  (category.id === 'all' && selectedFilter === 'all' && !showColorPalette) ||
                  (category.id === 'colors' && showColorPalette)
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Palettes de couleurs (affiché seulement si "Couleurs" est sélectionné) */}
          {showColorPalette && (
            <div className="flex flex-wrap justify-center gap-4">
              {colorPalettes.map((color) => (
                <button
                  key={color.id}
                  onClick={() => handleColorClick(color.id)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300 font-medium ${
                    selectedFilter === color.id
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: color.color }}
                  />
                  {color.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Grille de produits */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <a 
                key={item.id} 
                href={`/produit/${item.id}`}
                className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 block"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="group-hover:scale-105 transition-transform duration-500"
                    quality={95}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  
                  {/* Overlay au survol */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Bouton d'action */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <a 
                      href={`/produit/${item.id}`}
                      className="bg-white text-gray-900 px-6 py-3 font-medium hover:bg-gray-100 transition-colors duration-200"
                    >
                      Voir le produit
                    </a>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {item.name}
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {item.price}€
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer simple */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-4">JUSTE UN PEU</h3>
          <p className="text-gray-400">
            Mode • Style • Élégance
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CollectionPage;
