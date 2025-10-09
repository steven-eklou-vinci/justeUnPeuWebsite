'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

export interface PendingItem {
  productId: number;
  name: string;
  price: number;
  image: string;
  size: string;
}

interface CartContextType {
  items: CartItem[];
  pendingItem: PendingItem | null;
  totalItems: number;
  totalPrice: number;
  showSizeModal: boolean;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: number, size: string) => void;
  updateQuantity: (productId: number, size: string, quantity: number) => void;
  clearCart: () => void;
  setPendingItem: (item: PendingItem | null) => void;
  addPendingItemToCart: () => void;
  setShowSizeModal: (show: boolean) => void;
  handleSizeSelected: (size: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart doit être utilisé dans un CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [pendingItem, setPendingItem] = useState<PendingItem | null>(null);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [cartLoaded, setCartLoaded] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Fonctions pour appeler les API du panier
  const fetchUserCart = async (): Promise<CartItem[]> => {
    try {
      const response = await fetch('/api/cart');
      const data = await response.json();
      return data.success ? data.items : [];
    } catch (error) {
      console.error('Erreur lors de la récupération du panier:', error);
      return [];
    }
  };

  const saveUserCartAPI = async (cartItems: CartItem[]): Promise<boolean> => {
    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            ...item,
            addedAt: new Date()
          }))
        })
      });
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du panier:', error);
      return false;
    }
  };

  const clearUserCartAPI = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE'
      });
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Erreur lors de la suppression du panier:', error);
      return false;
    }
  };

  // Charger le panier depuis MongoDB si connecté, sinon localStorage
  useEffect(() => {
    const loadCart = async () => {
      console.log('🔄 Chargement du panier...', { isAuthenticated, userId: user?.id });
      
      if (isAuthenticated && user?.id) {
        // Vérifier s'il y a un panier invité à transférer
        const guestCart = localStorage.getItem('cart');
        let guestItems: CartItem[] = [];
        
        if (guestCart) {
          try {
            guestItems = JSON.parse(guestCart);
            console.log('👤 Panier invité trouvé:', guestItems);
          } catch (error) {
            console.error('Erreur lors de la lecture du panier invité:', error);
          }
        }

        // Charger le panier utilisateur depuis MongoDB
        const userCartItems = await fetchUserCart();
        console.log('🗄️ Panier utilisateur depuis MongoDB:', userCartItems);
        
        // Fusionner les paniers (invité + utilisateur)
        if (guestItems.length > 0) {
          const mergedItems = [...userCartItems];
          
          guestItems.forEach(guestItem => {
            const existingItem = mergedItems.find(
              item => item.productId === guestItem.productId && item.size === guestItem.size
            );
            
            if (existingItem) {
              existingItem.quantity += guestItem.quantity;
            } else {
              mergedItems.push(guestItem);
            }
          });
          
          console.log('🔀 Panier fusionné:', mergedItems);
          setItems(mergedItems);
          // Sauvegarder le panier fusionné dans MongoDB
          await saveUserCartAPI(mergedItems);
          
          // Nettoyer le panier invité
          localStorage.removeItem('cart');
        } else {
          console.log('📋 Chargement du panier utilisateur uniquement');
          setItems(userCartItems);
        }
      } else {
        // Charger depuis localStorage pour les invités
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          try {
            const items = JSON.parse(savedCart);
            console.log('💾 Panier invité depuis localStorage:', items);
            setItems(items);
          } catch (error) {
            console.error('Erreur lors du chargement du panier:', error);
          }
        } else {
          console.log('🆕 Nouveau panier vide pour invité');
          setItems([]);
        }
      }
    };

    loadCart().then(() => {
      setCartLoaded(true);
    });

    // Charger l'item en attente s'il existe
    const savedPendingItem = localStorage.getItem('pendingCartItem');
    if (savedPendingItem) {
      try {
        setPendingItem(JSON.parse(savedPendingItem));
      } catch (error) {
        console.error('Erreur lors du chargement de l\'item en attente:', error);
      }
    }
  }, [isAuthenticated, user?.id]);

  // Sauvegarder le panier dans MongoDB si connecté, sinon localStorage
  useEffect(() => {
    const saveCart = async () => {
      // Ne pas sauvegarder tant que le panier n'est pas chargé
      if (!cartLoaded) {
        console.log('⏳ Panier pas encore chargé, sauvegarde ignorée');
        return;
      }
      
      console.log('💾 Sauvegarde du panier:', { items: items.length, isAuthenticated, userId: user?.id });
      
      if (isAuthenticated && user?.id) {
        // Sauvegarder dans MongoDB
        await saveUserCartAPI(items);
      } else {
        // Sauvegarder dans localStorage pour les invités
        localStorage.setItem('cart', JSON.stringify(items));
      }
    };

    saveCart();
  }, [items, isAuthenticated, user?.id, cartLoaded]);

  // Sauvegarder l'item en attente dans localStorage
  useEffect(() => {
    if (pendingItem) {
      localStorage.setItem('pendingCartItem', JSON.stringify(pendingItem));
    } else {
      localStorage.removeItem('pendingCartItem');
    }
  }, [pendingItem]);

  // Écouter l'événement de connexion pour traiter l'item en attente
  useEffect(() => {
    const handleUserLoggedIn = () => {
      console.log('🔑 Utilisateur connecté, pending item:', pendingItem);
      if (pendingItem) {
        console.log('🎨 Ouverture du modal de taille');
        setShowSizeModal(true);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('userLoggedIn', handleUserLoggedIn);
      return () => window.removeEventListener('userLoggedIn', handleUserLoggedIn);
    }
  }, [pendingItem]);

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    console.log('🛒 Ajout d\'un article au panier:', newItem);
    setItems(prevItems => {
      const existingItem = prevItems.find(
        item => item.productId === newItem.productId && item.size === newItem.size
      );

      let newItems;
      if (existingItem) {
        newItems = prevItems.map(item =>
          item.productId === newItem.productId && item.size === newItem.size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...prevItems, { ...newItem, quantity: 1 }];
      }
      
      console.log('🛒 Nouveau panier après ajout:', newItems);
      return newItems;
    });
  };

  const removeItem = (productId: number, size: string) => {
    setItems(prevItems => 
      prevItems.filter(item => !(item.productId === productId && item.size === size))
    );
  };

  const updateQuantity = (productId: number, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, size);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = async () => {
    setItems([]);
    if (isAuthenticated && user?.id) {
      await clearUserCartAPI();
    } else {
      localStorage.removeItem('cart');
    }
  };

  const addPendingItemToCart = () => {
    if (pendingItem) {
      addItem(pendingItem);
      setPendingItem(null);
    }
  };

  const handleSizeSelected = (size: string) => {
    console.log('🎯 Taille sélectionnée:', size, 'Pending item:', pendingItem);
    if (pendingItem) {
      const itemToAdd = {
        ...pendingItem,
        size
      };
      console.log('➕ Ajout de l\'item en attente:', itemToAdd);
      addItem(itemToAdd);
      setPendingItem(null);
      setShowSizeModal(false);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const value: CartContextType = {
    items,
    pendingItem,
    totalItems,
    totalPrice,
    showSizeModal,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setPendingItem,
    addPendingItemToCart,
    setShowSizeModal,
    handleSizeSelected
  };

  return (
    <CartContext.Provider value={value}>
      {children}
      
      {/* Modal globale de sélection de taille */}
      {showSizeModal && pendingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">
                Sélectionner une taille
              </h3>
              <button
                onClick={() => setShowSizeModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Contenu */}
            <div className="p-6">
              <div className="flex space-x-4 mb-6">
                <div className="w-20 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={pendingItem.image} 
                    alt={pendingItem.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">
                    {pendingItem.name}
                  </h4>
                  <p className="text-lg font-bold text-gray-900">
                    {pendingItem.price.toFixed(2)} €
                  </p>
                </div>
              </div>

              {/* Sélection de taille */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Taille
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSizeSelected(size)}
                      className="py-3 px-4 border border-gray-300 text-gray-900 hover:border-gray-400 hover:bg-gray-50 text-sm font-medium transition-all"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
};