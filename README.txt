BunpoPanda — Logo Update

Open index.html directly from the extracted folder to use the grammar site without a server.

REPLACE LOGO WITH ONE IMAGE FILE:
Put one image in the assets/ folder named logo.png, logo.jpg, logo.jpeg, logo.webp or logo.svg.
- New PNG/JPG/JPEG/WebP takes priority over included assets/logo.svg, so you do NOT need to edit HTML.
- To use your own SVG, simply replace assets/logo.svg.
- For replacement with a different image type, just put the new image in assets/; no code changes.
- If opening index.html by itself without the assets folder, an embedded default panda SVG appears automatically.

PWA install/offline: serve the full folder on HTTPS or localhost. Direct file:// works for normal studying but cannot activate service workers. The installed PWA icon uses the placeholder assets/logo.svg; to customize the installed icon as well, replace that SVG file (PWA icon behavior varies by platform).

Your existing grammar data, global search, quizzes and settings are preserved.
