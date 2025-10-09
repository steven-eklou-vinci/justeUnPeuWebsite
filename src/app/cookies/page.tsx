'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import CookiePreferencesManager from '@/components/CookiePreferencesManager';

const CookiesPage = () => {

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Politique des Cookies
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Comprendre comment nous utilisons les cookies pour améliorer votre expérience sur Juste Un Peu
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          
          {/* Introduction */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Qu'est-ce qu'un cookie ?</h2>
            <p className="text-gray-600 mb-4">
              Un cookie est un petit fichier texte qui est placé sur votre ordinateur, smartphone ou autre appareil 
              lorsque vous visitez un site web. Les cookies permettent au site web de reconnaître votre appareil 
              et de stocker certaines informations sur vos préférences ou actions passées.
            </p>
          </section>

          {/* Types de cookies */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Types de cookies que nous utilisons</h2>
            
            <div className="grid gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Cookies essentiels</h3>
                <p className="text-gray-600 mb-3">
                  Ces cookies sont nécessaires au fonctionnement de notre site web. Ils vous permettent de naviguer 
                  sur le site et d'utiliser ses fonctionnalités essentielles.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Authentification et sécurité</li>
                  <li>Gestion du panier d'achat</li>
                  <li>Préférences de langue</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Cookies de performance</h3>
                <p className="text-gray-600 mb-3">
                  Ces cookies collectent des informations sur la façon dont vous utilisez notre site web, 
                  nous aidant à améliorer ses performances.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Analyse du trafic du site</li>
                  <li>Mesure de l'engagement des utilisateurs</li>
                  <li>Optimisation des performances</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Cookies de fonctionnalité</h3>
                <p className="text-gray-600 mb-3">
                  Ces cookies permettent au site web de se souvenir des choix que vous faites et 
                  de fournir des fonctionnalités améliorées et personnalisées.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Personnalisation de l'interface</li>
                  <li>Mémorisation des préférences</li>
                  <li>Amélioration de l'expérience utilisateur</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Gestion des cookies */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Comment gérer vos cookies</h2>
            <p className="text-gray-600 mb-4">
              Vous pouvez contrôler et gérer les cookies de plusieurs façons :
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Via notre banner de consentement</h3>
              <p className="text-blue-800 mb-3">
                Lorsque vous visitez notre site pour la première fois, nous vous demandons votre consentement 
                pour l'utilisation de cookies non essentiels. Vous pouvez modifier vos préférences à tout moment.
              </p>
              <CookiePreferencesManager />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Via les paramètres de votre navigateur</h3>
              <p className="text-gray-600">
                La plupart des navigateurs web vous permettent de contrôler les cookies via leurs paramètres :
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li><strong>Chrome :</strong> Paramètres → Confidentialité et sécurité → Cookies</li>
                <li><strong>Firefox :</strong> Paramètres → Vie privée et sécurité → Cookies</li>
                <li><strong>Safari :</strong> Préférences → Confidentialité → Cookies</li>
                <li><strong>Edge :</strong> Paramètres → Cookies et autorisations de site</li>
              </ul>
            </div>
          </section>

          {/* Durée de conservation */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Durée de conservation</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type de cookie
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durée
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Cookies de session</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Jusqu'à la fermeture du navigateur</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Cookies de préférences</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">12 mois</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Cookies analytiques</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">24 mois</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Contact */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact</h2>
            <p className="text-gray-600 mb-4">
              Si vous avez des questions concernant notre politique des cookies, n'hésitez pas à nous contacter :
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600"><strong>Email :</strong> contact@justeunpeu.com</p>
              <p className="text-gray-600"><strong>Adresse :</strong> Juste Un Peu, Belgique</p>
            </div>
          </section>

          {/* Mise à jour */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Mise à jour de cette politique</h2>
            <p className="text-gray-600 mb-4">
              Cette politique des cookies peut être mise à jour périodiquement pour refléter les changements 
              dans nos pratiques ou pour d'autres raisons opérationnelles, légales ou réglementaires.
            </p>
            <p className="text-sm text-gray-500">
              <strong>Dernière mise à jour :</strong> 9 octobre 2025
            </p>
          </section>

        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-4">JUSTE UN PEU</h3>
          <p className="text-gray-400 mb-6">
            Mode • Style • Élégance
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <Link href="/cookies" className="text-gray-400 hover:text-white">
              Politique des Cookies
            </Link>
            <Link href="/privacy" className="text-gray-400 hover:text-white">
              Politique de Confidentialité
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CookiesPage;