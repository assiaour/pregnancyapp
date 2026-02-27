# Pregnancy App

A React Native application built with Expo for tracking pregnancy journey.

## Features

- Home screen with welcome message
- Gmail authentication option
- Account creation
- Login navigation

## Instructions d'Installation

### Prérequis

**Node.js doit être installé sur votre système.**

Si vous obtenez l'erreur "npm n'est pas reconnu", consultez le fichier `INSTALLATION.md` pour les instructions détaillées d'installation de Node.js.

### Étapes

1. Installer les dépendances:
```bash
npm install
```

2. Démarrer le serveur de développement:
```bash
npm start
```

3. Run on your device:
   - Press `a` for Android
   - Press `i` for iOS
   - Scan the QR code with Expo Go app on your phone

## Project Structure

```
pregnancy-app/
├── screens/
│   ├── HomeScreen.js    # Main home screen
│   └── LoginScreen.js   # Login screen
├── App.js               # Main app component with navigation
├── package.json         # Dependencies
└── README.md           # This file
```

## Customization

- Replace the placeholder image URL in `HomeScreen.js` with your own image
- Customize the welcome message in `HomeScreen.js`
- Add authentication logic in the button handlers
- Style the components to match your brand

## Dependencies

- React Native
- Expo
- React Navigation
- React Native Screens
- React Native Safe Area Context
