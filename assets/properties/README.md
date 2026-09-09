# Ponasa property media manifest

`properties.js` is the import-ready address and media source for the Portfolio page. It contains all 61 properties from the supplied portfolio list, keyed by folio number.

`property-details.js` contains cached public-record facts and exact parcel centroids. Regenerate it and `sitemap.xml` with `node tools/sync-property-data.js`.

The browser uses the cached coordinates for the OpenStreetMap view, so visitors do not trigger geocoding requests. The one condominium unit without its own parcel polygon uses its saved address point.

Do not commit third-party API keys or key-bearing media URLs. Public property facts should be refreshed from the source before publication.
