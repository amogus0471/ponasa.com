const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const header = document.querySelector(".site-header");
const dropdowns = document.querySelectorAll(".nav-dropdown");

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

const renderMarketTicker = (quotes = {}) => {
  if (!tickerTrack) return;
  const pricedMarkets = marketSymbols.filter((market) => Number.isFinite(Number(quotes[market.symbol]?.price)));
  const visibleMarkets = pricedMarkets.length ? pricedMarkets : marketSymbols;
  const repeatCount = Math.max(6, Math.ceil(24 / visibleMarkets.length));
  const items = visibleMarkets.map((market) => {
    const quote = formatMarket(quotes[market.symbol]?.price, quotes[market.symbol]?.change);
    const detail = quote.price === "--" ? "Loading price" : quote.price;
    const movement = quote.change === "--" ? "Updating" : quote.change;
    return `<a class="market-item" href="${financeUrl(market)}" target="_blank" rel="noopener" aria-label="${market.name} stock price on Google Finance"><strong>${market.symbol}</strong><span>${detail}</span><em class="${quote.down ? "down" : ""}">${movement}</em></a>`;
  });
  tickerTrack.innerHTML = Array.from({ length: repeatCount }, () => items).flat().join("");
};

const loadMarketData = async () => {
  renderMarketTicker();
  const liveSymbols = marketSymbols.map((market) => market.symbol);
  try {
    const response = await fetch(`/api/market?symbols=${liveSymbols.join(",")}`);
    if (!response.ok) throw new Error("Market data unavailable");
    const data = await response.json();
    renderMarketTicker(data);
  } catch { renderMarketTicker(); }
};
if (tickerTrack) loadMarketData();

const slides = [...document.querySelectorAll(".video-slide")];
const videoCount = document.querySelector("#video-count");
let activeSlide = 0;
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
  if (videoCount) videoCount.textContent = `${String(activeSlide + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
};
document.querySelector("[data-video-prev]")?.addEventListener("click", () => showSlide(activeSlide - 1));
document.querySelector("[data-video-next]")?.addEventListener("click", () => showSlide(activeSlide + 1));
slides.forEach((slide) => {
  slide.querySelector("video")?.addEventListener("ended", () => showSlide(activeSlide + 1));
});
showSlide(0);

const propertyGrid = document.querySelector("#property-grid");
const propertySearch = document.querySelector("#property-search");
const propertyZip = document.querySelector("#property-zip");
const propertyResults = document.querySelector("#property-results");
const propertyCount = document.querySelector("#property-count");
const propertyProfile = document.querySelector("#property-profile");
const tenantGrid = document.querySelector("#tenant-grid");
const tenantCount = document.querySelector("#tenant-count");
const portfolioDirectory = document.querySelector("[data-portfolio-directory]");
const portfolioButtons = document.querySelectorAll("[data-portfolio-category]");
let activePortfolioCategory = "";

const escapePropertyHtml = (value) => String(value).replace(/[&<>\"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;",
}[character]));
const zillowSlug = (address) => address.replace(/[#,\.]/g, "").replace(/\s+/g, "-");
const zillowSearchUrl = (address) => `https://www.zillow.com/homes/${zillowSlug(address)}_rb/`;
const propertyDetailUrl = (property) => `/property?folio=${encodeURIComponent(property.folio)}`;
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
const propertyCategory = (property) => property.category ?? "residential";
const propertyMedia = (property) => window.PONASA_EXTERIOR_MEDIA?.[property.folio];
const propertyZillowMedia = (property) => window.PONASA_VERIFIED_MEDIA?.[property.folio];
const propertyZillowUrl = (property) => propertyZillowMedia(property)?.zillowUrl ?? zillowSearchUrl(property.address);

const renderPropertyDirectory = () => {
  if (!propertyGrid || !Array.isArray(window.PONASA_PROPERTIES)) return;
  if (portfolioDirectory) portfolioDirectory.hidden = !activePortfolioCategory;
  if (!activePortfolioCategory) {
    propertyGrid.innerHTML = "";
    if (propertyResults) propertyResults.textContent = "Choose a property type";
    return;
  }
  const query = (propertySearch?.value ?? "").trim().toLowerCase();
  const selectedZip = propertyZip?.value ?? "";
  const visibleProperties = window.PONASA_PROPERTIES.filter((property) => {
    const matchesCategory = propertyCategory(property) === activePortfolioCategory;
    const matchesQuery = !query || `${property.address} ${property.folio}`.toLowerCase().includes(query);
    const matchesZip = !selectedZip || propertyZipCode(property) === selectedZip;
    return matchesCategory && matchesQuery && matchesZip;
  });

  propertyGrid.innerHTML = visibleProperties.length ? visibleProperties.map((property, index) => {
    const media = propertyMedia(property);
    const zillowMedia = propertyZillowMedia(property);
    const zillowLabel = zillowMedia ? (zillowMedia.type === "listing-photo" ? `${zillowMedia.imageUrls.length} Zillow listing photos verified` : "Zillow Street View verified") : "Zillow link";
    const mediaMarkup = media?.imageUrl
      ? `<a class="property-media" href="${escapePropertyHtml(propertyDetailUrl(property))}" aria-label="Open profile for ${escapePropertyHtml(propertyLabel(property))}"><img src="${escapePropertyHtml(media.imageUrl)}" alt="Exterior of ${escapePropertyHtml(propertyLabel(property))}" loading="lazy"><span>Exterior photo</span></a>`
      : `<a class="property-media property-media-placeholder" href="${escapePropertyHtml(propertyDetailUrl(property))}" aria-label="Open profile for ${escapePropertyHtml(propertyLabel(property))}"><span>Open property</span><small>Exterior photo pending</small></a>`;
    return `<article class="property-card"><div class="property-card-index">${String(index + 1).padStart(2, "0")}</div>${mediaMarkup}<div class="property-card-body"><p class="property-card-kicker">${escapePropertyHtml(zillowLabel)}</p><h3><a href="${escapePropertyHtml(propertyDetailUrl(property))}">${escapePropertyHtml(propertyLabel(property))}</a></h3><p class="property-card-folio">Folio ${escapePropertyHtml(property.folio)}</p><a class="text-link" href="${escapePropertyHtml(propertyDetailUrl(property))}">View property profile <span aria-hidden="true">→</span></a></div></article>`;
  }).join("") : `<div class="empty-state"><p class="eyebrow">${escapePropertyHtml(activePortfolioCategory)}</p><h3>No public properties available.</h3><p>This category is not listed online right now.</p></div>`;
  if (propertyResults) propertyResults.textContent = `Showing ${visibleProperties.length} of ${window.PONASA_PROPERTIES.length}`;
};

