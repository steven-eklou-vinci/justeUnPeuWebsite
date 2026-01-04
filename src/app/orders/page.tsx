'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Image from 'next/image';

interface OrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  image?: string;
}

interface Order {
  _id: string;
  orderId: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  shippingAddress?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  paymentIntentId: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
  orderDate: string;
}

export default function OrdersPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, isLoading, router]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.orders || []);
      } else {
        setError(data.error || 'Erreur lors du chargement des commandes');
      }
    } catch (err) {
      setError('Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { label: 'Payée', color: 'bg-green-100 text-green-800' },
      processing: { label: 'En traitement', color: 'bg-blue-100 text-blue-800' },
      shipped: { label: 'Expédiée', color: 'bg-purple-100 text-purple-800' },
      delivered: { label: 'Livrée', color: 'bg-gray-100 text-gray-800' },
      cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-800' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, color: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mes commandes</h1>
          <p className="text-gray-600 mt-2">Suivez l'état de vos commandes et consultez votre historique d'achats</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white shadow-sm rounded-lg p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune commande</h3>
            <p className="text-gray-600 mb-6">Vous n'avez pas encore passé de commande</p>
            <button
              onClick={() => router.push('/collection')}
              className="bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors"
            >
              Découvrir la collection
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white shadow-sm rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <div className="mb-4 lg:mb-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">Commande #{order.orderId}</h3>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-sm text-gray-600">
                        Passée le {formatDate(order.createdAt)} • {order.items.length} article{order.items.length > 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-left lg:text-right">
                      <p className="text-2xl font-bold text-gray-900">{order.total.toFixed(2)} €</p>
                      <p className="text-sm text-gray-600">{order.paymentMethod}</p>
                    </div>
                  </div>

                  {/* Articles */}
                  <div className="border-t pt-4 space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="w-16 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={64}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            {item.size && `Taille: ${item.size}`} • Qté: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{(item.price * item.quantity).toFixed(2)} €</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Adresse de livraison */}
                  {order.shippingAddress && (
                    <div className="border-t mt-4 pt-4">
                      <p className="text-sm font-medium text-gray-900 mb-1">Adresse de livraison</p>
                      <p className="text-sm text-gray-600">
                        {order.firstName} {order.lastName}<br />
                        {order.shippingAddress.street}<br />
                        {order.shippingAddress.postalCode} {order.shippingAddress.city}<br />
                        {order.shippingAddress.country}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="border-t mt-4 pt-4 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      Voir les détails
                    </button>
                    <button
                      onClick={() => router.push('/contact')}
                      className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      Contacter le support
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal détails de commande */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Détails de la commande</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Commande #{selectedOrder.orderId}</h3>
                <p className="text-sm text-gray-600">Passée le {formatDate(selectedOrder.createdAt)}</p>
                <div className="mt-2">{getStatusBadge(selectedOrder.status)}</div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">Articles</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-16 bg-gray-100 rounded overflow-hidden">
                          {item.image && (
                            <Image src={item.image} alt={item.name} width={48} height={64} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-600">{item.size && `Taille ${item.size} • `}Qté {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium">{(item.price * item.quantity).toFixed(2)} €</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-medium">{selectedOrder.subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Livraison</span>
                  <span className="font-medium text-green-600">Gratuite</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">TVA</span>
                  <span className="font-medium">{selectedOrder.tax.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>{selectedOrder.total.toFixed(2)} €</span>
                </div>
              </div>

              {selectedOrder.shippingAddress && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Adresse de livraison</h3>
                  <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded">
                    <p className="font-medium text-gray-900">{selectedOrder.firstName} {selectedOrder.lastName}</p>
                    {selectedOrder.phone && <p>{selectedOrder.phone}</p>}
                    <p className="mt-2">{selectedOrder.shippingAddress.street}</p>
                    <p>{selectedOrder.shippingAddress.postalCode} {selectedOrder.shippingAddress.city}</p>
                    <p>{selectedOrder.shippingAddress.country}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-gray-50">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full bg-black text-white py-3 hover:bg-gray-800 transition-colors font-medium"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
