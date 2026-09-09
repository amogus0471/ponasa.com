const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const header = document.querySelector(".site-header");
const dropdowns = document.querySelectorAll(".nav-dropdown");

const footerVideoUrl = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260624_210218_173f8eba-17ff-4e27-972b-d128af25bf49.mp4";
document.querySelectorAll(".site-footer").forEach((footer) => {
  if (footer.querySelector(".footer-video")) return;
  const video = document.createElement("video");
  video.className = "footer-video";
  video.src = footerVideoUrl;
  video.autoplay = true;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = "metadata";
  video.setAttribute("aria-hidden", "true");
  footer.prepend(video);
});

const closeDropdowns = () => {
  dropdowns.forEach((dropdown) => {
    dropdown.classList.remove("open");
    dropdown.querySelector("button")?.setAttribute("aria-expanded", "false");
  });
};
const closeMenu = () => {
  siteNav?.classList.remove("open");
  document.body.classList.remove("nav-open");
  menuToggle?.setAttribute("aria-expanded", "false");
  closeDropdowns();
};

menuToggle?.addEventListener("click", () => {
  const isOpen = siteNav?.classList.toggle("open") ?? false;
  document.body.classList.toggle("nav-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
dropdowns.forEach((dropdown) => {
  const trigger = dropdown.querySelector("button");
  trigger?.addEventListener("click", (event) => {
    event.stopPropagation();
    const willOpen = !dropdown.classList.contains("open");
    closeDropdowns();
    dropdown.classList.toggle("open", willOpen);
    trigger.setAttribute("aria-expanded", String(willOpen));
  });
  dropdown.addEventListener("mouseleave", () => {
    if (window.matchMedia("(min-width: 981px)").matches) closeDropdowns();
  });
  dropdown.addEventListener("focusout", (event) => {
    if (event.relatedTarget instanceof Node && dropdown.contains(event.relatedTarget)) return;
    dropdown.classList.remove("open");
    trigger?.setAttribute("aria-expanded", "false");
  });
});
document.addEventListener("click", (event) => {
  if (event.target instanceof Element && !event.target.closest(".nav-dropdown")) closeDropdowns();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeDropdowns();
    if (siteNav?.classList.contains("open")) closeMenu();
  }
});
document.querySelectorAll(".site-nav a").forEach((link) => link.addEventListener("click", closeMenu));

const normalizePath = (value) => {
  const path = value.split("?")[0].split("#")[0].replace(/\/index(?:\.html)?$/, "/").replace(/\.html$/, "");
  return path === "" ? "/" : path;
};
const current = normalizePath(window.location.pathname);
document.querySelectorAll(".site-nav > a").forEach((link) => {
  const linkPath = normalizePath(new URL(link.getAttribute("href") ?? "/", window.location.origin).pathname);
  if (linkPath === current) link.classList.add("active");
});
const updateHeader = () => header?.classList.toggle("scrolled", window.scrollY > 12);
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const tickerTrack = document.querySelector(".market-track");
const tickerControl = document.querySelector(".ticker-control");
tickerControl?.addEventListener("click", () => {
  const paused = tickerTrack?.classList.toggle("paused") ?? false;
  tickerControl.setAttribute("aria-pressed", String(paused));
  tickerControl.setAttribute("aria-label", paused ? "Play market ticker" : "Pause market ticker");
  tickerControl.textContent = paused ? ">" : "||";
});

const marketSymbols = [
  { symbol: "JPM", name: "JPMorgan Chase", exchange: "NYSE" },
  { symbol: "BAC", name: "Bank of America", exchange: "NYSE" },
  { symbol: "WFC", name: "Wells Fargo", exchange: "NYSE" },
  { symbol: "C", name: "Citigroup", exchange: "NYSE" },
  { symbol: "GS", name: "Goldman Sachs", exchange: "NYSE" },
];

const financeUrl = ({ symbol, exchange }) => `https://www.google.com/finance/quote/${encodeURIComponent(symbol)}:${encodeURIComponent(exchange)}`;

const formatMarket = (value, change) => {
  const price = value == null ? Number.NaN : Number(value);
  const delta = change == null ? Number.NaN : Number(change);
  return { price: Number.isFinite(price) ? `$${price.toFixed(2)}` : "--", change: Number.isFinite(delta) ? `${delta >= 0 ? "+" : ""}${delta.toFixed(2)}%` : "--", down: Number.isFinite(delta) && delta < 0 };
};

const renderMarketTicker = (quotes = {}, unavailable = false) => {
  if (!tickerTrack) return;
  const pricedMarkets = marketSymbols.filter((market) => Number.isFinite(Number(quotes[market.symbol]?.price)));
  const visibleMarkets = pricedMarkets.length ? pricedMarkets : marketSymbols;
  const repeatCount = Math.max(6, Math.ceil(24 / visibleMarkets.length));
  const items = visibleMarkets.map((market) => {
    const quote = formatMarket(quotes[market.symbol]?.price, quotes[market.symbol]?.change);
    const detail = quote.price === "--" ? (unavailable ? "Quote delayed" : "Loading price") : quote.price;
    const movement = quote.change === "--" ? (unavailable ? "Refresh later" : "Updating") : quote.change;
    return `<a class="market-item" href="${financeUrl(market)}" target="_blank" rel="noopener" aria-label="${market.name} stock price on Google Finance"><strong>${market.symbol}</strong><span>${detail}</span><em class="${quote.down ? "down" : ""}">${movement}</em></a>`;
  });
  tickerTrack.innerHTML = Array.from({ length: repeatCount }, () => items).flat().join("");
};

const loadMarketData = async () => {
  renderMarketTicker();
  const liveSymbols = marketSymbols.map((market) => market.symbol);
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      const response = await fetch(`/api/market?symbols=${liveSymbols.join(",")}`);
      if (!response.ok) throw new Error("Market data unavailable");
      const payload = await response.json();
      const quotes = payload.quotes ?? payload;
      renderMarketTicker(quotes, Boolean(payload.unavailable));
      if (!payload.refreshing) return;
    } catch { renderMarketTicker({}, true); return; }
    await new Promise((resolve) => setTimeout(resolve, 1600));
  }
};
if (tickerTrack) loadMarketData();

