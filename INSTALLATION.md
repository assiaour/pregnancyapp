# Guide d'Installation - Pregnancy App

## Étape 1 : Installer Node.js

Node.js n'est pas installé sur votre système. Voici comment l'installer :

### Option A : Installation via le site officiel (Recommandé)

1. Allez sur [https://nodejs.org/](https://nodejs.org/)
2. Téléchargez la version **LTS** (Long Term Support) - recommandée
3. Exécutez le fichier d'installation téléchargé
4. Suivez les instructions d'installation (acceptez les options par défaut)
5. **Redémarrez votre terminal/PowerShell** après l'installation

### Option B : Installation via Chocolatey (si vous avez Chocolatey)

```powershell
choco install nodejs-lts
```

### Option C : Installation via winget (Windows Package Manager)

```powershell
winget install OpenJS.NodeJS.LTS
```

## Étape 2 : Vérifier l'installation

Après avoir redémarré votre terminal, vérifiez que Node.js est installé :

```powershell
node --version
npm --version
```

Vous devriez voir des numéros de version (par exemple : v18.17.0 et 9.6.7)

## Étape 3 : Installer les dépendances du projet

Une fois Node.js installé, exécutez :

```powershell
npm install
```

## Étape 4 : Démarrer l'application

```powershell
npm start
```

## Alternative : Utiliser Expo CLI globalement

Si vous préférez, vous pouvez installer Expo CLI globalement :

```powershell
npm install -g expo-cli
```

Puis utilisez :

```powershell
expo start
```

## Problèmes courants

### Le terminal ne reconnaît toujours pas npm après l'installation

1. Fermez complètement votre terminal/PowerShell
2. Rouvrez-le en tant qu'administrateur
3. Vérifiez que Node.js est dans le PATH :
   ```powershell
   $env:PATH
   ```
   Vous devriez voir un chemin contenant "Node.js"

### Si le problème persiste

1. Vérifiez que Node.js est installé dans : `C:\Program Files\nodejs\`
2. Ajoutez manuellement au PATH si nécessaire :
   - Ouvrez "Variables d'environnement" dans Windows
   - Ajoutez `C:\Program Files\nodejs\` au PATH système
