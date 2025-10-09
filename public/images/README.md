# Dossier Images - Juste Un Peu

## Organisation des dossiers

### `/public/images/`
Dossier principal pour toutes les images du site web.

### `/public/images/products/`
Images des produits de la collection :
- Vêtements femme
- Vêtements homme  
- Accessoires
- Images de produits individuels

**Format recommandé :** 
- Résolution : 800x1000px (ratio 4:5)
- Format : JPG ou WebP
- Taille : < 500KB par image

### `/public/images/hero/`
Images pour la section héro/bannière :
- Images de fond
- Images de campagne
- Visuals promotionnels

**Format recommandé :**
- Résolution : 1920x1080px ou plus
- Format : JPG ou WebP
- Taille : < 1MB par image

### `/public/images/categories/`
Images pour les catégories de produits :
- Femme
- Homme
- Accessoires
- Collections spéciales

**Format recommandé :**
- Résolution : 600x400px
- Format : JPG ou WebP
- Taille : < 300KB par image

## Utilisation dans le code

Les images seront accessibles via :
```jsx
// Pour les produits
<Image src="/images/products/nom-du-produit.jpg" alt="Description" />

// Pour le hero
<Image src="/images/hero/banniere-principale.jpg" alt="Description" />

// Pour les catégories
<Image src="/images/categories/femme.jpg" alt="Description" />
```

## Conseils

1. **Nommage** : Utilisez des noms descriptifs en minuscules avec des tirets
   - Exemple : `robe-midi-elegante.jpg`

2. **Optimisation** : Compressez les images avant de les ajouter

3. **Formats** : Privilégiez WebP pour une meilleure performance

4. **Alt text** : Toujours ajouter une description alternative pour l'accessibilité
