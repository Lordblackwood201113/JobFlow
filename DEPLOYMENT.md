# 🚀 Guide de Déploiement - JobFlow sur Coolify

Ce guide vous explique comment déployer votre application JobFlow sur Coolify avec Docker.

## 📋 Prérequis

- Un compte GitHub avec votre projet poussé
- Un serveur Coolify configuré
- Les variables d'environnement Supabase

## 🔧 Configuration des Variables d'Environnement

Avant de déployer, configurez ces variables dans Coolify :

```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_clé_publique_supabase
```

⚠️ **Important :** Ces variables doivent être préfixées par `VITE_` pour être accessibles dans l'application Vite.

## 🐳 Déploiement sur Coolify

### Étape 1 : Créer une nouvelle application

1. Connectez-vous à votre instance Coolify
2. Cliquez sur **"New Resource"** → **"Application"**
3. Choisissez **"Public Repository"** ou connectez votre GitHub

### Étape 2 : Configurer le dépôt

- **Repository URL :** `https://github.com/VOTRE_USERNAME/jobflow`
- **Branch :** `main`
- **Build Pack :** Sélectionnez **"Dockerfile"**

### Étape 3 : Configuration Build

Coolify détectera automatiquement le `Dockerfile` à la racine du projet.

**Paramètres recommandés :**
- **Port :** `80` (le port exposé par nginx)
- **Health Check Path :** `/` (optionnel)

### Étape 4 : Variables d'environnement

Dans l'onglet **"Environment Variables"** de Coolify, ajoutez :

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Étape 5 : Déployer

1. Cliquez sur **"Deploy"**
2. Suivez les logs en temps réel
3. Une fois terminé, votre application sera accessible via l'URL fournie par Coolify

## 🔄 Redéploiements automatiques

Pour activer les déploiements automatiques à chaque push :

1. Dans Coolify, allez dans **Settings** → **"Webhooks"**
2. Copiez l'URL du webhook
3. Dans GitHub, allez dans **Settings** → **Webhooks** → **"Add webhook"**
4. Collez l'URL et sélectionnez les événements **"Push"**

## 🧪 Tester localement avec Docker

Avant de déployer, vous pouvez tester localement :

```bash
# Build l'image Docker
docker build -t jobflow .

# Lancer le conteneur
docker run -p 8080:80 jobflow

# Accéder à l'application
# http://localhost:8080
```

## 📦 Architecture du Déploiement

```
┌─────────────────────────────────────┐
│   GitHub Repository                 │
│   └── Dockerfile                    │
│   └── nginx.conf                    │
│   └── src/                          │
└──────────────┬──────────────────────┘
               │
               │ git pull
               ▼
┌─────────────────────────────────────┐
│   Coolify (Build)                   │
│   1. npm install                    │
│   2. npm run build                  │
│   3. Copy to nginx                  │
└──────────────┬──────────────────────┘
               │
               │ deploy
               ▼
┌─────────────────────────────────────┐
│   Container Nginx                   │
│   Port: 80                          │
│   Serve: /dist                      │
└─────────────────────────────────────┘
```

## 🔍 Vérifications après déploiement

- [ ] L'application se charge correctement
- [ ] La connexion Supabase fonctionne
- [ ] Les routes fonctionnent (grâce au routing SPA dans nginx.conf)
- [ ] Les assets statiques se chargent
- [ ] L'authentification fonctionne

## 🐛 Debugging

### Les variables d'environnement ne sont pas détectées

Vérifiez que :
1. Elles sont préfixées par `VITE_`
2. Elles sont bien configurées dans Coolify
3. Vous avez redéployé après les avoir ajoutées

### Erreur 404 sur les routes

Le fichier `nginx.conf` gère le routing SPA. Vérifiez qu'il est bien copié dans le conteneur.

### L'application ne se connecte pas à Supabase

Vérifiez dans les logs du navigateur (F12) que les variables `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` sont bien définies.

## 📞 Support

Pour toute question sur Coolify : https://coolify.io/docs

---

**Version :** 1.0  
**Dernière mise à jour :** Décembre 2024
