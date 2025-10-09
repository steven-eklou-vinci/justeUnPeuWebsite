'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { resetPasswordSchema } from '@/lib/validation/auth';
import { z } from 'zod';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword, resetPasswordLoading } = useAuth();
  
  const [token, setToken] = useState('');
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setErrors({ general: 'Token manquant ou invalide' });
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setMessage('');

    if (!token) {
      setErrors({ general: 'Token manquant' });
      return;
    }

    try {
      const validatedData = resetPasswordSchema.parse({
        token,
        ...formData
      });
      
      const result = await resetPassword(validatedData);
      
      if (result.success) {
        setMessage(result.message || 'Mot de passe réinitialisé avec succès');
        setSuccess(true);
        setFormData({ password: '', confirmPassword: '' });
        
        // Rediriger vers la page de connexion après 3 secondes
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      } else {
        setErrors({ general: result.error || 'Erreur lors de la réinitialisation' });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          if (issue.path && issue.path.length > 0) {
            fieldErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ general: 'Une erreur inattendue est survenue' });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!token && !errors.general) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white p-8 border border-gray-200">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-light mb-2">
              Nouveau mot de passe
            </h1>
            <p className="text-gray-600 text-sm">
              Choisissez un nouveau mot de passe sécurisé
            </p>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } focus:border-black focus:outline-none transition-colors`}
                  placeholder="••••••••"
                  required
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  Minimum 8 caractères avec majuscule, minuscule et chiffre
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  } focus:border-black focus:outline-none transition-colors`}
                  placeholder="••••••••"
                  required
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
                  {errors.general}
                </div>
              )}

              <button
                type="submit"
                disabled={resetPasswordLoading}
                className="w-full bg-black text-white py-3 px-4 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {resetPasswordLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Réinitialisation...
                  </span>
                ) : (
                  'Réinitialiser le mot de passe'
                )}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-sm mb-4">
                ✅ {message}
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Vous allez être redirigé vers la page de connexion dans quelques secondes...
              </p>
              <Link
                href="/auth/login"
                className="inline-block bg-black text-white px-6 py-2 hover:bg-gray-800 transition-colors font-medium"
              >
                Se connecter maintenant
              </Link>
            </div>
          )}

          <div className="text-center mt-6">
            <Link 
              href="/auth/login"
              className="text-gray-600 text-sm hover:text-black hover:underline"
            >
              ← Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}