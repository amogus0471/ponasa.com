const http = require("http");
const fs = require("fs");
const path = require("path");
const port = 8000;
const root = __dirname;
const envPath = path.join(root, ".env.local");
const env = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8").split(/\r?\n/).reduce((values, line) => { const match = line.match(/^([^#=]+)=(.*)$/); if (match) values[match[1].trim()] = match[2].trim(); return values; }, {}) : {};
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml", ".ico": "image/x-icon" };
const marketCache = new Map();
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const getJson = async (params, apiKey) => {
  const url = new URL("https://www.alphavantage.co/query");
  Object.entries({ ...params, apikey: apiKey }).forEach(([key, value]) => url.searchParams.set(key, value));
  const response = await fetch(url);
  return response.json();
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

const sendMarketData = async (res, symbols) => {
  const apiKey = env.ALPHA_VANTAGE_API_KEY || process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) { res.writeHead(503, { "Content-Type": types[".json"] }); res.end(JSON.stringify({ error: "Market data is not configured" })); return; }
  const data = {};
  const requestedSymbols = [...new Set(symbols.map((symbol) => symbol.trim().toUpperCase()).filter(Boolean))].slice(0, 5);
  for (let index = 0; index < requestedSymbols.length; index += 1) {
    const symbol = requestedSymbols[index];
    const cached = marketCache.get(symbol);
    if (cached && Date.now() - cached.fetchedAt < 300000) { data[symbol] = cached.quote; continue; }
    try {
      if (index > 0) await wait(1250);
      data[symbol] = await fetchMarketQuote(symbol, apiKey);
      if (data[symbol].price !== null) marketCache.set(symbol, { fetchedAt: Date.now(), quote: data[symbol] });
    } catch {
      data[symbol] = { price: null, change: null };
    }
  }
  res.writeHead(200, { "Content-Type": types[".json"], "Cache-Control": "public, max-age=300" });
  res.end(JSON.stringify(data));
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  if (url.pathname === "/api/market") { await sendMarketData(res, (url.searchParams.get("symbols") || "JPM,BAC,WFC,C,GS").split(",")); return; }
  const requestedPath = decodeURIComponent(url.pathname);
  const filePath = path.normalize(path.join(root, requestedPath === "/" ? "index.html" : requestedPath));
  if (!filePath.startsWith(root)) { res.writeHead(403); res.end("Forbidden"); return; }
  fs.readFile(filePath, (error, data) => {
    if (error) { fs.readFile(path.join(root, "404.html"), (notFoundError, notFoundData) => { res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" }); res.end(notFoundError ? "Not found" : notFoundData); }); return; }
    res.writeHead(200, { "Content-Type": types[path.extname(filePath)] || "application/octet-stream" }); res.end(data);
  });
});
server.listen(port, () => console.log(`Ponasa preview running at http://localhost:${port}`));
