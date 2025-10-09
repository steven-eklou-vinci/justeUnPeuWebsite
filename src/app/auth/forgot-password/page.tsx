'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { forgotPasswordSchema } from '@/lib/validation/auth';
import { z } from 'zod';

export default function ForgotPasswordPage() {
  const { forgotPassword, forgotPasswordLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setMessage('');

    try {
      const validatedData = forgotPasswordSchema.parse({ email });
      const result = await forgotPassword(validatedData);
      
      if (result.success) {
        setMessage(result.message || 'Email envoyé');
        setSent(true);
        setEmail('');
      } else {
        setErrors({ general: result.error || 'Erreur lors de l\'envoi' });
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white p-8 border border-gray-200">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-light mb-2">
              Mot de passe oublié ?
            </h1>
            <p className="text-gray-600 text-sm">
              Saisissez votre adresse email pour recevoir un lien de réinitialisation
            </p>
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } focus:border-black focus:outline-none transition-colors`}
                  placeholder="votre@email.com"
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
                  {errors.general}
                </div>
              )}

              <button
                type="submit"
                disabled={forgotPasswordLoading}
                className="w-full bg-black text-white py-3 px-4 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {forgotPasswordLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Envoi en cours...
                  </span>
                ) : (
                  'Envoyer le lien de réinitialisation'
                )}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-sm mb-4">
                {message}
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Vérifiez votre boîte de réception et suivez les instructions pour réinitialiser votre mot de passe.
              </p>
              <button
                onClick={() => setSent(false)}
                className="text-black hover:underline font-medium"
              >
                Renvoyer un email
              </button>
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