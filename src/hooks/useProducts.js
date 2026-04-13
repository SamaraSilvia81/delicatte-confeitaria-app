// src/hooks/useProducts.js
// ─────────────────────────────────────────────
// Hook customizado = função que usa outros hooks
// do React para encapsular lógica reutilizável.
//
// Antes: loadProducts() era uma função solta no
// HTML que manipulava o DOM diretamente.
//
// Agora: useProducts() devolve { products, loading,
// error } e o componente decide o que renderizar.
// ─────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { ProductService } from '../services/api.js'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  useEffect(() => {
    let cancelled = false // evita atualizar estado em componente desmontado

    async function fetchProducts() {
      try {
        setLoading(true)
        const data = await ProductService.getAll()
        if (!cancelled) setProducts(data)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchProducts()
    return () => { cancelled = true }
  }, []) // [] = roda só uma vez, ao montar o componente

  return { products, loading, error }
}
