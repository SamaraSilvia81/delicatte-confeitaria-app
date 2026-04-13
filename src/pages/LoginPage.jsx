// src/pages/LoginPage.jsx
import { useState } from 'react'
import { AuthService, SessionService } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import heroImg from '../assets/img/hero.jpg'

export function LoginPage({ onNavigate }) {
  const { refresh } = useAuth()
  const [tab, setTab]               = useState('login')
  const [loading, setLoading]       = useState(false)
  const [loginError, setLoginError] = useState('')
  const [regError, setRegError]     = useState('')
  const [showPw, setShowPw]         = useState(false)
  const [showRegPw, setShowRegPw]   = useState(false)

  // Login form state
  const [email, setEmail]     = useState('')
  const [senha, setSenha]     = useState('')

  // Register form state
  const [regNome, setRegNome]       = useState('')
  const [regEmail, setRegEmail]     = useState('')
  const [regSenha, setRegSenha]     = useState('')
  const [regConfirm, setRegConfirm] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setLoginError('')
    if (!email || !senha) { setLoginError('Preencha todos os campos.'); return }
    setLoading(true)
    try {
      const user = await AuthService.login(email, senha)
      refresh()
      onNavigate(user.role === 'admin' ? '/admin' : '/')
    } catch (err) {
      setLoginError(err.response?.data?.error || 'E-mail ou senha incorretos.')
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(e) {
    e.preventDefault()
    setRegError('')
    if (!regNome || !regEmail || !regSenha) { setRegError('Preencha todos os campos.'); return }
    if (regSenha.length < 6)  { setRegError('Senha precisa ter pelo menos 6 caracteres.'); return }
    if (regSenha !== regConfirm) { setRegError('As senhas não coincidem.'); return }
    setLoading(true)
    try {
      await AuthService.register({ name: regNome, email: regEmail, password: regSenha })
      await AuthService.login(regEmail, regSenha)
      refresh()
      onNavigate('/')
    } catch (err) {
      setRegError(err.response?.data?.error || 'Erro ao criar conta.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-wrapper">
      <div className="lights" aria-hidden="true" />

      {/* Painel visual — esquerdo */}
      <div className="visual" aria-hidden="true">
        <img className="visual__bg-img" src={heroImg} alt="" draggable="false" />
        <div className="visual__pattern" />
        <div className="visual__content">
          <div className="visual__logo">Deli<em>catte</em></div>
          <div className="visual__sub">Confeitaria Artesanal</div>
          <blockquote className="visual__quote">
            "Um doce no momento certo<br />
            é um abraço que o paladar sente."
          </blockquote>
        </div>
      </div>

      {/* Painel formulário — direito */}
      <div className="panel">
        <div className="panel-inner">
          <button className="back-link" onClick={() => onNavigate('/')}>
            <i className="ph ph-arrow-left" /> Voltar à loja
          </button>

          <h2 className="panel-title">Bem-vinda de volta</h2>
          <p className="panel-subtitle">Entre na sua conta ou crie uma nova.</p>

          {/* Tabs */}
          <div className="tabs">
            <button
              className={`tab ${tab === 'login' ? 'active' : ''}`}
              onClick={() => setTab('login')}
            >Entrar</button>
            <button
              className={`tab ${tab === 'register' ? 'active' : ''}`}
              onClick={() => setTab('register')}
            >Criar conta</button>
          </div>

          {/* Formulário Login */}
          {tab === 'login' && (
            <form className="form-wrap" onSubmit={handleLogin} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="login-email">E-mail</label>
                <div className="input-with-icon">
                  <i className="ph ph-envelope-simple icon" />
                  <input
                    type="email" id="login-email" className="form-input"
                    placeholder="seu@email.com" autoComplete="email"
                    value={email} onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="login-senha">
                  Senha
                  <a href="#" className="forgot-link">Esqueci a senha</a>
                </label>
                <div className="input-with-icon">
                  <i className="ph ph-lock-simple icon" />
                  <input
                    type={showPw ? 'text' : 'password'} id="login-senha" className="form-input"
                    placeholder="••••••••" autoComplete="current-password"
                    value={senha} onChange={e => setSenha(e.target.value)}
                  />
                  <button type="button" className="eye-btn" onClick={() => setShowPw(!showPw)}>
                    <i className={showPw ? 'ph ph-eye-slash' : 'ph ph-eye'} />
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="error-box">
                  <i className="ph ph-warning-circle" />
                  <span>{loginError}</span>
                </div>
              )}

              <button type="submit" className="btn btn-primary submit-btn" disabled={loading}>
                {loading
                  ? <><i className="ph ph-circle-notch spinner" /> Entrando...</>
                  : <><i className="ph ph-sign-in" /> Entrar na conta</>
                }
              </button>
            </form>
          )}

          {/* Formulário Cadastro */}
          {tab === 'register' && (
            <form className="form-wrap" onSubmit={handleRegister} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-nome">Nome completo</label>
                <div className="input-with-icon">
                  <i className="ph ph-user icon" />
                  <input type="text" id="reg-nome" className="form-input" placeholder="Seu nome"
                    value={regNome} onChange={e => setRegNome(e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-email">E-mail</label>
                <div className="input-with-icon">
                  <i className="ph ph-envelope-simple icon" />
                  <input type="email" id="reg-email" className="form-input" placeholder="seu@email.com"
                    value={regEmail} onChange={e => setRegEmail(e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-senha">Senha</label>
                <div className="input-with-icon">
                  <i className="ph ph-lock-simple icon" />
                  <input
                    type={showRegPw ? 'text' : 'password'} id="reg-senha" className="form-input"
                    placeholder="Mínimo 6 caracteres"
                    value={regSenha} onChange={e => setRegSenha(e.target.value)}
                  />
                  <button type="button" className="eye-btn" onClick={() => setShowRegPw(!showRegPw)}>
                    <i className={showRegPw ? 'ph ph-eye-slash' : 'ph ph-eye'} />
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-confirm">Confirmar senha</label>
                <div className="input-with-icon">
                  <i className="ph ph-lock-simple-open icon" />
                  <input type="password" id="reg-confirm" className="form-input" placeholder="Repita a senha"
                    value={regConfirm} onChange={e => setRegConfirm(e.target.value)} />
                </div>
              </div>

              {regError && (
                <div className="error-box">
                  <i className="ph ph-warning-circle" />
                  <span>{regError}</span>
                </div>
              )}

              <button type="submit" className="btn btn-primary submit-btn" disabled={loading}>
                {loading
                  ? <><i className="ph ph-circle-notch spinner" /> Criando conta...</>
                  : <><i className="ph ph-user-plus" /> Criar minha conta</>
                }
              </button>
            </form>
          )}

          <p className="legal-note">
            Ao entrar você concorda com nossa{' '}
            <a href="#">Política de privacidade</a>.
          </p>
        </div>
      </div>

      <div id="toast-container" />
    </div>
  )
}
