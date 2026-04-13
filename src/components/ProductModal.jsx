// src/components/ProductModal.jsx
import { useEffect } from 'react'
import { useCart } from '../context/CartContext.jsx'

const fmt = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v ?? 0)

export function ProductModal({ product, onClose }) {
  const { add } = useCart()

  // Fechar com Escape
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!product) return null

  const { name, price, category, imageUrl, image, featured, description, desc, serves, weight, objectId } = product
  const imgSrc  = imageUrl || image || ''
  const descText = description || desc || ''
  const cat     = category || 'Especial'

  function handleAdd() {
    add({ id: objectId || product.id, name, price, image: imgSrc })
    onClose()
  }

  return (
    <div
      id="product-modal-overlay"
      className="pm-open"
      onClick={(e) => { if (e.target.id === 'product-modal-overlay') onClose() }}
      role="dialog"
      aria-modal="true"
      aria-label="Detalhe do produto"
    >
      <div className="product-modal">

        {/* Botão fechar */}
        <button className="pm-close" onClick={onClose} aria-label="Fechar">
          <i className="ph ph-x" />
        </button>

        {/* Imagem */}
        <div className="pm-image-wrap">
          {imgSrc ? (
            <img src={imgSrc} alt={name} className="pm-image" />
          ) : (
            <div className="pm-image-placeholder">
              <i className="ph ph-cake" />
            </div>
          )}
          {featured && (
            <span className="pm-badge">
              <i className="ph ph-star-four" /> Destaque
            </span>
          )}
        </div>

        {/* Conteúdo */}
        <div className="pm-body">
          <span className="pm-category">{cat}</span>
          <h2 className="pm-title">{name}</h2>
          {descText && <p className="pm-description">{descText}</p>}

          <div className="pm-meta">
            {serves && (
              <div className="pm-meta-item">
                <i className="ph ph-users-three" />
                <span>{serves}</span>
              </div>
            )}
            {weight && (
              <div className="pm-meta-item">
                <i className="ph ph-scales" />
                <span>{weight}</span>
              </div>
            )}
            <div className="pm-meta-item">
              <i className="ph ph-leaf" />
              <span>100% artesanal</span>
            </div>
          </div>

          <div className="pm-footer">
            <div className="pm-price-wrap">
              <span className="pm-price-label">Preço</span>
              <span className="pm-price">{fmt(price)}</span>
            </div>
            <button className="btn btn-primary pm-add-btn" onClick={handleAdd}>
              <i className="ph ph-shopping-bag" />
              Adicionar ao carrinho
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
