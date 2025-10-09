'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Politique de Confidentialité
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Votre confidentialité est importante pour nous. Découvrez comment nous protégeons vos données personnelles.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          
          {/* Introduction */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Introduction</h2>
            <p className="text-gray-600 mb-4">
              Chez Juste Un Peu, nous nous engageons à protéger votre vie privée et à traiter vos données personnelles 
              de manière transparente et sécurisée. Cette politique de confidentialité explique comment nous collectons, 
              utilisons, stockons et protégeons vos informations personnelles.
            </p>
            <p className="text-gray-600">
              Cette politique s'applique à tous les services offerts par Juste Un Peu, y compris notre site web, 
              nos applications mobiles et nos services en ligne.
            </p>
          </section>

          {/* Données collectées */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Données que nous collectons</h2>
            
            <div className="grid gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Informations que vous nous fournissez</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Nom, prénom et informations de contact</li>
                  <li>Adresse de livraison et de facturation</li>
                  <li>Adresse e-mail et numéro de téléphone</li>
                  <li>Informations de paiement (traitées de manière sécurisée)</li>
                  <li>Historique d'achats et préférences</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Informations collectées automatiquement</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Adresse IP et informations sur l'appareil</li>
                  <li>Données de navigation et d'utilisation du site</li>
                  <li>Cookies et technologies similaires</li>
                  <li>Géolocalisation (avec votre consentement)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Utilisation des données */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Comment nous utilisons vos données</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900">Traitement des commandes</h3>
                <p className="text-gray-600">
                  Nous utilisons vos informations pour traiter vos commandes, gérer les livraisons, 
                  les retours et fournir un support client.
                </p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900">Amélioration de nos services</h3>
                <p className="text-gray-600">
                  Nous analysons les données d'utilisation pour améliorer notre site web, 
                  nos produits et votre expérience d'achat.
                </p>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900">Communication marketing</h3>
                <p className="text-gray-600">
                  Avec votre consentement, nous vous envoyons des newsletters, 
                  des promotions et des informations sur nos nouveaux produits.
                </p>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900">Sécurité et conformité</h3>
                <p className="text-gray-600">
                  Nous utilisons vos données pour prévenir la fraude, assurer la sécurité 
                  et respecter nos obligations légales.
                </p>
              </div>
            </div>
          </section>

          {/* Base légale */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Base légale du traitement</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-blue-800 mb-4">
                Conformément au RGPD, nous traitons vos données personnelles sur les bases légales suivantes :
              </p>
              <ul className="list-disc list-inside text-blue-700 space-y-2">
                <li><strong>Exécution d'un contrat :</strong> pour traiter vos commandes et fournir nos services</li>
                <li><strong>Consentement :</strong> pour le marketing et certains cookies non essentiels</li>
                <li><strong>Intérêt légitime :</strong> pour améliorer nos services et assurer la sécurité</li>
                <li><strong>Obligation légale :</strong> pour respecter la législation applicable</li>
              </ul>
            </div>
          </section>

          {/* Partage des données */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Partage de vos données</h2>
            <p className="text-gray-600 mb-4">
              Nous ne vendons pas vos données personnelles à des tiers. Nous pouvons partager vos informations 
              dans les cas suivants :
            </p>
            <div className="grid gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900">Prestataires de services</h3>
                <p className="text-gray-600 text-sm">
                  Transporteurs, processeurs de paiement, services d'hébergement (sous contrat de confidentialité)
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900">Obligations légales</h3>
                <p className="text-gray-600 text-sm">
                  Lorsque requis par la loi ou pour protéger nos droits légitimes
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900">Avec votre consentement</h3>
                <p className="text-gray-600 text-sm">
                  Dans tous les autres cas, uniquement avec votre autorisation expresse
                </p>
              </div>
            </div>
          </section>

          {/* Vos droits */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Vos droits</h2>
            <p className="text-gray-600 mb-6">
              Conformément au RGPD, vous disposez des droits suivants concernant vos données personnelles :
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900">Droit d'accès</h3>
                <p className="text-green-700 text-sm">Consulter les données que nous détenons sur vous</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900">Droit de rectification</h3>
                <p className="text-blue-700 text-sm">Corriger ou mettre à jour vos informations</p>
              </div>
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <h3 className="font-semibold text-red-900">Droit à l'effacement</h3>
                <p className="text-red-700 text-sm">Demander la suppression de vos données</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-900">Droit à la portabilité</h3>
                <p className="text-yellow-700 text-sm">Récupérer vos données dans un format lisible</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900">Droit d'opposition</h3>
                <p className="text-purple-700 text-sm">Vous opposer au traitement de vos données</p>
              </div>
              <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg">
                <h3 className="font-semibold text-indigo-900">Droit de limitation</h3>
                <p className="text-indigo-700 text-sm">Limiter le traitement de vos données</p>
              </div>
            </div>
            
            <div className="mt-6 bg-gray-100 p-4 rounded-lg">
              <p className="text-gray-700 text-sm">
                <strong>Comment exercer vos droits :</strong> Contactez-nous à 
                <a href="mailto:privacy@justeunpeu.com" className="text-blue-600 hover:underline ml-1">
                  privacy@justeunpeu.com
                </a>
                . Nous vous répondrons dans les 30 jours.
              </p>
            </div>
          </section>

          {/* Sécurité */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sécurité de vos données</h2>
            <p className="text-gray-600 mb-4">
              Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger 
              vos données personnelles contre l'accès non autorisé, la perte, la destruction ou la divulgation :
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Chiffrement des données sensibles (SSL/TLS)</li>
              <li>Accès restreint aux données personnelles</li>
              <li>Formation régulière de notre personnel</li>
              <li>Surveillance et détection des incidents</li>
              <li>Sauvegardes sécurisées</li>
            </ul>
          </section>

          {/* Conservation */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Conservation des données</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type de données
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durée de conservation
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Données de compte</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Jusqu'à suppression du compte</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Historique des commandes</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">10 ans (obligations comptables)</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Données marketing</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">3 ans après le dernier contact</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Logs de connexion</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">12 mois</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Contact */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Nous contacter</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Délégué à la Protection des Données (DPO)</h3>
              <p className="text-gray-600 mb-2"><strong>Email :</strong> privacy@justeunpeu.com</p>
              <p className="text-gray-600 mb-2"><strong>Adresse :</strong> Juste Un Peu, Belgique</p>
              <p className="text-gray-600 mb-4"><strong>Téléphone :</strong> +32 (0)X XX XX XX XX</p>
              
              <h3 className="font-semibold text-gray-900 mb-3">Autorité de contrôle</h3>
              <p className="text-gray-600">
                Vous avez également le droit de déposer une plainte auprès de l'Autorité de protection des données (APD) 
                si vous estimez que le traitement de vos données personnelles constitue une violation du RGPD.
              </p>
            </div>
          </section>

          {/* Mise à jour */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Modifications de cette politique</h2>
            <p className="text-gray-600 mb-4">
              Nous pouvons modifier cette politique de confidentialité de temps en temps pour refléter les changements 
              dans nos pratiques ou pour d'autres raisons opérationnelles, légales ou réglementaires. 
              Nous vous informerons de tout changement important par e-mail ou via une notification sur notre site web.
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

export default PrivacyPage;