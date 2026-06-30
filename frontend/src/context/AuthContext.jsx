import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount, if a token exists, verify it against the real backend and
  // load the real user — never fabricate a user from localStorage alone.
  useEffect(() => {
    const token = localStorage.getItem('aangan_token')
    if (!token) {
      setLoading(false)
      return
    }
    authApi
      .me()
      .then((res) => setUser(res.data.user))
      .catch(() => {
        localStorage.removeItem('aangan_token')
        localStorage.removeItem('aangan_user')
      })
      .finally(() => setLoading(false))
  }, [])

  const applyAuth = useCallback((token, user) => {
    localStorage.setItem('aangan_token', token)
    localStorage.setItem('aangan_user', JSON.stringify(user))
    setUser(user)
  }, [])

  const adminSignup = useCallback(
    async (data) => {
      const res = await authApi.adminSignup(data)
      applyAuth(res.data.token, res.data.user)
      return res.data.user
    },
    [applyAuth]
  )

  const residentSignup = useCallback(
    async (data) => {
      const res = await authApi.residentSignup(data)
      applyAuth(res.data.token, res.data.user)
      return res.data.user
    },
    [applyAuth]
  )

  const login = useCallback(
    async (data) => {
      const res = await authApi.login(data)
      applyAuth(res.data.token, res.data.user)
      return res.data.user
    },
    [applyAuth]
  )

  const logout = useCallback(() => {
    localStorage.removeItem('aangan_token')
    localStorage.removeItem('aangan_user')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, adminSignup, residentSignup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
