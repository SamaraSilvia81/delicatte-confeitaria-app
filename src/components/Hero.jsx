// src/components/Hero.jsx
// ─────────────────────────────────────────────
// Seção Hero — puramente visual/estática.
// Em React, componentes sem estado (sem useState)
// são chamados de "componentes puros" ou
// "presentational components". São os mais simples.
// ─────────────────────────────────────────────

import heroImg from '../assets/img/hero.jpg'

export function Hero() {
  return (
    <section className="hero" aria-label="Apresentação">

      <div className="hero-text">
        <div className="hero-eyebrow">
          <i className="ph ph-sparkle" />
          Artesanal · Premium · Feito com amor
        </div>

        <h1 className="hero-title">
          Cada doce,<br />
          uma <em>história</em><br />
          de afeto
        </h1>

        <p className="hero-desc">
          Confeitaria artesanal com ingredientes selecionados,
          receitas exclusivas e a dedicação de quem transforma
          farinha e açúcar em momentos inesquecíveis.
        </p>

        <div className="hero-actions">
          <a href="#produtos" className="btn btn-primary">
            <i className="ph ph-storefront" />
            Explorar produtos
          </a>
          <a href="#sobre" className="btn btn-outline">
            Nossa história
          </a>
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-placeholder">
          <img
            className="hero-image"
            src={heroImg}
            alt="Bolo artesanal Delicatte"
          />

          <div className="hero-float tl">
            <div className="float-icon" style={{ background: 'rgba(134,1,32,.1)', color: 'var(--crimson)' }}>
              <i className="ph ph-star-four" />
            </div>
            <div>
              <div className="float-label">4.9 ★</div>
              <div className="float-sub">Avaliação média</div>
            </div>
          </div>

          <div className="hero-float br">
            <div className="float-icon" style={{ background: 'rgba(130,143,88,.15)', color: 'var(--sage-dark)' }}>
              <i className="ph ph-package" />
            </div>
            <div>
              <div className="float-label">Entrega</div>
              <div className="float-sub">Recife & região</div>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
