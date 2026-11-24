BunpoPanda v33 — Offline-first, optional library updates

INITIAL DEPLOY
Extract this ZIP. Upload ALL files inside the extracted folder to the root of the GitHub Pages publishing directory. Commit once. Make sure data/grammar.json is included.

FUTURE UPDATES
Edit and commit ONLY data/grammar.json. You do NOT need to re-upload index.html, grammar-data.js, or sw.js for library content changes. GitHub Pages may take a moment to publish the changed file.

HOW THE USER CONTROLS UPDATES
Settings > Library > below Import JSON: BunpoPanda checks the published grammar.json when online and displays 'New Version of Library is up!' if it differs from the installed local library. The button 'Download Updated Library' asks for confirmation before it replaces the local library. Nothing is installed automatically. Users can ignore the update and stay on their existing library indefinitely. A personally imported JSON library remains their local library until they choose otherwise.

MASTERED PROGRESS / QUIZ STATISTICS
Installing an updated library transfers mastered status for matching JLPT level + expression pairs, even when IDs change. Profile and quiz history remain intact. Custom grammar edits are replaced if the user chooses to download the official update; there is a confirmation prompt.

OFFLINE USE
The current grammar library is stored in browser localStorage and works offline. The baseline grammar is bundled in index.html, so directly opening index.html works without a server. However, browser file:// storage may differ across browser and folder changes; use the installed GitHub Pages PWA for dependable offline continuity. Online checking requires network access and the GitHub Pages URL; direct file:// opening does not fetch GitHub updates. In Settings you may still import a local JSON without a server.

IMPORTANT CACHE DETAIL
The service worker uses network-first behavior for data/grammar.json. Checking online can update the service worker cache, but it DOES NOT replace the user's installed grammar library until they press Download Updated Library. A previously installed PWA must load the v33 HTML and service worker once while online to receive this new update workflow.

SECURITY
The published client-side grammar.json remains publicly downloadable by anyone with access to the repository or deployed site, even though the app omits Export JSON. A private server is required for genuine access control.
