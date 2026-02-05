# Style & Deco - Site statique

Site vitrine multi-pages pour un peintre en bâtiment (HTML / CSS / JS, sans framework).

## Modifier les coordonnées
- **Téléphone** : remplacer `06 50 75 62 42` et `tel:+33650756242` dans les pages HTML.
- **Email** : remplacer `style.deco66@gmail.com` et `mailto:style.deco66@gmail.com`.
- **Zone** : ajuster le texte dans `index.html`, section "Zone d'intervention".

## Remplacer la bannière hero
- **Images à fournir :**
  - `/assets/images/hero-interieur.webp`
  - `/assets/images/hero-interieur.jpg`
- Le hero est **préchargé** dans `index.html`.
- Si les images sont absentes, un **fond premium de secours** est affiché automatiquement.

## Ajouter des photos dans les réalisations
1. Ajouter les fichiers dans `/assets/images/`.
2. Remplacer les blocs `.gallery-card` dans `/realisations/index.html` par des cartes avec `<img>` + légende.
3. Utiliser `loading="lazy"` et renseigner `width` / `height`.

## Formulaire (Netlify Forms)
Le formulaire de `/contact/` est prêt pour **Netlify Forms**.
- Le champ honeypot est `company` (caché).
- Redirection vers `/merci/` après envoi.

## Déploiement

### Netlify
1. Déposer le dossier du site.
2. Activer Netlify Forms automatiquement.
3. Définir le domaine si nécessaire.

### GitHub Pages
1. Pousser le projet sur un dépôt GitHub.
2. Activer GitHub Pages sur la branche principale.
3. Vérifier les liens canoniques si le domaine change.

## Fichiers clés
- `index.html`
- `services/index.html`
- `realisations/index.html`
- `contact/index.html`
- `mentions-legales/index.html`
- `politique-confidentialite/index.html`
- `merci/index.html`
- `assets/css/styles.css`
- `assets/js/main.js`
- `robots.txt`
- `sitemap.xml`








