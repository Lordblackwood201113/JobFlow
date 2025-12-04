# Guide de Déploiement sur Hostinger

Ce guide vous explique comment déployer votre application JobFlow sur Hostinger.

## Prérequis

- Un compte Hostinger avec un plan d'hébergement web (Business ou Premium recommandé)
- Accès au panneau de contrôle Hostinger (hPanel)
- Un nom de domaine configuré (optionnel)

## Étape 1 : Préparer l'application

### 1.1 Configurer les variables d'environnement

Créez un fichier `.env.production` à la racine du projet :

```env
VITE_SUPABASE_URL=https://fexwxyhxsjmnvfketvks.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZleHd4eWh4c2ptbnZma2V0dmtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMjY2ODEsImV4cCI6MjA3OTcwMjY4MX0.KhIPorJHwYcxQ7NDPUIld_-YUs0l8agLGcyXmKCShis
VITE_APP_NAME=JobFlow
VITE_MAX_FILE_SIZE=5242880
```

### 1.2 Builder l'application

Dans le terminal, exécutez :

```bash
cd jobflow
npm run build
```

Cette commande génère un dossier `dist` contenant tous les fichiers statiques optimisés.

**Vérification :** Le dossier `dist` doit contenir :
- `index.html`
- `assets/` (fichiers CSS et JS)
- `.htaccess` (pour les redirections)

## Étape 2 : Configurer Supabase

### 2.1 Ajouter l'URL de production

