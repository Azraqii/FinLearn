import axios from 'axios'

// VITE_API_URL: full backend URL for production (e.g. https://api.finlearn.stei.cloud)
// Leave empty in dev — Vite proxy forwards /api/* to localhost:3000
const API_BASE_URL = import.meta.env.VITE_API_URL || ''

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

const LOCAL_SCORE_KEY = 'finlearn-local-scores'

function readLocalScores() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_SCORE_KEY)) || []
  } catch {
    return []
  }
}

function writeLocalScore(scorePayload) {
  const currentScores = readLocalScores()
  const newScore = {
    id: Date.now(),
    name: scorePayload.name,
    topic: scorePayload.topic,
    score: scorePayload.score,
    created_at: new Date().toISOString(),
  }

  localStorage.setItem(LOCAL_SCORE_KEY, JSON.stringify([newScore, ...currentScores]))

  return newScore
}

export async function getCurrencyRates() {
  try {
    const response = await api.get('/api/currency/rates')
    // Backend returns { fiat: { IDR, SGD, MYR, JPY }, crypto: { bitcoin, ethereum }, updated_at }
    return { ...response.data, source: 'backend' }
  } catch (backendError) {
    console.warn('Backend currency endpoint unavailable. Using CoinGecko fallback.', backendError)

    // Same CoinGecko endpoint the backend uses — usd-coin is realtime USD proxy
    const fallbackUrl = import.meta.env.VITE_EXCHANGE_API_URL
    const response = await axios.get(fallbackUrl, { timeout: 10000 })
    const data = response.data

    return {
      fiat: {
        IDR: data['usd-coin']?.idr,
        SGD: data['usd-coin']?.sgd,
        MYR: data['usd-coin']?.myr,
        JPY: data['usd-coin']?.jpy,
      },
      crypto: data.bitcoin ? {
        bitcoin:  { usd: data.bitcoin.usd,  idr: data.bitcoin.idr  },
        ethereum: { usd: data.ethereum.usd, idr: data.ethereum.idr },
      } : null,
      updated_at: new Date().toISOString(),
      source: 'fallback-public-api',
    }
  }
}

export async function submitQuizScore(scorePayload) {
  try {
    const response = await api.post('/api/quiz/submit', scorePayload)
    return {
      ...response.data,
      offline: false,
    }
  } catch (error) {
    console.warn('Backend quiz submit unavailable. Saving score locally for frontend demo.', error)
    const localScore = writeLocalScore(scorePayload)

    return {
      success: true,
      offline: true,
      id: localScore.id,
    }
  }
}

export async function getLeaderboard(topic = 'all') {
  try {
    // Backend uses query param: GET /api/quiz/leaderboard?topic=budgeting
    const endpoint = topic === 'all' ? '/api/quiz/leaderboard' : `/api/quiz/leaderboard?topic=${topic}`
    const response = await api.get(endpoint)

    return {
      data: response.data,
      source: 'backend',
    }
  } catch (error) {
    console.warn('Backend leaderboard unavailable. Reading local demo scores.', error)

    const localScores = readLocalScores()
    const filteredScores = topic === 'all' ? localScores : localScores.filter((score) => score.topic === topic)

    return {
      data: filteredScores,
      source: 'local-demo',
    }
  }
}

export default api