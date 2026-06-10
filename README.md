# Tasky

Gestionnaire de tâches zen avec un compagnon évolutif — MVP solo.
Construit avec **Vite + React**.

## Lancer en local

```bash
npm install
npm run dev
```

Ouvre l'URL affichée (http://localhost:5173).

## Build de production

```bash
npm run build      # génère le dossier dist/
npm run preview    # prévisualise le build
```

## Déployer sur Vercel

### Option A — via le site (le plus simple)
1. Pousse ce dossier sur un dépôt GitHub.
2. Sur https://vercel.com → **Add New… → Project** → importe le dépôt.
3. Vercel détecte automatiquement Vite. Garde les réglages par défaut :
   - Framework Preset : **Vite**
   - Build Command : `npm run build`
   - Output Directory : `dist`
4. Clique **Deploy**. Tu obtiens une URL publique à partager.

### Option B — via la CLI
```bash
npm i -g vercel
vercel          # déploiement de prévisualisation
vercel --prod   # déploiement de production
```

## Notes
- L'état n'est **pas persisté** (pas de localStorage) : un rafraîchissement remet l'app à zéro. Normal pour ce MVP.
- Le composant `src/TaskyApp.jsx` contient toute l'app ; `TaskyAvatar` est un placeholder remplaçable.
