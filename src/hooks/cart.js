// src/hooks/cart.js
// ─────────────────────────────────────────────
// PADRÃO: Observer Pattern
//
// O carrinho é um "Subject" que mantém uma lista
// de "Observers" (funções). Quando o estado muda,
// todos os observers são notificados automaticamente.
//
// Quem usa: navbar badge, drawer, checkout.
// Nenhum deles precisa "puxar" o estado —
// eles se inscrevem e recebem as atualizações.
// ─────────────────────────────────────────────

import { CONFIG } from '../services/config.js'

export const CartService = (() => {
  const KEY = CONFIG.STORAGE.CART

  let _items = _load()
  let _observers = []   // Lista de funções inscritas

  function _load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || [] }
    catch { return [] }
  }

  function _save() {
    localStorage.setItem(KEY, JSON.stringify(_items))
  }

  // Notifica TODOS os observers com o estado atual
  function _notify() {
    _save()
    const state = _getState()
    _observers.forEach(fn => fn(state))
  }

  function _getState() {
    return {
      items: [..._items],
      count: _items.reduce((a, i) => a + i.qty, 0),
      total: _items.reduce((a, i) => a + i.price * i.qty, 0),
    }
  }

  return {
    // Inscreve um observer — retorna função de cancelamento
    subscribe(fn) {
      _observers.push(fn)
      fn(_getState())   // dispara imediatamente com estado atual
      return () => { _observers = _observers.filter(o => o !== fn) }
    },

    add(product) {
      const existing = _items.find(i => i.id === product.id)
      if (existing) existing.qty++
      else _items.push({ ...product, qty: 1 })
      _notify()
    },

    remove(id) {
      _items = _items.filter(i => i.id !== id)
      _notify()
    },

    updateQty(id, qty) {
      if (qty <= 0) { this.remove(id); return }
      const item = _items.find(i => i.id === id)
      if (item) { item.qty = qty; _notify() }
    },

    clear()    { _items = []; _notify() },
    getItems() { return [..._items] },
    getCount() { return _items.reduce((a,i) => a + i.qty, 0) },
    getTotal() { return _items.reduce((a,i) => a + i.price * i.qty, 0) },
    isEmpty()  { return _items.length === 0 },
  }
})()
