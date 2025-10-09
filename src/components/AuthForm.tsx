"use client";

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

type AuthProvider = 'email' | 'google' | 'apple' | 'microsoft';
type AuthMode = 'login' | 'register';

interface AuthFormProps {
  mode: AuthMode;
}

const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const { signUp, signIn, signInWithProvider, loading } = useAuth();
  const [selectedProvider, setSelectedProvider] = useState<AuthProvider>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (mode === 'register') {
        if (formData.password !== formData.confirmPassword) {
          setError('Les mots de passe ne correspondent pas');
          return;
        }
        if (formData.password.length < 6) {
          setError('Le mot de passe doit contenir au moins 6 caractères');
          return;
        }
        
        const { data, error } = await signUp(
          formData.email,
          formData.password,
          formData.firstName,
          formData.lastName
        );
        
        if (error) {
          setError(error.message);
        } else {
          // Redirection après inscription réussie
          window.location.href = '/';
        }
      } else {
        const { data, error } = await signIn(formData.email, formData.password);
        
        if (error) {
          setError(error.message);
        } else {
          // Redirection après connexion réussie
          window.location.href = '/';
        }
      }
    } catch (err) {
      setError('Une erreur inattendue s\'est produite');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProviderSelect = (provider: AuthProvider) => {
    setSelectedProvider(provider);
  };

  const renderProviderForm = () => {
    switch (selectedProvider) {
      case 'google':
        return (
          <div className="bg-white border-2 border-red-100 rounded-lg p-6">
            <div className="text-center mb-6">
              <svg className="w-12 h-12 mx-auto mb-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <h3 className="text-xl font-semibold text-gray-900">Connexion avec Google</h3>
              <p className="text-gray-600 mt-2">Vous serez redirigé vers Google pour vous authentifier</p>
            </div>
            <button 
              onClick={async () => {
                setIsLoading(true);
                setError(null);
                try {
                  const { data, error } = await signInWithProvider('google');
                  if (error) {
                    setError(error.message);
                  } else {
                    window.location.href = '/';
                  }
                } catch (err) {
                  setError('Erreur lors de la connexion avec Google');
                } finally {
                  setIsLoading(false);
                }
              }}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Connexion...' : 'Continuer avec Google'}
            </button>
          </div>
        );

      case 'apple':
        return (
          <div className="bg-white border-2 border-gray-900 rounded-lg p-6">
            <div className="text-center mb-6">
              <svg className="w-12 h-12 mx-auto mb-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <h3 className="text-xl font-semibold text-gray-900">Connexion avec Apple</h3>
              <p className="text-gray-600 mt-2">Utilisez votre Apple ID pour vous connecter</p>
            </div>
            <button 
              onClick={async () => {
                setIsLoading(true);
                setError(null);
                try {
                  const { data, error } = await signInWithProvider('apple');
                  if (error) {
                    setError(error.message);
                  } else {
                    window.location.href = '/';
                  }
                } catch (err) {
                  setError('Erreur lors de la connexion avec Apple');
                } finally {
                  setIsLoading(false);
                }
              }}
              disabled={isLoading}
              className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Connexion...' : 'Continuer avec Apple'}
            </button>
          </div>
        );

      case 'microsoft':
        return (
          <div className="bg-white border-2 border-blue-100 rounded-lg p-6">
            <div className="text-center mb-6">
              <svg className="w-12 h-12 mx-auto mb-4" viewBox="0 0 24 24">
                <path fill="#f25022" d="M1 1h10v10H1z"/>
                <path fill="#00a4ef" d="M13 1h10v10H13z"/>
                <path fill="#7fba00" d="M1 13h10v10H1z"/>
                <path fill="#ffb900" d="M13 13h10v10H13z"/>
              </svg>
              <h3 className="text-xl font-semibold text-gray-900">Connexion avec Microsoft</h3>
              <p className="text-gray-600 mt-2">Utilisez votre compte Microsoft ou Outlook</p>
            </div>
            <button 
              onClick={async () => {
                setIsLoading(true);
                setError(null);
                try {
                  const { data, error } = await signInWithProvider('github');
                  if (error) {
                    setError(error.message);
                  } else {
                    window.location.href = '/';
                  }
                } catch (err) {
                  setError('Erreur lors de la connexion avec Microsoft');
                } finally {
                  setIsLoading(false);
                }
              }}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Connexion...' : 'Continuer avec Microsoft'}
            </button>
          </div>
        );

      default: // email
        return (
          <form className="space-y-6" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                    placeholder="Votre prénom"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                    placeholder="Votre nom"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                placeholder={mode === 'register' ? "Créez un mot de passe" : "Votre mot de passe"}
              />
            </div>

            {mode === 'register' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmer le mot de passe
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                  placeholder="Confirmez votre mot de passe"
                />
              </div>
            )}

            {mode === 'login' && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Se souvenir de moi
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="text-gray-900 hover:underline">
                    Mot de passe oublié ?
                  </a>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 text-lg disabled:opacity-50"
            >
              {isLoading 
                ? (mode === 'register' ? 'Création du compte...' : 'Connexion...')
                : (mode === 'register' ? 'Créer mon compte' : 'Se connecter')
              }
            </button>
          </form>
        );
    }
  };

  return (
    <div className="max-w-md w-full space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-light text-gray-900 mb-2">
          {mode === 'register' ? 'Créer un compte' : 'Se connecter'}
        </h2>
        <p className="text-gray-600">
          {mode === 'register' 
            ? 'Rejoignez la communauté JUSTE UN PEU et découvrez nos collections exclusives'
            : 'Accédez à votre compte JUSTE UN PEU'
          }
        </p>
      </div>

      {/* Provider Selection */}
      <div className="grid grid-cols-4 gap-3">
        <button
          onClick={() => handleProviderSelect('email')}
          className={`flex items-center justify-center p-3 border rounded-lg transition-colors ${
            selectedProvider === 'email' 
              ? 'border-gray-900 bg-gray-900 text-white' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
          </svg>
        </button>
        <button
          onClick={() => handleProviderSelect('google')}
          className={`flex items-center justify-center p-3 border rounded-lg transition-colors ${
            selectedProvider === 'google' 
              ? 'border-blue-500 bg-blue-500 text-white' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill={selectedProvider === 'google' ? 'white' : '#4285F4'} d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill={selectedProvider === 'google' ? 'white' : '#34A853'} d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          </svg>
        </button>
        <button
          onClick={() => handleProviderSelect('apple')}
          className={`flex items-center justify-center p-3 border rounded-lg transition-colors ${
            selectedProvider === 'apple' 
              ? 'border-gray-900 bg-gray-900 text-white' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
        </button>
        <button
          onClick={() => handleProviderSelect('microsoft')}
          className={`flex items-center justify-center p-3 border rounded-lg transition-colors ${
            selectedProvider === 'microsoft' 
              ? 'border-blue-500 bg-blue-500 text-white' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill={selectedProvider === 'microsoft' ? 'white' : '#f25022'} d="M1 1h10v10H1z"/>
            <path fill={selectedProvider === 'microsoft' ? 'white' : '#00a4ef'} d="M13 1h10v10H13z"/>
            <path fill={selectedProvider === 'microsoft' ? 'white' : '#7fba00'} d="M1 13h10v10H1z"/>
            <path fill={selectedProvider === 'microsoft' ? 'white' : '#ffb900'} d="M13 13h10v10H13z"/>
          </svg>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Selected Provider Form */}
      <div className="mt-8">
        {renderProviderForm()}
      </div>

      {/* Terms and Links */}
      {selectedProvider === 'email' && (
        <>
          {mode === 'register' && (
            <div className="text-center">
              <p className="text-xs text-gray-500">
                En créant un compte, vous acceptez nos{' '}
                <a href="#" className="text-gray-900 hover:underline">
                  Conditions d'utilisation
                </a>{' '}
                et notre{' '}
                <a href="#" className="text-gray-900 hover:underline">
                  Politique de confidentialité
                </a>
              </p>
            </div>
          )}

          <div className="text-center border-t border-gray-200 pt-6">
            <p className="text-gray-600">
              {mode === 'register' 
                ? 'Vous avez déjà un compte ?'
                : "Vous n'avez pas encore de compte ?"
              }{' '}
              <a 
                href={mode === 'register' ? '/auth/login' : '/auth/register'} 
                className="text-gray-900 font-medium hover:underline"
              >
                {mode === 'register' ? 'Se connecter' : 'Créer un compte'}
              </a>
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default AuthForm;