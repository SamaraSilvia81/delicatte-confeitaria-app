// src/App.jsx
import { useState, useEffect } from 'react'

import { ThemeProvider } from './context/ThemeContext.jsx'
import { CartProvider }  from './context/CartContext.jsx'
import { AuthProvider }  from './context/AuthContext.jsx'

import { Navbar }      from './components/Navbar.jsx'
import { Banner }      from './components/Banner.jsx'
import { Footer }      from './components/Footer.jsx'
import { CartDrawer }  from './components/CartDrawer.jsx'
import { Home }        from './pages/Home.jsx'
import { LoginPage }   from './pages/LoginPage.jsx'
import { ProfilePage } from './pages/ProfilePage.jsx'
import { AdminPage }   from './pages/AdminPage.jsx'

import './styles/global.css'
import './styles/index.css'
import './styles/login.css'
import './styles/admin.css'
import './styles/cart.css'

// ── Roteamento simples sem React Router ──────────
function getInitialRoute() {
  const hash = window.location.hash
  if (hash === '#/login')   return '/login'
  if (hash === '#/profile') return '/profile'
  if (hash === '#/admin')   return '/admin'
  return '/'
}

export default function App() {
  const [route, setRoute] = useState(getInitialRoute)

  function navigate(to) {
    setRoute(to)
    window.location.hash = to === '/' ? '' : `#${to}`
    window.scrollTo(0, 0)
  }

  // Sincroniza se o usuário usar botão voltar do browser
  useEffect(() => {
    function onHashChange() {
      const hash = window.location.hash
      if (!hash || hash === '#/')    setRoute('/')
      else if (hash === '#/login')   setRoute('/login')
      else if (hash === '#/profile') setRoute('/profile')
      else if (hash === '#/admin')   setRoute('/admin')
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const isLoginPage   = route === '/login'
  const isProfilePage = route === '/profile'
  const isAdminPage   = route === '/admin'
  const isHomePage    = route === '/'

  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>

          {/* Tela de Login — layout próprio */}
          {isLoginPage && (
            <LoginPage onNavigate={navigate} />
          )}

          {/* Perfil */}
          {isProfilePage && (
            <ProfilePage onNavigate={navigate} />
          )}

          {/* Admin — layout próprio */}
          {isAdminPage && (
            <AdminPage onNavigate={navigate} />
          )}

          {/* Home — layout principal */}
          {isHomePage && (
            <>
              <div className="lights" aria-hidden="true" />
              <Banner />
              <Navbar onNavigate={navigate} />
              <Home />
              <Footer />
              <CartDrawer />
            </>
          )}

        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