document.querySelectorAll("[data-carousel], [data-video-carousel]").forEach((carousel) => {
  const slides = [...carousel.querySelectorAll(".development-slide, .video-slide")];
  const section = carousel.closest("section") ?? document;
  const count = section.querySelector("#development-count, #portfolio-count, #video-count");
  const previous = section.querySelector("[data-carousel-prev], [data-video-prev]");
  const next = section.querySelector("[data-carousel-next], [data-video-next]");
  let activeSlide = 0;
  let autoAdvance;
  const showSlide = (index) => {
    if (!slides.length) return;
    activeSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeSlide;
      slide.classList.toggle("is-active", isActive);
      const video = slide.querySelector("video");
      if (isActive) video?.play().catch(() => {});
      else { video?.pause(); if (video) video.currentTime = 0; }
    });
    if (count) count.textContent = `${String(activeSlide + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
  };
  const restartAutoAdvance = () => {
    if (autoAdvance) window.clearInterval(autoAdvance);
    if (!carousel.querySelector("video") && slides.length > 1) autoAdvance = window.setInterval(() => showSlide(activeSlide + 1), 6500);
  };
  previous?.addEventListener("click", () => { showSlide(activeSlide - 1); restartAutoAdvance(); });
  next?.addEventListener("click", () => { showSlide(activeSlide + 1); restartAutoAdvance(); });
  slides.forEach((slide) => slide.querySelector("video")?.addEventListener("ended", () => showSlide(activeSlide + 1)));
  carousel.addEventListener("mouseenter", () => { if (autoAdvance) window.clearInterval(autoAdvance); });
  carousel.addEventListener("mouseleave", restartAutoAdvance);
  carousel.addEventListener("focusin", () => { if (autoAdvance) window.clearInterval(autoAdvance); });
  carousel.addEventListener("focusout", restartAutoAdvance);
  showSlide(0);
  restartAutoAdvance();
});

const propertyGrid = document.querySelector("#property-grid");
const propertySearch = document.querySelector("#property-search");
const propertyZip = document.querySelector("#property-zip");
const propertyResults = document.querySelector("#property-results");
const propertyProfile = document.querySelector("#property-profile");
const portfolioDirectory = document.querySelector("[data-portfolio-directory]");
const portfolioButtons = document.querySelectorAll("[data-portfolio-category]");
const propertyDirectoryTitle = document.querySelector("#property-directory-title");
const propertyDirectoryKicker = document.querySelector("#property-directory-kicker");
const propertyDirectoryCopy = document.querySelector("#property-directory-copy");
let activePortfolioCategory = "";

const escapePropertyHtml = (value) => String(value).replace(/[&<>\"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;",
}[character]));
const zillowSlug = (address) => address.replace(/[#,\.]/g, "").replace(/\s+/g, "-");
const zillowSearchUrl = (address) => `https://www.zillow.com/homes/${zillowSlug(address)}_rb/`;
const propertySlug = (property) => property.address
  .normalize("NFKD")
  .toLowerCase()
  .replace(/#/g, " unit ")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");
const propertyDetailUrl = (property) => `/portfolio/${propertySlug(property)}`;
const folioPlain = (property) => property.folio.replace(/-/g, "");
const bcpaRecordUrl = (property) => `https://web.bcpa.net/bcpaclient/#/Record-Search?folio=${encodeURIComponent(folioPlain(property))}`;
const bcpaMapUrl = (property) => `https://gisweb-adapters.bcpa.net/bcpawebmap_ex_new/bcpawebmap.aspx?FOLIO=${encodeURIComponent(folioPlain(property))}`;
const googleMapsUrl = (property) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.address)}`;
const propertyZipCode = (property) => property.address.match(/\b\d{5}\b/)?.[0] ?? "";
const propertyCities = ["DEERFIELD BEACH", "POMPANO BEACH", "NORTH LAUDERDALE", "LAUDERDALE LAKES", "FORT LAUDERDALE", "OAKLAND PARK", "UNINCORPORATED", "LAUDERHILL", "HOLLYWOOD", "TAMARAC", "SUNRISE"];
const addressBeforeState = (property) => property.address.replace(/\s+FL\s+\d{5}\s*$/, "").replace(/\s+/g, " ");
const propertyCity = (property) => propertyCities.find((city) => addressBeforeState(property).endsWith(` ${city}`)) ?? "Broward County";
const propertyStreet = (property) => addressBeforeState(property).replace(new RegExp(`\\s+${propertyCity(property)}$`), "");
const propertyLabel = (property) => property.address.replace(/\s+FL\s+\d{5}\s*$/, "").replace(/\s+/g, " ");
const propertyCategory = (property) => {
  if (property.folio === "504201GJ1190") return "hospitality";
  if (property.folio === "494214-09-0300") return "commercial";
  return "residential";
};
const propertyMedia = (property) => window.PONASA_EXTERIOR_MEDIA?.[property.folio];
const propertyDetails = (property) => window.PONASA_PROPERTY_DETAILS?.[property.folio] ?? {};
const propertyZillowMedia = (property) => window.PONASA_VERIFIED_MEDIA?.[property.folio];
const propertyZillowUrl = (property) => propertyZillowMedia(property)?.zillowUrl ?? zillowSearchUrl(property.address);
const propertyMapPoint = (property) => window.PONASA_PARCEL_COORDINATES?.[property.folio];
const fallbackPropertyImage = (property) => propertyCategory(property) === "hospitality"
  ? "/assets/hilton-beach-house-1.webp"
  : "/assets/ponasa-holdings-band.png";

const renderPropertyMap = () => {
  const mapElement = document.querySelector("#property-map");
  if (!mapElement || !Array.isArray(window.PONASA_PROPERTIES) || !window.L) return;
  const map = window.L.map(mapElement, { scrollWheelZoom: true, zoomControl: true });
  window.L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a>',
  }).addTo(map);
  const bounds = [];
  const marker = window.L.divIcon({ className: "property-marker", html: "<span></span>", iconSize: [18, 18], iconAnchor: [9, 9] });
  window.PONASA_PROPERTIES.forEach((property) => {
    const point = propertyMapPoint(property);
    if (!Array.isArray(point) || point.length !== 2) return;
    bounds.push(point);
    const detailUrl = propertyDetailUrl(property);
    const address = propertyLabel(property);
    window.L.marker(point, { icon: marker, title: address })
      .addTo(map)
      .bindPopup(`<div class="map-popup"><strong>${escapePropertyHtml(address)}</strong><span>${escapePropertyHtml(propertyCity(property))}, Florida</span><a href="${escapePropertyHtml(detailUrl)}" target="_blank" rel="noopener">Open property profile <span aria-hidden="true">→</span></a></div>`);
  });
  if (bounds.length) map.fitBounds(bounds, { padding: [22, 22], maxZoom: 12 });
  window.requestAnimationFrame(() => map.invalidateSize());
};

const renderPropertyDirectory = () => {
  if (!propertyGrid || !Array.isArray(window.PONASA_PROPERTIES)) return;
  if (portfolioDirectory) portfolioDirectory.hidden = false;
  const query = (propertySearch?.value ?? "").trim().toLowerCase();
  const selectedZip = propertyZip?.value ?? "";
  const visibleProperties = window.PONASA_PROPERTIES.filter((property) => {
    const matchesCategory = !activePortfolioCategory || propertyCategory(property) === activePortfolioCategory;
    const matchesQuery = !query || `${property.address} ${property.folio}`.toLowerCase().includes(query);
    const matchesZip = !selectedZip || propertyZipCode(property) === selectedZip;
    return matchesCategory && matchesQuery && matchesZip;
  });

  propertyGrid.innerHTML = visibleProperties.length ? visibleProperties.map((property, index) => {
    const media = propertyMedia(property);
    const imageUrl = media?.imageUrl || fallbackPropertyImage(property);
    const fallbackUrl = fallbackPropertyImage(property);
    const details = propertyDetails(property);
    const area = details.buildingSqFt ? `${details.buildingSqFt.toLocaleString()} sq ft` : propertyCity(property);
    return `<a class="property-card" href="${escapePropertyHtml(propertyDetailUrl(property))}" target="_blank" rel="noopener" aria-label="Open profile for ${escapePropertyHtml(propertyLabel(property))} in a new tab"><span class="property-card-index">${String(index + 1).padStart(2, "0")}</span><span class="property-media"><img src="${escapePropertyHtml(imageUrl)}" alt="Exterior of ${escapePropertyHtml(propertyLabel(property))}" loading="lazy" onerror="this.onerror=null;this.src='${escapePropertyHtml(fallbackUrl)}'"><span>View details</span></span><span class="property-card-body"><span class="property-card-kicker">${escapePropertyHtml(area)}</span><strong>${escapePropertyHtml(property.address.replace(/\s+/g, " "))}</strong><span class="text-link">Open property profile <span aria-hidden="true">→</span></span></span></a>`;
  }).join("") : `<div class="empty-state"><p class="eyebrow">${escapePropertyHtml(activePortfolioCategory)}</p><h3>No public properties available.</h3><p>This category is not listed online right now.</p></div>`;
  if (propertyResults) propertyResults.textContent = `${visibleProperties.length} ${visibleProperties.length === 1 ? "property" : "properties"}`;
};

if (propertyGrid && Array.isArray(window.PONASA_PROPERTIES)) {
  const zipCodes = [...new Set(window.PONASA_PROPERTIES.map(propertyZipCode).filter(Boolean))].sort();
  zipCodes.forEach((zip) => propertyZip?.insertAdjacentHTML("beforeend", `<option value="${zip}">${zip}</option>`));
  propertySearch?.addEventListener("input", renderPropertyDirectory);
  propertyZip?.addEventListener("change", renderPropertyDirectory);
  portfolioButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activePortfolioCategory = button.dataset.portfolioCategory ?? "";
      if (propertySearch) propertySearch.value = "";
      if (propertyZip) propertyZip.value = "";
      portfolioButtons.forEach((item) => item.classList.toggle("active", item === button));
      portfolioButtons.forEach((item) => item.setAttribute("aria-expanded", String(item === button)));
      const categoryLabels = {
        hospitality: ["Hospitality", "Hospitality property", "Beachfront hospitality in Fort Lauderdale."],
        commercial: ["Commercial", "Commercial property", "Commercial space in Oakland Park."],
        residential: ["Residential", "Residential properties", "Rental homes and apartments across Broward County."],
      };
      const [kicker, title, copy] = categoryLabels[activePortfolioCategory] ?? ["Properties", "Ponasa properties", "Property profiles and public-record details."];
      if (propertyDirectoryKicker) propertyDirectoryKicker.textContent = kicker;
      if (propertyDirectoryTitle) propertyDirectoryTitle.textContent = title;
      if (propertyDirectoryCopy) propertyDirectoryCopy.textContent = copy;
      renderPropertyDirectory();
      portfolioDirectory?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

const renderPropertyProfile = () => {
  if (!propertyProfile || !Array.isArray(window.PONASA_PROPERTIES)) return;
  const slugFromPath = decodeURIComponent(window.location.pathname.match(/^\/portfolio\/([^/]+)\/?$/)?.[1] ?? "");
  const legacyFolio = decodeURIComponent(window.location.pathname.match(/^\/property\/([^/]+)\/?$/)?.[1] ?? "") || new URLSearchParams(window.location.search).get("folio");
  const property = window.PONASA_PROPERTIES.find((item) => propertySlug(item) === slugFromPath || item.folio === legacyFolio);
  if (!property) {
    document.title = "Property not found | Ponasa";
    propertyProfile.innerHTML = '<a class="property-back-link" href="/portfolio">Back to property map</a><div class="empty-state"><p class="eyebrow">Property</p><h1>Property not found.</h1><p>The requested property profile is not available.</p></div>';
    return;
  }
  const media = propertyMedia(property);
  const details = propertyDetails(property);
  const zillowMedia = propertyZillowMedia(property);
  const zillowUrl = propertyZillowUrl(property);
  const zip = propertyZipCode(property);
  const city = propertyCity(property);
  const sourceItems = [
    { label: "View on Zillow", url: zillowUrl },
    { label: "County property record", url: bcpaRecordUrl(property) },
    { label: "County photo archive", url: media?.photoPageUrl },
    { label: "County parcel map", url: bcpaMapUrl(property) },
    { label: "Google Maps", url: googleMapsUrl(property) },
  ].filter((item) => item.url);
  const zillowGallery = zillowMedia?.imageUrls?.length
    ? `<section class="property-panel"><p class="eyebrow">Zillow media</p><div class="property-mini-gallery">${zillowMedia.imageUrls.map((imageUrl) => `<a href="${escapePropertyHtml(zillowUrl)}" target="_blank" rel="noopener"><img src="${escapePropertyHtml(imageUrl)}" alt="Zillow media for ${escapePropertyHtml(propertyLabel(property))}" loading="lazy"></a>`).join("")}</div></section>`
    : "";

  document.title = `${propertyStreet(property)} | Ponasa`;
  const description = `Ponasa LLC property profile for ${propertyLabel(property)}, folio ${property.folio}.`;
  document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.append(canonical);
  }
  canonical.setAttribute("href", `https://ponasa.com${propertyDetailUrl(property)}`);
  const category = propertyCategory(property);
  const missingValue = category === "commercial" ? "Not applicable" : "Not listed";
  const detailFacts = [
    ["Building area", details.buildingSqFt ? `${details.buildingSqFt.toLocaleString()} sq ft` : "Not listed"],
    ["Bedrooms", details.beds != null ? (details.beds < 1 ? "Studio" : String(details.beds)) : missingValue],
    ["Bathrooms", details.baths != null ? String(details.baths) : missingValue],
    ["Year built", details.yearBuilt || "Not listed"],
    ["Property type", details.type || category],
    ["Lot size", details.lot || (category === "hospitality" ? "Condominium" : "Not listed")],
  ];
  const imageUrl = media?.imageUrl || fallbackPropertyImage(property);
  propertyProfile.innerHTML = `
    <a class="property-back-link" href="/portfolio">Back to portfolio</a>
    <div class="property-profile-hero">
      <div class="property-profile-media">
        <img src="${escapePropertyHtml(imageUrl)}" alt="Exterior of ${escapePropertyHtml(propertyLabel(property))}" onerror="this.onerror=null;this.src='${escapePropertyHtml(fallbackPropertyImage(property))}'">
        <span>${escapePropertyHtml(media?.photoCount ? `${media.photoCount} county photos available` : "Exterior photo")}</span>
      </div>
      <div class="property-profile-copy">
        <p class="eyebrow">Property profile</p>
        <h1>${escapePropertyHtml(propertyStreet(property))}</h1>
        <p>${escapePropertyHtml(property.address)}</p>
        <div class="property-action-row">
          ${sourceItems.map((item) => `<a class="button ${item.label === "View on Zillow" ? "primary" : "secondary"}" href="${escapePropertyHtml(item.url)}" target="_blank" rel="noopener">${escapePropertyHtml(item.label)}</a>`).join("")}
        </div>
      </div>
    </div>
    <section class="property-facts" aria-label="Property facts">
      ${detailFacts.map(([label, value]) => `<article><span>${escapePropertyHtml(label)}</span><strong>${escapePropertyHtml(value)}</strong></article>`).join("")}
    </section>
    <section class="property-detail-grid" aria-label="Property details">
      <article class="property-panel"><p class="eyebrow">Address</p><dl><div><dt>Street address</dt><dd>${escapePropertyHtml(propertyStreet(property))}</dd></div><div><dt>City</dt><dd>${escapePropertyHtml(city)}</dd></div><div><dt>State</dt><dd>Florida</dd></div><div><dt>ZIP</dt><dd>${escapePropertyHtml(zip)}</dd></div></dl></article>
      <article class="property-panel"><p class="eyebrow">Public record</p><dl><div><dt>Parcel reference</dt><dd>${escapePropertyHtml(property.folio)}</dd></div><div><dt>Owner</dt><dd>Ponasa LLC</dd></div><div><dt>County</dt><dd>Broward County</dd></div><div><dt>Data source</dt><dd>Broward County Property Appraiser</dd></div></dl></article>
      <article class="property-panel"><p class="eyebrow">External records</p><div class="property-link-list">${sourceItems.map((item) => `<a href="${escapePropertyHtml(item.url)}" target="_blank" rel="noopener">${escapePropertyHtml(item.label)} <span aria-hidden="true">↗</span></a>`).join("")}</div></article>
      ${zillowGallery}
    </section>
    <p class="property-source-note">Property facts are from Broward County public records and may differ from current leasing information. Contact Ponasa for availability and current terms.</p>`;
};

renderPropertyProfile();

const propertySitemapList = document.querySelector("#property-sitemap-list");
if (propertySitemapList && Array.isArray(window.PONASA_PROPERTIES)) {
  propertySitemapList.innerHTML = window.PONASA_PROPERTIES.map((property) => `<li><a href="${escapePropertyHtml(propertyDetailUrl(property))}">${escapePropertyHtml(property.address.replace(/\s+/g, " "))}</a><span>Property profile</span></li>`).join("");
}

renderPropertyMap();
