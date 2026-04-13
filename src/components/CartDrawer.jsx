// src/components/CartDrawer.jsx
import { useCart } from '../context/CartContext.jsx'

const formatBRL = (val) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

export function CartDrawer() {
  const {
    items, count, total,
    remove, updateQty, clear, isEmpty,
    drawerOpen, closeDrawer,
  } = useCart()

  return (
    <>
      {/* Overlay */}
      {drawerOpen && (
        <div
          className="cart-overlay"
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        className={`cart-drawer ${drawerOpen ? 'open' : ''}`}
        aria-label="Carrinho de compras"
        aria-hidden={!drawerOpen}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-soft)',
        }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>
            Meu carrinho
            {count > 0 && (
              <span style={{
                marginLeft: '.5rem', fontSize: '.85rem',
                color: 'var(--crimson)', fontFamily: 'var(--font-body)',
              }}>
                ({count} {count === 1 ? 'item' : 'itens'})
              </span>
            )}
          </h3>
          <button
            className="icon-btn"
            onClick={closeDrawer}
            aria-label="Fechar carrinho"
          >
            <i className="ph ph-x" />
          </button>
        </div>

        {/* Itens */}
        <div className="cart-items" style={{ flex: 1, overflowY: 'auto' }}>
          {isEmpty ? (
            <div className="cart-empty">
              <i className="ph ph-shopping-bag-open" style={{ fontSize: '2.5rem', opacity: .35 }} />
              <p style={{ marginTop: '.75rem', color: 'var(--text-muted)' }}>
                Seu carrinho está vazio.
              </p>
              <button
                className="btn btn-outline"
                onClick={closeDrawer}
                style={{ marginTop: '1rem', fontSize: '.85rem' }}
              >
                Ver produtos
              </button>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <div key={item.id} className="cart-item">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      style={{
                        width: 56, height: 56, borderRadius: 8,
                        objectFit: 'cover', flexShrink: 0,
                      }}
                    />
                  )}
                  <div className="cart-item-info">
                    <span className="cart-item-name">{item.name}</span>
                    <span className="cart-item-price">{formatBRL(item.price * item.qty)}</span>
                  </div>
                  <div className="cart-item-controls">
                    <button
                      className="qty-btn"
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      aria-label="Diminuir"
                    >
                      <i className="ph ph-minus" />
                    </button>
                    <span className="qty-value">{item.qty}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      aria-label="Aumentar"
                    >
                      <i className="ph ph-plus" />
                    </button>
                    <button
                      className="qty-btn"
                      onClick={() => remove(item.id)}
                      aria-label="Remover"
                      style={{ color: 'var(--crimson)' }}
                    >
                      <i className="ph ph-trash" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Limpar carrinho */}
              <button
                onClick={clear}
                style={{
                  width: '100%', background: 'none', border: 'none',
                  color: 'var(--text-muted)', fontSize: '.78rem',
                  cursor: 'pointer', padding: '.75rem', textAlign: 'center',
                  textDecoration: 'underline',
                }}
              >
                Limpar carrinho
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        {!isEmpty && (
          <div style={{
            padding: '1.25rem 1.5rem',
            borderTop: '1px solid var(--border-soft)',
            display: 'flex', flexDirection: 'column', gap: '1rem',
          }}>
            <div className="cart-total-row">
              <span className="cart-total-label">Total</span>
              <span className="cart-total-value">{formatBRL(total)}</span>
            </div>
            <button
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '.85rem' }}
              onClick={() => alert('Checkout em breve — conectaremos com o Back4App em hooks!')}
            >
              <i className="ph ph-credit-card" />
              Finalizar pedido
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
