// src/services/api.js
// ─────────────────────────────────────────────
// PADRÃO: Singleton + Module Pattern
//
// Por que Singleton?
//   Uma única instância do Axios com config do
//   Back4App. Nenhum arquivo hardcoda URL ou
//   headers — tudo passa por aqui.
//
// Por que Module Pattern (IIFE)?
//   Encapsula o estado interno (_instance, token)
//   sem poluir o escopo global.
// ─────────────────────────────────────────────

import axios from 'axios'
import { CONFIG } from './config.js'

// ══════════════════════════════════════════
//  SESSION SERVICE
//  Facade sobre localStorage — interface simples
//  para operações de sessão/autenticação.
// ══════════════════════════════════════════
export const SessionService = {
  save(data) {
    localStorage.setItem(CONFIG.STORAGE.SESSION, JSON.stringify(data))
  },

  get() {
    try {
      return JSON.parse(localStorage.getItem(CONFIG.STORAGE.SESSION))
    } catch {
      return null
    }
  },

  clear() {
    localStorage.removeItem(CONFIG.STORAGE.SESSION)
  },

  isLoggedIn() {
    return !!this.get()?.token
  },

  isAdmin() {
    return this.get()?.role === 'admin'
  },
}

// ══════════════════════════════════════════
//  API SERVICE — Singleton
// ══════════════════════════════════════════
export const ApiService = (() => {
  let _instance = null   // ← Singleton: criado apenas uma vez

  function _createInstance() {
    return axios.create({
      baseURL: CONFIG.BACK4APP.BASE_URL,
      headers: {
        'X-Parse-Application-Id':  CONFIG.BACK4APP.APP_ID,
        'X-Parse-JavaScript-Key':  CONFIG.BACK4APP.JS_KEY,
        'Content-Type':            'application/json',
      },
    })
  }

  function _getInstance() {
    if (!_instance) {
      _instance = _createInstance()
      _setupInterceptors(_instance)
    }
    return _instance
  }

  // Interceptors: injetam o session token do Back4App
  // automaticamente em toda requisição autenticada.
  // Equivale ao Bearer token do JWT tradicional.
  function _setupInterceptors(instance) {
    // REQUEST: adiciona token se existir
    instance.interceptors.request.use((config) => {
      const session = SessionService.get()
      if (session?.token) {
        config.headers['X-Parse-Session-Token'] = session.token
      }
      return config
    })

    // RESPONSE: trata erros globais
    instance.interceptors.response.use(
      (res) => res,
      (err) => {
        // Código 209 = Invalid session token (token expirado)
        if (err.response?.status === 209) {
          SessionService.clear()
          window.location.href = '/src/pages/login.html'
        }
        return Promise.reject(err)
      }
    )
  }

  return {
    get:    (url, cfg) => _getInstance().get(url, cfg),
    post:   (url, data, cfg) => _getInstance().post(url, data, cfg),
    put:    (url, data, cfg) => _getInstance().put(url, data, cfg),
    delete: (url, cfg) => _getInstance().delete(url, cfg),
  }
})()

