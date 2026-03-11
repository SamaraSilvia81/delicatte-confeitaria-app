// src/components/ProductCard.js
// ─────────────────────────────────────────────
// PADRÃO: Factory Pattern
//
// Uma função que recebe dados e retorna um
// HTMLElement completo e funcional.
// Reutilizável em qualquer contexto.
// ─────────────────────────────────────────────

import { Format, renderEmptyState } from '../utils/ui.js'
import { CartService } from '../hooks/cart.js'
import { Toast } from '../utils/ui.js'

// ── Modal de detalhe do produto ────────────
const ProductModal = (() => {
  let _overlay = null

  function _ensureDOM() {
    if (_overlay) return
    _overlay = document.createElement('div')
    _overlay.id = 'product-modal-overlay'
    _overlay.setAttribute('role', 'dialog')
    _overlay.setAttribute('aria-modal', 'true')
    _overlay.setAttribute('aria-label', 'Detalhe do produto')
    _overlay.innerHTML = `<div class="product-modal" id="product-modal-inner"></div>`
    document.body.appendChild(_overlay)

    // Fechar ao clicar no overlay
    _overlay.addEventListener('click', (e) => {
      if (e.target === _overlay) close()
    })

    // Fechar com Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close()
    })
  }

  function open(product) {
    _ensureDOM()
    const price    = Format.currency(product.price || 0)
    const imgSrc   = product.imageUrl || product.image || ''
    const category = product.category || 'Especial'

    document.getElementById('product-modal-inner').innerHTML = `
      <button class="pm-close" id="pm-close-btn" aria-label="Fechar">
        <i class="ph ph-x"></i>
      </button>

      <div class="pm-image-wrap">
        ${imgSrc
          ? `<img src="${imgSrc}" alt="${product.name}" class="pm-image">`
          : `<div class="pm-image-placeholder"><i class="ph ph-cake"></i></div>`
        }
        ${product.featured
          ? `<span class="pm-badge"><i class="ph ph-star-four"></i> Destaque</span>`
          : ''}
      </div>

      <div class="pm-body">
        <span class="pm-category">${category}</span>
        <h2 class="pm-title">${product.name}</h2>
        <p class="pm-description">${product.description || ''}</p>

        <div class="pm-meta">
          ${product.serves ? `
            <div class="pm-meta-item">
              <i class="ph ph-users-three"></i>
              <span>${product.serves}</span>
            </div>` : ''}
          ${product.weight ? `
            <div class="pm-meta-item">
              <i class="ph ph-scales"></i>
              <span>${product.weight}</span>
            </div>` : ''}
          <div class="pm-meta-item">
            <i class="ph ph-leaf"></i>
            <span>100% artesanal</span>
          </div>
        </div>

        <div class="pm-footer">
          <div class="pm-price-wrap">
            <span class="pm-price-label">Preço</span>
            <span class="pm-price">${price}</span>
          </div>
          <button class="btn btn-primary pm-add-btn" id="pm-add-cart-btn"
                  data-id="${product.objectId}"
                  data-name="${product.name}"
                  data-price="${product.price}"
                  data-image="${imgSrc}">
            <i class="ph ph-shopping-bag"></i>
            Adicionar ao carrinho
          </button>
        </div>
      </div>
    `

    document.getElementById('pm-close-btn').addEventListener('click', close)

    const addBtn = document.getElementById('pm-add-cart-btn')
    addBtn.addEventListener('click', () => {
      CartService.add({
        id:    product.objectId,
        name:  product.name,
        price: product.price,
        image: imgSrc,
      })
      Toast.success(`${product.name} adicionado!`)
      const orig = addBtn.innerHTML
      addBtn.innerHTML = '<i class="ph ph-check"></i> Adicionado!'
      addBtn.disabled = true
      setTimeout(() => { addBtn.innerHTML = orig; addBtn.disabled = false }, 1800)
    })

    // Animar entrada
    requestAnimationFrame(() => {
      _overlay.classList.add('pm-open')
      document.body.style.overflow = 'hidden'
    })
  }

  function close() {
    if (!_overlay) return
    _overlay.classList.remove('pm-open')
    document.body.style.overflow = ''
  }

  return { open, close }
})()

