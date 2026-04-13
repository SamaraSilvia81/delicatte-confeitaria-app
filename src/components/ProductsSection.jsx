// src/components/ProductsSection.jsx
import { useState } from 'react'
import { useProducts } from '../hooks/useProducts.js'
import { useCart }     from '../context/CartContext.jsx'
import { ProductCard } from './ProductCard.jsx'
import { ProductModal } from './ProductModal.jsx'
import { Toast }       from './Toast.jsx'

const CATEGORIES = [
  { key: 'all',        label: 'Todos' },
  { key: 'bolos',      label: 'Bolos' },
  { key: 'tortas',     label: 'Tortas' },
  { key: 'docinhos',   label: 'Docinhos' },
  { key: 'sobremesas', label: 'Sobremesas' },
]

export function ProductsSection() {
  const [activeCategory, setActiveCategory]   = useState('all')
  const [toastMsg, setToastMsg]               = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const { products, loading, error } = useProducts()
  const { add } = useCart()

  const filtered =
    activeCategory === 'all'
      ? products
      : products.filter((p) => p.category === activeCategory)

  function handleAddToCart(product) {
    add(product)
    setToastMsg(`${product.name} adicionado ao carrinho!`)
    setTimeout(() => setToastMsg(null), 3500)
  }

  return (
    <section className="products-section" id="produtos" aria-label="Nossos produtos">
      <div className="section-inner">

        <div className="section-header">
          <p className="section-eyebrow">
            <i className="ph ph-cookie" /> Cardápio
          </p>
          <h2>Nossos <em>doces</em></h2>
          <p>
            Cada produto feito com carinho, ingredientes frescos
            e técnicas que fazem toda a diferença no sabor final.
          </p>
        </div>

        {/* Filtros */}
        <div className="filters" role="group" aria-label="Filtrar por categoria">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              className={`filter-btn ${activeCategory === cat.key ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="products-grid" role="list">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="product-card skeleton" aria-hidden="true">
                <div className="pc-image-wrap skeleton-img" />
                <div className="pc-body">
                  <div className="skeleton-line short" />
                  <div className="skeleton-line" />
                  <div className="skeleton-line medium" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Erro */}
        {error && (
          <div className="empty-state">
            <i className="ph ph-wifi-slash" />
            <p>Não foi possível carregar os produtos.</p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && (
          <div className="products-grid" role="list">
            {filtered.length === 0 ? (
              <div className="empty-state">
                <i className="ph ph-cookie" />
                <p>Nenhum produto nessa categoria ainda.</p>
              </div>
            ) : (
              filtered.map((product) => (
                <ProductCard
                  key={product.id || product.objectId}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onOpenDetail={setSelectedProduct}
                />
              ))
            )}
          </div>
        )}

      </div>

      {/* Modal de detalhes */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Toast feedback */}
      {toastMsg && <Toast message={toastMsg} type="success" />}
    </section>
  )
}
