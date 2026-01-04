'use client';

import { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';
import type { RegisterDto, ForgotPasswordDto, ResetPasswordDto } from '@/lib/validation/auth';

interface UseAuthResult {
  // Session data
  user: {
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: {
      street: string;
      city: string;
      postalCode: string;
      country: string;
    };
    emailVerified?: boolean;
  } | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  register: (data: RegisterDto) => Promise<{ success: boolean; error?: string; message?: string }>;
  forgotPassword: (data: ForgotPasswordDto) => Promise<{ success: boolean; error?: string; message?: string }>;
  resetPassword: (data: ResetPasswordDto) => Promise<{ success: boolean; error?: string; message?: string }>;
  verifyEmail: (token: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  
  // Profile actions
  getProfile: () => Promise<{ success: boolean; user?: any; error?: string }>;
  updateProfile: (data: any) => Promise<{ success: boolean; error?: string; message?: string }>;
  changePassword: (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => Promise<{ success: boolean; error?: string; message?: string }>;
  
  // Loading states
  loginLoading: boolean;
  registerLoading: boolean;
  forgotPasswordLoading: boolean;
  resetPasswordLoading: boolean;
  verifyEmailLoading: boolean;
  profileLoading: boolean;
  // Backwards-compatible aliases (legacy components expect { data, error } shape for signIn/signUp)
  signIn: (email: string, password: string) => Promise<{ data: any | null; error: { message: string } | null }>;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ data: any | null; error: { message: string } | null }>;
  signInWithProvider: (provider: string) => Promise<any>;
  loading: boolean;
  signOut: () => Promise<void>;
}

export function useAuth(): UseAuthResult {
  // State
  const [user, setUser] = useState<UseAuthResult['user']>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Loading states
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [verifyEmailLoading, setVerifyEmailLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      logger.error({ error }, 'Session check error');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoginLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (!response.ok) {
        return { 
          success: false, 
          error: result.error || 'Email ou mot de passe incorrect' 
        };
      }

      setUser(result.user);
      logger.info({ email }, 'Login successful');
      
      // Déclencher l'événement de connexion réussie pour le panier
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('userLoggedIn'));
      }
      
      return { success: true };
    } catch (error) {
      logger.error({ error, email }, 'Login error');
      return { success: false, error: 'Une erreur est survenue' };
    } finally {
      setLoginLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      logger.info('User logged out');
    } catch (error) {
      logger.error({ error }, 'Logout error');
    }
  };

  const register = async (data: RegisterDto) => {
    setRegisterLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        return { 
          success: false, 
          error: result.error || 'Erreur lors de l\'inscription' 
        };
      }

      return { 
        success: true, 
        message: result.message || 'Inscription réussie' 
      };
    } catch (error) {
      logger.error({ error }, 'Registration error');
      return { 
        success: false, 
        error: 'Une erreur réseau est survenue' 
      };
    } finally {
      setRegisterLoading(false);
    }
  };

  const forgotPassword = async (data: ForgotPasswordDto) => {
    setForgotPasswordLoading(true);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        return { 
          success: false, 
          error: result.error || 'Erreur lors de l\'envoi' 
        };
      }

      return { 
        success: true, 
        message: result.message || 'Email envoyé' 
      };
    } catch (error) {
      logger.error({ error }, 'Forgot password error');
      return { 
        success: false, 
        error: 'Une erreur réseau est survenue' 
      };
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const resetPassword = async (data: ResetPasswordDto) => {
    setResetPasswordLoading(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        return { 
          success: false, 
          error: result.error || 'Erreur lors de la réinitialisation' 
        };
      }

      return { 
        success: true, 
        message: result.message || 'Mot de passe réinitialisé' 
      };
    } catch (error) {
      logger.error({ error }, 'Reset password error');
      return { 
        success: false, 
        error: 'Une erreur réseau est survenue' 
      };
    } finally {
      setResetPasswordLoading(false);
    }
  };

  const verifyEmail = async (token: string) => {
    setVerifyEmailLoading(true);
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      });

      const result = await response.json();

      if (!response.ok) {
        return { 
          success: false, 
          error: result.error || 'Erreur lors de la vérification' 
        };
      }

      return { 
        success: true, 
        message: result.message || 'Email vérifié' 
      };
    } catch (error) {
      logger.error({ error }, 'Email verification error');
      return { 
        success: false, 
        error: 'Une erreur réseau est survenue' 
      };
    } finally {
      setVerifyEmailLoading(false);
    }
  };

  const getProfile = async () => {
    setProfileLoading(true);
    try {
      const response = await fetch('/api/auth/profile');
      const result = await response.json();

      if (!response.ok) {
        return { 
          success: false, 
          error: result.error || 'Erreur lors de la récupération du profil' 
        };
      }

      return { 
        success: true, 
        user: result.user
      };
    } catch (error) {
      logger.error({ error }, 'Get profile error');
      return { 
        success: false, 
        error: 'Une erreur réseau est survenue' 
      };
    } finally {
      setProfileLoading(false);
    }
  };

  const updateProfile = async (data: any) => {
    setProfileLoading(true);
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        return { 
          success: false, 
          error: result.error || 'Erreur lors de la mise à jour' 
        };
      }

      return { 
        success: true, 
        message: result.message || 'Profil mis à jour' 
      };
    } catch (error) {
      logger.error({ error }, 'Update profile error');
      return { 
        success: false, 
        error: 'Une erreur réseau est survenue' 
      };
    } finally {
      setProfileLoading(false);
    }
  };

  const changePassword = async (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    setProfileLoading(true);
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        return { 
          success: false, 
          error: result.error || 'Erreur lors du changement de mot de passe' 
        };
      }

      return { 
        success: true, 
        message: result.message || 'Mot de passe modifié' 
      };
    } catch (error) {
      logger.error({ error }, 'Change password error');
      return { 
        success: false, 
        error: 'Une erreur réseau est survenue' 
      };
    } finally {
      setProfileLoading(false);
    }
  };

  return {
    // Session data
    user,
    isLoading,
    isAuthenticated: !!user,

    // Actions (canonical)
    login,
    logout,
    register,
    forgotPassword,
    resetPassword,
    verifyEmail,

    // Profile actions
    getProfile,
    updateProfile,
    changePassword,

    // Loading states
    loginLoading,
    registerLoading,
    forgotPasswordLoading,
    resetPasswordLoading,
    verifyEmailLoading,
    profileLoading,

    // Backwards-compatible aliases expected elsewhere in the codebase
      // legacy-style signUp/signIn used by UI components — map to API endpoints and return { data, error }
      signUp: async (email: string, password: string, firstName?: string, lastName?: string) => {
        try {
          const payload = {
            firstName: firstName || '',
            lastName: lastName || '',
            email,
            phone: '00000000',
            address: { street: 'N/A', city: 'N/A', postalCode: '0000', country: 'N/A' },
            password,
            confirmPassword: password
          } as any;

          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          const result = await response.json();
          if (!response.ok) {
            return { data: null, error: { message: result.error || 'Erreur lors de l\'inscription' } };
          }

          // On success the API returns the created user
          return { data: result.user ?? null, error: null };
        } catch (err) {
          return { data: null, error: { message: 'Erreur réseau' } };
        }
      },
      signIn: async (email: string, password: string) => {
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });

          const result = await response.json();
          if (!response.ok) {
            return { data: null, error: { message: result.error || 'Erreur lors de la connexion' } };
          }

          // Update local user state
          if (result.user) setUser(result.user);

          return { data: result.user ?? null, error: null };
        } catch (err) {
          return { data: null, error: { message: 'Erreur réseau' } };
        }
      },
      signInWithProvider: async (provider: string) => {
        logger.info({ provider }, 'signInWithProvider fallback called');
        return { success: false, error: 'Provider sign-in non implémenté' } as any;
      },
      loading: isLoading,
      signOut: logout
  };

}

// Backwards-compatible aliases expected by some components
export type UseAuthReturn = ReturnType<typeof useAuth>;
