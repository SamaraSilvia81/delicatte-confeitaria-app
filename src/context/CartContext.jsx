// src/context/CartContext.jsx
import { createContext, useContext, useReducer, useEffect, useState } from 'react'
import { CONFIG } from '../services/config.js'

const initialState = { items: [] }

function loadFromStorage() {
  try {
    const saved = localStorage.getItem(CONFIG.STORAGE.CART)
    return saved ? { items: JSON.parse(saved) } : initialState
  } catch {
    return initialState
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find((i) => i.id === action.product.id)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i
          ),
        }
      }
      return { items: [...state.items, { ...action.product, qty: 1 }] }
    }
    case 'REMOVE':
      return { items: state.items.filter((i) => i.id !== action.id) }
    case 'UPDATE_QTY': {
      if (action.qty <= 0) {
        return { items: state.items.filter((i) => i.id !== action.id) }
      }
      return {
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, qty: action.qty } : i
        ),
      }
    }
    case 'CLEAR':
      return { items: [] }
    default:
      return state
  }
}

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadFromStorage)
  // ── Estado do drawer ────────────────────────
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(CONFIG.STORAGE.CART, JSON.stringify(state.items))
  }, [state.items])

  const count = state.items.reduce((a, i) => a + i.qty, 0)
  const total = state.items.reduce((a, i) => a + i.price * i.qty, 0)

  const value = {
    items:       state.items,
    count,
    total,
    add:         (product) => dispatch({ type: 'ADD', product }),
    remove:      (id)      => dispatch({ type: 'REMOVE', id }),
    updateQty:   (id, qty) => dispatch({ type: 'UPDATE_QTY', id, qty }),
    clear:       ()        => dispatch({ type: 'CLEAR' }),
    isEmpty:     state.items.length === 0,
    // drawer
    drawerOpen,
    openDrawer:  () => setDrawerOpen(true),
    closeDrawer: () => setDrawerOpen(false),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart deve ser usado dentro de <CartProvider>')
  return ctx
}
