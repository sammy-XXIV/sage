export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const syms = ['TSLA', 'AMZN', 'NFLX', 'PLTR', 'AMD'];
  const result = {};

  await Promise.all(syms.map(async sym => {
    try {
      const r = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${sym}?interval=1d&range=1d`,
        { headers: { 'User-Agent': 'Mozilla/5.0' } }
      );
      const data = await r.json();
      const meta = data?.chart?.result?.[0]?.meta;
      result[sym] = { price: meta?.regularMarketPrice, prev: meta?.chartPreviousClose };
    } catch {
      result[sym] = null;
    }
  }));

  res.status(200).json(result);
}
