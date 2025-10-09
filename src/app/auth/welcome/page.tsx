"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams } from 'next/navigation';

const WelcomePage: React.FC = () => {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  
  // Récupérer les paramètres de l'URL
  const isNewUser = searchParams.get('new') === 'true';
  const provider = searchParams.get('provider') || 'email';

  useEffect(() => {
    // Compte à rebours et redirection automatique
    const timer = setInterval(() => {
      setRedirectCountdown((prev) => {
        if (prev <= 1) {
          window.location.href = '/';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getProviderName = (provider: string) => {
    switch (provider) {
      case 'google': return 'Google';
      case 'apple': return 'Apple';
      case 'github': return 'Microsoft';
      default: return 'email';
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'google':
        return (
          <svg className="w-8 h-8" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        );
      case 'apple':
        return (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
        );
      case 'github':
        return (
          <svg className="w-8 h-8" viewBox="0 0 24 24">
            <path fill="#f25022" d="M1 1h10v10H1z"/>
            <path fill="#00a4ef" d="M13 1h10v10H13z"/>
            <path fill="#7fba00" d="M1 13h10v10H1z"/>
            <path fill="#ffb900" d="M13 13h10v10H13z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
          </svg>
        );
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de votre connexion...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-light text-gray-900 mb-2">
            {isNewUser ? 'Bienvenue' : 'Content de vous revoir'} !
          </h1>
          
          <p className="text-xl text-gray-700 mb-4">
            {user.user_metadata?.first_name || 'Cher client'}
          </p>
        </div>

        {/* Connection Info */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-center space-x-3 mb-4">
            {getProviderIcon(provider)}
            <span className="text-gray-600">
              {provider === 'email' 
                ? 'Connexion par email réussie'
                : `Connexion via ${getProviderName(provider)} réussie`
              }
            </span>
          </div>
          
          <div className="text-center text-sm text-gray-500 border-t pt-4">
            <p className="mb-2">Votre compte :</p>
            <p className="font-medium text-gray-700">{user.email}</p>
            {user.user_metadata?.first_name && (
              <p className="text-gray-600">
                {user.user_metadata.first_name} {user.user_metadata.last_name}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Continuer vers JUSTE UN PEU
          </button>
          
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Redirection automatique dans {redirectCountdown} seconde{redirectCountdown !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            {isNewUser 
              ? 'Merci de rejoindre notre communauté ! Découvrez dès maintenant nos collections exclusives.'
              : 'Nous sommes ravis de vous revoir ! Vos articles favoris vous attendent.'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;