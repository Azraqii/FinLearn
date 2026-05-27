import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || ''

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

const LOCAL_SCORE_KEY = 'finlearn-local-scores'
const LOCAL_USERS_KEY = 'finlearn-local-users'
const LOCAL_MATERIALS_KEY = 'finlearn-local-materials'
const LOCAL_CHALLENGES_KEY = 'finlearn-local-challenges'
const LOCAL_SUBMISSIONS_KEY = 'finlearn-local-submissions'
const AUTH_SESSION_KEY = 'finlearn-auth-session'

const FRONTEND_TO_BACKEND_TOPIC = {
  'compound-interest': 'compound',
}

const BACKEND_TO_FRONTEND_TOPIC = {
  compound: 'compound-interest',
}

const defaultUsers = [
  {
    id: 'admin-demo',
    name: 'Admin FinLearn',
    email: 'admin@finlearn.local',
    password: 'Finlearn123!',
    role: 'superadmin',
    status: 'approved',
    created_at: new Date().toISOString(),
  },
  {
    id: 'mentor-demo',
    name: 'Mentor FinLearn',
    email: 'mentor@finlearn.local',
    password: 'Finlearn123!',
    role: 'mentor',
    status: 'approved',
    created_at: new Date().toISOString(),
  },
  {
    id: 'student-demo',
    name: 'Student FinLearn',
    email: 'student@finlearn.local',
    password: 'Finlearn123!',
    role: 'student',
    status: 'approved',
    created_at: new Date().toISOString(),
  },
]

const defaultMaterials = [
  {
    id: 'material-budgeting',
    title: 'Budgeting untuk Pelajar',
    summary: 'Cara membagi uang saku, kebutuhan, keinginan, dan tabungan dengan metode sederhana.',
    content: 'Mulai dari mencatat pemasukan, memisahkan kebutuhan dan keinginan, lalu evaluasi pengeluaran setiap minggu.',
    thumbnail: '',
    author: 'Mentor FinLearn',
    created_at: new Date().toISOString(),
  },
  {
    id: 'material-inflasi',
    title: 'Memahami Inflasi',
    summary: 'Kenapa harga naik dan bagaimana dampaknya terhadap daya beli harian.',
    content: 'Inflasi membuat uang yang sama membeli lebih sedikit barang. Budget perlu diperbarui saat harga kebutuhan berubah.',
    thumbnail: '',
    author: 'Mentor FinLearn',
    created_at: new Date().toISOString(),
  },
]

const defaultChallenges = [
  {
    id: 'challenge-budget-week',
    title: 'Catatan Pengeluaran 7 Hari',
    description: 'Catat semua pengeluaran selama satu minggu, lalu tulis tiga pola pengeluaran yang kamu temukan.',
    dueDate: '',
    created_at: new Date().toISOString(),
  },
]