1. Connectez-vous à [Supabase](https://supabase.com)
2. Sélectionnez votre projet
3. Allez dans **Authentication** → **URL Configuration**
4. Ajoutez votre URL Hostinger dans **Site URL** :
   - Exemple : `https://votre-domaine.com`
5. Ajoutez également dans **Redirect URLs** :
   - `https://votre-domaine.com/*`
   - `https://www.votre-domaine.com/*`

### 2.2 Vérifier les politiques RLS

Assurez-vous que toutes les migrations ont été exécutées dans Supabase SQL Editor :
- `001_create_profiles_table.sql`
- `002_create_job_applications_table.sql`
- `003_add_rls_policies.sql`
- `004_create_storage_bucket.sql`
- `005_add_job_fields.sql`
- `006_create_statistics_views.sql`
- `007_create_avatars_bucket.sql`

## Étape 3 : Déployer sur Hostinger

### Méthode 1 : Upload via File Manager (Recommandé pour débutants)

1. **Connectez-vous à hPanel**
   - Allez sur [hpanel.hostinger.com](https://hpanel.hostinger.com)
   - Connectez-vous avec vos identifiants

2. **Accédez au File Manager**
   - Dans hPanel, cliquez sur **File Manager**
   - Naviguez vers le dossier `public_html`

3. **Supprimez les fichiers par défaut**
   - Sélectionnez tous les fichiers dans `public_html`
   - Cliquez sur **Delete**

4. **Uploadez votre application**
   - Cliquez sur **Upload Files**
   - Sélectionnez **tous** les fichiers du dossier `dist` (pas le dossier lui-même)
   - Attendez la fin de l'upload
   - Vérifiez que le fichier `.htaccess` est bien présent

5. **Vérifiez la structure**
   ```
   public_html/
   ├── .htaccess
   ├── index.html
   └── assets/
       ├── index-[hash].css
       ├── index-[hash].js
       ├── react-vendor-[hash].js
       ├── supabase-[hash].js
       └── ... autres fichiers
   ```

### Méthode 2 : Upload via FTP/SFTP (Pour utilisateurs avancés)

1. **Récupérez vos identifiants FTP**
   - Dans hPanel, allez dans **Files** → **FTP Accounts**
   - Notez : hostname, username, password, port

2. **Connectez-vous avec un client FTP**
   - Utilisez FileZilla, WinSCP ou Cyberduck
   - Host : `ftp.votre-domaine.com`
   - Username : votre username FTP
   - Password : votre mot de passe FTP
   - Port : 21 (FTP) ou 22 (SFTP)

3. **Uploadez les fichiers**
   - Naviguez vers `public_html`
   - Supprimez les fichiers existants
   - Uploadez tout le contenu du dossier `dist`

## Étape 4 : Vérifier le déploiement

### 4.1 Tester l'application

1. Ouvrez votre navigateur
2. Accédez à votre domaine (ex: `https://votre-domaine.com`)
3. Testez les fonctionnalités :
   - ✓ Inscription / Connexion
   - ✓ Création d'une candidature
   - ✓ Upload de documents
   - ✓ Navigation entre les pages
   - ✓ Modification d'une candidature

### 4.2 Vérifier les redirections

Testez que le routing React fonctionne :
- Accédez à `https://votre-domaine.com/dashboard`
- Rechargez la page (F5)
- La page doit se charger correctement (pas d'erreur 404)

### 4.3 Vérifier HTTPS

- Vérifiez que votre site est accessible en HTTPS
- Si ce n'est pas le cas, activez le SSL dans hPanel :
  1. Allez dans **Security** → **SSL**
  2. Activez **Free SSL** (Let's Encrypt)
  3. Attendez quelques minutes

## Étape 5 : Configuration du domaine (Optionnel)

### Si vous utilisez un domaine personnalisé

1. **Dans hPanel**
   - Allez dans **Domains**
   - Cliquez sur **Add Domain**
   - Ajoutez votre domaine
   - Configurez les DNS si nécessaire

2. **Pointer vers public_html**
   - Assurez-vous que le domaine pointe vers `/public_html`
   - Dans **File Manager**, vous pouvez créer un sous-dossier si besoin

## Étape 6 : Optimisations et bonnes pratiques

### 6.1 Activer la compression

Le fichier `.htaccess` inclut déjà :
- ✓ Compression GZIP
- ✓ Cache des assets (images, CSS, JS)
- ✓ Headers de sécurité
- ✓ Redirection HTTP → HTTPS

### 6.2 Configurer les backups

1. Dans hPanel, allez dans **Files** → **Backups**
2. Activez les backups automatiques
3. Créez un backup manuel après le déploiement

### 6.3 Monitorer les performances

- Utilisez **Google PageSpeed Insights** : https://pagespeed.web.dev
- Vérifiez les temps de chargement
- Optimisez si nécessaire

## Mise à jour de l'application

Pour mettre à jour votre application après des modifications :

1. **Rebuild localement**
   ```bash
   npm run build
   ```

2. **Uploadez les nouveaux fichiers**
   - Supprimez l'ancien contenu de `public_html`
   - Uploadez le nouveau contenu de `dist`

3. **Videz le cache du navigateur**
   - Testez avec CTRL+F5 (hard refresh)

## Résolution de problèmes

### Erreur 404 lors du rafraîchissement

**Problème :** Les routes React retournent 404 au refresh

**Solution :**
1. Vérifiez que `.htaccess` est présent dans `public_html`
2. Vérifiez que `mod_rewrite` est activé (contactez le support Hostinger si nécessaire)
3. Vérifiez les permissions du fichier `.htaccess` (644)

### Erreur de connexion Supabase

**Problème :** L'application ne se connecte pas à Supabase

**Solution :**
1. Vérifiez que les variables d'environnement sont correctes
2. Rebuilder avec le bon fichier `.env.production`
3. Vérifiez que l'URL est ajoutée dans Supabase Auth settings

### Images/Assets ne se chargent pas

**Problème :** Les images ou fichiers CSS/JS ne se chargent pas

**Solution :**
1. Vérifiez que le dossier `assets` est bien uploadé
2. Vérifiez les permissions (755 pour dossiers, 644 pour fichiers)
3. Videz le cache du navigateur

### Upload de fichiers ne fonctionne pas

**Problème :** Impossible d'uploader des documents

**Solution :**
1. Vérifiez les buckets Supabase Storage
2. Vérifiez les politiques RLS sur les buckets
3. Vérifiez la taille maximale des fichiers (définie dans `.env`)

## Support

Si vous rencontrez des problèmes :

1. **Documentation Hostinger** : https://support.hostinger.com
2. **Support Hostinger** : Via le chat dans hPanel
3. **Documentation Supabase** : https://supabase.com/docs
4. **Logs** : Consultez les logs dans hPanel → **Advanced** → **Error Logs**

## Checklist de déploiement

- [ ] Build de l'application généré (`npm run build`)
- [ ] Variables d'environnement configurées
- [ ] Fichier `.htaccess` présent dans le build
- [ ] Contenu de `dist` uploadé dans `public_html`
- [ ] SSL activé (HTTPS)
- [ ] URL ajoutée dans Supabase Auth
- [ ] Migrations Supabase exécutées
- [ ] Test de connexion/inscription
- [ ] Test de création de candidature
- [ ] Test de navigation et refresh
- [ ] Test d'upload de documents
- [ ] Backup créé

---

**Félicitations !** 🎉 Votre application JobFlow est maintenant déployée sur Hostinger !
