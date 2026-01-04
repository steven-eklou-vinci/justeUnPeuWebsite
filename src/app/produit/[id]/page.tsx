"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Toast from '@/components/Toast';
import { useParams, useRouter } from 'next/navigation';
import { getProductById } from '@/data/products';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/contexts/CartContext';

const ProductDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const productId = parseInt(params.id as string);
  
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const product = getProductById(productId);
  const { isAuthenticated } = useAuth();
  const { addItem, setPendingItem } = useCart();

  const handleAddToCart = () => {
    if (!product) return;

    // Si l'utilisateur n'est pas connecté, sauvegarder l'intention d'achat et rediriger
    if (!isAuthenticated) {
      setPendingItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: selectedSize || 'M' // Taille par défaut si pas sélectionnée
      });
      router.push('/auth/login');
      return;
    }

    // Si connecté mais pas de taille sélectionnée, demander de sélectionner une taille
    if (!selectedSize) {
      setToastMessage('Veuillez sélectionner une taille');
      setShowToast(true);
      return;
    }

    // Ajouter plusieurs exemplaires si quantity > 1
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: selectedSize
      });
    }

    // Feedback visuel
    setToastMessage(`${quantity} article(s) ajouté(s) au panier !`);
    setShowToast(true);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Produit non trouvé</h1>
          <a href="/collection" className="text-gray-600 hover:text-gray-900">
            Retour à la collection
          </a>
        </div>
      </div>
    );
  }

  // Images du produit (utilise les images définies dans les données ou l'image principale par défaut)
  const productImages = product?.images || [product?.image || '/images/placeholder.jpg'];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex space-x-2 text-sm text-gray-500">
          <a href="/" className="hover:text-gray-900">Accueil</a>
          <span>/</span>
          <a href="/collection" className="hover:text-gray-900">Collection</a>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Galerie d'images */}
          <div className="space-y-4">
            {/* Image principale */}
            <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden group">
              <Image
                src={productImages[selectedImageIndex]}
                alt={product.name}
                fill
                style={{ objectFit: 'cover' }}
                className="transition-all duration-300"
                quality={95}
              />
              
              {/* Flèches de navigation - visibles au survol */}
              <button
                onClick={() => setSelectedImageIndex(
                  selectedImageIndex === 0 ? productImages.length - 1 : selectedImageIndex - 1
                )}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:scale-110"
                aria-label="Image précédente"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={() => setSelectedImageIndex(
                  selectedImageIndex === productImages.length - 1 ? 0 : selectedImageIndex + 1
                )}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:scale-110"
                aria-label="Image suivante"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              {/* Indicateur de position */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {productImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      selectedImageIndex === index ? 'bg-white' : 'bg-white/50'
                    }`}
                    aria-label={`Aller à l'image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            
            {/* Miniatures */}
            <div className="flex space-x-4">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative w-20 h-24 bg-gray-100 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    selectedImageIndex === index ? 'border-gray-900' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - Vue ${index + 1}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    quality={85}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Informations produit */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-light text-gray-900 mb-4">
                {product.name}
              </h1>
              <p className="text-3xl font-bold text-gray-900 mb-6">
                {product.price}€
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Sélection de taille */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Taille</h3>
              <div className="flex space-x-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 border rounded-lg font-medium transition-all duration-200 ${
                      selectedSize === size
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-300 text-gray-700 hover:border-gray-900'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantité */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quantité</h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-900 transition-colors"
                >
                  -
                </button>
                <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-900 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="space-y-4">
              <button 
                onClick={handleAddToCart}
                className="w-full py-4 text-lg font-medium transition-all duration-300 bg-gray-900 text-white hover:bg-gray-800"
              >
                Ajouter au panier
              </button>
              <button className="w-full py-4 text-lg font-medium border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300">
                Acheter maintenant
              </button>
            </div>

            {/* Services */}
            <div className="border-t pt-8">
              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span>Livraison gratuite à partir de 50€</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Retours gratuits sous 14 jours</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Paiement 100% sécurisé</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-4">JUSTE UN PEU</h3>
          <p className="text-gray-400">
            Mode • Style • Élégance
          </p>
        </div>
      </footer>

      {/* Toast notification */}
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

export default ProductDetailPage;
