# Guide de Configuration Supabase

Ce guide vous accompagne dans la configuration complète de Supabase pour JobFlow.

## 📋 Prérequis

- Un compte Supabase (gratuit) : [supabase.com](https://supabase.com)

## 🚀 Étapes de Configuration

### 1. Créer un Projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Cliquez sur "Start your project"
3. Connectez-vous ou créez un compte
4. Cliquez sur "New Project"
5. Remplissez les informations :
   - **Name:** JobFlow
   - **Database Password:** Choisissez un mot de passe fort (notez-le !)
   - **Region:** Choisissez la région la plus proche (Europe West pour la France)
   - **Plan:** Free
6. Cliquez sur "Create new project"
7. Attendez 2-3 minutes que le projet soit créé

### 2. Récupérer les Credentials

1. Dans votre projet Supabase, allez dans **Settings** (icône ⚙️ en bas à gauche)
2. Cliquez sur **API**
3. Copiez les informations suivantes :
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

### 3. Configurer les Variables d'Environnement

1. Ouvrez le fichier `.env.local` à la racine du projet
2. Remplacez les valeurs par vos credentials :

```env
VITE_SUPABASE_URL=https://votre-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=votre-anon-key-ici
```

3. Sauvegardez le fichier

### 4. Exécuter les Migrations SQL

Les migrations SQL se trouvent dans le dossier `supabase/migrations/`.

**Option A : Via l'interface Supabase (Recommandé)**

1. Dans votre projet Supabase, allez dans **SQL Editor** (icône 📝)
2. Exécutez les migrations **dans l'ordre** :

   **Migration 1 : Profiles**
   - Ouvrez `supabase/migrations/001_create_profiles.sql`
   - Copiez tout le contenu
   - Collez dans l'éditeur SQL
   - Cliquez sur "RUN" (ou appuyez sur Ctrl+Enter)
   - Vérifiez qu'il n'y a pas d'erreur

   **Migration 2 : Jobs**
   - Ouvrez `supabase/migrations/002_create_jobs.sql`
   - Copiez et exécutez le contenu

   **Migration 3 : Documents**
   - Ouvrez `supabase/migrations/003_create_documents.sql`
   - Copiez et exécutez le contenu

   **Migration 4 : Storage**
   - Ouvrez `supabase/migrations/004_create_storage.sql`
   - Copiez et exécutez le contenu

   **Migration 5 : Functions & Triggers**
   - Ouvrez `supabase/migrations/005_create_functions_triggers.sql`
   - Copiez et exécutez le contenu

   **Migration 6 : Draft Status**
   - Ouvrez `supabase/migrations/006_add_draft_status.sql`
   - Copiez et exécutez le contenu

   **Migration 7 : Avatars Bucket**
   - Ouvrez `supabase/migrations/007_create_avatars_bucket.sql`
   - Copiez et exécutez le contenu

**Option B : Via Supabase CLI (Pour développeurs avancés)**

```bash
# Installer Supabase CLI
npm install -g supabase

# Se connecter à Supabase
supabase login

# Lier le projet
supabase link --project-ref votre-project-ref

# Exécuter les migrations
supabase db push
```

### 5. Vérifier les Tables

1. Allez dans **Table Editor** (icône 📊)
2. Vous devriez voir les tables suivantes :
   - ✅ `profiles`
   - ✅ `jobs`
   - ✅ `documents`

### 6. Configurer l'Authentification

1. Allez dans **Authentication** → **Providers**
2. Activez les providers souhaités :

   **Email (Déjà activé par défaut)**
   - ✅ Email/Password déjà activé

   **Google OAuth (Optionnel)**
   - Toggle "Google" sur ON
   - Suivez les instructions pour obtenir Client ID et Secret
   - Configurez les URLs de redirection

   **GitHub OAuth (Optionnel)**
   - Toggle "GitHub" sur ON
   - Suivez les instructions pour obtenir Client ID et Secret
   - Configurez les URLs de redirection

3. Dans **Authentication** → **URL Configuration**
   - **Site URL:** `http://localhost:5173` (développement)
   - **Redirect URLs:** Ajoutez `http://localhost:5173/auth/callback`

### 7. Vérifier le Storage

1. Allez dans **Storage** (icône 📦)
2. Vous devriez voir les buckets :
   - ✅ `job-documents` (privé)
   - ✅ `avatars` (public)

### 8. Tester la Configuration

1. Redémarrez votre serveur de développement :
   ```bash
   npm run dev
   ```

2. Ouvrez votre navigateur sur `http://localhost:5173`

3. La page devrait se charger sans erreur

4. Ouvrez la console du navigateur (F12)
   - Il ne devrait pas y avoir d'erreur liée à Supabase

## ✅ Vérification Finale

Checklist de vérification :

- ✅ Projet Supabase créé
- ✅ Variables d'environnement configurées dans `.env.local`
- ✅ Toutes les migrations SQL exécutées (7 migrations)
- ✅ Tables créées : `profiles`, `jobs`, `documents`
- ✅ Buckets Storage créés : `job-documents`, `avatars`
- ✅ Authentification configurée (au minimum Email)
- ✅ Application démarre sans erreur

## 🔧 Dépannage

### Erreur : "Missing Supabase environment variables"
- Vérifiez que `.env.local` existe et contient les bonnes valeurs
- Redémarrez le serveur de développement après avoir modifié `.env.local`

### Erreur lors de l'exécution des migrations
- Vérifiez que vous exécutez les migrations **dans l'ordre**
- Vérifiez qu'il n'y a pas d'erreurs de syntaxe SQL
- Essayez de supprimer et recréer le projet Supabase si nécessaire

### Les politiques RLS bloquent les requêtes
- Vérifiez que vous êtes bien authentifié
- Vérifiez que les politiques RLS sont bien créées (migrations 001-003)

## 📚 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## 🆘 Besoin d'Aide ?

Si vous rencontrez des problèmes :
1. Vérifiez les logs dans la console du navigateur (F12)
2. Vérifiez les logs Supabase dans le dashboard
3. Consultez la documentation Supabase
4. Ouvrez une issue sur le repository du projet
