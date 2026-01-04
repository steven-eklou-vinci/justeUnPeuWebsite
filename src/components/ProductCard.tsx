'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/contexts/CartContext';
import SizeModal from './SizeModal';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image?: string; // Chemin vers l'image dans /public/images/
  description: string;
  sale?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  id, 
  name, 
  price, 
  image, 
  description, 
  sale = false 
}) => {
  const [showSizeModal, setShowSizeModal] = useState(false);
  const { isAuthenticated } = useAuth();
  const { addItem, setPendingItem } = useCart();
  const router = useRouter();
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Empêche la navigation vers la page produit
    if (!image) return; // Pas d'image, pas de produit valide
    
    // Si l'utilisateur n'est pas connecté, sauvegarder l'intention d'achat et rediriger
    if (!isAuthenticated) {
      setPendingItem({
        productId: id,
        name,
        price,
        image,
        size: '' // sera défini dans la modal après connexion
      });
      router.push('/auth/login');
      return;
    }
    
    // Si l'utilisateur est connecté, ouvrir la modal de sélection de taille
    setShowSizeModal(true);
  };

  const handleSizeSelected = (size: string) => {
    if (!image) return;
    
    addItem({
      productId: id,
      name,
      price,
      image,
      size
    });
  };

  const handleProductClick = () => {
    router.push(`/produit/${id}`);
  };

  return (
    <>
      <div className="group cursor-pointer transform transition-all duration-300 hover:scale-105">
        <div 
          className="relative bg-gray-100 mb-4 overflow-hidden rounded-lg" 
          style={{ aspectRatio: '3/4' }}
          onClick={handleProductClick}
        >
          {sale && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 text-xs font-bold z-20 rounded">
              SALE
            </div>
          )}
          {image ? (
            <Image 
              src={image} 
              alt={name}
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-sm">Image du produit</span>
            </div>
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
          
          {/* Quick Add Button */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
            <button 
              onClick={handleAddToCart}
              className="bg-black text-white px-6 py-3 text-sm font-medium hover:bg-gray-800 transition-colors shadow-lg rounded"
            >
              Ajouter au panier
            </button>
          </div>
        </div>
        
        <div className="space-y-1 cursor-pointer" onClick={handleProductClick}>
          <h3 className="text-lg font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
            {name}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
          <div className="flex items-center space-x-2">
            <span className={`text-lg font-bold ${sale ? 'text-red-600' : 'text-gray-900'}`}>
              {price.toFixed(2)} €
            </span>
            {sale && (
              <span className="text-gray-500 line-through text-sm">
                {(price * 1.3).toFixed(2)} €
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Modal de sélection de taille */}
      {showSizeModal && image && (
        <SizeModal
          isOpen={showSizeModal}
          onClose={() => setShowSizeModal(false)}
          product={{
            id,
            name,
            price,
            image
          }}
          onAddToCart={handleSizeSelected}
        />
      )}
    </>
  );
};

export default ProductCard;
