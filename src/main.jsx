// src/main.jsx
// ─────────────────────────────────────────────
// Ponto de entrada da aplicação React.
//
// ReactDOM.createRoot() monta o React na div#root
// do index.html — o único elemento HTML que
// precisamos escrever à mão.
//
// StrictMode: ativa avisos extras em desenvolvimento.
// Não afeta produção.
// ─────────────────────────────────────────────

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
