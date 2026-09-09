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

const current = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".site-nav > a").forEach((link) => {
  if (link.getAttribute("href")?.split("/").pop() === current) link.classList.add("active");
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
  { symbol: "MS", name: "Morgan Stanley", exchange: "NYSE" },
  { symbol: "SPY", name: "S&P 500 ETF", exchange: "NYSEARCA" },
  { symbol: "VNQ", name: "Vanguard Real Estate ETF", exchange: "NYSEARCA" },
  { symbol: "IYR", name: "U.S. Real Estate ETF", exchange: "NYSEARCA" },
  { symbol: "XLRE", name: "Real Estate Select Sector", exchange: "NYSEARCA" },
];

const financeUrl = ({ symbol, exchange }) => `https://www.google.com/finance/quote/${encodeURIComponent(symbol)}:${encodeURIComponent(exchange)}`;

const formatMarket = (value, change) => {
  const price = value == null ? Number.NaN : Number(value);
  const delta = change == null ? Number.NaN : Number(change);
  return { price: Number.isFinite(price) ? `$${price.toFixed(2)}` : "--", change: Number.isFinite(delta) ? `${delta >= 0 ? "+" : ""}${delta.toFixed(2)}%` : "--", down: Number.isFinite(delta) && delta < 0 };
};

const renderMarketTicker = (quotes = {}) => {
  if (!tickerTrack) return;
  const items = marketSymbols.map((market) => {
    const quote = formatMarket(quotes[market.symbol]?.price, quotes[market.symbol]?.change);
    const detail = quote.price === "--" ? "View quote" : quote.price;
    const movement = quote.change === "--" ? "Google Finance" : quote.change;
    return `<a class="market-item" href="${financeUrl(market)}" target="_blank" rel="noopener" aria-label="${market.name} on Google Finance"><strong>${market.symbol}</strong><span>${detail}</span><em class="${quote.down ? "down" : ""}">${movement}</em></a>`;
  });
  tickerTrack.innerHTML = [...items, ...items, ...items].join("");
};

const loadMarketData = async () => {
  renderMarketTicker();
  const liveSymbols = marketSymbols.slice(0, 5).map((market) => market.symbol);
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
showSlide(0);
