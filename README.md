# Job Tracker - Gestionnaire de Candidatures

Application web moderne pour suivre et gérer vos candidatures d'emploi, construite avec React, Supabase et Tailwind CSS.

![Job Tracker](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-19.2.0-61dafb.svg)
![Supabase](https://img.shields.io/badge/Supabase-2.86.0-3ECF8E.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4.18-38B2AC.svg)

## 🚀 Fonctionnalités

### Gestion des candidatures
- ✅ **CRUD complet** : Créer, lire, modifier et supprimer des candidatures
- ✅ **Statuts** : Brouillon, Envoyé, Entretien, Refus, Offre
- ✅ **Recherche & filtres** : Par entreprise, poste, statut, type de contrat
- ✅ **Favoris** : Marquer les candidatures importantes
- ✅ **Notes** : Ajouter des notes personnelles pour chaque candidature

### Statistiques
- ✅ **Dashboard** : Vue d'ensemble avec statistiques clés
- ✅ **Graphiques avancés** : Distribution par statut, tendances, sources
- ✅ **Métriques** : Taux de réponse, temps moyen, etc.

### Documents
- ✅ **Upload** : CV, lettres de motivation, portfolios
- ✅ **Gestion** : Téléchargement et suppression de documents
- ✅ **Validation** : Types et tailles de fichiers contrôlés

### Profil utilisateur
- ✅ **Informations personnelles** : Nom, téléphone, localisation
- ✅ **Avatar** : Upload et gestion de photo de profil
- ✅ **Sécurité** : Changement de mot de passe

### Authentification
- ✅ **Email/Password** : Inscription et connexion classiques
- ✅ **OAuth** : Google et GitHub (optionnel)
- ✅ **Sécurisé** : Row Level Security avec Supabase

## 🛠️ Stack Technique

- **Frontend** : React 19, Vite, React Router
- **UI** : Tailwind CSS, Lucide Icons
- **Backend** : Supabase (Auth, Database, Storage)
- **Formulaires** : React Hook Form + Zod
- **Graphiques** : Recharts
- **Date** : date-fns
- **Notifications** : React Hot Toast

## 📋 Prérequis

- Node.js 18+ et npm
- Un compte Supabase (gratuit)
- Git

## 📦 Installation

1. Cloner le repository
```bash
git clone <url-du-repo>
cd job-tracker
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement
```bash
cp .env.example .env.local
```

4. Mettre à jour `.env.local` avec vos credentials Supabase
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Lancer le serveur de développement
```bash
npm run dev
```

## 🗄️ Configuration Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Exécuter les migrations SQL dans `supabase/migrations/`
3. Configurer le bucket Storage `job-documents`
4. Récupérer l'URL et la clé API anon

## 📁 Structure du Projet

```
src/
├── components/
│   ├── atoms/        # Composants de base (Button, Input, etc.)
│   ├── molecules/    # Composants composés
│   ├── organisms/    # Composants complexes
│   ├── templates/    # Layouts
│   └── ui/          # Composants UI génériques
├── context/         # Contextes React (Auth, Jobs)
├── hooks/           # Custom hooks
├── services/        # Services API
├── lib/             # Utilitaires et validators
├── pages/           # Pages de l'application
├── config/          # Configuration (theme, constants)
└── utils/           # Fonctions utilitaires
```

## 🎨 Design System - LimeProject

- **Couleur principale:** Lime Green (#D8F26E)
- **Accent:** Purple (#8B5CF6)
- **Police:** Inter
- **Border Radius:** 24px (cartes)
- **Ombre:** Subtile sur les cartes

## 📝 Scripts Disponibles

- `npm run dev` - Lancer le serveur de développement
- `npm run build` - Build de production
- `npm run preview` - Preview du build de production
- `npm run lint` - Lancer le linter

## 🔐 Sécurité

- **Row Level Security (RLS)** : Chaque utilisateur ne voit que ses données
- **Authentification** : Gérée par Supabase Auth
- **Storage sécurisé** : Politiques d'accès sur les fichiers
- **Validation** : Zod pour la validation côté client

## 📱 Responsive

L'application est entièrement responsive :
- **Mobile** : 1 colonne
- **Tablet** : 2 colonnes
- **Desktop** : 3-4 colonnes

## 🧪 Tests

Les tests manuels ont été effectués sur :
- ✅ Authentification (login, register, logout)
- ✅ CRUD candidatures
- ✅ Recherche et filtres
- ✅ Upload de documents
- ✅ Gestion de profil
- ✅ Statistiques
- ✅ Responsive design

## 🚀 Déploiement

Consultez le guide complet dans [DEPLOYMENT.md](./DEPLOYMENT.md)

**Déploiement rapide sur Vercel :**

```bash
npm install -g vercel
vercel
```

## 📚 Documentation

- [Guide de configuration Supabase](./SUPABASE_SETUP.md)
- [Guide de déploiement](./DEPLOYMENT.md)
- [Plan d'implémentation](./projectplan.md)

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le projet
2. Créez une branche (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Add amazing feature'`)
4. Poussez sur la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.

## 🙏 Remerciements

- [Supabase](https://supabase.com) pour le backend
- [Tailwind CSS](https://tailwindcss.com) pour le design
- [Lucide](https://lucide.dev) pour les icônes
- [Vite](https://vitejs.dev) pour le bundler

## 📞 Support

Pour toute question ou problème :
- Ouvrez une issue sur GitHub
- Consultez la documentation Supabase
- Vérifiez les logs dans la console du navigateur

---

**Fait avec ❤️ et Claude Code**