function readJson(key, fallback) {
  try {
    const stored = JSON.parse(localStorage.getItem(key))
    return stored || fallback
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
  return value
}

function readLocalScores() {
  return readJson(LOCAL_SCORE_KEY, [])
}

function toBackendTopic(topic) {
  return FRONTEND_TO_BACKEND_TOPIC[topic] || topic
}

function toFrontendTopic(topic) {
  return BACKEND_TO_FRONTEND_TOPIC[topic] || topic
}

function normalizeScore(score) {
  return {
    ...score,
    topic: toFrontendTopic(score.topic),
  }
}

function writeLocalScore(scorePayload) {
  const currentScores = readLocalScores()
  const newScore = {
    id: Date.now(),
    name: scorePayload.name,
    email: scorePayload.email || '',
    topic: scorePayload.topic,
    score: scorePayload.score,
    created_at: new Date().toISOString(),
  }

  localStorage.setItem(LOCAL_SCORE_KEY, JSON.stringify([newScore, ...currentScores]))

  return newScore
}

function ensureLocalUsers() {
  const users = readJson(LOCAL_USERS_KEY, null)
  if (Array.isArray(users) && users.length > 0) return users
  return writeJson(LOCAL_USERS_KEY, defaultUsers)
}

function publicUser(user) {
  if (!user) return null
  const { password, ...safeUser } = user
  return safeUser
}

function ensureLocalMaterials() {
  const materials = readJson(LOCAL_MATERIALS_KEY, null)
  if (Array.isArray(materials)) return materials
  return writeJson(LOCAL_MATERIALS_KEY, defaultMaterials)
}

function ensureLocalChallenges() {
  const challenges = readJson(LOCAL_CHALLENGES_KEY, null)
  if (Array.isArray(challenges)) return challenges
  return writeJson(LOCAL_CHALLENGES_KEY, defaultChallenges)
}

function readLocalSubmissions() {
  return readJson(LOCAL_SUBMISSIONS_KEY, [])
}

function readAuthSession() {
  return readJson(AUTH_SESSION_KEY, null)
}

function currentUser() {
  return readAuthSession()?.user || null
}

api.interceptors.request.use((config) => {
  const token = readAuthSession()?.token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

function apiErrorMessage(error, fallback) {
  return error?.response?.data?.error || error?.response?.data?.message || error?.message || fallback
}

function shouldUseLocalFallback(error) {
  return !error.response
}

function normalizeRole(role) {
  return role === 'admin' ? 'superadmin' : role
}

function normalizeUser(user) {
  return user ? { ...user, role: normalizeRole(user.role) } : user
}

function normalizeMaterial(material) {
  return {
    ...material,
    author: material.author || material.mentor_name || 'FinLearn',
    thumbnail: material.thumbnail || material.thumbnail_path || '',
    created_at: material.created_at || new Date().toISOString(),
  }
}

function normalizeChallenge(challenge) {
  return {
    ...challenge,
    dueDate: challenge.dueDate || challenge.due_at || '',
    mentorName: challenge.mentorName || challenge.mentor_name || 'Mentor FinLearn',
    created_at: challenge.created_at || new Date().toISOString(),
  }
}

function normalizeSubmission(submission) {
  return {
    ...submission,
    challengeId: submission.challengeId || submission.challenge_id,
    challengeTitle: submission.challengeTitle || submission.challenge_title || 'Challenge',
    studentName: submission.studentName || submission.student_name || '',
    studentEmail: submission.studentEmail || submission.student_email || '',
    text: submission.text || submission.answer_text || '',
    fileName: submission.fileName || submission.attachment_path || '',
    feedback: submission.feedback || submission.feedback_text || '',
    submitted_at: submission.submitted_at || submission.created_at || new Date().toISOString(),
  }
}

function formDataFromObject(payload, fileFields = {}) {
  const formData = new FormData()
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || fileFields[key]) return
    formData.append(key, value)
  })
  Object.entries(fileFields).forEach(([key, value]) => {
    if (value instanceof File) formData.append(key, value)
  })
  return formData
}

export async function loginUser(credentials) {
  try {
    const response = await api.post('/api/auth/login', credentials)
    return {
      user: normalizeUser(response.data.user || response.data),
      token: response.data.token || null,
      source: 'backend',
    }
  } catch (error) {
    if (!shouldUseLocalFallback(error)) {
      throw new Error(apiErrorMessage(error, 'Login gagal. Coba lagi.'))
    }
    console.warn('Backend login unavailable. Using local auth fallback.', error)
    const users = ensureLocalUsers()
    const user = users.find((item) => item.email === credentials.email && item.password === credentials.password)

    if (!user) {
      throw new Error('Email atau password tidak sesuai.')
    }

    if (user.status !== 'approved') {
      throw new Error('Akun kamu masih menunggu persetujuan admin.')
    }

    return { user: normalizeUser(publicUser(user)), token: null, source: 'local-demo' }
  }
}

export async function registerUser(payload) {
  try {
    const response = await api.post('/api/auth/register', payload)
    return {
      user: normalizeUser(response.data.user || response.data),
      token: response.data.token || null,
      source: 'backend',
    }
  } catch (error) {
    if (!shouldUseLocalFallback(error)) {
      throw new Error(apiErrorMessage(error, 'Registrasi gagal. Coba lagi.'))
    }
    console.warn('Backend register unavailable. Saving local pending user.', error)
    const users = ensureLocalUsers()
    const exists = users.some((user) => user.email === payload.email)

    if (exists) {
      throw new Error('Email sudah terdaftar.')
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role: payload.role || 'student',
      status: 'pending',
      created_at: new Date().toISOString(),
    }

    writeJson(LOCAL_USERS_KEY, [newUser, ...users])
    return { user: normalizeUser(publicUser(newUser)), token: null, source: 'local-demo' }
  }
}

export async function getUsers() {
  try {
    const response = await api.get('/api/admin/users')
    return { data: response.data.map(normalizeUser), source: 'backend' }
  } catch (error) {
    if (!shouldUseLocalFallback(error)) throw new Error(apiErrorMessage(error, 'Gagal mengambil user.'))
    console.warn('Backend users unavailable. Reading local users.', error)
    return { data: ensureLocalUsers().map(publicUser).map(normalizeUser), source: 'local-demo' }
  }
}

export async function getPendingUsers() {
  const result = await getUsers()
  return {
    ...result,
    data: result.data.filter((user) => user.status === 'pending'),
  }
}

