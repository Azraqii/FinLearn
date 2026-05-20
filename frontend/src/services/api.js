import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

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
    return {
      ...response.data,
      source: 'backend',
    }
  } catch (backendError) {
    console.warn('Backend currency endpoint unavailable. Using public fallback API.', backendError)

    const response = await axios.get('https://open.er-api.com/v6/latest/USD', {
      timeout: 10000,
    })

    return {
      base: response.data.base_code || 'USD',
      rates: response.data.rates || {},
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
    const endpoint = topic === 'all' ? '/api/quiz/leaderboard' : `/api/quiz/leaderboard/${topic}`
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