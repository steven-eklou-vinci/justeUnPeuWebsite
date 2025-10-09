'use client';

import React from 'react';
import Header from '@/components/Header';

const LivraisonPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Breadcrumb */}
        <div className="mb-8">
          <nav className="flex space-x-2 text-sm text-gray-500">
            <a href="/" className="hover:text-gray-900">Accueil</a>
            <span>/</span>
            <span className="text-gray-900">Livraison & Retours</span>
          </nav>
        </div>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-light text-gray-900 mb-6">Livraison & Retours</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez nos conditions de livraison et notre politique de retours simple et transparente.
          </p>
        </div>

        <div className="space-y-16">
          {/* Section Livraison */}
          <section>
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h2 className="text-3xl font-light text-gray-900">Livraison</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gray-50 p-8 rounded-lg">
                <h3 className="text-xl font-medium text-gray-900 mb-4">Livraison Standard</h3>
                <div className="space-y-3 text-gray-600">
                  <p><span className="font-medium">Délai :</span> 3-5 jours ouvrés</p>
                  <p><span className="font-medium">Prix :</span> 4,90€</p>
                  <p><span className="font-medium">Gratuite :</span> dès 50€ d'achat</p>
                </div>
              </div>

              <div className="bg-gray-50 p-8 rounded-lg">
                <h3 className="text-xl font-medium text-gray-900 mb-4">Livraison Express</h3>
                <div className="space-y-3 text-gray-600">
                  <p><span className="font-medium">Délai :</span> 24-48h</p>
                  <p><span className="font-medium">Prix :</span> 9,90€</p>
                  <p><span className="font-medium">Commande avant :</span> 14h</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800 mb-1">Information importante</h3>
                  <p className="text-sm text-blue-700">
                    Toutes nos livraisons sont effectuées par La Poste et sont assurées. 
                    Vous recevrez un email avec le numéro de suivi dès l'expédition de votre commande.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section Retours */}
          <section>
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-light text-gray-900">Retours & Remboursements</h2>
            </div>

            <div className="space-y-8">
              <div className="border border-gray-200 rounded-lg p-8">
                <h3 className="text-xl font-medium text-gray-900 mb-6">Conditions de retour</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">14 jours</h4>
                    <p className="text-sm text-gray-600">pour retourner vos articles</p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">État neuf</h4>
                    <p className="text-sm text-gray-600">étiquettes et emballage intacts</p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-2">Retours gratuits</h4>
                    <p className="text-sm text-gray-600">nous prenons en charge les frais</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">Comment procéder au retour ?</h4>
                  <ol className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm mr-3 mt-0.5">1</span>
                      <span>Contactez-nous par email à <a href="mailto:juste.unpeu@outlook.com" className="text-gray-900 hover:underline">juste.unpeu@outlook.com</a></span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm mr-3 mt-0.5">2</span>
                      <span>Indiquez votre numéro de commande et les articles à retourner</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm mr-3 mt-0.5">3</span>
                      <span>Nous vous envoyons une étiquette de retour prépayée</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm mr-3 mt-0.5">4</span>
                      <span>Emballez les articles et collez l'étiquette sur le colis</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm mr-3 mt-0.5">5</span>
                      <span>Déposez le colis dans un bureau de poste ou boîte aux lettres</span>
                    </li>
                  </ol>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-8">
                <h3 className="text-xl font-medium text-gray-900 mb-4">Délais de remboursement</h3>
                <div className="space-y-4 text-gray-600">
                  <p>
                    Une fois votre retour reçu et vérifié, nous procédons au remboursement dans un délai de 
                    <span className="font-medium text-gray-900"> 3-5 jours ouvrés</span>.
                  </p>
                  <p>
                    Le remboursement s'effectue automatiquement sur le moyen de paiement utilisé lors de votre commande.
                  </p>
                  <p>
                    Vous recevrez un email de confirmation dès que le remboursement aura été traité.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section Contact */}
          <section className="bg-gray-50 p-8 rounded-lg">
            <div className="text-center">
              <h3 className="text-2xl font-light text-gray-900 mb-4">Une question ?</h3>
              <p className="text-gray-600 mb-6">
                Notre équipe customer care est là pour vous accompagner dans vos retours et échanges.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="mailto:juste.unpeu@outlook.com"
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 rounded-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Nous contacter par email
                </a>
                <a 
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 transition-colors rounded-lg"
                >
                  Aller à la page contact
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-4">JUSTE UN PEU</h3>
          <p className="text-gray-400">
            Mode • Style • Élégance
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LivraisonPage;