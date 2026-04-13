// src/components/Navbar.jsx
import { useState } from 'react'
import { useCart }  from '../context/CartContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { useAuth }  from '../context/AuthContext.jsx'

export function Navbar({ onNavigate }) {
  const { count, openDrawer }                    = useCart()
  const { theme, toggle }                        = useTheme()
  const { session, isLoggedIn, isAdmin, logout } = useAuth()
  const [mobileOpen, setMobileOpen]              = useState(false)

  async function handleLogout() {
    await logout()
    setMobileOpen(false)
    onNavigate('/')
  }

  return (
    <>
      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div
          style={{ position:'fixed', inset:0, background:'rgba(6,4,12,.95)', zIndex:500, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'2rem' }}
          onClick={() => setMobileOpen(false)}
        >
          <button style={{ position:'absolute', top:'1.5rem', right:'1.5rem', background:'none', border:'none', color:'var(--text-1)', cursor:'pointer' }}>
            <i className="ph ph-x" style={{ fontSize:'1.75rem' }} />
          </button>
          {[['#produtos','Produtos'],['#sobre','Nossa história'],['#contato','Contato']].map(([href, label]) => (
            <a key={href} href={href}
              onClick={() => setMobileOpen(false)}
              style={{ fontFamily:'var(--font-display)', fontSize:'2.2rem', fontWeight:300, color:'var(--text-1)', fontStyle:'italic', textDecoration:'none' }}>
              {label}
            </a>
          ))}
          {isLoggedIn
            ? <button onClick={handleLogout} style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem', fontWeight:300, color:'var(--text-muted)', background:'none', border:'none', cursor:'pointer' }}>Sair</button>
            : <button onClick={() => { setMobileOpen(false); onNavigate('/login') }} style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem', color:'var(--crimson)', background:'none', border:'none', cursor:'pointer', fontStyle:'italic' }}>Entrar</button>
          }
        </div>
      )}

      <header id="navbar" role="banner">
        <div className="navbar-inner">

          <button className="nav-logo" onClick={() => onNavigate('/')} style={{ background:'none', border:'none', cursor:'pointer' }}>
            Deli<em>catte</em>
          </button>

          {/* Links — desktop */}
          <ul className="nav-links" role="list">
            <li><a href="#produtos">Produtos</a></li>
            <li><a href="#sobre">Nossa história</a></li>
            <li><a href="#contato">Contato</a></li>
          </ul>

          <div className="nav-actions">
            <button className="icon-btn" onClick={toggle} aria-label="Alternar tema">
              <i className={theme === 'dark' ? 'ph ph-sun' : 'ph ph-moon'} />
            </button>

            <button className="icon-btn" onClick={openDrawer} aria-label="Abrir carrinho">
              <i className="ph ph-shopping-bag" style={{ fontSize:'1.2rem' }} />
              {count > 0 && <span id="cart-badge" style={{ display:'flex' }}>{count}</span>}
            </button>

            {/* Auth — desktop */}
            <div className="nav-auth-desktop">
              {isLoggedIn ? (
                <>
                  {isAdmin && (
                    <button className="btn btn-outline btn-sm" onClick={() => onNavigate('/admin')}>
                      <i className="ph ph-gauge" /> Painel
                    </button>
                  )}
                  <button className="btn btn-outline btn-sm" onClick={() => onNavigate('/profile')}>
                    <i className="ph ph-user-circle" /> {session?.name?.split(' ')[0] || 'Conta'}
                  </button>
                  <button className="icon-btn" onClick={handleLogout} title="Sair">
                    <i className="ph ph-sign-out" style={{ fontSize:'1.1rem' }} />
                  </button>
                </>
              ) : (
                <button className="btn btn-primary" onClick={() => onNavigate('/login')}>
                  <i className="ph ph-user" /> Entrar
                </button>
              )}
            </div>

            {/* Hamburger — mobile */}
            <button
              className="icon-btn nav-hamburger"
              onClick={() => setMobileOpen(true)}
              aria-label="Menu"
            >
              <i className="ph ph-list" style={{ fontSize:'1.4rem' }} />
            </button>
          </div>
        </div>
      </header>
    </>
  )
}
