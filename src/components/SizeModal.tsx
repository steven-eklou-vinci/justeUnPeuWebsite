'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface SizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
  };
  onAddToCart: (size: string) => void;
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const SizeModal: React.FC<SizeModalProps> = ({ 
  isOpen, 
  onClose, 
  product, 
  onAddToCart 
}) => {
  const [selectedSize, setSelectedSize] = useState<string>('');

  if (!isOpen) return null;

  const handleAddToCart = () => {
    if (selectedSize) {
      onAddToCart(selectedSize);
      setSelectedSize('');
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header avec bouton de fermeture */}
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            Sélectionner une taille
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenu du produit */}
        <div className="p-6">
          <div className="flex space-x-4 mb-6">
            {/* Image du produit */}
            <div className="w-20 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <Image 
                src={product.image} 
                alt={product.name}
                width={80}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Info produit */}
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 mb-1">
                {product.name}
              </h4>
              <p className="text-lg font-bold text-gray-900">
                {product.price.toFixed(2)} €
              </p>
            </div>
          </div>

          {/* Sélection de taille */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Taille
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 px-4 border text-sm font-medium transition-all ${
                    selectedSize === size
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 text-gray-900 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Guide des tailles */}
          <div className="mb-6">
            <button className="text-sm text-gray-600 hover:text-gray-900 underline">
              Guide des tailles
            </button>
          </div>

          {/* Bouton ajouter au panier */}
          <button
            onClick={handleAddToCart}
            disabled={!selectedSize}
            className={`w-full py-3 px-4 font-medium transition-all ${
              selectedSize
                ? 'bg-black text-white hover:bg-gray-800'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {selectedSize ? 'Ajouter au panier' : 'Sélectionner une taille'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SizeModal;