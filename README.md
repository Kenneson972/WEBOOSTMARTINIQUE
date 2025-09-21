# WebBoost Martinique v2 (Hybride: Frontend statique + Backend PHP)

Ce dépôt contient la refonte professionnelle du site WebBoost Martinique avec une architecture hybride optimisée:

- Frontend 100% statique (HTML/CSS/JS) — compatible GitHub Pages pour prévisualisation rapide
- Backend PHP (api/) — prévu pour hébergement 02switch (Apache + PHP 8+)
- Fallback intelligent: si l'API n'est pas disponible (ex: preview GitHub Pages), l'interface fonctionne en mode dégradé (chatbot affiche un message de contact WhatsApp, formulaires non bloquants)

## Structure

```
webboost-martinique-v2/
├── index.html                  # Landing page principale (GitHub Pages OK)
├── assets/
│   ├── css/
│   │   ├── main.css            # Design system + base
│   │   ├── components.css      # Composants UI
│   │   ├── chatbot.css         # UI Élise
│   │   └── responsive.css      # Breakpoints mobile-first
│   ├── js/
│   │   ├── main.js             # Interactions globales
│   │   ├── chatbot.js          # Élise IA (fichier fourni, inchangé)
│   │   ├── analytics.js        # GA4 + Hotjar (placeholders)
│   │   ├── animations.js       # Apparitions/scroll
│   │   ├── order-flow.js       # Tunnel de vente (Phase 2)
│   │   └── contact-forms.js    # Gestion formulaire (fallback)
│   └── images/
│       ├── .gitkeep
│       ├── logo/.gitkeep
│       ├── packs/.gitkeep
│       └── testimonials/.gitkeep
├── api/                        # Backend PHP (ignoré par GitHub Pages)
│   ├── .htaccess               # Config Apache (02switch)
│   ├── config.php              # Chargement .env, CORS, PDO
│   ├── chat.php                # Élise IA (OpenAI)
│   ├── contact.php             # Formulaire contact (email)
│   └── order.php               # Commandes (Phase 2)
├── pages/
│   ├── mentions-legales.html
│   ├── cgv.html
│   ├── politique-confidentialite.html
│   └── a-propos.html
├── robots.txt
├── sitemap.xml
├── .htaccess                   # Cache + headers (prod 02switch)
├── .env.example                # Variables d'environnement backend
└── .gitignore
```

## Déploiement

### 1) Preview GitHub Pages (frontend uniquement)
- Branche: main (ou gh-pages)
- Dans les paramètres du repo GitHub: Pages → Source: Deploy from branch → dossier racine
- L'API (dossier api/) est ignorée par GitHub Pages. Le chatbot passera en mode fallback si l'API est indisponible.

### 2) Production 02switch (API PHP)
- Uploadez le dossier `api/` et les fichiers racine (index.html, .htaccess, robots.txt, sitemap.xml) sur votre hébergement 02switch sous public_html
- Copiez `.env.example` en `.env` à la racine du site (ou dans `/api`) et remplissez les variables
- Vérifiez que PHP 8+ est activé

Exemple .env:

```
# OpenAI
OPENAI_API_KEY=sk-....

# Base MySQL
DB_HOST=localhost
DB_NAME=weboostbot
DB_USER=weboost_user
DB_PASS=votre_mot_de_passe

# CORS
ALLOWED_ORIGINS=https://weboostmartinique.com,https://www.weboostmartinique.com

# Email destination contact
EMAIL_TO=contact@weboostmartinique.com
```

## Chatbot Élise (OpenAI)
- Fichier frontend: `assets/js/chatbot.js` (fourni par vous, inchangé)
- Endpoint backend: `api/chat.php`
- Clé OpenAI: à renseigner dans `.env` (variable OPENAI_API_KEY) sur 02switch
- Sécurité CORS gérée par `api/config.php` (allowlist via ALLOWED_ORIGINS)

Note: En preview GitHub Pages, l'appel cross-origin vers `weboostmartinique.com/api/chat.php` est bloqué par CORS → le chatbot affiche un message de fallback WhatsApp (comportement attendu).

## Analytics & Tracking
- Ouvrez `assets/js/analytics.js` et renseignez vos IDs:
  - GA4 Measurement ID: G-XXXXXXX
  - Hotjar Site ID: 1234567
- Le script n'initialise rien tant que les IDs ne sont pas renseignés.

## Performance & SEO
- Base mobile-first, palette couleurs, typographies Inter/Roboto Slab
- .htaccess (Apache) configure cache pour assets
- robots.txt et sitemap.xml inclus

## Sécurité
- Headers sécurisés côté Apache (.htaccess) et côté PHP (config.php)
- Validation basique des entrées API

## Roadmap des phases
- Phase 1 (ce dépôt): fondations + landing responsive + bulle chatbot sur toutes pages + fallback
- Phase 2: tunnel de vente (order-flow), formulaires avancés, paiements si besoin
- Phase 3: optimisations Lighthouse/SEO/Accessibilité + contenus finaux

---

Support: Ouvrez une issue ou contactez l'éditeur du site.