'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCookiePreferences, CookiePreferences } from '@/hooks/useCookiePreferences';

interface CookieConsentProps {
  onAccept?: () => void;
  onDecline?: () => void;
  forceShow?: boolean; // Pour forcer l'affichage depuis la page cookies
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onAccept, onDecline, forceShow = false }) => {
  const { preferences, updatePreferences, hasConsented, isLoggedIn } = useCookiePreferences();
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [currentPrefs, setCurrentPrefs] = useState({
    performance: false,
    functionality: false,
    marketing: false
  });

  useEffect(() => {
    if (forceShow) {
      setIsVisible(true);
      setShowDetails(true);
      // Charger les préférences actuelles
      if (preferences) {
        setCurrentPrefs({
          performance: preferences.performance,
          functionality: preferences.functionality,
          marketing: preferences.marketing
        });
      }
    } else if (!hasConsented) {
      // Afficher le banner après un petit délai pour une meilleure UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [forceShow, hasConsented, preferences]);

  const handleAcceptAll = async () => {
    const success = await updatePreferences({
      performance: true,
      functionality: true,
      marketing: true
    });
    
    if (success) {
      setIsVisible(false);
      onAccept?.();
    }
  };

  const handleAcceptNecessary = async () => {
    const success = await updatePreferences({
      performance: false,
      functionality: false,
      marketing: false
    });
    
    if (success) {
      setIsVisible(false);
      onDecline?.();
    }
  };

  const handleAcceptSelection = async () => {
    const success = await updatePreferences(currentPrefs);
    
    if (success) {
      setIsVisible(false);
      onAccept?.();
    }
  };

  const handleCustomize = () => {
    setShowDetails(!showDetails);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
      
      {/* Cookie Banner */}
      <div className="fixed inset-x-0 bottom-0 z-50 p-4 md:p-6">
        <div className="mx-auto max-w-4xl bg-white rounded-t-lg shadow-2xl border border-gray-200">
          <div className="p-6 md:p-8">
            {!showDetails ? (
              /* Mode simple */
              <div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Nous utilisons des cookies
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Nous utilisons des cookies pour améliorer votre expérience sur notre site, 
                      analyser le trafic et personnaliser le contenu. Vous pouvez choisir d'accepter 
                      tous les cookies ou personnaliser vos préférences.
                    </p>
                    <p className="text-xs text-gray-500 mb-6">
                      En continuant à naviguer, vous acceptez notre utilisation des cookies essentiels. 
                      <Link href="/cookies" className="text-blue-600 hover:underline ml-1">
                        En savoir plus sur notre politique des cookies
                      </Link>
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleAcceptAll}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Accepter tous les cookies
                      </button>
                      <button
                        onClick={handleAcceptNecessary}
                        className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                      >
                        Cookies essentiels uniquement
                      </button>
                      <button
                        onClick={handleCustomize}
                        className="text-blue-600 hover:text-blue-700 px-6 py-3 font-medium underline"
                      >
                        Personnaliser
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Mode détaillé */
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Paramètres des cookies
                  </h3>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  {/* Cookies essentiels */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Cookies essentiels</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Nécessaires au fonctionnement du site (authentification, panier, sécurité)
                      </p>
                    </div>
                    <div className="flex items-center">
                      <div className="w-12 h-6 bg-green-500 rounded-full relative">
                        <div className="absolute right-0 top-0 w-6 h-6 bg-white rounded-full border-2 border-green-500"></div>
                      </div>
                      <span className="ml-2 text-sm text-gray-500">Requis</span>
                    </div>
                  </div>

                  {/* Cookies de performance */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Cookies de performance</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Nous aident à analyser l'utilisation du site pour l'améliorer
                      </p>
                    </div>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentPrefs.performance}
                        onChange={(e) => setCurrentPrefs(prev => ({ ...prev, performance: e.target.checked }))}
                        className="sr-only"
                      />
                      <div 
                        className={`w-12 h-6 rounded-full relative transition-colors ${
                          currentPrefs.performance ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`absolute top-0 w-6 h-6 bg-white rounded-full border-2 transition-all duration-200 ${
                          currentPrefs.performance 
                            ? 'translate-x-6 border-blue-500' 
                            : 'translate-x-0 border-gray-300'
                        }`}></div>
                      </div>
                    </label>
                  </div>

                  {/* Cookies de fonctionnalité */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Cookies de fonctionnalité</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Mémorisent vos préférences et personnalisent votre expérience
                      </p>
                    </div>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentPrefs.functionality}
                        onChange={(e) => setCurrentPrefs(prev => ({ ...prev, functionality: e.target.checked }))}
                        className="sr-only"
                      />
                      <div 
                        className={`w-12 h-6 rounded-full relative transition-colors ${
                          currentPrefs.functionality ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`absolute top-0 w-6 h-6 bg-white rounded-full border-2 transition-all duration-200 ${
                          currentPrefs.functionality 
                            ? 'translate-x-6 border-blue-500' 
                            : 'translate-x-0 border-gray-300'
                        }`}></div>
                      </div>
                    </label>
                  </div>

                  {/* Cookies marketing */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Cookies marketing</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Utilisés pour vous proposer des publicités personnalisées
                      </p>
                    </div>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentPrefs.marketing}
                        onChange={(e) => setCurrentPrefs(prev => ({ ...prev, marketing: e.target.checked }))}
                        className="sr-only"
                      />
                      <div 
                        className={`w-12 h-6 rounded-full relative transition-colors ${
                          currentPrefs.marketing ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`absolute top-0 w-6 h-6 bg-white rounded-full border-2 transition-all duration-200 ${
                          currentPrefs.marketing 
                            ? 'translate-x-6 border-blue-500' 
                            : 'translate-x-0 border-gray-300'
                        }`}></div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleAcceptSelection}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    {forceShow ? 'Sauvegarder les préférences' : 'Accepter la sélection'}
                  </button>
                  <button
                    onClick={handleAcceptNecessary}
                    className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Refuser les cookies optionnels
                  </button>
                  {forceShow && (
                    <button
                      onClick={() => setIsVisible(false)}
                      className="text-gray-600 hover:text-gray-800 px-6 py-3 font-medium"
                    >
                      Annuler
                    </button>
                  )}
                </div>
                
                <p className="text-xs text-gray-500 mt-4 text-center">
                  <Link href="/cookies" className="text-blue-600 hover:underline">
                    Politique des cookies
                  </Link>
                  {" • "}
                  <Link href="/privacy" className="text-blue-600 hover:underline">
                    Politique de confidentialité
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CookieConsent;