// ── Vitrine pública ────────────────────────
export const ProductCard = {
  create(product) {
    const article = document.createElement('article')
    article.className = 'card overflow-hidden group cursor-pointer'
    article.dataset.id = product.objectId
    article.setAttribute('tabindex', '0')
    article.setAttribute('role', 'button')
    article.setAttribute('aria-label', `Ver detalhes de ${product.name}`)

    const price    = Format.currency(product.price || 0)
    const imgSrc   = product.imageUrl || product.image || ''
    const category = product.category || 'Especial'

    article.innerHTML = `
      <div class="relative h-52 overflow-hidden bg-blush/30">
        ${imgSrc
          ? `<img src="${imgSrc}" alt="${product.name}"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy">`
          : `<div class="w-full h-full flex items-center justify-center text-crimson/30">
               <i class="ph ph-cake text-6xl"></i>
             </div>`
        }
        ${product.featured
          ? `<span class="badge badge-crimson absolute top-3 left-3">
               <i class="ph ph-star-four"></i> Destaque
             </span>`
          : ''}
        <div class="card-hover-hint">
          <i class="ph ph-magnifying-glass-plus"></i>
          Ver detalhes
        </div>
      </div>

      <div class="p-4">
        <span class="text-[10px] font-medium tracking-widest uppercase text-[var(--text-muted)]">
          ${category}
        </span>
        <h4 class="font-display text-xl mt-0.5 mb-1">${product.name}</h4>
        <p class="text-xs text-[var(--text-muted)] leading-relaxed mb-3 line-clamp-2">
          ${product.description || ''}
        </p>
        <div class="flex items-center justify-between">
          <span class="font-display text-2xl text-crimson font-semibold">${price}</span>
          <button class="btn btn-primary btn-sm add-to-cart"
                  data-id="${product.objectId}"
                  data-name="${product.name}"
                  data-price="${product.price}">
            <i class="ph ph-shopping-bag"></i>
            Adicionar
          </button>
        </div>
      </div>
    `

    // Clicar no card → abre modal (exceto no botão de adicionar)
    article.addEventListener('click', (e) => {
      if (e.target.closest('.add-to-cart')) return
      ProductModal.open(product)
    })

    article.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('.add-to-cart')) {
        e.preventDefault()
        ProductModal.open(product)
      }
    })

    // Botão "Adicionar" direto no card (sem abrir modal)
    article.querySelector('.add-to-cart')
      .addEventListener('click', (e) => {
        e.stopPropagation()
        CartService.add({
          id:    product.objectId,
          name:  product.name,
          price: product.price,
          image: imgSrc,
        })
        Toast.success(`${product.name} adicionado!`)

        const btn = e.currentTarget
        const orig = btn.innerHTML
        btn.innerHTML = '<i class="ph ph-check"></i> Adicionado'
        btn.disabled = true
        setTimeout(() => { btn.innerHTML = orig; btn.disabled = false }, 1500)
      })

    return article
  },

  renderList(container, products) {
    if (!container) return
    if (!products?.length) {
      renderEmptyState(container, 'Nenhum produto encontrado.', 'ph-cookie')
      return
    }
    container.innerHTML = ''
    products.forEach(p => container.appendChild(this.create(p)))
  },
}

// ── Admin — linha de tabela ────────────────
export const AdminProductRow = {
  create(product, onEdit, onDelete) {
    const tr = document.createElement('tr')
    tr.dataset.id = product.objectId

    const imgSrc = product.imageUrl || product.image || ''

    tr.innerHTML = `
      <td class="px-5 py-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg overflow-hidden bg-blush/30 flex-shrink-0">
            ${imgSrc
              ? `<img src="${imgSrc}" alt="${product.name}" class="w-full h-full object-cover">`
              : `<div class="w-full h-full flex items-center justify-center text-crimson/40"><i class="ph ph-cake"></i></div>`}
          </div>
          <span class="font-medium text-sm">${product.name}</span>
        </div>
      </td>
      <td class="px-5 py-3">
        <span class="text-[10px] font-medium tracking-widest uppercase text-[var(--text-muted)]">
          ${product.category || '—'}
        </span>
      </td>
      <td class="px-5 py-3 font-display text-crimson">${Format.currency(product.price || 0)}</td>
      <td class="px-5 py-3">
        ${product.featured
          ? '<span class="badge badge-crimson"><i class="ph ph-star-four"></i> Sim</span>'
          : '<span class="badge badge-cream">Não</span>'}
      </td>
      <td class="px-5 py-3">
        <div class="flex gap-1">
          <button class="btn btn-ghost btn-sm edit-btn" title="Editar">
            <i class="ph ph-pencil-simple"></i>
          </button>
          <button class="btn btn-ghost btn-sm delete-btn text-red-500" title="Excluir">
            <i class="ph ph-trash"></i>
          </button>
        </div>
      </td>
    `

    tr.querySelector('.edit-btn').addEventListener('click', () => onEdit?.(product))
    tr.querySelector('.delete-btn').addEventListener('click', () => onDelete?.(product))
    return tr
  },
}
