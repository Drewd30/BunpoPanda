BunpoPanda v35 — optional GitHub library update fix

Bug fixed: previous update validator rejected the two legitimate N3 records called さ as duplicates, even though each has a unique ID and a different usage. Published JSON now validates by unique positive numeric ID.

Instructions:
1. Upload all files in this folder to the root of Drewd30/BunpoPanda (replacing existing files), and commit.
2. After GitHub Pages deployment, open site, then Settings > Library > Check for updates.
3. A device with an empty library should show Download Updated Library (327 records).
4. Confirm install to store the full grammar library offline.

Delete Library still asks for confirmation. Profile, stats, and saved mastery references remain safe.
If your browser still shows an old version, close and reopen after Pages deploys and service-worker refreshes.
