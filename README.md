# Frontend SteganographIA

Interface web React/Vite pour:

- signer une image (`/sign`),
- verifier une image (`/verify`),
- detecter une image potentiellement generee par IA (`/detect`),
- consulter un dashboard d'analyses (`/dashboard`),
- gerer l'authentification et l'administration (`/login`, `/register`, `/admin`).

## Stack technique

- React 18 + TypeScript
- Vite 5
- React Router 6
- Tailwind CSS

## Prerequis

- Node.js 18+ (recommande)
- npm 9+
- Backend lance sur `http://localhost:8000` (ou autre URL configuree)

## Installation

```bash
npm install
```

## Configuration

1. Copier le fichier d'exemple:

```bash
cp .env.example .env
```

1. Verifier la variable:

```env
VITE_API_URL=http://localhost:8000
```

Cette URL est utilisee par `scr/lib/api.ts` pour tous les appels API.

## Lancer le projet

```bash
npm run dev
```

Application disponible par defaut sur `http://localhost:5173`.

## Scripts disponibles

- `npm run dev` : demarre le serveur de developpement
- `npm run build` : build de production
- `npm run build:dev` : build en mode development
- `npm run preview` : previsualise le build
- `npm run lint` : verifie le code avec ESLint

## Structure du projet

```text
front/
  scr/
    components/   # UI + pages (SignImage, VerifyImage, DetectAI, Dashboard, AdminPanel...)
    hooks/        # gestion auth et analyses
    lib/          # client API et utilitaires reseau
    App.tsx       # routes et pages protegees
    main.tsx      # point d'entree React
```

## Authentification et securite

- Le token JWT est stocke en local (`stegano_access_token`).
- Les routes metiers sont protegees via `ProtectedRoute`.
- La route `/admin` exige un role administrateur.

## Depannage rapide

- Erreurs CORS: verifier `CORS_ORIGINS` cote backend.
- Erreurs 401/403: se reconnecter et verifier le role utilisateur.
- Impossible de joindre l'API: controler `VITE_API_URL` dans `.env`.
