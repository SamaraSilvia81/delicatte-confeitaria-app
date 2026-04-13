// src/context/AuthContext.jsx
// Estado global de autenticação — disponível em toda a app
import { createContext, useContext, useState, useCallback } from 'react'
import { SessionService } from '../services/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => SessionService.get())

  const refresh = useCallback(() => {
    setSession(SessionService.get())
  }, [])

  const logout = useCallback(async () => {
    try {
      const { AuthService } = await import('../services/api.js')
      await AuthService.logout()
    } catch {}
    setSession(null)
  }, [])

  return (
    <AuthContext.Provider value={{
      session,
      isLoggedIn: !!session?.token,
      isAdmin:    session?.role === 'admin',
      refresh,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  return ctx
}