export async function updateUserStatus(userId, status) {
  try {
    const response = await api.patch(`/api/admin/users/${userId}/status`, { status })
    return { user: normalizeUser(response.data.user || response.data), source: 'backend' }
  } catch (error) {
    if (!shouldUseLocalFallback(error)) throw new Error(apiErrorMessage(error, 'Gagal mengubah status user.'))
    console.warn('Backend user status unavailable. Updating local user.', error)
    const users = ensureLocalUsers().map((user) => (
      user.id === userId ? { ...user, status } : user
    ))
    writeJson(LOCAL_USERS_KEY, users)
    return { user: normalizeUser(publicUser(users.find((user) => user.id === userId))), source: 'local-demo' }
  }
}

export async function updateUserRole(userId, role) {
  try {
    const response = await api.patch(`/api/admin/users/${userId}/role`, { role })
    return { user: normalizeUser(response.data.user || response.data), source: 'backend' }
  } catch (error) {
    if (!shouldUseLocalFallback(error)) throw new Error(apiErrorMessage(error, 'Gagal mengubah role user.'))
    console.warn('Backend user role unavailable. Updating local user.', error)
    const users = ensureLocalUsers().map((user) => (
      user.id === userId ? { ...user, role } : user
    ))
    writeJson(LOCAL_USERS_KEY, users)
    return { user: normalizeUser(publicUser(users.find((user) => user.id === userId))), source: 'local-demo' }
  }
}

export async function getMaterials() {
  try {
    const response = await api.get('/api/materials')
    return { data: response.data.map(normalizeMaterial), source: 'backend' }
  } catch (error) {
    console.warn('Backend materials unavailable. Reading local materials.', error)
    return { data: ensureLocalMaterials().map(normalizeMaterial), source: 'local-demo' }
  }
}

export async function getMaterial(idOrSlug) {
  try {
    const response = await api.get(`/api/materials/${idOrSlug}`)
    return { data: normalizeMaterial(response.data), source: 'backend' }
  } catch (error) {
    if (!shouldUseLocalFallback(error)) {
      throw new Error(apiErrorMessage(error, 'Gagal mengambil materi.'))
    }
    const material = ensureLocalMaterials()
      .map(normalizeMaterial)
      .find((item) => String(item.slug || item.id) === String(idOrSlug))
    if (!material) throw new Error('Materi tidak ditemukan.')
    return { data: material, source: 'local-demo' }
  }
}

export async function saveMaterial(payload) {
  try {
    const backendPayload = {
      title: payload.title,
      topic: payload.topic || 'budgeting',
      summary: payload.summary,
      content: payload.content,
      status: payload.status || 'published',
    }
    const body = formDataFromObject(backendPayload, { thumbnail: payload.thumbnailFile })
    const response = payload.id
      ? await api.patch(`/api/materials/${payload.id}`, body)
      : await api.post('/api/materials', body)
    return {
      data: normalizeMaterial({
        ...payload,
        ...response.data,
        mentor_name: currentUser()?.name,
        status: backendPayload.status,
      }),
      source: 'backend',
    }
  } catch (error) {
    if (!shouldUseLocalFallback(error)) {
      throw new Error(apiErrorMessage(error, 'Gagal menyimpan materi.'))
    }
    console.warn('Backend material save unavailable. Saving local material.', error)
    const materials = ensureLocalMaterials()
    const { thumbnailFile, ...localPayload } = payload
    const material = {
      ...localPayload,
      id: payload.id || `material-${Date.now()}`,
      created_at: payload.created_at || new Date().toISOString(),
    }
    const nextMaterials = payload.id
      ? materials.map((item) => (item.id === payload.id ? material : item))
      : [material, ...materials]

    writeJson(LOCAL_MATERIALS_KEY, nextMaterials)
    return { data: material, source: 'local-demo' }
  }
}

export async function getChallenges() {
  try {
    const response = await api.get('/api/challenges')
    return { data: response.data.map(normalizeChallenge), source: 'backend' }
  } catch (error) {
    console.warn('Backend challenges unavailable. Reading local challenges.', error)
    return { data: ensureLocalChallenges().map(normalizeChallenge), source: 'local-demo' }
  }
}

export async function saveChallenge(payload) {
  try {
    const backendPayload = {
      title: payload.title,
      description: payload.description,
      due_at: payload.dueDate || payload.due_at || '',
      status: payload.status || 'published',
    }
    const body = formDataFromObject(backendPayload, { attachment: payload.attachmentFile })
    const response = payload.id
      ? await api.patch(`/api/challenges/${payload.id}`, body)
      : await api.post('/api/challenges', body)
    return {
      data: normalizeChallenge({
        ...payload,
        ...response.data,
        mentor_name: currentUser()?.name,
        status: backendPayload.status,
      }),
      source: 'backend',
    }
  } catch (error) {
    console.warn('Backend challenge save unavailable. Saving local challenge.', error)
    const challenges = ensureLocalChallenges()
    const { attachmentFile, ...localPayload } = payload
    const challenge = {
      ...localPayload,
      id: `challenge-${Date.now()}`,
      created_at: new Date().toISOString(),
    }

    writeJson(LOCAL_CHALLENGES_KEY, [challenge, ...challenges])
    return { data: challenge, source: 'local-demo' }
  }
}

