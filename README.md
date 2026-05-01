# Zai 🥭 — Know What You Eat

> Scan food and cosmetic products. Get an instant health score. Make smarter choices.

[![Live App](https://img.shields.io/badge/Live%20App-esteves7771.github.io/Zai-2D5016?style=flat-square)](https://esteves7771.github.io/Zai/)
[![Privacy Policy](https://img.shields.io/badge/Privacy-Policy-2D5016?style=flat-square)](https://esteves7771.github.io/Zai/privacy.html)

---

## What is Zai?

Zai is a free mobile web app that lets you scan the barcode of any food or cosmetic product and instantly understand what's inside it. No account. No ads. No data collection.

Built as a PWA (Progressive Web App), Zai works on any smartphone — install it directly from your browser without an app store.

---

## Features

- 📷 **Barcode scanner** — scan any product in seconds
- 📊 **Health score 0–100** — based on Nutri-Score, additives and processing level (NOVA group)
- ⚗️ **Additive breakdown** — risk-ranked list of every additive with explanations
- 🌿 **Eco-score** — environmental impact badge
- 🧴 **Cosmetics scanning** — ingredient safety analysis for shampoos, creams and more
- 🚨 **Allergen alerts** — set your allergens, get instant warnings
- 🔍 **Smart search** — accent-tolerant, multi-query search with recent history
- ⭐ **Favourites** — save products you trust
- 🕓 **Scan history** — everything you've scanned, locally stored
- 🌍 **6 languages** — English, Portuguese BR, Spanish, French, German, Italian
- 🔒 **100% private** — all data stays on your device

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite |
| Styling | CSS Variables + inline styles |
| Scanner | html5-qrcode |
| Food API | Open Food Facts (free, no key) |
| Beauty API | Open Beauty Facts (free, no key) |
| Storage | localStorage (device only) |
| Hosting | GitHub Pages |
| Distribution | PWA + Google Play (TWA) |

---

## API

Zai uses two free, open-source, non-profit APIs:

**Food products:**
```
GET https://world.openfoodfacts.org/api/v2/product/{barcode}.json
GET https://world.openfoodfacts.org/cgi/search.pl?search_terms={query}&json=true
```

**Cosmetic products:**
```
GET https://world.openbeautyfacts.org/api/v2/product/{barcode}.json
```

No API key required. Please add a User-Agent header identifying your app if you build on top of this.

---

## Scoring Algorithm

Zai calculates a score from 0 to 100 based on three factors:

1. **Nutri-Score (A–E)** — nutritional quality rating
2. **Additives** — each additive penalised by risk level (high/moderate/low)
3. **NOVA group (1–4)** — food processing level
4. **Organic certification** — small bonus

Cosmetic products are scored separately based on INCI ingredient risk matching against a curated database of ~60 concerning ingredients.

---

## Privacy

Zai collects zero personal data. Full privacy policy:
👉 [esteves7771.github.io/Zai/privacy.html](https://esteves7771.github.io/Zai/privacy.html)

---

## Languages

| Code | Language |
|------|----------|
| en | English |
| pt | Portuguese (BR) |
| es | Spanish |
| fr | French |
| de | German |
| it | Italian |

---

## Development

```bash
# Install
npm install

# Dev server (exposed on LAN for mobile testing)
npm run dev -- --host

# Production build
npm run build

# Preview build
npm run preview
```

---

## Deployment

Zai is deployed automatically via GitHub Actions on every push to `main`. The workflow builds the React app and deploys the `dist/` folder to GitHub Pages.

---

## Credits

- Food data: [Open Food Facts](https://world.openfoodfacts.org) — Open Database License (ODbL)
- Beauty data: [Open Beauty Facts](https://world.openbeautyfacts.org) — Open Database License (ODbL)
- Fonts: [Nunito](https://fonts.google.com/specimen/Nunito) + [DM Sans](https://fonts.google.com/specimen/DM+Sans) — SIL Open Font License
- Logo: © 2026 Pedro Esteves

---

## License

Copyright © 2026 Pedro Esteves. All rights reserved.

This software and its source code are proprietary. No part of this project may be copied, modified, distributed or used without explicit written permission from the author.

See [LICENSE](./LICENSE) for full terms.

---

*Zai is not affiliated with Open Food Facts or Open Beauty Facts beyond using their public APIs.*
