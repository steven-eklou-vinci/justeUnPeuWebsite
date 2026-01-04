'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { useCart } from '@/contexts/CartContext';
import { logger } from '@/lib/logger';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret');
    const paymentIntent = searchParams.get('payment_intent');

    if (!paymentIntentClientSecret || !paymentIntent) {
      setStatus('error');
      return;
    }

    // Vérifier le statut du paiement et créer la commande
    fetch('/api/confirm-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentIntentId: paymentIntent }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrderId(data.orderId);
          setStatus('success');
          // Vider le panier
          clearCart();
        } else {
          setStatus('error');
        }
      })
      .catch((err) => {
        console.error('Error confirming payment:', err);
        setStatus('error');
      });
  }, [searchParams, clearCart]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto py-16 px-4 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-black mx-auto mb-6"></div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Confirmation du paiement...</h1>
          <p className="text-gray-600">Veuillez patienter pendant que nous vérifions votre paiement</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto py-16 px-4">
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-red-900 mb-2">Erreur de paiement</h1>
            <p className="text-red-700 mb-6">
              Une erreur est survenue lors de la confirmation de votre paiement. Veuillez réessayer ou contacter notre support.
            </p>
            <div className="space-x-4">
              <button
                onClick={() => router.push('/cart')}
                className="bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors"
              >
                Retour au panier
              </button>
              <button
                onClick={() => router.push('/contact')}
                className="border border-gray-300 text-gray-700 px-6 py-3 hover:bg-gray-50 transition-colors"
              >
                Contacter le support
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-2xl mx-auto py-16 px-4">
        <div className="bg-white shadow-lg rounded-lg p-8 text-center">
          {/* Icône de succès */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Merci pour votre commande !</h1>
          <p className="text-lg text-gray-600 mb-6">Votre paiement a été accepté avec succès</p>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <p className="text-sm text-gray-600 mb-2">Numéro de commande</p>
            <p className="text-2xl font-bold text-black">{orderId}</p>
          </div>

          <div className="text-left bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-blue-900 mb-1">Confirmation par email</p>
                <p className="text-sm text-blue-700">
                  Un email de confirmation contenant les détails de votre commande vous a été envoyé.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => router.push('/orders')}
              className="w-full bg-black text-white py-3 px-4 hover:bg-gray-800 transition-colors font-medium"
            >
              Voir mes commandes
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
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
