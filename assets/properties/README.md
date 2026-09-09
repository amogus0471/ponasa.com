# Ponasa property media manifest

`properties.js` is the import-ready data source for the Portfolio and Tenants pages. It contains all 61 properties from `Search Results.csv`, keyed by folio number.

`PONASA_PROPERTY_COORDINATES` contains address-level coordinates produced once with the U.S. Census geocoder. The browser uses those saved coordinates for the OpenStreetMap view, so visitors do not trigger bulk geocoding requests.

All tenant availability is shown as unavailable until the site is connected to Propertyware.

Do not commit third-party API keys or key-bearing media URLs in this file. Public property and media data should be refreshed through a server-side integration before publication.
