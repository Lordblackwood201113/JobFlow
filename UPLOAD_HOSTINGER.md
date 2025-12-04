# Guide d'Upload sur Hostinger - JobFlow

## Problème identifié
Le dossier `dist` a été uploadé au lieu de son contenu. Les fichiers doivent être directement dans `public_html`.

## Solution rapide

### Option 1 : Créer un ZIP

1. **Sur votre ordinateur :**
   - Allez dans : `C:\Users\ADMIN\Desktop\Cursor_project\jobflow\dist`
   - Sélectionnez TOUT le contenu :
     - `.htaccess`
     - `index.html`
     - `vite.svg`
     - Dossier `assets/`
   - Clic droit → **Envoyer vers** → **Dossier compressé (ZIP)**
   - Nommez-le `jobflow.zip`

2. **Dans Hostinger File Manager :**
   - Allez dans `public_html`
   - Supprimez tout ce qui s'y trouve
   - Cliquez sur **Upload Files**
   - Uploadez `jobflow.zip`
   - Une fois uploadé, clic droit sur le fichier ZIP → **Extract** (Extraire)
   - Supprimez le fichier ZIP après extraction

3. **Vérifiez la structure :**
   ```
   public_html/
   ├── .htaccess
   ├── index.html
   ├── vite.svg
   └── assets/
       ├── charts-Bay9tgFC.js
       ├── date-Ct_oZqpv.js
       ├── forms-_jBPSxwi.js
       ├── icons-Dge5zyrf.js
       ├── index-D9Taoeec.css
       ├── index-DS8oV66O.js
       ├── react-vendor-Dk2srK30.js
       └── supabase-D9i_xg26.js
   ```

### Option 2 : Upload via FTP

Si vous préférez utiliser FTP (plus fiable) :

1. **Téléchargez FileZilla** : https://filezilla-project.org/download.php?type=client

2. **Récupérez vos identifiants FTP dans Hostinger :**
   - hPanel → **Files** → **FTP Accounts**
   - Notez :
     - Host (Hôte) : `ftp.votredomaine.com`
     - Username (Nom d'utilisateur)
     - Password (Mot de passe)
     - Port : 21

3. **Connectez-vous avec FileZilla :**
   - Ouvrez FileZilla
   - Fichier → **Gestionnaire de sites**
   - Nouveau site :
     - Hôte : `ftp.votredomaine.com`
     - Port : 21
     - Protocole : FTP
     - Chiffrement : Connexion FTP simple (non sécurisée)
     - Type d'authentification : Normal
     - Identifiant : votre username
     - Mot de passe : votre password
   - Cliquez sur **Connexion**

4. **Uploadez les fichiers :**
   - **Côté gauche** (local) : Naviguez vers `C:\Users\ADMIN\Desktop\Cursor_project\jobflow\dist`
   - **Côté droit** (serveur) : Naviguez vers `/public_html` et SUPPRIMEZ tout
   - **Sélectionnez TOUT** le contenu de dist (côté gauche)
   - **Glissez-déposez** vers public_html (côté droit)
   - Attendez la fin du transfert

5. **Vérifiez :**
   - Dans FileZilla, côté droit, vous devez voir dans `/public_html` :
     - `.htaccess`
     - `index.html`
     - `vite.svg`
     - `assets/` (dossier)

## Vérification finale

### 1. Structure des fichiers
Dans File Manager Hostinger, `public_html` doit contenir :
```
.htaccess          ← Important pour le routing
index.html         ← Page principale
vite.svg
assets/            ← Dossier avec tous les JS/CSS
```

### 2. Permissions
Vérifiez les permissions dans File Manager :
- Dossiers : **755** (rwxr-xr-x)
- Fichiers : **644** (rw-r--r--)

Pour modifier :
- Clic droit sur le fichier/dossier → **Permissions**
- Cochez les bonnes cases

### 3. Tester le site
1. Ouvrez votre domaine dans un navigateur
2. Videz le cache : `Ctrl + Shift + Delete` → Cochez "Images et fichiers en cache" → Effacer
3. Rechargez : `Ctrl + F5` (hard refresh)
4. Vous devriez voir la page de connexion

### 4. Vérifier la console (F12)
- Ouvrez la console (`F12`)
- Onglet **Console** : doit être vide (pas d'erreur rouge)
- Onglet **Network** : tous les fichiers en vert (status 200)

## Toujours le problème ?

Si après tout ça la page est toujours blanche :

1. **Vérifiez le fichier .htaccess :**
   - Dans File Manager, ouvrez `.htaccess`
   - Vérifiez qu'il contient bien les règles de redirection

2. **Testez avec l'index.html directement :**
   - Essayez d'accéder à : `https://votredomaine.com/index.html`
   - Si ça fonctionne, le problème vient du .htaccess

3. **Contactez le support Hostinger :**
   - Chat dans hPanel
   - Dites-leur : "Mon fichier .htaccess ne fonctionne pas, pouvez-vous activer mod_rewrite ?"

## Checklist finale

- [ ] Tous les fichiers sont directement dans `public_html` (pas dans un sous-dossier `dist`)
- [ ] Le fichier `.htaccess` est présent et visible dans File Manager
- [ ] Le dossier `assets/` contient 8 fichiers JavaScript
- [ ] Les permissions sont correctes (755 pour dossiers, 644 pour fichiers)
- [ ] Le cache du navigateur a été vidé
- [ ] La console du navigateur ne montre pas d'erreur "Failed to load"
- [ ] L'onglet Network montre tous les fichiers en status 200

Si tous les points sont cochés et que ça ne fonctionne toujours pas, prenez une capture d'écran de :
1. La structure des fichiers dans File Manager (public_html)
2. La console du navigateur (onglet Console)
3. La console du navigateur (onglet Network)

Et envoyez-les moi pour un diagnostic plus approfondi.
