import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import CookieConsent from '@/components/CookieConsent';

// Données des produits avec vraies images
const featuredProducts = [
  {
    id: 1,
    name: "Just enough",
    price: 45,
    description: "Look contemporain et élégant, parfait pour toutes occasions",
    image: "/images/home_collection/3e38407e-e61b-473e-8e93-b1ffc53d1e7e.jpg",
    sale: false
  },
  {
    id: 2,
    name: "The original Black",
    price: 45,
    description: "Tenue décontractée chic pour un style urbain authentique",
    image: "/images/home_collection/7c949c59-3a53-4b31-81a5-30f3452a8278.jpg",
    sale: false
  },
  {
    id: 3,
    name: "The fine touch",
    price: 45,
    description: "Ensemble raffiné pour une élégance naturelle",
    image: "/images/home_collection/7ead4a29-8627-4a26-a9bf-ab3424ea3005.jpg",
    sale: false
  },

  {
    id: 5,
    name: "The original White",
    price: 45,
    description: "Parfait équilibre entre décontraction et élégance",
    image: "/images/home_collection/ba571b06-3885-4cde-be0a-347a45c41044.jpg",
    sale: false
  },
  {
    id: 6,
    name: "Orange",
    price: 55,
    description: "Ensemble moderne avec une coupe impeccable",
    image: "/images/home_collection/fec35dd9-fe72-4bb1-92a6-b54da3e5a54d.jpg",
    sale: false
  }
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />

      {/* Featured Products */}
      <section id="notre-collection" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-light text-gray-900 mb-4">Notre Collection</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez notre sélection de pièces incontournables, choisies pour leur qualité 
            exceptionnelle et leur style intemporel.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              description={product.description}
              sale={product.sale}
            />
          ))}
        </div>
        
        <div className="text-center mt-16">
          <a 
            href="/collection" 
            className="inline-block border-2 border-gray-900 text-gray-900 px-8 py-3 hover:bg-gray-900 hover:text-white transition-all duration-300 text-lg font-medium"
          >
            Voir toute la collection
          </a>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-light text-gray-900 mb-4">
            Restez à la pointe de la mode
          </h3>
          <p className="text-gray-600 mb-8 text-lg">
            Inscrivez-vous à notre newsletter et recevez en exclusivité nos dernières nouveautés, 
            tendances et offres spéciales.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Votre adresse email" 
              className="flex-1 px-6 py-3 border border-gray-300 focus:border-gray-900 focus:outline-none text-lg"
            />
            <button className="bg-gray-900 text-white px-8 py-3 hover:bg-gray-800 transition-colors text-lg font-medium whitespace-nowrap">
              S&apos;abonner
            </button>
          </div>
          <p className="text-gray-500 text-sm mt-4">
            Nous respectons votre vie privée. Désabonnez-vous à tout moment.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h5 className="text-lg font-bold mb-4">JUSTE UN PEU</h5>
              <p className="text-gray-400 mb-6">Votre destination pour la mode moderne et élégante.</p>
              
              {/* Réseaux sociaux */}
              <div className="flex space-x-4">
                <a 
                  href="https://www.instagram.com/justeunpeu.be?igsh=MWZyNTBoNW9kbnprNg=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  title="Instagram"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a 
                  href="https://l.instagram.com/?u=https%3A%2F%2Fwww.tiktok.com%2F%40justeunpeu.be%3F_t%3DZG-90NofOAtm9A%26_r%3D1&e=AT3mxsPvfcue1QPA3fr-7Uyia7DMMyJQqbvvta61K6zJbqKRO5fNaiQ7LQuKW2Ib91bsluu-xFUcpQT12gskfB_6cbZDTv2lPyE88_p0i9R3wB05yjvL00efu4dECApSQLGHlkO65LoX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  title="TikTok"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Boutique</h6>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/collection" className="hover:text-white">Collection</a></li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Service Client</h6>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/contact" className="hover:text-white">Contact</a></li>
                <li><a href="/livraison" className="hover:text-white">Livraison & Retours</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
                <a href="/privacy" className="hover:text-white transition-colors">Politique de Confidentialité</a>
                <a href="/cookies" className="hover:text-white transition-colors">Politique des Cookies</a>
                <a href="/contact" className="hover:text-white transition-colors">Contact</a>
              </div>
              <p className="text-gray-400 text-center">&copy; 2025 Juste Un Peu. Tous droits réservés.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Cookie Consent Popup */}
      <CookieConsent />
    </div>
  );
};

export default HomePage;
