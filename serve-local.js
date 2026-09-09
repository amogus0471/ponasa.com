const http = require("http");
const fs = require("fs");
const path = require("path");
const port = 8000;
const root = __dirname;
const envPath = path.join(root, ".env.local");
const marketCachePath = path.join(root, ".market-cache.json");
const env = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8").split(/\r?\n/).reduce((values, line) => { const match = line.match(/^([^#=]+)=(.*)$/); if (match) values[match[1].trim()] = match[2].trim(); return values; }, {}) : {};
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8", ".xml": "application/xml; charset=utf-8", ".txt": "text/plain; charset=utf-8", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml", ".ico": "image/x-icon" };
const savedMarketCache = fs.existsSync(marketCachePath) ? JSON.parse(fs.readFileSync(marketCachePath, "utf8")) : {};
const marketCache = new Map(Object.entries(savedMarketCache));
let marketRefreshPromise = null;
let marketRetryAfter = 0;
const marketCacheDuration = 6 * 60 * 60 * 1000;
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const getJson = async (params, apiKey) => {
  const url = new URL("https://www.alphavantage.co/query");
  Object.entries({ ...params, apikey: apiKey }).forEach(([key, value]) => url.searchParams.set(key, value));
  const response = await fetch(url);
  const payload = await response.json();
  if (payload.Information && /rate limit/i.test(payload.Information)) {
    const error = new Error("Market data rate limit reached");
    error.code = "RATE_LIMIT";
    throw error;
  }
  return payload;
};

const parseGlobalQuote = (payload) => {
  const quote = payload["Global Quote"] || {};
  const price = Number(quote["05. price"]);
  const previous = Number(quote["08. previous close"]);
  const percent = Number(quote["10. change percent"]?.replace("%", ""));
  return {
    price: Number.isFinite(price) ? price : null,
    change: previous && Number.isFinite(price) ? ((price - previous) / previous) * 100 : (Number.isFinite(percent) ? percent : null),
  };
};

const fetchMarketQuote = async (symbol, apiKey) => {
  const globalQuote = parseGlobalQuote(await getJson({ function: "GLOBAL_QUOTE", symbol }, apiKey));
  if (globalQuote.price !== null) return globalQuote;
  return { price: null, change: null };
};

const saveMarketCache = () => {
  fs.writeFileSync(marketCachePath, JSON.stringify(Object.fromEntries(marketCache), null, 2));
};

const refreshMarketData = async (symbols, apiKey) => {
  if (marketRefreshPromise) return marketRefreshPromise;
  if (Date.now() < marketRetryAfter) return null;
  marketRefreshPromise = (async () => {
    for (let index = 0; index < symbols.length; index += 1) {
      const symbol = symbols[index];
      const cached = marketCache.get(symbol);
      if (cached && Date.now() - cached.fetchedAt < marketCacheDuration) continue;
      try {
        if (index > 0) await wait(1250);
        const quote = await fetchMarketQuote(symbol, apiKey);
        if (quote.price !== null) {
          marketCache.set(symbol, { fetchedAt: Date.now(), quote });
          saveMarketCache();
        }
      } catch (error) {
        if (error.code === "RATE_LIMIT") {
          marketRetryAfter = Date.now() + marketCacheDuration;
          break;
        }
        // Keep the last successful quote when the provider is temporarily unavailable.
      }
    }
  })().finally(() => { marketRefreshPromise = null; });
  return marketRefreshPromise;
};

const sendMarketData = (res, symbols) => {
  const apiKey = env.ALPHA_VANTAGE_API_KEY || process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) { res.writeHead(503, { "Content-Type": types[".json"] }); res.end(JSON.stringify({ error: "Market data is not configured" })); return; }
  const data = {};
  const requestedSymbols = [...new Set(symbols.map((symbol) => symbol.trim().toUpperCase()).filter(Boolean))].slice(0, 5);
  requestedSymbols.forEach((symbol) => { data[symbol] = marketCache.get(symbol)?.quote ?? { price: null, change: null }; });
  void refreshMarketData(requestedSymbols, apiKey);
  res.writeHead(200, { "Content-Type": types[".json"], "Cache-Control": "no-store" });
  res.end(JSON.stringify({ quotes: data, refreshing: Boolean(marketRefreshPromise), unavailable: Date.now() < marketRetryAfter }));
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  if (url.pathname === "/api/market") { sendMarketData(res, (url.searchParams.get("symbols") || "JPM,BAC,WFC,C,GS").split(",")); return; }
  if (url.pathname === "/tenants" || url.pathname === "/tenants/") {
    res.writeHead(301, { Location: "/portfolio" });
    res.end();
    return;
  }
  if (url.pathname.endsWith(".html")) {
    const cleanPath = url.pathname === "/index.html" ? "/" : url.pathname.replace(/\.html$/, "");
    res.writeHead(301, { Location: `${cleanPath}${url.search}` });
    res.end();
    return;
  }
  const requestedPath = decodeURIComponent(url.pathname);
  const propertyRoute = requestedPath.match(/^\/(?:property|portfolio)\/[^/]+\/?$/);
  const routePath = propertyRoute ? "property.html" : (requestedPath === "/" ? "index.html" : (path.extname(requestedPath) ? requestedPath : `${requestedPath}.html`));
  const filePath = path.normalize(path.join(root, routePath));
  if (!filePath.startsWith(root)) { res.writeHead(403); res.end("Forbidden"); return; }
  fs.readFile(filePath, (error, data) => {
    if (error) { fs.readFile(path.join(root, "404.html"), (notFoundError, notFoundData) => { res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" }); res.end(notFoundError ? "Not found" : notFoundData); }); return; }
    const extension = path.extname(filePath);
    const headers = { "Content-Type": types[extension] || "application/octet-stream" };
    if ([".html", ".css", ".js"].includes(extension)) headers["Cache-Control"] = "no-store";
    res.writeHead(200, headers); res.end(data);
  });
});
server.listen(port, () => {
  console.log(`Ponasa preview running at http://localhost:${port}`);
});
