// src/hooks/useToast.js
// ─────────────────────────────────────────────
// Versão React do Toast do ui.js original.
// Usa useState para manter a lista de toasts
// e cleanup automático via useEffect.
// ─────────────────────────────────────────────

import { useState, useCallback } from 'react'

let _idCounter = 0

export function useToast() {
  const [toasts, setToasts] = useState([])

  const show = useCallback((message, type = 'info', duration = 3500) => {
    const id = ++_idCounter
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)
  }, [])

  return {
    toasts,
    success: (msg) => show(msg, 'success'),
    error:   (msg) => show(msg, 'error'),
    info:    (msg) => show(msg, 'info'),
  }
}
