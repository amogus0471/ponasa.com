# Ponasa Website

Static multi-page redesign for Ponasa Real Estate Investments & Management.

## Local Preview

Run `run-local.bat` and open `http://localhost:8000`.

The site includes a Leaflet/OpenStreetMap property map and clean property-profile links. The local preview reads `ALPHA_VANTAGE_API_KEY` from `.env.local` for the market banner, caches successful quotes for six hours, and does not expose the key to the browser.

The site is static HTML/CSS/JS with clean local URLs for Home, Tenants, Portfolio, Company, Locations, Contact, legal pages, sitemap, property profiles, and 404. It can be hosted by any static web host; the market banner falls back gracefully if the local API proxy is unavailable.
