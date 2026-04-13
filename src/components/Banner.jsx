// src/components/Banner.jsx
// ─────────────────────────────────────────────
// No HTML, fechar o banner era um addEventListener
// no botão que adicionava display:none.
//
// Em React: useState guarda se o banner está visível.
// Quando setVisible(false) é chamado, React re-renderiza
// e o banner some — sem tocar no DOM diretamente.
// ─────────────────────────────────────────────

import { useState } from 'react'

export function Banner() {
  const [visible, setVisible] = useState(true)

  // Renderização condicional: retorna null = nada no DOM
  if (!visible) return null

  return (
    <div className="banner-slot">
      <strong>🍰 Novidade!</strong>{' '}
      Caixa de Docinhos Sortidos com 12 unidades por apenas R$ 68,00.{' '}
      <a href="#produtos">Ver agora</a>

      <button
        className="banner-slot__close"
        onClick={() => setVisible(false)}
        aria-label="Fechar banner"
      >
        <i className="ph ph-x" />
      </button>
    </div>
  )
}
