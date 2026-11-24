# 🐼 BunpoPanda

**Offline-first Japanese grammar library and practice app for JLPT N5, N4 and N3.** BunpoPanda runs as a static website on GitHub Pages, and its main study functions can also run by opening `index.html` directly. It is built with HTML, CSS and JavaScript, with no account or external database required.

> **Main principle:** A published grammar-library update is **optional**. Each learner decides whether to download it; the app does not intentionally overwrite an installed library just because a newer `grammar.json` is online.

## Features

### 📚 Grammar Library
- Browse JLPT **N5, N4 and N3** grammar, organized by level and category.
- Open grammar cards for meanings, sentence patterns/formats and Japanese examples with English translations.
- Toggle the hiragana readings shown below Japanese examples in Settings.
- Search grammar expressions, readings, meanings and examples; sort the library and filter by level/category.
- Mark expressions as **mastered** with a star and optionally hide mastered cards.
- Add or edit expressions locally using the in-app library editor.

### ⚡ Mastery Blitz — Quick Quiz
- Practice selected JLPT levels/categories, with either **expression → meaning** or **meaning → expression** questions.
- Choose question-count or time-based rounds; review score, accuracy and mistakes.
- Pause, restart or end a round; revisit incorrectly answered grammar details from results.
- Keyboard controls on desktop, touch-friendly answers on phones, optional quiz sounds and answer animations.

### 📊 Progress & Profile
- Editable display name and profile photo; light and dark modes.
- Mastered-expression tracking and quiz statistics, including lifetime and level-based views.
- Compact older quiz results using **Back Up** in Settings; clear quiz results separately with confirmation.
- Transfer selected profile/progress/statistics using BunpoPanda transfer text, a generated QR, or a saved BunpoPanda QR PNG; imported statistics replace existing statistics after confirmation.
- Duplicate transfer warning for a previously imported transfer.

### 🔄 User-controlled Grammar Library Updates
- **Import JSON:** choose a personal grammar library from a local file; it is installed only when the user chooses it.
- **Check for updates:** when online on GitHub Pages, compare the installed library against the published `data/grammar.json` contents, not just the file name or number of entries.
- **Download Updated Library:** appears if the published file is different. It requires confirmation and saves the chosen update for offline use.
- **Delete Library:** removes the installed grammar library only after confirmation, while preserving unrelated profile and quiz statistics; permits testing or choosing a new library.
- Mastered stars are carried to matching level/expression entries when replacing a library where possible.
- Users may **ignore an update and keep studying with their current saved library offline**.

### 📱 Offline & PWA
- Responsive layout for desktop and mobile, with a bottom navigation bar and compact dialogs.
- Installable as a **Progressive Web App (PWA)** when hosted over HTTPS, such as GitHub Pages.
- Previously loaded site resources and locally saved grammar data remain accessible when offline, subject to browser storage policies.
- `index.html` contains built-in default grammar/QR code for direct standalone opening. **An offline `file://` page cannot check GitHub for new library versions.**

## Current bundled content

| Level | Grammar expressions |
|---|---:|
| N5 | 62 |
| N4 | 121 |
| N3 | 144 |
| **Total** | **327** |

These are **records in the included JSON**, not an official JLPT grammar syllabus count. Distinct records may use the same displayed expression for different meanings.

## Repository files

```text
BunpoPanda/
├── index.html             # App, styles and bundled standalone fallbacks
├── data/
│   └── grammar.json       # Published source for OPTIONAL online updates
├── assets/
│   └── logo.png           # App, favicon and PWA icon
├── manifest.webmanifest   # PWA metadata
├── sw.js                  # Offline caching and network checks
└── README.md              # This guide
```

The older `grammar-data.js`, `qr-encoder.js` and `qr-transfer.js` are **not needed in this cleaned build**: the standalone fallbacks and QR code are already embedded in `index.html`, and `sw.js` has been updated not to precache those standalone files. Removing these files from other versions without updating their HTML and service worker is **not** recommended.

## Publish on GitHub Pages

1. Upload all the files above to the **root of the branch/folder GitHub Pages publishes**. Keep the `data/` and `assets/` folder names.
2. Commit the upload. Make sure Pages is configured under **Settings → Pages**.
3. Open the published site online once, so the PWA can cache its app shell.
4. To publish new grammar later, edit/replace **only** `data/grammar.json` and commit. No `index.html` or `sw.js` edit is required just for grammar content changes.
5. After GitHub Pages deploys the change, users go to **Settings → Library → Check for updates**, then choose whether to download the newer library. If both library contents match, the app reports that it is up to date.

**Important:** Updating `grammar.json` on GitHub does **not** automatically change the fallback data embedded inside a separately downloaded standalone `index.html`. Users can instead import the newer JSON manually or download it through the hosted site while online.

## JSON format

`data/grammar.json` is an array of grammar objects. Keep stable, unique IDs and supported levels (`N5`, `N4`, `N3`). Example structure:

```json
[
  {
    "id": 1,
    "level": "N5",
    "expression": "Example expression",
    "meaning": "Example meaning",
    "category": "Basics",
    "format": "Formation / pattern",
    "usages": [
      {
        "usage": "Meaning or usage note",
        "japanese": "日本語の例文。",
        "reading": "にほんごのれいぶん。",
        "english": "An example sentence."
      }
    ]
  }
]
```

The example above illustrates the **file shape**, not an actual BunpoPanda grammar entry. Duplicate *IDs* are invalid; two records may share a written expression when their meanings differ. Keep valid UTF-8 JSON syntax.

## User data and privacy

Study progress, profile settings and installed grammar are stored **in that browser's local storage**, not in the public GitHub repository. Clearing browser/site data, using a different browser/profile, or changing the local file path can remove or isolate saved data. Before clearing site storage, export a compatible progress transfer where available. Private images/stats are not uploaded to GitHub by the application.

The public repository's `grammar.json` can be downloaded by visitors; removing an in-app export control does not make public grammar content confidential.

## Troubleshooting

- **New grammar isn't offered:** verify GitHub Pages deployed the new JSON; then go to Settings → Library → Check for updates while online. If contents are identical, there is no update.
- **Offline update check fails:** internet access is required to *check* GitHub, but studying an already installed library works offline.
- **QR won't scan:** use **Copy transfer text** and **Import Pasted QR**, or a BunpoPanda-saved QR PNG; camera QR scanning depends on browser and HTTPS support.
- **Opening `index.html` directly:** normal study works with bundled defaults; PWA installation and GitHub update checks require a hosted site.
- **Unexpected missing progress:** verify you are using the same browser and site URL, and that browser storage wasn't cleared.

## Version

**v36 — optional offline library download with saved-content verification.** This repository cleanup consolidates prior README notes and removes duplicate scripts already embedded in `index.html`, without changing BunpoPanda's main application logic.
