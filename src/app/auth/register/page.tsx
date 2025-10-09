'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import NewAuthForm from '@/components/NewAuthForm';

export default function RegisterPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('register');

  const handleSuccess = () => {
    // Ne pas rediriger automatiquement après inscription
    // L'utilisateur doit vérifier son email d'abord
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <NewAuthForm 
          mode={mode}
          onSuccess={handleSuccess}
          onModeChange={setMode}
        />
      </div>
    </div>
  );
}