if (propertyGrid && Array.isArray(window.PONASA_PROPERTIES)) {
  const zipCodes = [...new Set(window.PONASA_PROPERTIES.map(propertyZipCode).filter(Boolean))].sort();
  zipCodes.forEach((zip) => propertyZip?.insertAdjacentHTML("beforeend", `<option value="${zip}">${zip}</option>`));
  if (propertyCount) propertyCount.textContent = String(window.PONASA_PROPERTIES.length);
  propertySearch?.addEventListener("input", renderPropertyDirectory);
  propertyZip?.addEventListener("change", renderPropertyDirectory);
  portfolioButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activePortfolioCategory = button.dataset.portfolioCategory ?? "";
      portfolioButtons.forEach((item) => item.classList.toggle("active", item === button));
      renderPropertyDirectory();
      portfolioDirectory?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  renderPropertyDirectory();
}

const renderTenantDirectory = () => {
  if (!tenantGrid || !Array.isArray(window.PONASA_PROPERTIES)) return;
  tenantGrid.innerHTML = window.PONASA_PROPERTIES.map((property) => `<article class="tenant-card"><span>Unavailable</span><h3>${escapePropertyHtml(propertyLabel(property))}</h3><p>Folio ${escapePropertyHtml(property.folio)}</p></article>`).join("");
  if (tenantCount) tenantCount.textContent = String(window.PONASA_PROPERTIES.length);
};
renderTenantDirectory();

const renderPropertyProfile = () => {
  if (!propertyProfile || !Array.isArray(window.PONASA_PROPERTIES)) return;
  const folio = new URLSearchParams(window.location.search).get("folio");
  const property = window.PONASA_PROPERTIES.find((item) => item.folio === folio) ?? window.PONASA_PROPERTIES[0];
  const media = propertyMedia(property);
  const zillowMedia = propertyZillowMedia(property);
  const zillowUrl = propertyZillowUrl(property);
  const zip = propertyZipCode(property);
  const city = propertyCity(property);
  const sourceItems = [
    { label: "View on Zillow", url: zillowUrl },
    { label: "County photo archive", url: media?.photoPageUrl },
    { label: "County parcel map", url: bcpaMapUrl(property) },
    { label: "Google Maps", url: googleMapsUrl(property) },
  ].filter((item) => item.url);
  const zillowGallery = zillowMedia?.imageUrls?.length
    ? `<section class="property-panel"><p class="eyebrow">Zillow media</p><div class="property-mini-gallery">${zillowMedia.imageUrls.map((imageUrl) => `<a href="${escapePropertyHtml(zillowUrl)}" target="_blank" rel="noopener"><img src="${escapePropertyHtml(imageUrl)}" alt="Zillow media for ${escapePropertyHtml(propertyLabel(property))}" loading="lazy"></a>`).join("")}</div></section>`
    : "";

  document.title = `${propertyStreet(property)} | Ponasa`;
  propertyProfile.innerHTML = `
    <a class="property-back-link" href="/portfolio">Back to portfolio</a>
    <div class="property-profile-hero">
      <div class="property-profile-media">
        ${media?.imageUrl ? `<img src="${escapePropertyHtml(media.imageUrl)}" alt="Exterior of ${escapePropertyHtml(propertyLabel(property))}">` : ""}
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
    <section class="property-detail-grid" aria-label="Property details">
      <article class="property-panel"><p class="eyebrow">Address</p><dl><div><dt>Street address</dt><dd>${escapePropertyHtml(propertyStreet(property))}</dd></div><div><dt>City</dt><dd>${escapePropertyHtml(city)}</dd></div><div><dt>State</dt><dd>Florida</dd></div><div><dt>ZIP</dt><dd>${escapePropertyHtml(zip)}</dd></div></dl></article>
      <article class="property-panel"><p class="eyebrow">Parcel</p><dl><div><dt>Folio</dt><dd>${escapePropertyHtml(property.folio)}</dd></div><div><dt>Owner</dt><dd>PONASA LLC</dd></div><div><dt>County</dt><dd>Broward County</dd></div><div><dt>Image source</dt><dd>Broward County Property Appraiser</dd></div></dl></article>
      <article class="property-panel"><p class="eyebrow">External records</p><div class="property-link-list">${sourceItems.map((item) => `<a href="${escapePropertyHtml(item.url)}" target="_blank" rel="noopener">${escapePropertyHtml(item.label)} <span aria-hidden="true">↗</span></a>`).join("")}</div></article>
      ${zillowGallery}
    </section>`;
};

renderPropertyProfile();
