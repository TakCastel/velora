# Subscrivo

Gestionnaire d’abonnements multilingue, maintenant outillé comme un vrai produit open-source.

## Démarrage

Prérequis : Node.js >= 18

- Installer les dépendances : `npm install`
- Lancer le dev server : `npm run dev`
- Lancer les tests : `npm test`
- Lancer Storybook : `npm run storybook`

## Tests & Qualité

- Tests unitaires/intégration : `npm test` (vitest + RTL)
- CI : un workflow GitHub Actions échoue si les tests ne passent pas.

## Storybook

Un design system minimal (Button, IconButton, Card, Modal, Input, Select, Badge) est documenté dans Storybook : `npm run storybook`. Construire : `npm run storybook:build`.

## Versionning

- La version suit `package.json`. Chaque modification (incluant celles faites par une IA) doit incrémenter la version (patch/minor/major selon l’impact).
- Convention suggérée : correctifs = patch, features = minor, breaking = major.
- Mettez à jour ce fichier et le changelog associé avant merge.

## Licence & usage

Projet sous licence **CC BY-NC 4.0** : utilisation non commerciale uniquement, attribution requise. Voir `LICENSE`.

## Support

Si le projet vous aide : [Buy me a coffee](https://buymeacoffee.com/ttlh)

## Déploiement / Production

- Build production : `npm run build`
- L’artefact `dist` peut être servi statiquement (Vite).

## PWA & offline léger

- Manifest + service worker (`public/manifest.webmanifest`, `public/sw.js`).
- Installation mobile possible (standalone) et consultation offline (cache des assets + fallback sur `index.html` pour le calendrier/statistiques).
- En dev/preview, ouvrir l’app puis “Ajouter à l’écran d’accueil” sur mobile compatible.

## Variables d’environnement

L’application n’exige plus de clé AI. Aucune configuration externe requise par défaut.
