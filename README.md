# Ponasa Website

Static multi-page redesign for Ponasa Real Estate Investments & Management.

## Local Preview

Run `run-local.bat` and open `http://localhost:8000`.

The local preview reads `ALPHA_VANTAGE_API_KEY` from `.env.local` for the market watch banner. The local key file is ignored by Git; use `.env.example` as the template if the site is set up on another machine.

The site is static HTML/CSS/JS with separate Focus, Portfolio, Company, Locations, Contact, legal, and 404 pages. It can be hosted by any static web host; the market banner falls back gracefully if the local API proxy is unavailable.
