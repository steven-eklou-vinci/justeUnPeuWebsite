"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const Hero = () => {
  const [showCarousel, setShowCarousel] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const heroImages = [
    "/images/hero/1.jpg",
    "/images/hero/2.jpg",
    "/images/hero/3.jpg",
    "/images/hero/4.jpg",
    "/images/hero/5.jpg",
    "/images/hero/6.jpg",
    "/images/hero/7.jpg",
    "/images/hero/8.jpg",
    "/images/hero/9.jpg",
    "/images/hero/10.jpg",
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCarousel(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showCarousel) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => 
          prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
        );
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [showCarousel, heroImages.length]);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden -mt-1">
      {/* Images pleine largeur sans espacement */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              showCarousel && index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={image}
              alt={`Collection JUSTE UN PEU - Image ${index + 1}`}
              fill
              style={{ objectFit: "cover", objectPosition: "center 35%" }}
              className="transition-transform duration-700"
              priority={index === 0}
              quality={95}
              sizes="100vw"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
          </div>
        ))}
        {/* Overlay sombre */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Contenu centré au-dessus de l'image */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="text-center text-white px-4 max-w-4xl mx-auto">
          <div className="space-y-8">
            <div className={`transition-all duration-1000 ${showCarousel ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight mb-6">
                JUSTE UN PEU.
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl font-light max-w-2xl mx-auto leading-relaxed">
                Découvrez notre nouvelle collection exclusive
              </p>
            </div>

            <div className={`transition-all duration-1000 delay-500 ${
              showCarousel ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}>
              <button 
                onClick={() => {
                  const section = document.getElementById("notre-collection");
                  if (section) {
                    section.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="inline-flex items-center bg-white text-black px-8 py-3 text-lg font-medium hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Découvrir
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Zones de navigation sur toute la largeur */}
      <button
        onClick={() => setCurrentImageIndex(
          currentImageIndex === 0 ? heroImages.length - 1 : currentImageIndex - 1
        )}
        className="absolute left-0 top-0 w-1/3 h-full opacity-0 z-20"
        aria-label="Image précédente"
      />
      <button
        onClick={() => setCurrentImageIndex(
          currentImageIndex === heroImages.length - 1 ? 0 : currentImageIndex + 1
        )}
        className="absolute right-0 top-0 w-1/3 h-full opacity-0 z-20"
        aria-label="Image suivante"
      />

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
