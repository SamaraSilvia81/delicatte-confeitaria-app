// src/components/ProductCard.jsx
export function ProductCard({ product, onAddToCart, onOpenDetail }) {
  const { name, price, category, imageUrl, featured, desc, description } = product
  const descText = desc || description || ''

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL',
  }).format(price ?? 0)

  return (
    <article
      className="card overflow-hidden group cursor-pointer"
      role="listitem"
      tabIndex={0}
      aria-label={`Ver detalhes de ${name}`}
      onClick={() => onOpenDetail?.(product)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpenDetail?.(product) }
      }}
    >

      <div className="pc-image-wrap" style={{ position:'relative', height:'13rem', overflow:'hidden', background:'var(--blush-soft)' }}>
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="pc-image"
            style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform .5s ease' }}
            loading="lazy" />
        ) : (
          <div className="pc-image-placeholder"
            style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--crimson)', opacity:.3 }}>
            <i className="ph ph-cake" style={{ fontSize:'3.5rem' }} />
          </div>
        )}

        {featured && (
          <span className="pc-badge" style={{
            position:'absolute', top:'.75rem', left:'.75rem',
            background:'var(--crimson)', color:'#fff',
            fontSize:'.65rem', fontWeight:600,
            padding:'.25rem .65rem', borderRadius:'999px',
            display:'inline-flex', alignItems:'center', gap:'.3rem',
          }}>
            <i className="ph ph-star-four" /> Destaque
          </span>
        )}

        {/* Hover hint */}
        <div className="card-hover-hint" style={{ borderRadius:0 }}>
          <i className="ph ph-magnifying-glass-plus" />
          Ver detalhes
        </div>
      </div>

      <div className="p-4">
        <span style={{
          fontSize:'.65rem', fontWeight:500, letterSpacing:'.1em',
          textTransform:'uppercase', color:'var(--text-muted)',
          display:'block', marginBottom:'.2rem',
        }}>
          {category}
        </span>
        <h4 className="font-display text-xl mt-0.5 mb-1">{name}</h4>
        {descText && (
          <p style={{
            fontSize:'.8rem', color:'var(--text-muted)',
            lineHeight:1.6, marginBottom:'.75rem',
            display:'-webkit-box', WebkitLineClamp:2,
            WebkitBoxOrient:'vertical', overflow:'hidden',
          }}>
            {descText}
          </p>
        )}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'.75rem' }}>
          <span style={{
            fontFamily:'var(--font-display)',
            fontSize:'1.5rem', color:'var(--crimson)', fontWeight:600,
          }}>
            {formattedPrice}
          </span>
          <button
            className="btn btn-primary btn-sm"
            onClick={(e) => { e.stopPropagation(); onAddToCart?.(product) }}
          >
            <i className="ph ph-shopping-bag-open" /> Adicionar
          </button>
        </div>
      </div>

    </article>
  )
}
