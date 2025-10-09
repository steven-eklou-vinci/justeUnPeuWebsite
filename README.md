# Juste Un Peu - Site E-commerce

Un site e-commerce moderne et élégant pour la marque de vêtements "Juste Un Peu", inspiré par des marques comme Zara, HMA et Satyn.

## Technologies utilisées

- **Next.js 14** avec App Router
- **TypeScript** pour la sécurité des types
- **Tailwind CSS** pour le design moderne
- **React** pour l'interface utilisateur

## Fonctionnalités

- 🛍️ Catalogue de produits avec navigation intuitive
- 🎨 Design moderne et minimaliste
- 📱 Interface entièrement responsive
- 🔍 Système de recherche et filtres
- 🛒 Panier d'achat interactif
- 👤 Authentification utilisateur (à venir)
- 💳 Système de paiement (à venir)

## Installation

1. Clonez le repository
2. Installez les dépendances :
   ```bash
   npm install
   ```

## Développement

Pour lancer le serveur de développement :

```bash
npm run dev
```

# 🔐 Système d'Authentification - Juste Un Peu

Système d'authentification complet et sécurisé utilisant NextAuth.js, MongoDB, et des pratiques de sécurité modernes.

## 📋 Table des Matières

- [Installation](#installation)
- [Configuration](#configuration)
- [Architecture](#architecture)
- [API Routes](#api-routes)
- [Schéma des Collections](#schéma-des-collections)
- [Flux d'Authentification](#flux-dauthentification)
- [Sécurité](#sécurité)
- [Déploiement](#déploiement)

## 🚀 Installation

### Prérequis

- Node.js 18+
- MongoDB (local ou Atlas)
- Compte Mailjet (pour les emails)

### Installation des dépendances

```bash
npm install
```

### Configuration de l'environnement

Copiez le fichier `.env.sample` vers `.env.local` et configurez les variables :

```bash
cp .env.sample .env.local
```

### Démarrage du serveur de développement

```bash
npm run dev
```

L'application sera disponible sur [http://localhost:3001](http://localhost:3001)

## ⚙️ Configuration

### Variables d'environnement

| Variable | Description | Exemple |
|----------|-------------|---------|
| `APP_URL` | URL de l'application | `http://localhost:3001` |
| `MONGODB_URI` | Chaîne de connexion MongoDB | `mongodb://localhost:27017/justeunpeu` |
| `NEXTAUTH_SECRET` | Clé secrète pour NextAuth.js | `your-super-secret-key` |
| `NEXTAUTH_URL` | URL de base pour NextAuth.js | `http://localhost:3001` |
| `MAILJET_API_KEY` | Clé API Mailjet | `your-mailjet-api-key` |
| `MAILJET_SECRET_KEY` | Clé secrète Mailjet | `your-mailjet-secret-key` |
| `EMAIL_FROM` | Adresse email d'envoi | `noreply@justeunpeu.com` |

## 🏗️ Architecture

### Technologies utilisées

- **Frontend** : Next.js 14, React, TypeScript, Tailwind CSS
- **Backend** : Next.js API Routes, NextAuth.js
- **Base de données** : MongoDB avec validation de schéma
- **Authentification** : NextAuth.js avec provider Credentials
- **Sécurité** : Argon2id, Rate limiting, Zod validation
- **Email** : Mailjet
- **Logging** : Pino avec masquage des PII

## 🛣️ API Routes

### Endpoints d'authentification

| Méthode | Endpoint | Description | Body |
|---------|----------|-------------|------|
| `POST` | `/api/auth/register` | Inscription | `{ email, password, confirmPassword }` |
| `POST` | `/api/auth/verify-email` | Vérification email | `{ token }` |
| `POST` | `/api/auth/forgot-password` | Mot de passe oublié | `{ email }` |
| `POST` | `/api/auth/reset-password` | Réinitialisation | `{ token, password, confirmPassword }` |

### NextAuth.js endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/auth/signin` | Connexion |
| `POST` | `/api/auth/signout` | Déconnexion |
| `GET` | `/api/auth/session` | Session actuelle |

## 📊 Schéma des Collections

### Collection `users`

```javascript
{
  _id: ObjectId,
  email: String,           // Unique, indexé
  passwordHash: String,    // Hash Argon2id
  emailVerifiedAt: Date | null,
  createdAt: Date,
  updatedAt: Date
}
```

### Collection `password_resets`

```javascript
{
  _id: ObjectId,
  userId: ObjectId,        // Référence à users._id
  tokenHash: String,       // Hash du token
  expiresAt: Date,         // TTL automatique
  usedAt: Date | null,     // Timestamp d'utilisation
  createdAt: Date
}
```

## 🔄 Flux d'Authentification

### 1. Inscription
1. L'utilisateur saisit email/mot de passe
2. Validation des données (Zod)
3. Vérification unicité email
4. Hash du mot de passe (Argon2id)
5. Création de l'utilisateur
6. Génération et stockage du token de vérification
7. Envoi de l'email de vérification
8. Redirection vers page de confirmation

### 2. Vérification d'email
1. L'utilisateur clique sur le lien dans l'email
2. Vérification du token
3. Activation du compte
4. Invalidation du token
5. Redirection vers page de connexion

### 3. Connexion
1. L'utilisateur saisit ses identifiants
2. NextAuth.js valide via le provider Credentials
3. Vérification en base de données
4. Création de la session JWT
5. Redirection vers l'accueil

### 4. Réinitialisation mot de passe
1. Demande de réinitialisation avec email
2. Génération et envoi du token de reset
3. L'utilisateur clique sur le lien
4. Saisie du nouveau mot de passe
5. Validation et mise à jour
6. Invalidation du token

## 🛡️ Sécurité

### Hashing des mots de passe
- **Algorithme** : Argon2id (recommandé OWASP)
- **Configuration** : Memory cost 64MB, 3 iterations

### Rate Limiting
- **Connexion** : 5 tentatives / 15 min
- **Inscription** : 3 tentatives / heure
- **Reset mot de passe** : 3 tentatives / heure

### Validation des données
- **Email** : Format RFC, max 254 caractères
- **Mot de passe** : Min 8 caractères, majuscule, minuscule, chiffre

### Tokens de sécurité
- **Génération** : 32 bytes aléatoires
- **Stockage** : Hash Argon2id
- **Expiration** : 24 heures
- **Usage unique** : Invalidation après utilisation

## 🚀 Utilisation

### Hook d'authentification

```typescript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { 
    user, 
    isAuthenticated, 
    login, 
    logout, 
    register 
  } = useAuth();
  
  // Utilisation...
}
```

### Exemple de connexion

```typescript
const handleLogin = async () => {
  const result = await login('user@example.com', 'password');
  if (result.success) {
    // Redirection ou action de succès
  }
};
```

## 📱 Pages disponibles

- `/auth/login` - Connexion
- `/auth/register` - Inscription  
- `/auth/forgot-password` - Mot de passe oublié
- `/auth/reset-password` - Réinitialisation
- `/auth/verify-email` - Vérification d'email

## 🔧 Scripts disponibles

```bash
# Développement
npm run dev

# Build de production
npm run build

# Démarrage en production
npm start

# Linting
npm run lint

# MongoDB local (Docker)
docker-compose up -d mongodb
```

## 🔗 Configuration MongoDB Atlas (Production)

La base de données est configurée avec MongoDB Atlas :
- **Cluster** : JusteUnPeuDB
- **Database** : justeunpeu
- **Collections** : users, password_resets (créées automatiquement)

## 📧 Configuration Email

Pour activer l'envoi d'emails :
1. Créez un compte [Mailjet](https://www.mailjet.com/)
2. Récupérez vos clés API
3. Configurez les variables dans `.env.local`

## 🐛 Développement

### Structure des erreurs

Tous les endpoints retournent des erreurs standardisées :

```json
{
  "success": false,
  "error": "Message d'erreur utilisateur",
  "code": "ERROR_CODE"
}
```

### Logging

Les logs sont masqués pour la sécurité (mots de passe, tokens) et incluent :
- Tentatives d'authentification
- Erreurs système
- Événements de sécurité

---

**Système d'authentification développé par l'équipe Juste Un Peu** 🚀

## Scripts disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Construit l'application pour la production
- `npm start` - Lance l'application en production
- `npm run lint` - Vérifie le code avec ESLint

## Structure du projet

```
src/
├── app/                 # Pages et layouts (App Router)
│   ├── globals.css     # Styles globaux
│   ├── layout.tsx      # Layout principal
│   └── page.tsx        # Page d'accueil
├── components/         # Composants réutilisables (à venir)
└── styles/            # Styles additionnels (à venir)
```

## Design

Le design s'inspire des meilleures pratiques du e-commerce moderne :
- Palette de couleurs neutres (noir, blanc, gris)
- Typographie claire et lisible
- Mise en page épurée
- Navigation intuitive
- Animations subtiles

## Roadmap

- [ ] Catalogue de produits complet
- [ ] Système de filtres avancés
- [ ] Panier d'achat fonctionnel
- [ ] Authentification utilisateur
- [ ] Système de paiement
- [ ] Interface d'administration
- [ ] Optimisation SEO
- [ ] Tests automatisés

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## License

Ce projet est sous licence MIT.