export async function getSubmissions() {
  try {
    const user = currentUser()
    if (user?.role === 'student') {
      const response = await api.get('/api/submissions/mine')
      return { data: response.data.map(normalizeSubmission), source: 'backend' }
    }

    const challengesResult = await getChallenges()
    const submissionLists = await Promise.all(
      challengesResult.data.map((challenge) =>
        api.get(`/api/challenges/${challenge.id}/submissions`)
          .then((response) => response.data.map((submission) => ({
            ...submission,
            challenge_title: challenge.title,
          })))
          .catch(() => []),
      ),
    )
    return { data: submissionLists.flat().map(normalizeSubmission), source: 'backend' }
  } catch (error) {
    console.warn('Backend submissions unavailable. Reading local submissions.', error)
    return { data: readLocalSubmissions(), source: 'local-demo' }
  }
}

export async function submitChallenge(payload) {
  try {
    const backendPayload = {
      answer_text: payload.text || payload.answer_text,
    }
    const body = formDataFromObject(backendPayload, { attachment: payload.attachmentFile })
    const response = await api.post(`/api/challenges/${payload.challengeId}/submissions`, body)
    return {
      data: normalizeSubmission({
        ...payload,
        ...response.data,
        answer_text: backendPayload.answer_text,
        status: 'submitted',
      }),
      source: 'backend',
    }
  } catch (error) {
    console.warn('Backend submission unavailable. Saving local submission.', error)
    const submissions = readLocalSubmissions()
    const { attachmentFile, ...localPayload } = payload
    const submission = {
      ...localPayload,
      id: `submission-${Date.now()}`,
      status: 'submitted',
      feedback: '',
      submitted_at: new Date().toISOString(),
    }

    writeJson(LOCAL_SUBMISSIONS_KEY, [submission, ...submissions])
    return { data: submission, source: 'local-demo' }
  }
}

export async function saveSubmissionFeedback(submissionId, feedback) {
  try {
    const response = await api.patch(`/api/submissions/${submissionId}/feedback`, {
      feedback_text: feedback,
      status: 'reviewed',
    })
    return {
      data: normalizeSubmission({
        ...response.data,
        id: submissionId,
        feedback_text: feedback,
        status: 'reviewed',
      }),
      source: 'backend',
    }
  } catch (error) {
    console.warn('Backend feedback unavailable. Saving local feedback.', error)
    const submissions = readLocalSubmissions().map((submission) => (
      submission.id === submissionId
        ? { ...submission, feedback, status: 'reviewed', reviewed_at: new Date().toISOString() }
        : submission
    ))
    writeJson(LOCAL_SUBMISSIONS_KEY, submissions)
    return { data: submissions.find((submission) => submission.id === submissionId), source: 'local-demo' }
  }
}

export async function getCurrencyRates() {
  try {
    const response = await api.get('/api/currency/rates')
    return { ...response.data, source: 'backend' }
  } catch (backendError) {
    console.warn('Backend currency endpoint unavailable. Using CoinGecko fallback.', backendError)

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
        bitcoin: { usd: data.bitcoin.usd, idr: data.bitcoin.idr },
        ethereum: { usd: data.ethereum.usd, idr: data.ethereum.idr },
      } : null,
      updated_at: new Date().toISOString(),
      source: 'fallback-public-api',
    }
  }
}

export async function submitQuizScore(scorePayload) {
  const backendPayload = {
    ...scorePayload,
    topic: toBackendTopic(scorePayload.topic),
  }

  try {
    const response = await api.post('/api/quiz/submit', backendPayload)
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
    const backendTopic = toBackendTopic(topic)
    const endpoint = topic === 'all' ? '/api/quiz/leaderboard' : `/api/quiz/leaderboard?topic=${backendTopic}`
    const response = await api.get(endpoint)

    return {
      data: response.data.map(normalizeScore),
      source: 'backend',
    }
  } catch (error) {
    console.warn('Backend leaderboard unavailable. Reading local demo scores.', error)

    const localScores = readLocalScores()
    const normalizedScores = localScores.map(normalizeScore)
    const filteredScores = topic === 'all'
      ? normalizedScores
      : normalizedScores.filter((score) => score.topic === topic)

    return {
      data: filteredScores,
      source: 'local-demo',
    }
  }
}

export default api
