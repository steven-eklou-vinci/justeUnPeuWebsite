"use client";

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/contexts/CartContext';

const Header: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const { totalItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-gray-900 tracking-tight hover:text-gray-700 transition-colors cursor-pointer">
              JUSTE UN PEU
            </a>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a 
              href="/collection" 
              className="text-gray-700 hover:text-gray-900 transition-colors font-medium relative group"
            >
              Collection
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 transition-all duration-300 group-hover:w-full" />
            </a>
          </nav>
          
          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* User Account - Desktop only */}
            <div className="relative hidden md:block">
              {isLoading ? (
                <div className="w-6 h-6 animate-pulse bg-gray-300 rounded-full"></div>
              ) : user ? (
                <div className="flex items-center space-x-4">
                  <a 
                    href="/profile"
                    className="text-gray-700 hover:text-gray-900 transition-colors p-1"
                    title="Mon profil"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </a>
                  <button 
                    onClick={handleSignOut}
                    className="text-gray-700 hover:text-gray-900 transition-colors p-1"
                    title="Se déconnecter"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                  <span className="hidden md:block text-sm text-gray-700">
                    {user.firstName || user.email?.split('@')[0] || 'Mon compte'}
                  </span>
                </div>
              ) : (
                <a href="/auth/login" className="text-gray-700 hover:text-gray-900 transition-colors p-1" title="Se connecter">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </a>
              )}
            </div>
            
            {/* Shopping Cart - Always visible */}
            <a href="/cart" className="text-gray-700 hover:text-gray-900 transition-colors relative p-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13h10m-10 0l-2.5-5" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </a>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-700 hover:text-gray-900 transition-colors p-1"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-4 py-2 space-y-1">
              {/* Navigation Links */}
              <a 
                href="/collection"
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Collection
              </a>
              
              {/* User Actions */}
              {user ? (
                <>
                  <a 
                    href="/profile"
                    className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Mon profil
                  </a>
                  <button 
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  >
                    Se déconnecter
                  </button>
                  <div className="px-3 py-2 text-sm text-gray-500">
                    Connecté en tant que {user.firstName || user.email?.split('@')[0]}
                  </div>
                </>
              ) : (
                <a 
                  href="/auth/login"
                  className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Se connecter
                </a>
              )}
              
              {/* Cart Link */}
              <a 
                href="/cart"
                className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md flex items-center justify-between"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>Panier</span>
                {totalItems > 0 && (
                  <span className="bg-gray-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {totalItems}
                  </span>
                )}
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