// ══════════════════════════════════════════
//  AUTH SERVICE
// ══════════════════════════════════════════
export const AuthService = {
  async login(username, password) {
    // Back4App usa o campo "username" para autenticar.
    // Tenta primeiro com o valor passado, depois extrai só a parte local do email
    // para cobrir casos onde o username foi salvo diferente.
    let res
    try {
      res = await ApiService.get('/login', {
        params: { username, password },
      })
    } catch (firstErr) {
      // Se falhou e o valor parece um email, tenta com a parte antes do @
      if (username.includes('@')) {
        const localPart = username.split('@')[0]
        try {
          res = await ApiService.get('/login', {
            params: { username: localPart, password },
          })
        } catch {
          throw firstErr // lança o erro original
        }
      } else {
        throw firstErr
      }
    }
    const user = res.data

    // Busca role ANTES de salvar sessão, com token explícito
    let role = 'customer'
    try {
      const meRes = await ApiService.get('/users/me', {
        headers: { 'X-Parse-Session-Token': user.sessionToken }
      })
      role = meRes.data.role || user.role || 'customer'
    } catch {
      role = user.role || 'customer'
    }

    // Salva sessão SÓ DEPOIS de ter o role correto
    SessionService.save({
      token:    user.sessionToken,
      userId:   user.objectId,
      username: user.username,
      name:     user.name || username,
      role,
      avatar:   user.avatar || null,
    })

    return { ...user, role }
  },

  async logout() {
    try {
      await ApiService.post('/logout')
    } finally {
      SessionService.clear()
    }
  },

  async register({ name, email, password }) {
    const res = await ApiService.post('/users', {
      username: email,
      password,
      email,
      name,
      role: 'customer',
    })
    return res.data
  },

  // Atualiza dados do perfil no Back4App
  async updateProfile({ name, phone, avatar }) {
    const session = SessionService.get()
    if (!session?.userId) throw new Error('Não autenticado')

    const payload = {}
    if (name  !== undefined) payload.name  = name
    if (phone !== undefined) payload.phone = phone
    if (avatar !== undefined) payload.avatar = avatar

    await ApiService.put(`/users/${session.userId}`, payload)

    // Atualiza sessão local
    SessionService.save({ ...session, name: name ?? session.name, avatar: avatar ?? session.avatar })
    return true
  },

  // Troca senha
  async changePassword(oldPassword, newPassword) {
    const session = SessionService.get()
    // Back4App: re-login para verificar senha antiga, depois atualiza
    await ApiService.get('/login', { params: { username: session.username, password: oldPassword } })
    await ApiService.put(`/users/${session.userId}`, { password: newPassword })
    return true
  },

  // Guards de rota
  requireAuth() {
    if (!SessionService.isLoggedIn()) {
      window.location.href = '/src/pages/login.html'
    }
  },

  requireAdmin() {
    // Sem sessão → manda pro login admin
    if (!SessionService.isLoggedIn()) {
      window.location.replace('/admin/index.html')
      return false
    }
    // Tem sessão mas não é admin → manda pra loja
    if (!SessionService.isAdmin()) {
      window.location.replace('/')
      return false
    }
    return true
  },
}

// ══════════════════════════════════════════
//  PRODUCT SERVICE
// ══════════════════════════════════════════
export const ProductService = {
  CLASS: `/classes/${CONFIG.CLASSES.PRODUCT}`,

  async getAll(filters = {}) {
    const params = { order: 'name', limit: 100 }

    const where = {}
    if (filters.category && filters.category !== 'all') {
      where.category = filters.category
    }
    if (filters.featured) {
      where.featured = true
    }
    if (Object.keys(where).length) {
      params.where = JSON.stringify(where)
    }

    const res = await ApiService.get(this.CLASS, { params })
    return res.data.results
  },

  async getById(id) {
    const res = await ApiService.get(`${this.CLASS}/${id}`)
    return res.data
  },

  async create(data) {
    const res = await ApiService.post(this.CLASS, data)
    return res.data
  },

  async update(id, data) {
    const res = await ApiService.put(`${this.CLASS}/${id}`, data)
    return res.data
  },

  async delete(id) {
    const res = await ApiService.delete(`${this.CLASS}/${id}`)
    return res.data
  },
}

// ══════════════════════════════════════════
//  ORDER SERVICE
// ══════════════════════════════════════════
export const OrderService = {
  CLASS: `/classes/${CONFIG.CLASSES.ORDER}`,

  async getAll() {
    const res = await ApiService.get(this.CLASS, {
      params: { order: '-createdAt', limit: 100 },
    })
    return res.data.results
  },

  async create(items, total) {
    const session = SessionService.get()
    const res = await ApiService.post(this.CLASS, {
      items,
      total,
      status:       'pending',
      customerId:   session?.userId   || 'guest',
      customerName: session?.name     || 'Visitante',
    })
    return res.data
  },

  async updateStatus(id, status) {
    const res = await ApiService.put(`${this.CLASS}/${id}`, { status })
    return res.data
  },
}
