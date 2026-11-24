BunpoPanda v36 – Verified optional library install

Fixes:
- After installing the GitHub grammar library, old quiz summaries missing levels no longer crash display refresh.
- Save failures and post-save UI refresh problems are handled separately.
- The installed JSON is read back from localStorage and content-compared against the downloaded JSON.
- Check for Updates checks the saved library, not just an expression count or filename.
- Same published JSON yields Library is up to date; different JSON offers optional download.

Deploy: upload the entire folder contents (especially index.html and sw.js) to your GitHub Pages repository. Updating grammar content later still only requires data/grammar.json.

Deleting the library is optional and remains confirmation-protected. Existing quiz stats and profile are not cleared.
