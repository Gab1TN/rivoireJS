# Frontend - Réservation restaurants

Frontend pédagogique en Vue 3 + Vite + Vue Router + Pinia.

## Lancer le projet

```bash
npm install
npm run dev
```

## Routes

- `/`
- `/restaurant/:id`
- `/reservation`
- `/reservation/token/:token`

## Architecture

- `components/` : composants de présentation (props + events)
- `stores/` : état, appels API, gestion erreurs
- `views/` : assemblage des composants + stores
