# Portfolio – Motion Web Dev

## 1. Présentation du projet

Ce projet est un site web personnel de type **CV / Portfolio** réalisé en HTML, CSS et JavaScript.

Objectifs principaux :
- Présenter mon profil de développeur web.
- Mettre en avant mes compétences et mes projets.
- Montrer que je sais utiliser des animations avancées (canvas, micro-interactions, JS, etc.).

Le site a été construit en utilisant uniquement des prompts envoyés à une IA, conformément aux consignes du projet.

## 2. Stack technique

- **HTML5** : structure sémantique de la page (header, main, sections, footer).
- **CSS3** : mise en page (Flexbox, Grid), responsive, animations et micro-interactions.
- **JavaScript** :
  - gestion des canvases (fond animé + écran de chargement),
  - interactions (filtrage, carrousel, modale),
  - validation du formulaire,
  - stockage local avec `localStorage`.

## 3. Fonctionnalités implémentées

- Écran de chargement avec :
  - canvas d’intro animé (orbites lumineuses),
  - barre de progression,
  - bouton "Entrer maintenant".
- Canvas de fond avec :
  - effet “champ de force 3D”,
  - étoiles scintillantes avec effet de parallaxe.
- Curseur personnalisé avec effet de survol.
- Mode sombre / clair avec mémorisation du thème.
- Panneau de paramètres :
  - changement de palette d’accent,
  - option “réduire les animations”.
- Section Hero avec :
  - texte principal,
  - stats (projets, années, focus),
  - effet “machine à écrire”.
- Compteur de visites via `localStorage`.
- Animations d’apparition au scroll (reveal).
- Section Compétences avec barres animées.
- Section Story (parcours) en plusieurs étapes.
- Section Projets :
  - filtrage par catégorie (web, JS, design),
  - carrousel de projets,
  - modale de détail de projet.
- Formulaire de contact :
  - validation en temps réel (nom, email, message),
  - simulation d’envoi (sans back-end).
- Bouton “retour en haut” et scroll spy sur la navigation.

## 4. Structure du projet

```text
.
├─ index.html           # Structure HTML du site
├─ style.css            # Styles, layout, animations, responsive
├─ script.js            # Logique et interactions en JavaScript
├─ README.md            # Présentation du projet
├─ progression-prompts.md   # Documentation des prompts et de la progression
└─ assets/
   └─ images/           # Captures d’écran du site
