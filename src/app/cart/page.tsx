'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const CartPage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Votre Panier</h1>
            <p className="text-gray-600 mb-8">Connectez-vous pour voir votre panier</p>
            <button
              onClick={() => router.push('/auth/login')}
              className="bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors"
            >
              Se connecter
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header du panier */}
        <div className="bg-white shadow-sm rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Votre Panier</h1>
            <p className="text-gray-600 mt-1">
              {totalItems} article{totalItems > 1 ? 's' : ''}
            </p>
          </div>

          {items.length === 0 ? (
            // Panier vide
            <div className="px-6 py-12 text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13h10m-10 0l-2.5-5" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Votre panier est vide</h3>
              <p className="text-gray-600 mb-6">Découvrez notre collection et ajoutez vos articles préférés</p>
              <button
                onClick={() => router.push('/collection')}
                className="bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors"
              >
                Voir la collection
              </button>
            </div>
          ) : (
            // Articles du panier
            <div className="divide-y divide-gray-200">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="px-6 py-6 flex items-center space-x-4">
                  {/* Image du produit */}
                  <div className="w-20 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <Image 
                      src={item.image} 
                      alt={item.name}
                      width={80}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Informations du produit */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">Taille: {item.size}</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">
                      {item.price.toFixed(2)} €
                    </p>
                  </div>

                  {/* Contrôles de quantité */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                      </svg>
                    </button>
                    
                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                    
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>

                  {/* Prix total pour cet item */}
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {(item.price * item.quantity).toFixed(2)} €
                    </p>
                  </div>

                  {/* Bouton supprimer */}
                  <button
                    onClick={() => removeItem(item.productId, item.size)}
                    className="text-red-600 hover:text-red-700 p-2"
                    title="Supprimer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Résumé et actions */}
        {items.length > 0 && (
          <div className="bg-white shadow-sm rounded-lg">
            <div className="px-6 py-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Résumé de la commande</h3>
                <button
                  onClick={clearCart}
                  className="text-sm text-gray-500 hover:text-red-600 underline"
                >
                  Vider le panier
                </button>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total ({totalItems} article{totalItems > 1 ? 's' : ''})</span>
                  <span className="font-medium">{totalPrice.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Livraison</span>
                  <span className="font-medium text-green-600">Gratuite</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-gray-900">{totalPrice.toFixed(2)} €</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button className="w-full bg-black text-white py-3 px-4 hover:bg-gray-800 transition-colors font-medium">
                  Procéder au paiement
                </button>
                <button
                  onClick={() => router.push('/collection')}
                  className="w-full border border-gray-300 text-gray-700 py-3 px-4 hover:bg-gray-50 transition-colors font-medium"
                >
                  Continuer les achats
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;