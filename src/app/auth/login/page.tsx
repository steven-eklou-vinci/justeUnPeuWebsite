'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import NewAuthForm from '@/components/NewAuthForm';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const handleSuccess = () => {
    router.push('/');
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