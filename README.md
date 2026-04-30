# Zai 🥭

Know exactly what you're eating. Scan food barcodes, get nutrition scores, check additives.

## Tech Stack
- React + Vite (PWA)
- Open Food Facts API (free, no key required)
- localStorage for scan history

## Dev
```bash
npm install
npm run dev        # local dev (add --host to expose on LAN)
```

## Build & Deploy
```bash
npm run build      # outputs to dist/
# Drag dist/ to netlify.com/drop
```

## API
- Barcode lookup: `https://world.openfoodfacts.org/api/v2/product/{barcode}.json`
- Search: `https://world.openfoodfacts.org/cgi/search.pl?search_terms={query}&json=true`

## Scoring
0–100 score based on:
1. Nutri-Score (A–E)
2. Additive risk (local E-number database)
3. Organic certification bonus
