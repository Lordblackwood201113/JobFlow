# 🏗️ Guide de Build et Test - Job Tracker

Ce guide vous aide à builder et tester votre application avant le déploiement.

## 📦 Build local (sans Docker)

### 1. Build de production

```bash
# Installer les dépendances
npm install

# Build pour la production
npm run build
```

Le résultat du build sera dans le dossier `dist/`.

### 2. Prévisualiser le build

```bash
npm run preview
```

Accédez à `http://localhost:4173` pour tester.

---

## 🐳 Build et Test avec Docker

### Option 1 : Build simple

```bash
# Build l'image Docker
docker build -t job-tracker:latest .

# Lancer le conteneur
docker run -p 8080:80 job-tracker:latest

# Tester dans le navigateur
# http://localhost:8080
```

### Option 2 : Avec docker-compose (recommandé)

#### Étape 1 : Créer le fichier .env.production

```bash
cp .env.production.example .env.production
```

Puis éditez `.env.production` avec vos vraies valeurs Supabase.

#### Étape 2 : Lancer avec docker-compose

```bash
# Build et lancer
docker-compose up --build

# Ou en arrière-plan
docker-compose up -d --build

# Voir les logs
docker-compose logs -f

# Arrêter
docker-compose down
```

#### Étape 3 : Tester

Ouvrez votre navigateur : `http://localhost:8080`

---

## ✅ Checklist de vérification

Avant de déployer sur Coolify, vérifiez :

- [ ] **Build réussit** : `npm run build` fonctionne sans erreur
- [ ] **Variables d'environnement** : VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont définies
- [ ] **Docker build** : L'image Docker se build correctement
- [ ] **Application démarre** : Le conteneur démarre sur le port 80
- [ ] **Page d'accueil** : La page se charge sans erreur
- [ ] **Connexion Supabase** : L'authentification fonctionne
- [ ] **Routes SPA** : La navigation entre pages fonctionne
- [ ] **Console du navigateur** : Pas d'erreur JavaScript (F12)

---

## 🔍 Vérifications dans le navigateur

Une fois l'application lancée :

### 1. Ouvrir la console (F12)

Vérifiez qu'il n'y a pas d'erreurs en rouge.

### 2. Vérifier les variables d'environnement

Dans la console du navigateur, tapez :

```javascript
console.log(import.meta.env.VITE_SUPABASE_URL)
console.log(import.meta.env.VITE_SUPABASE_ANON_KEY)
```

Les valeurs doivent s'afficher correctement.

### 3. Tester les fonctionnalités

- [ ] Page de connexion s'affiche
- [ ] Inscription fonctionne
- [ ] Connexion fonctionne
- [ ] Dashboard se charge
- [ ] Création d'une candidature fonctionne
- [ ] Upload de fichiers fonctionne

---

## 🐛 Résolution des problèmes courants

### Erreur : "npm run build" échoue

**Solution :**
```bash
# Nettoyer node_modules
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Erreur : Docker build échoue

**Vérifiez :**
- Que Docker est bien lancé
- Que vous avez assez d'espace disque
- Que votre connexion internet fonctionne (pour télécharger les dépendances)

**Rebuild complet :**
```bash
docker build --no-cache -t job-tracker:latest .
```

### L'application ne se connecte pas à Supabase

**Solutions :**
1. Vérifiez que les variables d'environnement sont bien définies
2. Vérifiez que vous utilisez la bonne URL Supabase
3. Vérifiez que la clé ANON est correcte (pas la clé SERVICE)
4. Dans Supabase, vérifiez que votre domaine est autorisé dans "Authentication" → "URL Configuration"

### Erreur 404 sur les routes

Le fichier `nginx.conf` doit être correctement copié dans le conteneur. Vérifiez qu'il existe bien à la racine du projet.

---

## 📊 Statistiques du build

Après un build réussi, vous devriez voir :

```
✓ built in XXms
✓ XX chunks transformed
dist/index.html                    X.XX kB
dist/assets/index-XXXXXX.css      XX.XX kB
dist/assets/react-vendor-XXXXX.js XXX.XX kB
dist/assets/index-XXXXXX.js       XXX.XX kB
```

**Taille totale recommandée :** < 2 MB pour de bonnes performances

---

## 🚀 Prêt pour le déploiement ?

Si tous les tests passent, vous êtes prêt à déployer sur Coolify !

Consultez le fichier `DEPLOYMENT.md` pour les étapes de déploiement.

---

**Besoin d'aide ?** Vérifiez les logs :
- Build local : Sortie de `npm run build`
- Docker : `docker logs <container-id>`
- Coolify : Logs dans le dashboard Coolify

