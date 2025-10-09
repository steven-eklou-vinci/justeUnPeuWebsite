import { useState, useEffect } from 'react';

export interface CookiePreferences {
  necessary: boolean;
  performance: boolean;
  functionality: boolean;
  marketing: boolean;
  timestamp: string;
}

interface UseCookiePreferencesReturn {
  preferences: CookiePreferences | null;
  loading: boolean;
  updatePreferences: (newPreferences: Partial<CookiePreferences>) => Promise<boolean>;
  hasConsented: boolean;
  isLoggedIn: boolean;
}

export function useCookiePreferences(): UseCookiePreferencesReturn {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        setIsLoggedIn(!!data.user);
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsLoggedIn(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Charger les préférences
  useEffect(() => {
    const loadPreferences = async () => {
      setLoading(true);
      
      if (isLoggedIn) {
        // Utilisateur connecté : charger depuis l'API
        try {
          const response = await fetch('/api/user/cookie-preferences');
          if (response.ok) {
            const data = await response.json();
            setPreferences(data.preferences);
          } else {
            // En cas d'erreur, charger depuis localStorage
            loadFromLocalStorage();
          }
        } catch (error) {
          console.error('Error loading preferences from API:', error);
          loadFromLocalStorage();
        }
      } else {
        // Utilisateur non connecté : charger depuis localStorage
        loadFromLocalStorage();
      }
      
      setLoading(false);
    };

    const loadFromLocalStorage = () => {
      const stored = localStorage.getItem('cookieConsent');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setPreferences(parsed);
        } catch (error) {
          console.error('Error parsing stored preferences:', error);
          setPreferences(null);
        }
      } else {
        setPreferences(null);
      }
    };

    if (isLoggedIn !== undefined) {
      loadPreferences();
    }
  }, [isLoggedIn]);

  const updatePreferences = async (newPreferences: Partial<CookiePreferences>): Promise<boolean> => {
    const updatedPreferences: CookiePreferences = {
      necessary: true,
      performance: newPreferences.performance ?? preferences?.performance ?? false,
      functionality: newPreferences.functionality ?? preferences?.functionality ?? false,
      marketing: newPreferences.marketing ?? preferences?.marketing ?? false,
      timestamp: new Date().toISOString()
    };

    try {
      // Toujours sauvegarder dans localStorage
      localStorage.setItem('cookieConsent', JSON.stringify(updatedPreferences));

      // Si connecté, sauvegarder aussi dans la base de données
      if (isLoggedIn) {
        const response = await fetch('/api/user/cookie-preferences', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ preferences: updatedPreferences }),
        });

        if (!response.ok) {
          console.error('Error saving preferences to API');
          // Même si l'API échoue, on continue avec localStorage
        }
      }

      setPreferences(updatedPreferences);
      return true;
    } catch (error) {
      console.error('Error updating preferences:', error);
      return false;
    }
  };

  const hasConsented = preferences !== null;

  return {
    preferences,
    loading,
    updatePreferences,
    hasConsented,
    isLoggedIn
  };
}