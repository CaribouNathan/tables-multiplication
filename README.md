# Tables de multiplication — PWA

Portage HTML de l'app SwiftUI `MultiplicationQuiz` (Caribou Labs), installable sur iOS et Android, fonctionnelle hors-ligne.

```
index.html              l'application complète (aucune dépendance externe)
manifest.webmanifest    nom, icônes, mode standalone, raccourcis
sw.js                   service worker, precache des 11 fichiers
icons/                  généré depuis AppIcon.appiconset
```

## Mise en ligne

Le service worker exige **HTTPS ou localhost** — en `file://` l'app fonctionne mais ne s'installe pas.

**GitHub Pages** — pousser le contenu de ce dossier à la racine d'un dépôt, puis Settings → Pages → branche `main`, dossier `/ (root)`. URL du type `https://<compte>.github.io/<depot>/`. Le `scope` et le `start_url` du manifest sont relatifs, ça marche donc aussi dans un sous-dossier.

**Netlify Drop** — glisser le dossier sur `app.netlify.com/drop`, URL HTTPS immédiate.

**Test local** — `python3 -m http.server 8000` puis `http://localhost:8000` (localhost est considéré comme sécurisé, le service worker s'installe).

## Installation sur iPhone

Safari (obligatoire, Chrome iOS ne sait pas installer) → Partager → **Sur l'écran d'accueil**. L'app se lance ensuite sans barre d'adresse, avec l'icône de l'appiconset, et fonctionne en mode avion.

## Mise à jour

`sw.js` sert le cache en priorité et rafraîchit `index.html` en arrière-plan : une modification est donc visible au **deuxième** lancement suivant. Pour forcer une prise en compte immédiate côté utilisateurs, incrémenter `VERSION` dans `sw.js` — l'ancien cache est purgé à l'activation.

## Icônes

Le `.appiconset` d'origine contient un bug : dans `AppIcon-Light-1024.png`, les traits du × sont blancs sur la carte blanche, donc invisibles. Les icônes ci-jointes repartent de cette variante avec les traits recolorés en `#1D9E75` (la teinte du point central, déjà correcte dans le fichier source). La variante Dark est reprise telle quelle pour `apple-touch-icon-dark.png`.

Les versions `maskable` posent l'illustration à 90 % sur un fond constitué de la même illustration agrandie, ce qui évite le liseré uni visible sous les masques circulaires d'Android.

Correctif à reporter dans Xcode si tu regénères : ouvrir `AppIcon-Light-1024.png` et passer les traits du × de `#FFFFFF` à `#1D9E75`.

## Limites connues

- **Synthèse vocale** : iOS exige une interaction utilisateur avant le premier `speak()`. C'est le cas ici (tout passe par un bouton), mais au tout premier lancement la liste des voix peut être vide — le code écoute `voiceschanged` et rattrape la voix `fr-FR` dès qu'elle arrive.
- **Aucune persistance** : réglages, meilleur combo et compteur de parfaits sont perdus à la fermeture, comme dans l'app SwiftUI d'origine (le modèle SwiftData `Item` n'y était pas utilisé).
- `color-mix()` sur les pastilles de minuterie demande Safari 16.4+.
