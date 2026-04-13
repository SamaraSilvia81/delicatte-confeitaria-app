// src/pages/AdminPage.jsx
import { useState, useEffect, useCallback } from 'react'
import { ProductService, OrderService, SessionService } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'

const formatBRL  = v => new Intl.NumberFormat('pt-BR', { style:'currency', currency:'BRL' }).format(v)
const formatDate = s => { try { return new Intl.DateTimeFormat('pt-BR').format(new Date(s)) } catch { return '—' } }
const STATUS_LABEL = { pending:'Pendente', confirmed:'Confirmado', preparing:'Preparando', ready:'Pronto', delivered:'Entregue', cancelled:'Cancelado' }
const STATUS_NEXT  = { pending:'confirmed', confirmed:'preparing', preparing:'ready', ready:'delivered' }

const EMPTY_PRODUCT = { name:'', price:'', category:'', description:'', imageUrl:'', featured:false }

export function AdminPage({ onNavigate }) {
  const { session, isAdmin, logout } = useAuth()
  const { theme, toggle }            = useTheme()
  const [page, setPage]              = useState('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    localStorage.getItem('delicatte_sidebar') === 'collapsed'
  )

  // Dashboard
  const [orders, setOrders]       = useState([])
  const [products, setProducts]   = useState([])
  const [ordersFilter, setOrdersFilter] = useState('all')
  const [productSearch, setProductSearch] = useState('')

  // Modal produto
  const [modalOpen, setModalOpen]   = useState(false)
  const [modalTitle, setModalTitle] = useState('Novo produto')
  const [editId, setEditId]         = useState(null)
  const [form, setForm]             = useState(EMPTY_PRODUCT)
  const [saving, setSaving]         = useState(false)

  // Guard: redireciona se não for admin
  useEffect(() => {
    if (!session?.token) { onNavigate('/login'); return }
    if (!isAdmin)        { onNavigate('/'); return }
    loadOrders()
    loadProducts()
  }, [session, isAdmin])

  // Não renderiza nada enquanto verifica autenticação
  if (!session?.token || !isAdmin) return null

  const loadOrders   = async () => { try { setOrders(await OrderService.getAll()) } catch {} }
  const loadProducts = async () => { try { setProducts(await ProductService.getAll()) } catch {} }

  function toggleSidebar() {
    const next = !sidebarCollapsed
    setSidebarCollapsed(next)
    localStorage.setItem('delicatte_sidebar', next ? 'collapsed' : 'expanded')
  }

  function openNewProduct() {
    setEditId(null); setForm(EMPTY_PRODUCT); setModalTitle('Novo produto'); setModalOpen(true)
  }

  function openEditProduct(p) {
    setEditId(p.objectId)
    setForm({ name: p.name||'', price: p.price||'', category: p.category||'', description: p.description||p.desc||'', imageUrl: p.imageUrl||'', featured: !!p.featured })
    setModalTitle('Editar produto')
    setModalOpen(true)
  }

  async function handleSaveProduct() {
    if (!form.name || !form.price || !form.category) return
    setSaving(true)
    try {
      const data = { ...form, price: parseFloat(form.price) }
      if (editId) await ProductService.update(editId, data)
      else        await ProductService.create(data)
      setModalOpen(false)
      loadProducts()
    } catch {}
    setSaving(false)
  }

  async function handleDeleteProduct(id) {
    if (!confirm('Excluir produto?')) return
    try { await ProductService.delete(id); loadProducts() } catch {}
  }

  async function handleNextStatus(order) {
    const next = STATUS_NEXT[order.status]
    if (!next) return
    try { await OrderService.updateStatus(order.objectId, next); loadOrders() } catch {}
  }

  // Métricas derivadas
  const today    = new Date().toDateString()
  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today)
  const monthRevenue = orders.filter(o => new Date(o.createdAt).getMonth() === new Date().getMonth())
                             .reduce((a, o) => a + (o.total||0), 0)
  const pendingCount = orders.filter(o => o.status === 'pending').length
  const filteredOrders   = ordersFilter === 'all' ? orders : orders.filter(o => o.status === ordersFilter)
  const filteredProducts = products.filter(p => p.name?.toLowerCase().includes(productSearch.toLowerCase()))

  const adminInit = (session?.name || 'A')[0].toUpperCase()

  return (
    <div className="admin-wrapper">

      {/* SIDEBAR */}
      <aside id="sidebar" className={sidebarCollapsed ? 'collapsed' : ''} aria-label="Menu lateral">
        <div className="sb-header">
          <span className="sb-logo">Deli<em>catte</em></span>
          <button className="sb-toggle" onClick={toggleSidebar} aria-label="Retrair menu">
            <i className="ph ph-sidebar-simple" />
          </button>
        </div>

        <nav className="sb-nav">
          <div className="sb-section">
            <div className="sb-section-title sidebar-text">Visão geral</div>
            <button className={`nav-link ${page==='dashboard'?'active':''}`} onClick={() => setPage('dashboard')}>
              <i className="ph ph-squares-four" /><span className="sidebar-text">Dashboard</span>
            </button>
            <button className={`nav-link ${page==='orders'?'active':''}`} onClick={() => setPage('orders')}>
              <i className="ph ph-receipt" /><span className="sidebar-text">Pedidos</span>
              {pendingCount > 0 && <span className="nav-badge sidebar-text">{pendingCount}</span>}
            </button>
          </div>
          <div className="sb-section">
            <div className="sb-section-title sidebar-text">Catálogo</div>
            <button className={`nav-link ${page==='products'?'active':''}`} onClick={() => setPage('products')}>
              <i className="ph ph-cookie" /><span className="sidebar-text">Produtos</span>
            </button>
          </div>
          <div className="sb-section">
            <div className="sb-section-title sidebar-text">Sistema</div>
            <button className="nav-link" onClick={() => onNavigate('/')}>
              <i className="ph ph-storefront" /><span className="sidebar-text">Ver loja</span>
            </button>
          </div>
        </nav>

        <div className="sb-footer">
          <button className={`nav-link ${page==='settings'?'active':''}`} onClick={() => setPage('settings')}>
            <i className="ph ph-gear-six" /><span className="sidebar-text">Configurações</span>
          </button>
          <button className="nav-link" onClick={async () => { await logout(); onNavigate('/') }}>
            <i className="ph ph-sign-out" style={{ color:'#c0392b' }} />
            <span className="sidebar-text" style={{ color:'#c0392b' }}>Sair</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="admin-main">

        {/* Topbar */}
        <header className="topbar">
          <span style={{ fontFamily:'var(--font-display)', fontSize:'1.3rem' }}>
            {{ dashboard:'Dashboard', products:'Produtos', orders:'Pedidos', settings:'Configurações' }[page]}
          </span>
          <div className="topbar-actions">
            <button className="btn btn-ghost" onClick={toggle} aria-label="Tema">
              <i className={theme === 'dark' ? 'ph ph-sun' : 'ph ph-moon'} />
            </button>
            <button className="btn btn-outline btn-sm" onClick={() => onNavigate('/')}>
              <i className="ph ph-eye" /> Ver loja
            </button>
            <div className="admin-avatar" title="Configurações" onClick={() => setPage('settings')}>
              {adminInit}
            </div>
          </div>
        </header>

        {/* Conteúdo */}
        <main className="admin-content">

          {/* ── DASHBOARD ── */}
          {page === 'dashboard' && (
            <>
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-icon" style={{ background:'rgba(134,1,32,.1)', color:'var(--crimson)' }}>
                    <i className="ph ph-receipt" />
                  </div>
                  <div className="metric-value">{todayOrders.length}</div>
                  <div className="metric-label">Pedidos hoje</div>
                  <div className="metric-delta"><i className="ph ph-trend-up" /> Total do dia</div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon" style={{ background:'rgba(130,143,88,.15)', color:'var(--sage-dark)' }}>
                    <i className="ph ph-currency-circle-dollar" />
                  </div>
                  <div className="metric-value">{formatBRL(monthRevenue)}</div>
                  <div className="metric-label">Faturamento (mês)</div>
                  <div className="metric-delta"><i className="ph ph-trend-up" /> Mês atual</div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon" style={{ background:'rgba(250,209,218,.5)', color:'var(--crimson)' }}>
                    <i className="ph ph-receipt" />
                  </div>
                  <div className="metric-value">{pendingCount}</div>
                  <div className="metric-label">Pedidos pendentes</div>
                  <div className="metric-delta" style={{ color: pendingCount > 0 ? 'var(--crimson)' : 'var(--text-muted)' }}>
                    <i className={pendingCount > 0 ? 'ph ph-warning' : 'ph ph-minus'} />
                    {pendingCount > 0 ? ' Aguardando' : ' Tudo ok'}
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon" style={{ background:'rgba(130,143,88,.15)', color:'var(--sage-dark)' }}>
                    <i className="ph ph-cookie" />
                  </div>
                  <div className="metric-value">{products.length}</div>
                  <div className="metric-label">Produtos ativos</div>
                  <div className="metric-delta" style={{ color:'var(--text-muted)' }}>
                    <i className="ph ph-minus" /> No catálogo
                  </div>
                </div>
              </div>

              <div className="table-card">
                <div className="table-toolbar">
                  <h4 className="table-title">Pedidos recentes</h4>
                  <button className="btn btn-primary btn-sm" onClick={() => setPage('orders')}>Ver todos</button>
                </div>
                <table>
                  <thead><tr><th>Cliente</th><th>Itens</th><th>Total</th><th>Status</th><th>Data</th></tr></thead>
                  <tbody>
                    {orders.slice(0,8).map(o => (
                      <tr key={o.objectId}>
                        <td>{o.customerName || '—'}</td>
                        <td style={{ color:'var(--text-muted)', fontSize:'.82rem' }}>
                          {(o.items||[]).slice(0,2).map(i => i.name||'Item').join(', ')}
                          {(o.items||[]).length > 2 ? ` +${(o.items||[]).length - 2}` : ''}
                        </td>
                        <td style={{ fontFamily:'var(--font-display)', color:'var(--crimson)' }}>{formatBRL(o.total||0)}</td>
                        <td><span className="badge badge-cream">{STATUS_LABEL[o.status] || o.status}</span></td>
                        <td style={{ color:'var(--text-muted)', fontSize:'.82rem' }}>{formatDate(o.createdAt)}</td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr><td colSpan={5} style={{ textAlign:'center', padding:'2rem', color:'var(--text-muted)' }}>Nenhum pedido ainda</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ── PRODUTOS ── */}
          {page === 'products' && (
            <div className="table-card">
              <div className="table-toolbar">
                <div className="search-wrap">
                  <i className="ph ph-magnifying-glass" />
                  <input type="text" className="form-input" placeholder="Buscar produto..."
                    value={productSearch} onChange={e => setProductSearch(e.target.value)} />
                </div>
                <button className="btn btn-primary" onClick={openNewProduct}>
                  <i className="ph ph-plus" /> Novo produto
                </button>
              </div>
              <table>
                <thead><tr><th>Produto</th><th>Categoria</th><th>Preço</th><th>Destaque</th><th>Ações</th></tr></thead>
                <tbody>
                  {filteredProducts.map(p => (
                    <tr key={p.objectId}>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:'.75rem' }}>
                          <div style={{ width:40, height:40, borderRadius:8, overflow:'hidden', background:'var(--blush-soft)', flexShrink:0 }}>
                            {p.imageUrl
                              ? <img src={p.imageUrl} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                              : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--crimson)', opacity:.4 }}><i className="ph ph-cake" /></div>
                            }
                          </div>
                          <span style={{ fontWeight:500, fontSize:'.88rem' }}>{p.name}</span>
                        </div>
                      </td>
                      <td style={{ fontSize:'.8rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'.06em' }}>{p.category}</td>
                      <td style={{ fontFamily:'var(--font-display)', color:'var(--crimson)' }}>{formatBRL(p.price||0)}</td>
                      <td>{p.featured ? <span className="badge badge-crimson"><i className="ph ph-star-four" /> Sim</span> : <span className="badge badge-cream">Não</span>}</td>
                      <td>
                        <div style={{ display:'flex', gap:'.25rem' }}>
                          <button className="btn btn-ghost btn-sm" title="Editar" onClick={() => openEditProduct(p)}>
                            <i className="ph ph-pencil-simple" />
                          </button>
                          <button className="btn btn-ghost btn-sm" title="Excluir" style={{ color:'#c0392b' }} onClick={() => handleDeleteProduct(p.objectId)}>
                            <i className="ph ph-trash" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr><td colSpan={5} style={{ textAlign:'center', padding:'2rem', color:'var(--text-muted)' }}>Nenhum produto encontrado</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* ── PEDIDOS ── */}
          {page === 'orders' && (
            <>
              <div className="content-tabs">
                {['all','pending','preparing','ready','delivered'].map(s => (
                  <button key={s} className={`ctab ${ordersFilter===s?'active':''}`} onClick={() => setOrdersFilter(s)}>
                    {s === 'all' ? 'Todos' : STATUS_LABEL[s]}
                    {s === 'pending' && pendingCount > 0 && <span className="badge badge-crimson" style={{ marginLeft:'.4rem' }}>{pendingCount}</span>}
                  </button>
                ))}
              </div>
              <div className="table-card">
                <table>
                  <thead><tr><th>ID</th><th>Cliente</th><th>Total</th><th>Status</th><th>Data</th><th>Ação</th></tr></thead>
                  <tbody>
                    {filteredOrders.map(o => (
                      <tr key={o.objectId}>
                        <td style={{ fontFamily:'monospace', fontSize:'.78rem', color:'var(--text-muted)' }}>#{(o.objectId||'').slice(-8).toUpperCase()}</td>
                        <td>{o.customerName || '—'}</td>
                        <td style={{ fontFamily:'var(--font-display)', color:'var(--crimson)' }}>{formatBRL(o.total||0)}</td>
                        <td><span className="badge badge-cream">{STATUS_LABEL[o.status] || o.status}</span></td>
                        <td style={{ color:'var(--text-muted)', fontSize:'.82rem' }}>{formatDate(o.createdAt)}</td>
                        <td>
                          {STATUS_NEXT[o.status] && (
                            <button className="btn btn-outline btn-sm" onClick={() => handleNextStatus(o)}>
                              → {STATUS_LABEL[STATUS_NEXT[o.status]]}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filteredOrders.length === 0 && (
                      <tr><td colSpan={6} style={{ textAlign:'center', padding:'2rem', color:'var(--text-muted)' }}>Nenhum pedido nesta categoria</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ── CONFIGURAÇÕES ── */}
          {page === 'settings' && (
            <div className="settings-wrap">
              <h3 className="settings-title">Configurações</h3>
              <div className="table-card settings-card">
                <div className="settings-user">
                  <div className="settings-avatar">{adminInit}</div>
                  <div>
                    <div className="settings-name">{session?.name || '—'}</div>
                    <div className="settings-email">{session?.username || '—'}</div>
                  </div>
                </div>
                <div className="theme-row">
                  <span>Modo escuro</span>
                  <button className="btn btn-outline btn-sm" onClick={toggle}>
                    <i className={theme === 'dark' ? 'ph ph-sun' : 'ph ph-moon'} /> Alternar
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* MODAL PRODUTO */}
      {modalOpen && (
        <div className="modal-overlay open" onClick={e => { if (e.target.className.includes('modal-overlay')) setModalOpen(false) }}>
          <div className="modal">
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1.25rem 1.5rem', borderBottom:'1px solid var(--border-soft)' }}>
              <h3 style={{ fontFamily:'var(--font-display)' }}>{modalTitle}</h3>
              <button className="btn btn-ghost" onClick={() => setModalOpen(false)}><i className="ph ph-x" /></button>
            </div>
            <div style={{ padding:'1.5rem' }}>
              <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                <div className="form-group">
                  <label className="form-label">Nome *</label>
                  <input type="text" className="form-input" placeholder="Ex: Bolo Red Velvet"
                    value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Preço (R$) *</label>
                    <input type="number" className="form-input" placeholder="0.00" min="0" step="0.01"
                      value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Categoria *</label>
                    <select className="form-input" value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))}>
                      <option value="">Selecione...</option>
                      <option value="bolos">Bolos</option>
                      <option value="tortas">Tortas</option>
                      <option value="docinhos">Docinhos</option>
                      <option value="sobremesas">Sobremesas</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Descrição</label>
                  <textarea className="form-input" rows={3} placeholder="Descreva o produto..."
                    style={{ resize:'vertical' }}
                    value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} />
                </div>
                <div className="form-group">
                  <label className="form-label">URL da imagem</label>
                  <input type="url" className="form-input" placeholder="https://..."
                    value={form.imageUrl} onChange={e => setForm(f => ({...f, imageUrl: e.target.value}))} />
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'.75rem' }}>
                  <input type="checkbox" id="p-featured" style={{ width:16, height:16, accentColor:'var(--crimson)' }}
                    checked={form.featured} onChange={e => setForm(f => ({...f, featured: e.target.checked}))} />
                  <label htmlFor="p-featured" style={{ fontSize:'.9rem', cursor:'pointer' }}>Produto em destaque</label>
                </div>
              </div>
            </div>
            <div style={{ padding:'1rem 1.5rem', borderTop:'1px solid var(--border-soft)', display:'flex', gap:'.75rem', justifyContent:'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setModalOpen(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSaveProduct} disabled={saving}>
                {saving ? <><i className="ph ph-circle-notch spinner" /> Salvando...</> : <><i className="ph ph-floppy-disk" /> Salvar</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <div id="toast-container" />
    </div>
  )
}
