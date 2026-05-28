# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Frontend (run from repo root)
npm run dev        # start Vite dev server
npm run build      # production build
npm run lint       # ESLint

# Firebase deployment
firebase deploy --only hosting    # deploy frontend
firebase deploy --only functions  # deploy Cloud Functions

# Manual data refresh (HTTP trigger)
# GET https://<region>-<project>.cloudfunctions.net/manualUpdate?category=0
# category: 0=Candidates 1=Escandalos 2=Experiencia 3=Educacion 4=Salud 5=Seguridad
```

There are no tests.

## Architecture

**Elecciones Colombia AI** is a read-only election information site that displays AI-generated summaries of Colombian presidential candidates, refreshed daily.

### Data pipeline (backend — `functions/`)

Cloud Functions (Node.js, CommonJS) run on a daily schedule and follow one fixed pattern:

1. For each candidate (Cepeda, Espriella, Valencia), send a category-specific prompt from `functions/src/queries.json` to **Gemini 2.5 Flash Lite** with Google Search grounding enabled.
2. Parse the response: extract `text` and deduplicated `sources[]` from `groundingMetadata.groundingChunks`.
3. Write a new document to the matching **Firestore collection** with fields: `last_name`, `general_summary`, `sources[]`, `createdAt`.

Each category maps to a Firestore collection via `COLLECTIONS` array in `functions/src/firestore.js`:

| Index | Collection | Schedule (UTC) |
|-------|-----------|---------------|
| 0 | Candidates | 05:00 |
| 1 | Escandalos | 09:00 |
| 2 | Experiencia | 13:00 |
| 3 | Educacion | 17:00 |
| 4 | Salud | 21:00 |
| 5 | Seguridad | 01:00 |

The `manualUpdate` HTTP function accepts `?category=0-5` to trigger any category on demand.

### Frontend (`src/`)

React 19 + Vite SPA with React Router DOM. No auth — read-only Firestore access.

**Page pattern** — every page (Candidates, Category1–5) is nearly identical:
1. On mount, call `loadAllCandidates(getterFn)` from `src/utils/helpers.js`, where `getterFn` is the collection-specific function (`getCandidate`, `getEscandalo`, etc.).
2. `loadAllCandidates` runs three parallel Firestore queries (one per candidate), each fetching the single most recent document ordered by `createdAt desc`.
3. Render candidate cards in shuffled order (randomized once per page load via `useMemo`) to avoid position bias. Summaries are rendered with `ReactMarkdown`.

**Adding a new category** requires:
- A new Firestore collection entry in `functions/src/firestore.js` (`COLLECTIONS` array)
- A new scheduled function in `functions/index.js`
- A new getter export in `src/utils/helpers.js`
- A new page in `src/pages/` (copy any Category page, swap the getter)
- A new route in `src/App.jsx`
- A new nav item in `src/components/Navigation.jsx` (`NAV_ITEMS`)
- A new prompt in both `src/utils/queries.json` and `functions/src/queries.json`

**Key files:**
- `src/utils/helpers.js` — all Firestore read logic; `loadAllCandidates` is the shared data loader
- `src/utils/queries.json` — prompts shown in the UI "About" section (display only)
- `functions/src/queries.json` — prompts actually sent to Gemini (must stay in sync with the UI version)
- `src/config/firebase.js` — Firebase client SDK init (project `candidatos-e44f4`)
- `functions/src/gemini.js` — Gemini API call + source extraction
- `functions/src/firestore.js` — Firestore write logic via Firebase Admin SDK

**Gemini API key** is stored as a Firebase Functions parameter (`GEMINI_API_KEY`), not in source code. Set it with `firebase functions:config:set` or via the Firebase Console.
