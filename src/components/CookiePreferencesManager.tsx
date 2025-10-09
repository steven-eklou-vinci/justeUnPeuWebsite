'use client';

import { useState } from 'react';
import CookieConsent from './CookieConsent';

interface CookiePreferencesManagerProps {
  className?: string;
}

const CookiePreferencesManager: React.FC<CookiePreferencesManagerProps> = ({ className = "" }) => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <button 
        onClick={handleOpenModal}
        className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors ${className}`}
      >
        Modifier mes préférences
      </button>

      {showModal && (
        <CookieConsent 
          forceShow={true}
          onAccept={handleCloseModal}
          onDecline={handleCloseModal}
        />
      )}
    </>
  );
};

export default CookiePreferencesManager;