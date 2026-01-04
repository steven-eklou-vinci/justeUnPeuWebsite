'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { registerSchema, loginSchema } from '@/lib/validation/auth';
import { z } from 'zod';

interface NewAuthFormProps {
  mode: 'login' | 'register';
  onSuccess?: () => void;
  onModeChange?: (mode: 'login' | 'register') => void;
}

export default function NewAuthForm({ mode, onSuccess, onModeChange }: NewAuthFormProps) {
  const { login, register, loginLoading, registerLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: 'France'
    },
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setMessage('');

    try {
      if (mode === 'login') {
        const validatedData = loginSchema.parse(formData);
        const result = await login(validatedData.email, validatedData.password);
        
        if (result.success) {
          setMessage('Connexion réussie !');
          onSuccess?.();
        } else {
          setErrors({ general: result.error || 'Erreur de connexion' });
        }
      } else {
        const validatedData = registerSchema.parse(formData);
        const result = await register(validatedData);
        
        if (result.success) {
          setMessage('Inscription réussie ! Redirection vers la connexion...');
          // Rediriger vers la page de login après 1.5 secondes
          setTimeout(() => {
            onModeChange?.('login');
          }, 1500);
        } else {
          setErrors({ general: result.error || 'Erreur d\'inscription' });
        }
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested address fields
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const isLoading = mode === 'login' ? loginLoading : registerLoading;

  return (
    <div className="max-w-md mx-auto bg-white p-8 border border-gray-200">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-light mb-2">
          {mode === 'login' ? 'Se connecter' : 'Créer un compte'}
        </h1>
        <p className="text-gray-600 text-sm">
          {mode === 'login' 
            ? 'Accédez à votre espace personnel' 
            : 'Rejoignez la communauté Juste Un Peu'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First Name and Last Name (register only) */}
        {mode === 'register' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                Prénom
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                } focus:border-black focus:outline-none transition-colors`}
                placeholder="Votre prénom"
                required
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Nom
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                } focus:border-black focus:outline-none transition-colors`}
                placeholder="Votre nom"
                required
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>
        )}

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Adresse email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
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

        {/* Phone (register only) */}
        {mode === 'register' && (
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Numéro de téléphone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              } focus:border-black focus:outline-none transition-colors`}
              placeholder="+33 1 23 45 67 89"
              required
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>
        )}

        {/* Address (register only) */}
        {mode === 'register' && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">Adresse</h3>
            
            <div>
              <label htmlFor="address.street" className="block text-sm font-medium text-gray-700 mb-1">
                Adresse
              </label>
              <input
                type="text"
                id="address.street"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${
                  errors['address.street'] ? 'border-red-500' : 'border-gray-300'
                } focus:border-black focus:outline-none transition-colors`}
                placeholder="123 rue de la Paix"
                required
              />
              {errors['address.street'] && (
                <p className="text-red-500 text-sm mt-1">{errors['address.street']}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="address.postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Code postal
                </label>
                <input
                  type="text"
                  id="address.postalCode"
                  name="address.postalCode"
                  value={formData.address.postalCode}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${
                    errors['address.postalCode'] ? 'border-red-500' : 'border-gray-300'
                  } focus:border-black focus:outline-none transition-colors`}
                  placeholder="75001"
                  required
                />
                {errors['address.postalCode'] && (
                  <p className="text-red-500 text-sm mt-1">{errors['address.postalCode']}</p>
                )}
              </div>
              <div>
                <label htmlFor="address.city" className="block text-sm font-medium text-gray-700 mb-1">
                  Ville
                </label>
                <input
                  type="text"
                  id="address.city"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${
                    errors['address.city'] ? 'border-red-500' : 'border-gray-300'
                  } focus:border-black focus:outline-none transition-colors`}
                  placeholder="Paris"
                  required
                />
                {errors['address.city'] && (
                  <p className="text-red-500 text-sm mt-1">{errors['address.city']}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="address.country" className="block text-sm font-medium text-gray-700 mb-1">
                Pays
              </label>
              <select
                id="address.country"
                name="address.country"
                value={formData.address.country}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${
                  errors['address.country'] ? 'border-red-500' : 'border-gray-300'
                } focus:border-black focus:outline-none transition-colors`}
                required
              >
                <option value="France">France</option>
                <option value="Belgique">Belgique</option>
                <option value="Suisse">Suisse</option>
                <option value="Canada">Canada</option>
                <option value="Luxembourg">Luxembourg</option>
              </select>
              {errors['address.country'] && (
                <p className="text-red-500 text-sm mt-1">{errors['address.country']}</p>
              )}
            </div>
          </div>
        )}

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Mot de passe
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
          {mode === 'register' && (
            <p className="text-gray-500 text-xs mt-1">
              Minimum 8 caractères avec majuscule, minuscule et chiffre
            </p>
          )}
        </div>

        {/* Confirm Password (register only) */}
        {mode === 'register' && (
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
        )}

        {/* General error */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
            {errors.general}
          </div>
        )}

        {/* Success message */}
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-sm">
            {message}
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black text-white py-3 px-4 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {mode === 'login' ? 'Connexion...' : 'Inscription...'}
            </span>
          ) : (
            mode === 'login' ? 'Se connecter' : 'Créer mon compte'
          )}
        </button>
      </form>

      {/* Mode switch */}
      <div className="text-center mt-6">
        <p className="text-gray-600 text-sm">
          {mode === 'login' ? 'Pas encore de compte ?' : 'Déjà un compte ?'}
        </p>
        <button
          onClick={() => onModeChange?.(mode === 'login' ? 'register' : 'login')}
          className="text-black font-medium hover:underline mt-1"
        >
          {mode === 'login' ? 'Créer un compte' : 'Se connecter'}
        </button>
      </div>

      {/* Forgot password link (login only) */}
      {mode === 'login' && (
        <div className="text-center mt-4">
          <a 
            href="/auth/forgot-password"
            className="text-gray-600 text-sm hover:text-black hover:underline"
          >
            Mot de passe oublié ?
          </a>
        </div>
      )}
    </div>
  );
}