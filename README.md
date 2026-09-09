# Ponasa Website

Static multi-page redesign for Ponasa Real Estate Investments & Management.

## Local Preview

Run `run-local.bat` and open `http://localhost:8000`.

The site includes a Leaflet/OpenStreetMap property map and clean, address-based property-profile links. The local preview reads `ALPHA_VANTAGE_API_KEY` from `.env.local` for the market banner, caches successful quotes for six hours, and does not expose the key to the browser.

The site is static HTML/CSS/JS. `serve-local.js` handles clean local routes and `.htaccess` provides equivalent Apache rewrites for production. The market banner falls back gracefully if the local API proxy is unavailable.

Run `node tools/sync-property-data.js` to refresh cached Broward County property facts, parcel centroids, and `sitemap.xml`.
