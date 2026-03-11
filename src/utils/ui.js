// src/utils/ui.js
// ─────────────────────────────────────────────
// Funções utilitárias de interface.
// PADRÃO: Module Pattern
// ─────────────────────────────────────────────

import { CONFIG } from '../services/config.js'

// ══════════════════════════════════════════
//  TOAST — PADRÃO: Module Pattern
// ══════════════════════════════════════════
export const Toast = (() => {
  function _container() {
    let el = document.getElementById('toast-container')
    if (!el) {
      el = document.createElement('div')
      el.id = 'toast-container'
      document.body.appendChild(el)
    }
    return el
  }

  function show(message, type = 'info', duration = 3500) {
    const icons = { success:'ph-check-circle', error:'ph-warning-circle', info:'ph-info' }
    const toast = document.createElement('div')
    toast.className = `toast ${type}`
    toast.innerHTML = `
      <i class="ph ${icons[type] || icons.info}" style="font-size:1.1rem;flex-shrink:0;"></i>
      <span>${message}</span>
    `
    _container().appendChild(toast)
    setTimeout(() => {
      toast.classList.add('out')
      toast.addEventListener('animationend', () => toast.remove(), { once: true })
    }, duration)
  }

  return {
    success: (msg, d) => show(msg, 'success', d),
    error:   (msg, d) => show(msg, 'error',   d),
    info:    (msg, d) => show(msg, 'info',     d),
  }
})()

// ══════════════════════════════════════════
//  THEME MANAGER — dark / light toggle
// ══════════════════════════════════════════
export const ThemeManager = (() => {
  const KEY = CONFIG.STORAGE.THEME

  function _apply(theme) {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(KEY, theme)
    document.querySelectorAll('[data-theme-icon]').forEach(el => {
      el.className = el.className.replace(/ph-sun|ph-moon/, '')
        + (theme === 'dark' ? ' ph-sun' : ' ph-moon')
    })
  }

  return {
    init() {
      const saved = localStorage.getItem(KEY)
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      _apply(saved || (prefersDark ? 'dark' : 'light'))
    },
    toggle() {
      const cur = document.documentElement.getAttribute('data-theme')
      _apply(cur === 'dark' ? 'light' : 'dark')
    },
    bind(selector = '#theme-toggle') {
      document.querySelectorAll(selector)
        .forEach(btn => btn.addEventListener('click', this.toggle.bind(this)))
    },
  }
})()

// ══════════════════════════════════════════
//  VALIDATORS — PADRÃO: Strategy Pattern
//
//  Cada validação é uma função independente
//  (estratégia). O mesmo campo pode receber
//  qualquer combinação de estratégias.
// ══════════════════════════════════════════
export const Validators = {
  required: (v) =>
    v?.toString().trim().length > 0 ? null : 'Este campo é obrigatório.',

  email: (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'E-mail inválido.',

  password: (v) =>
    v?.length >= 6 ? null : 'Mínimo de 6 caracteres.',

  minLength: (min) => (v) =>
    v?.length >= min ? null : `Mínimo de ${min} caracteres.`,

  maxLength: (max) => (v) =>
    v?.length <= max ? null : `Máximo de ${max} caracteres.`,

  positiveNumber: (v) =>
    !isNaN(v) && Number(v) > 0 ? null : 'Deve ser um número positivo.',
}

// Aplica estratégias a um campo e exibe feedback
export function validateField(input, ...validators) {
  const value = input.value
  let error = null
  for (const v of validators) {
    error = v(value)
    if (error) break
  }

  const errEl = document.getElementById(`${input.id}-error`)
  input.classList.toggle('error', !!error)
  if (errEl) {
    errEl.innerHTML = error
      ? `<i class="ph ph-warning"></i> ${error}`
      : ''
  }
  return !error
}

// Valida vários campos de uma vez
export function validateForm(rules) {
  return rules.every(({ input, validators }) =>
    validateField(input, ...validators)
  )
}

// ══════════════════════════════════════════
//  FORMATAÇÃO
// ══════════════════════════════════════════
export const Format = {
  currency: (v) => new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL',
  }).format(v),

  date: (s) => new Intl.DateTimeFormat('pt-BR').format(new Date(s)),

  dateTime: (s) => new Intl.DateTimeFormat('pt-BR', {
    day:'2-digit', month:'2-digit', year:'numeric',
    hour:'2-digit', minute:'2-digit',
  }).format(new Date(s)),

  statusLabel: (s) => ({
    pending:'Pendente', confirmed:'Confirmado', preparing:'Preparando',
    ready:'Pronto', delivered:'Entregue', cancelled:'Cancelado',
  })[s] || s,

  statusBadge: (s) => {
    const cls = {
      pending:'badge-cream', confirmed:'badge-sage', preparing:'badge-crimson',
      ready:'badge-sage', delivered:'badge-sage', cancelled:'badge-cream',
    }
    return `<span class="badge ${cls[s]||'badge-cream'}">${Format.statusLabel(s)}</span>`
  },
}

// ══════════════════════════════════════════
//  SKELETON — PADRÃO: Factory Pattern
//  Cria elementos HTML de loading dinamicamente.
// ══════════════════════════════════════════
export const SkeletonFactory = {
  card: () => `
    <div class="card p-0 overflow-hidden">
      <div class="skeleton h-48 rounded-b-none rounded-t-3xl"></div>
      <div class="p-4 space-y-2">
        <div class="skeleton h-3 w-1/3"></div>
        <div class="skeleton h-5 w-4/5"></div>
        <div class="skeleton h-3 w-2/3"></div>
        <div class="flex justify-between items-center mt-3">
          <div class="skeleton h-6 w-1/4"></div>
          <div class="skeleton h-9 w-1/3 rounded-xl"></div>
        </div>
      </div>
    </div>`,

  row: () => `
    <tr>
      <td class="px-5 py-3"><div class="skeleton h-4 w-4/5"></div></td>
      <td class="px-5 py-3"><div class="skeleton h-4 w-3/5"></div></td>
      <td class="px-5 py-3"><div class="skeleton h-4 w-2/5"></div></td>
      <td class="px-5 py-3"><div class="skeleton h-4 w-2/5"></div></td>
    </tr>`,

  renderCards(container, count = 6) {
    if (!container) return
    container.innerHTML = Array(count).fill(this.card()).join('')
  },
}

// ══════════════════════════════════════════
//  EMPTY STATE
// ══════════════════════════════════════════
export function renderEmptyState(container, msg = 'Nenhum item encontrado.', icon = 'ph-cookie') {
  if (!container) return
  container.innerHTML = `
    <div class="text-center py-16 col-span-full" style="color:var(--text-muted);">
      <i class="ph ${icon} block text-5xl mb-4 opacity-40"></i>
      <p>${msg}</p>
    </div>`
}

// ══════════════════════════════════════════
//  DOM HELPERS
// ══════════════════════════════════════════
export const DOM = {
  $:   (sel, ctx = document) => ctx.querySelector(sel),
  $$:  (sel, ctx = document) => [...ctx.querySelectorAll(sel)],
  show: (el) => el && el.removeAttribute('hidden'),
  hide: (el) => el && el.setAttribute('hidden', ''),
}

// Loading state em botões
export function setLoading(btn, loading) {
  if (loading) {
    btn.disabled = true
    btn.dataset.orig = btn.innerHTML
    btn.innerHTML = '<i class="ph ph-circle-notch spinner"></i> Aguarde...'
  } else {
    btn.disabled = false
    btn.innerHTML = btn.dataset.orig
  }
}
