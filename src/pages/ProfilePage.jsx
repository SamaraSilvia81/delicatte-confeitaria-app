// src/pages/ProfilePage.jsx
import { useState, useEffect } from 'react'
import { AuthService, SessionService, OrderService } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'

const formatBRL = v => new Intl.NumberFormat('pt-BR', { style:'currency', currency:'BRL' }).format(v)
const formatDate = s => new Intl.DateTimeFormat('pt-BR').format(new Date(s))
const statusLabel = s => ({ pending:'Pendente', confirmed:'Confirmado', preparing:'Preparando', ready:'Pronto', delivered:'Entregue', cancelled:'Cancelado' })[s] || s
const statusColor = s => ({ pending:'var(--text-muted)', confirmed:'var(--sage)', preparing:'var(--crimson)', ready:'var(--sage)', delivered:'var(--sage-dark)', cancelled:'var(--text-muted)' })[s] || 'var(--text-muted)'

export function ProfilePage({ onNavigate }) {
  const { session, refresh, logout } = useAuth()
  const [activeTab, setActiveTab]   = useState('orders')
  const [orders, setOrders]         = useState([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [editingInfo, setEditingInfo] = useState(false)
  const [editingPw, setEditingPw]   = useState(false)
  const [name, setName]             = useState(session?.name || '')
  const [phone, setPhone]           = useState(session?.phone || '')
  const [pwCurrent, setPwCurrent]   = useState('')
  const [pwNew, setPwNew]           = useState('')
  const [pwConfirm, setPwConfirm]   = useState('')
  const [saving, setSaving]         = useState(false)

  useEffect(() => {
    if (!session?.token) { onNavigate('/login'); return }
    loadOrders()
  }, [])

  async function loadOrders() {
    setOrdersLoading(true)
    try {
      const all = await OrderService.getAll()
      setOrders(all.filter(o => o.customerId === session?.userId || o.customerName === session?.name))
    } catch {}
    setOrdersLoading(false)
  }

  async function handleSaveInfo() {
    if (!name.trim()) return
    setSaving(true)
    try {
      await AuthService.updateProfile({ name: name.trim(), phone: phone.trim() })
      refresh()
      setEditingInfo(false)
    } catch {}
    setSaving(false)
  }

  async function handleSavePw() {
    if (!pwCurrent) return
    if (pwNew.length < 6) return
    if (pwNew !== pwConfirm) return
    setSaving(true)
    try {
      await AuthService.changePassword(pwCurrent, pwNew)
      setEditingPw(false)
      setPwCurrent(''); setPwNew(''); setPwConfirm('')
    } catch {}
    setSaving(false)
  }

  async function handleLogout() {
    await logout()
    onNavigate('/')
  }

  const avatarLetter = (session?.name || '?')[0].toUpperCase()

  return (
    <>
      <div className="lights" aria-hidden="true" />
      <header id="navbar" role="banner">
        <div className="navbar-inner">
          <button className="nav-logo" onClick={() => onNavigate('/')}>Deli<em>catte</em></button>
          <ul className="nav-links" role="list" />
          <div className="nav-actions">
            <a href="#" className="btn btn-outline btn-sm" onClick={() => onNavigate('/')}>
              <i className="ph ph-arrow-left" /> Voltar à loja
            </a>
            <button className="btn btn-primary btn-sm" onClick={handleLogout}>
              <i className="ph ph-sign-out" /> Sair
            </button>
          </div>
        </div>
      </header>

      <main>
        <div className="profile-wrap">

          {/* Avatar + info */}
          <div className="profile-hero">
            <div>
              <div className="profile-avatar-wrap">
                <div className="profile-avatar-lg">
                  {session?.avatar
                    ? <img src={session.avatar} alt="foto" />
                    : avatarLetter
                  }
                </div>
              </div>
            </div>
            <div className="profile-hero-info">
              <h1 id="profile-name">{session?.name || '—'}</h1>
              <div className="profile-hero-email">{session?.username || '—'}</div>
              <div className="profile-hero-badge">
                {session?.role === 'admin'
                  ? <><i className="ph ph-shield-check" /> Administrador</>
                  : <><i className="ph ph-user" /> Cliente</>
                }
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="profile-tabs">
            <button className={`ptab ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
              <i className="ph ph-receipt" /> Meus pedidos
            </button>
            <button className={`ptab ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>
              <i className="ph ph-user-gear" /> Minha conta
            </button>
          </div>

          {/* Pedidos */}
          {activeTab === 'orders' && (
            <div>
              {ordersLoading ? (
                <div style={{ textAlign:'center', padding:'3rem', color:'var(--text-muted)' }}>
                  <i className="ph ph-spinner" style={{ fontSize:'2rem', display:'block', marginBottom:'.75rem', animation:'spin .8s linear infinite' }} />
                  Carregando pedidos...
                </div>
              ) : orders.length === 0 ? (
                <div className="empty-orders">
                  <i className="ph ph-shopping-bag-open" />
                  <p>Você ainda não fez nenhum pedido.</p>
                  <button className="btn btn-primary btn-sm" onClick={() => onNavigate('/#produtos')}>
                    <i className="ph ph-storefront" /> Ver produtos
                  </button>
                </div>
              ) : orders.map(o => (
                <div key={o.objectId} className="order-card">
                  <div className="order-card-top">
                    <span className="order-id">#{(o.objectId||'').slice(-8).toUpperCase()}</span>
                    <span className="order-date">{formatDate(o.createdAt || new Date())}</span>
                  </div>
                  <div className="order-items">
                    {(o.items||[]).map(i => `${i.name||'Item'} × ${i.qty||1}`).join(' · ') || '—'}
                  </div>
                  <div className="order-footer">
                    <span className="order-total">{formatBRL(o.total||0)}</span>
                    <span className="badge badge-cream" style={{ color: statusColor(o.status) }}>
                      {statusLabel(o.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Minha conta */}
          {activeTab === 'info' && (
            <div>
              {/* Dados pessoais */}
              <div className="pcard">
                <div className="pcard-title">
                  Dados pessoais
                  {!editingInfo && (
                    <button className="edit-toggle-btn" onClick={() => setEditingInfo(true)}>
                      <i className="ph ph-pencil-simple" /> Editar
                    </button>
                  )}
                </div>
                <div className="pcard-grid">
                  <div className="form-group">
                    <label className="form-label">Nome completo</label>
                    <div className="input-with-icon">
                      <i className="ph ph-user icon" />
                      <input type="text" className="form-input" value={name}
                        onChange={e => setName(e.target.value)}
                        readOnly={!editingInfo}
                        style={{ paddingLeft: '2.5rem' }} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Telefone / WhatsApp</label>
                    <div className="input-with-icon">
                      <i className="ph ph-phone icon" />
                      <input type="tel" className="form-input" value={phone}
                        onChange={e => setPhone(e.target.value)}
                        readOnly={!editingInfo}
                        style={{ paddingLeft: '2.5rem' }} />
                    </div>
                  </div>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">E-mail</label>
                    <div className="input-with-icon">
                      <i className="ph ph-envelope-simple icon" />
                      <input type="email" className="form-input" value={session?.username || ''}
                        readOnly style={{ paddingLeft: '2.5rem' }} />
                    </div>
                    <span style={{ fontSize:'.72rem', color:'var(--text-muted)', marginTop:'.3rem', display:'block' }}>
                      <i className="ph ph-info" /> O e-mail é seu login e não pode ser alterado aqui.
                    </span>
                  </div>
                </div>
                {editingInfo && (
                  <div className="save-row visible">
                    <button className="btn btn-primary btn-sm" onClick={handleSaveInfo} disabled={saving}>
                      <i className="ph ph-floppy-disk" /> Salvar alterações
                    </button>
                    <button className="btn btn-outline btn-sm" onClick={() => { setEditingInfo(false); setName(session?.name||''); setPhone(session?.phone||'') }}>
                      Cancelar
                    </button>
                  </div>
                )}
              </div>

              {/* Alterar senha */}
              <div className="pcard">
                <div className="pcard-title">
                  Alterar senha
                  {!editingPw && (
                    <button className="edit-toggle-btn" onClick={() => setEditingPw(true)}>
                      <i className="ph ph-lock-simple" /> Alterar
                    </button>
                  )}
                </div>
                {!editingPw && (
                  <p style={{ fontSize:'.85rem', color:'var(--text-muted)' }}>
                    Clique em "Alterar" para definir uma nova senha.
                  </p>
                )}
                {editingPw && (
                  <div className="pw-grid">
                    <div className="form-group">
                      <label className="form-label">Senha atual</label>
                      <div className="input-with-icon">
                        <i className="ph ph-lock-simple icon" />
                        <input type="password" className="form-input" placeholder="••••••••"
                          value={pwCurrent} onChange={e => setPwCurrent(e.target.value)}
                          style={{ paddingLeft:'2.5rem' }} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Nova senha</label>
                      <div className="input-with-icon">
                        <i className="ph ph-lock-simple icon" />
                        <input type="password" className="form-input" placeholder="Mínimo 6 caracteres"
                          value={pwNew} onChange={e => setPwNew(e.target.value)}
                          style={{ paddingLeft:'2.5rem' }} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Confirmar nova senha</label>
                      <div className="input-with-icon">
                        <i className="ph ph-lock-simple-open icon" />
                        <input type="password" className="form-input" placeholder="Repita a nova senha"
                          value={pwConfirm} onChange={e => setPwConfirm(e.target.value)}
                          style={{ paddingLeft:'2.5rem' }} />
                      </div>
                    </div>
                    <div className="save-row visible" style={{ marginTop:0, paddingTop:0, border:'none' }}>
                      <button className="btn btn-primary btn-sm" onClick={handleSavePw} disabled={saving}>
                        <i className="ph ph-floppy-disk" /> Salvar nova senha
                      </button>
                      <button className="btn btn-outline btn-sm" onClick={() => { setEditingPw(false); setPwCurrent(''); setPwNew(''); setPwConfirm('') }}>
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>
      <div id="toast-container" />
    </>
  )
}
