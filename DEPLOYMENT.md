# Guide de Déploiement - Job Tracker

Ce guide vous accompagne pour déployer l'application Job Tracker en production.

## 📋 Pré-requis

Avant de déployer, assurez-vous que :

- ✅ Le projet Supabase est configuré et fonctionnel
- ✅ Toutes les migrations SQL sont exécutées
- ✅ Les buckets Storage sont créés (`job-documents`, `avatars`)
- ✅ L'authentification est configurée
- ✅ Les tests manuels sont passés
- ✅ Le build local fonctionne (`npm run build`)

## 🚀 Déploiement sur Vercel (Recommandé)

Vercel offre le déploiement le plus simple et le plus optimisé pour React + Vite.

### Méthode 1 : Via l'interface Web (Plus facile)

1. **Connectez-vous sur** [vercel.com](https://vercel.com)

2. **Cliquez sur "Add New" → "Project"**

3. **Importez votre repository Git**
   - Connectez votre compte GitHub/GitLab/Bitbucket
   - Sélectionnez le repository `job-tracker`

4. **Configurez le projet**
   - **Framework Preset** : Vite
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`
   - **Install Command** : `npm install`

5. **Ajoutez les variables d'environnement**

   Allez dans "Environment Variables" et ajoutez :
   ```
   VITE_SUPABASE_URL=votre_url_supabase
   VITE_SUPABASE_ANON_KEY=votre_cle_anon
   ```

6. **Cliquez sur "Deploy"**

7. **Attendez le déploiement** (environ 2-3 minutes)

8. **Testez l'application** en cliquant sur le lien généré

### Méthode 2 : Via la CLI Vercel

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer
cd job-tracker
vercel

# Suivre les instructions interactives
# - Set up and deploy: Y
# - Which scope: Votre compte
# - Link to existing project: N
# - Project name: job-tracker
# - In which directory: ./
# - Override settings: N

# Ajouter les variables d'environnement
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# Redéployer avec les variables
vercel --prod
```

### Configuration Post-Déploiement Vercel

1. **Configurer le domaine personnalisé** (optionnel)
   - Allez dans Settings → Domains
   - Ajoutez votre domaine custom

2. **Mettre à jour Supabase**
   - Allez dans votre projet Supabase
   - **Authentication** → **URL Configuration**
   - Ajoutez votre URL Vercel dans **Site URL** et **Redirect URLs**
   - Exemple : `https://job-tracker.vercel.app`

3. **Tester OAuth** (si utilisé)
   - Google OAuth : Ajoutez l'URL Vercel dans Google Console
   - GitHub OAuth : Ajoutez l'URL Vercel dans GitHub Settings

---

## 🌐 Déploiement sur Netlify

Alternative populaire avec des fonctionnalités similaires.

### Via l'interface Web

1. **Connectez-vous sur** [netlify.com](https://netlify.com)

2. **Cliquez sur "Add new site" → "Import an existing project"**

3. **Connectez votre repository Git**

4. **Configurez le build**
   - **Build command** : `npm run build`
   - **Publish directory** : `dist`
   - **Base directory** : (laissez vide)

5. **Ajoutez les variables d'environnement**

   Allez dans Site settings → Environment variables :
   ```
   VITE_SUPABASE_URL=votre_url_supabase
   VITE_SUPABASE_ANON_KEY=votre_cle_anon
   ```

6. **Créez le fichier `netlify.toml`** à la racine du projet :
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

7. **Déployez**

### Via la CLI Netlify

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Se connecter
netlify login

# Initialiser
cd job-tracker
netlify init

# Déployer
netlify deploy --prod

# Ajouter les variables d'environnement
netlify env:set VITE_SUPABASE_URL "votre_url"
netlify env:set VITE_SUPABASE_ANON_KEY "votre_cle"
```

### Configuration Post-Déploiement Netlify

Même étapes que Vercel pour :
- Configurer le domaine
- Mettre à jour Supabase
- Tester OAuth

---

## 🔐 Variables d'Environnement de Production

### Variables Obligatoires

| Variable | Description | Où la trouver |
|----------|-------------|---------------|
| `VITE_SUPABASE_URL` | URL de votre projet Supabase | Supabase Dashboard → Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Clé anonyme Supabase | Supabase Dashboard → Settings → API → anon/public |

### ⚠️ IMPORTANT : Sécurité

- ❌ **NE JAMAIS** commit le fichier `.env.local` dans Git
- ❌ **NE JAMAIS** exposer la clé `service_role` (seulement `anon`)
- ✅ Ajoutez `.env.local` dans `.gitignore`
- ✅ Utilisez uniquement les variables d'environnement de la plateforme

---

## 🧪 Tester le Build Localement

Avant de déployer, testez le build en local :

```bash
# Build de production
npm run build

# Prévisualiser le build
npm run preview

# L'app sera accessible sur http://localhost:4173
```

**Checklist de test :**
- ✅ Authentification fonctionne
- ✅ CRUD candidatures opérationnel
- ✅ Upload de documents
- ✅ Statistiques affichées
- ✅ Pas d'erreurs dans la console
- ✅ Responsive sur mobile

---

## 🔄 Déploiement Continu (CI/CD)

Une fois déployé sur Vercel ou Netlify, chaque push sur la branche `main` déclenche automatiquement un nouveau déploiement.

### Workflow recommandé

1. **Développement** : Branche `dev`
   ```bash
   git checkout -b dev
   # Vos modifications
   git commit -m "Add feature"
   git push origin dev
   ```

2. **Preview Deployment** : Les branches sont automatiquement déployées avec une URL de preview

3. **Production** : Merge dans `main`
   ```bash
   git checkout main
   git merge dev
   git push origin main
   ```

---

## 📊 Monitoring Post-Déploiement

### Vercel Analytics

Activez les analytics Vercel :
1. Allez dans votre projet → Analytics
2. Activez Web Analytics

### Supabase Logs

Surveillez les logs Supabase :
1. Supabase Dashboard → Logs
2. Vérifiez les erreurs d'authentification et de base de données

### Error Tracking (Optionnel)

Intégrez Sentry pour le tracking d'erreurs :
```bash
npm install @sentry/react
```

---

## 🐛 Dépannage

### Problème : L'application ne charge pas

**Solution :**
1. Vérifiez les variables d'environnement
2. Regardez la console du navigateur (F12)
3. Vérifiez les logs de build sur Vercel/Netlify

### Problème : Authentification ne fonctionne pas

**Solution :**
1. Vérifiez que l'URL de production est ajoutée dans Supabase
2. **Authentication** → **URL Configuration**
3. Ajoutez `https://votre-domaine.com` dans Site URL et Redirect URLs

### Problème : OAuth ne fonctionne pas

**Solution :**
1. Vérifiez les redirect URLs dans Google/GitHub OAuth settings
2. Ajoutez `https://votre-domaine.com/auth/callback`
3. Redémarrez l'authentification OAuth dans Supabase

### Problème : Upload de fichiers ne fonctionne pas

**Solution :**
1. Vérifiez que les buckets Storage existent
2. Vérifiez les politiques RLS sur les buckets
3. Regardez les logs Supabase → Storage

### Problème : Build échoue

**Solution :**
1. Vérifiez que toutes les dépendances sont installées
2. Testez le build localement d'abord
3. Vérifiez les logs de build
4. Assurez-vous que les variables d'environnement sont définies

---

## 📈 Optimisations Post-Déploiement

### 1. Performance

- ✅ Le code splitting est déjà configuré dans `vite.config.js`
- ✅ Les assets sont automatiquement optimisés par Vite
- ✅ Gzip/Brotli activés automatiquement par Vercel/Netlify

### 2. SEO (Optionnel)

Ajoutez des meta tags dans `index.html` :
```html
<meta name="description" content="Gestionnaire de candidatures d'emploi">
<meta property="og:title" content="Job Tracker">
<meta property="og:description" content="Gérez vos candidatures efficacement">
```

### 3. PWA (Optionnel)

Convertissez en Progressive Web App avec Vite PWA :
```bash
npm install vite-plugin-pwa -D
```

---

## ✅ Checklist Finale

Avant de considérer le déploiement comme terminé :

- ✅ L'application est accessible publiquement
- ✅ L'authentification fonctionne
- ✅ Toutes les fonctionnalités sont opérationnelles
- ✅ Pas d'erreurs dans la console
- ✅ Responsive sur mobile/tablette/desktop
- ✅ URLs Supabase mises à jour
- ✅ OAuth configuré (si utilisé)
- ✅ Domaine personnalisé configuré (si souhaité)
- ✅ Analytics activées (optionnel)

---

## 🎉 Félicitations !

Votre application Job Tracker est maintenant en production ! 🚀

**Prochaines étapes :**
- Partagez le lien avec vos utilisateurs
- Surveillez les métriques et les logs
- Collectez les retours utilisateurs
- Itérez et améliorez

---

**Besoin d'aide ?**
- Documentation Vercel : https://vercel.com/docs
- Documentation Netlify : https://docs.netlify.com
- Documentation Supabase : https://supabase.com/docs
