'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { verifyEmail, verifyEmailLoading } = useAuth();
  
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
      handleVerification(tokenParam);
    } else {
      setError('Token de vérification manquant');
    }
  }, [searchParams]);

  const handleVerification = async (verificationToken: string) => {
    try {
      const result = await verifyEmail(verificationToken);
      
      if (result.success) {
        setSuccess(true);
        setMessage(result.message || 'Email vérifié avec succès');
        
        // Rediriger vers la page de connexion après 3 secondes
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      } else {
        setError(result.error || 'Erreur lors de la vérification');
      }
    } catch (err) {
      setError('Une erreur inattendue est survenue');
    }
  };

  if (verifyEmailLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 border border-gray-200 text-center">
        {success ? (
          <>
            {/* Succès */}
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-light mb-4">Email vérifié !</h1>
            <p className="text-green-600 mb-4">{message}</p>
            <p className="text-gray-600 text-sm mb-6">
              Votre compte est maintenant activé. Vous allez être redirigé vers la page de connexion...
            </p>
            <button
              onClick={() => router.push('/auth/login')}
              className="bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors font-medium"
            >
              Se connecter maintenant
            </button>
          </>
        ) : error ? (
          <>
            {/* Erreur */}
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-light mb-4">Erreur de vérification</h1>
            <p className="text-red-600 mb-6">{error}</p>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/auth/register')}
                className="w-full bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors font-medium"
              >
                Créer un nouveau compte
              </button>
              <button
                onClick={() => router.push('/auth/login')}
                className="w-full border border-gray-300 text-gray-700 px-6 py-3 hover:bg-gray-50 transition-colors font-medium"
              >
                Se connecter
              </button>
            </div>
          </>
        ) : (
          <>
            {/* État de chargement initial */}
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
            </div>
            <h1 className="text-2xl font-light mb-4">Vérification en cours...</h1>
            <p className="text-gray-600">
              Veuillez patienter pendant que nous vérifions votre adresse email.
            </p>
          </>
        )}
      </div>
    </div>
  );
}