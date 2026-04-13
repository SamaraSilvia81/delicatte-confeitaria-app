// src/context/ThemeContext.jsx
// ─────────────────────────────────────────────
// No HTML usávamos ThemeManager com localStorage
// e setAttribute no document. Em React, guardamos
// o estado no Context e o efeito (useEffect) cuida
// de sincronizar com o DOM.
// ─────────────────────────────────────────────

import { createContext, useContext, useState, useEffect } from 'react'
import { CONFIG } from '../services/config.js'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(CONFIG.STORAGE.THEME)
    if (saved) return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  // Aplica o tema no <html> sempre que mudar
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(CONFIG.STORAGE.THEME, theme)
  }, [theme])

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme deve ser usado dentro de <ThemeProvider>')
  return ctx
}
