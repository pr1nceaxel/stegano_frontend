# SteganographIA — Algorithmes et limites

Ce document décrit les chaînes implémentées dans `backend/app/` + `front/`.

## 1) Signature cryptographique du payload (image ↔ personne)

### Objectif pédagogique

Le profil attendu est une preuve vérifiable **sans secret global partagé avec le vérificateur** : on utilise **ECDSA sur courbe P-256** avec **SHA-256**.

- Chaque utilisateur possède une paire de clés générée au premier besoin (signature d’image).
- La **clé publique** est stockée en base et exposée via `GET /api/public/users/{id}/signing-key`.
- La **clé privée** est chiffrée au repos (Fernet + HKDF dérivé de `STEGO_SECRET_KEY` + `userId`).  
  *Limitation documentée* : le serveur peut toujours resigner si `STEGO_SECRET_KEY` et la base sont compromises — pour une non-répudiation maximale, il faudrait signer côté navigateur (WebCrypto) sans jamais envoyer la clé privée.

### Format du jeton embarqué

1. JSON canonique trié (`author`, `message`, `issuedAt`, `nonce`, `version`, `userId`).
2. Signature ECDSA du texte UTF-8 exact (pas du base64).
3. Chaîne transportée : `base64url(payload_json_sans_padding).base64url(signature_DER_sans_padding)`.

Ce jeton est ensuite compressé (`zlib`), encapsulé (`STEG` + longueur 16 bits + CRC32), converti en bits et étalé dans l’image.

## 2) Canaux stéganographiques

### A) DCT-DM (robuste JPEG)

- YCrCb → canal **Y** en flottants, blocs **8×8**, DCT OpenCV.
- Modulation par différence des coefficients (3,4) vs (4,3) avec seuil `delta` (`EMBED_STRENGTH`, défaut **18**).
- Ordre des blocs permuté de façon déterministe selon `SHA256(STEGO_SECRET_KEY)` (non lié à l’identité cryptographique du signataire ; uniquement pour l’étalement spatial).

**Calibration qualité** : exécuter `backend/scripts/measure_embedding_quality.py` pour un tableau **PSNR / SSIM** (luminance) vs `delta` (export CSV).

### B) LSB-Y (référence comparative)

- Même payload binaire que la DCT, mais bits écrits dans le **LSB du canal Y** après permutation pseudo-aléatoire des pixels.
- **Très fragile** face au JPEG et au redimensionnement — utile pour illustrer le compromis *capacité vs robustesse* dans le rapport.

### Répétition / vote majoritaire

`EMBED_REPEAT_FACTOR` (défaut **3**) duplique chaque bit ; à l’extraction un vote majoritaire par groupe réduit le taux d’erreur.

## 3) Capacité et erreurs

- **Capacité approximative** : `GET /api/stego/capacity?height=&width=&algorithm=dct|lsb&repeat=`.
- **Image trop petite** : `ValueError` explicite à l’embed DCT (pas de bloc 8×8) ; LSB exige un minimum de pixels.
- **Payload trop grand** : message d’erreur HTTP 400 incluant une borne d’octets approximative.

## 4) Formats fichiers (entrée / sortie)

Détection par *magic bytes* (`backend/app/format_detect.py`) : JPEG, PNG, WebP, BMP.  
La réponse de vérification inclut `inputFormat` et `formatWarnings` (ex. LSB + JPEG d’entrée).

Sortie de `/api/sign` : `output_format=png` (sans perte, défaut) ou `jpeg` (Q=95) pour scénarios réalistes.

## 5) Benchmarks de résistance

Le script `backend/scripts/robustness_report.py` produit un **CSV** (JPEG multi-qualités, resize %, crop) pour les courbes du rapport.

Les tests automatiques : `backend/tests/test_robustness.py`.

## 6) Détection IA

- **`/api/detect-ai`** — pipeline OpenCV : Laplacien, énergie haute-fréquence, blockiness 8×8, corrélation inter-canaux.
- Champ **`modelVersion`** (ex. `heuristic-cv-v1`). Si `AI_DETECTION_BACKEND` vaut `hybrid`, `cnn` ou `cnn_stub`, un champ `deepClassifierStatus` documente que l’extension CNN/ONNX reste à brancher avec un checkpoint du projet.

## 7) Authentification plateforme (distincte)

Les jetons Bearer pour l’API (`app/auth.py`) restent une couche session (HMAC + `STEGO_SECRET_KEY`) — séparée de la signature **embarquée** ECDSA décrite en §1.
