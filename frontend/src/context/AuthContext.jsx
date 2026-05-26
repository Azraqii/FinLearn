import { createContext, useContext, useMemo, useState } from 'react'
import { loginUser, registerUser } from '../services/api'

const SESSION_KEY = 'finlearn-auth-user'
const AuthContext = createContext(null)

function readSessionUser() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY))
  } catch {
    return null
  }
}

function getDashboardPath(role) {
  if (role === 'admin') return '/admin/dashboard'
  if (role === 'mentor') return '/mentor/dashboard'
  return '/student/dashboard'
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSessionUser)
  const [authSource, setAuthSource] = useState('')

  async function login(credentials) {
    const result = await loginUser(credentials)
    localStorage.setItem(SESSION_KEY, JSON.stringify(result.user))
    setUser(result.user)
    setAuthSource(result.source)
    return result.user
  }

  async function register(payload) {
    const result = await registerUser(payload)
    return result.user
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
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
