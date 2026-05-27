import { createContext, useContext, useMemo, useState } from 'react'
import { loginUser, registerUser } from '../services/api'

const SESSION_KEY = 'finlearn-auth-session'
const LEGACY_USER_KEY = 'finlearn-auth-user'
const AuthContext = createContext(null)

function readSession() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY))
    if (session?.user) return session

    const legacyUser = JSON.parse(localStorage.getItem(LEGACY_USER_KEY))
    if (legacyUser) return { user: legacyUser, token: null, source: 'legacy-local' }
    return null
  } catch {
    return null
  }
}

function getDashboardPath(role) {
  if (role === 'superadmin') return '/admin/dashboard'
  if (role === 'mentor') return '/mentor/dashboard'
  return '/student/dashboard'
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession)
  const user = session?.user || null
  const [authSource, setAuthSource] = useState(session?.source || '')

  async function login(credentials) {
    const result = await loginUser(credentials)
    const nextSession = {
      user: result.user,
      token: result.token || null,
      source: result.source,
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession))
    localStorage.removeItem(LEGACY_USER_KEY)
    setSession(nextSession)
    setAuthSource(result.source)
    return result.user
  }

  async function register(payload) {
    const result = await registerUser(payload)
    if (result.token && result.user?.status === 'approved') {
      const nextSession = {
        user: result.user,
        token: result.token,
        source: result.source,
      }
      localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession))
      localStorage.removeItem(LEGACY_USER_KEY)
      setSession(nextSession)
      setAuthSource(result.source)
    }
    return result.user
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY)
    localStorage.removeItem(LEGACY_USER_KEY)
    setSession(null)
    setAuthSource('')
  }

  const value = useMemo(() => ({
    user,
    authSource,
    login,
    register,
    logout,
    isAuthenticated: Boolean(user),
    dashboardPath: user ? getDashboardPath(user.role) : '/login',
  }), [authSource, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}

export { getDashboardPath }
