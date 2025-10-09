export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  color: string;
  image: string;
  description: string;
  details: string;
  care: string;
  sizes: string[];
  images?: string[]; // Images supplémentaires pour la galerie
}

export const products: Product[] = [
  {
    id: 1,
    name: "Just enough",
    price: 45,
    category: "ensemble",
    color: "blanc",
    image: "/images/home_collection/3e38407e-e61b-473e-8e93-b1ffc53d1e7e.jpg",
    description: "Look contemporain et élégant, parfait pour toutes occasions. Un ensemble raffiné qui incarne la simplicité chic.",
    details: "Composition: 75% Coton bio, 20% Lin, 5% Élasthanne",
    care: "Lavage en machine à 30°C, repassage à température moyenne",
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [
      "/images/home_collection/3e38407e-e61b-473e-8e93-b1ffc53d1e7e.jpg",
      "/images/collection/PHOTO-2025-09-26-20-44-45.jpg",
      "/images/collection/PHOTO-2025-09-26-20-44-45 2.jpg",
      "/images/collection/a392d2b9-7aaf-4b1b-8392-0672f39c8e01.jpg"
    ]
  },
  {
    id: 2,
    name: "The original Black",
    price: 45,
    category: "ensemble",
    color: "noir",
    image: "/images/home_collection/7c949c59-3a53-4b31-81a5-30f3452a8278.jpg",
    description: "Tenue décontractée chic pour un style urbain authentique. Le noir intemporel pour une élégance assurée.",
    details: "Composition: 70% Coton, 25% Polyester, 5% Élasthanne",
    care: "Lavage en machine à 30°C, repassage à température moyenne",
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [
      "/images/home_collection/7c949c59-3a53-4b31-81a5-30f3452a8278.jpg",
      "/images/collection/0cc4aebd-b6ca-46d3-9381-974354e7902d.jpg",
      "/images/collection/caca106f-9a40-42c6-99ae-4e0a008d6709.jpg",
      "/images/collection/1d4f33f7-2aff-46fa-88a3-6575baa7b23e.jpg"
    ]
  },
  {
    id: 3,
    name: "The fine Touch",
    price: 45,
    category: "ensemble",
    color: "blanc",
    image: "/images/home_collection/7ead4a29-8627-4a26-a9bf-ab3424ea3005.jpg",
    description: "Ensemble raffiné pour une élégance naturelle. La finesse au service de votre style.",
    details: "Composition: 80% Coton peigné, 18% Modal, 2% Élasthanne",
    care: "Lavage en machine à 30°C, séchage à l'air libre",
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [
      "/images/home_collection/7ead4a29-8627-4a26-a9bf-ab3424ea3005.jpg",
      "/images/collection/7f265c1f-e8a8-465e-aedf-a9ed7a54ad26.jpg",
      "/images/collection/PHOTO-2025-09-26-20-33-57.jpg",
      "/images/collection/PHOTO-2025-09-26-20-37-48.jpg",
    ]
  },
  {
    id: 5,
    name: "The original White",
    price: 45,
    category: "ensemble",
    color: "blanc",
    image: "/images/home_collection/ba571b06-3885-4cde-be0a-347a45c41044.jpg",
    description: "Parfait équilibre entre décontraction et élégance. Le blanc pur pour une fraîcheur intemporelle.",
    details: "Composition: 75% Coton bio, 20% Lin européen, 5% Élasthanne",
    care: "Lavage en machine à 40°C, repassage à haute température",
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [
      "/images/home_collection/ba571b06-3885-4cde-be0a-347a45c41044.jpg",
      "/images/collection/beafb71f-ca87-4e49-8a97-094c74c48794.jpg",
      "/images/collection/a507b887-513b-4cc2-8d8a-e9ba7db1a200.jpg",
      "/images/collection/PHOTO-2025-08-09-16-56-08.jpg"
    ]
  },
  {
    id: 6,
    name: "ORANGE",
    price: 55,
    category: "robe",
    color: "orange",
    image: "/images/home_collection/fec35dd9-fe72-4bb1-92a6-b54da3e5a54d.jpg",
    description: "Ensemble moderne avec une coupe impeccable. L'orange pour oser la couleur avec style.",
    details: "Composition: 80% Viscose, 20% Élasthanne",
    care: "Lavage en machine à 30°C, séchage à l'air libre, pas de repassage direct",
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [
      "/images/home_collection/fec35dd9-fe72-4bb1-92a6-b54da3e5a54d.jpg",
      "/images/collection/195ff017-b947-43c1-9450-558d67ee3f85.jpg",
      "/images/collection/PHOTO-2025-08-09-16-45-38.jpg",
      "/images/collection/PHOTO-2025-08-09-16-45-46.jpg",
    ]
  }
];

export const getProductById = (id: number): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  if (category === 'all') return products;
  return products.filter(product => product.category === category);
};

export const getProductsByColor = (color: string): Product[] => {
  if (color === 'all') return products;
  return products.filter(product => product.color === color);
};