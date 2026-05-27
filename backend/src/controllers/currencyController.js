const axios = require('axios');

// Single CoinGecko endpoint — usd-coin (USDC) serves as realtime USD proxy for fiat rates
const COINGECKO_API_URL = process.env.COINGECKO_API_URL
  || 'https://api.coingecko.com/api/v3/simple/price?ids=usd-coin,bitcoin,ethereum&vs_currencies=usd,idr,sgd,myr,jpy';

// Single in-memory cache for all rate data
const cache = { data: null, fetchedAt: null };
const ONE_HOUR_MS = 60 * 60 * 1000;

function isStale() {
  return !cache.fetchedAt || Date.now() - cache.fetchedAt > ONE_HOUR_MS;
}

async function fetchAllRates() {
  if (!isStale()) return cache.data;

  const { data } = await axios.get(COINGECKO_API_URL, { timeout: 8000 });

  // usd-coin (USDC) is pegged 1:1 to USD — use it as realtime USD/fiat source
  const usdc = data['usd-coin'];
  cache.data = {
    fiat: {
      IDR: usdc.idr,
      SGD: usdc.sgd,
      MYR: usdc.myr,
      JPY: usdc.jpy,
    },
    crypto: {
      bitcoin:  { usd: data.bitcoin.usd,  idr: data.bitcoin.idr  },
      ethereum: { usd: data.ethereum.usd, idr: data.ethereum.idr },
    },
  };
  cache.fetchedAt = Date.now();
  return cache.data;
}

// GET /api/currency/rates
async function getRates(req, res) {
  try {
    const rates = await fetchAllRates();
    return res.json({
      ...rates,
      updated_at: new Date(cache.fetchedAt).toISOString(),
    });
  } catch (err) {
    console.error('[currencyController.getRates]', err);
    return res.status(502).json({ error: 'Failed to fetch currency rates' });
  }
}

module.exports = { getRates };
