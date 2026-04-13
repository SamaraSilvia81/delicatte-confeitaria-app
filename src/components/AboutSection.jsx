// src/components/AboutSection.jsx
// Componente puramente visual — sem estado.
// Props não são necessárias aqui, mas poderíamos
// receber os dados (stats) como props para
// deixar o componente mais reutilizável.

import aboutImg from '../assets/img/about.jpg'

const STATS = [
  { value: '+500', label: 'Clientes felizes' },
  { value: '+80',  label: 'Receitas únicas' },
  { value: '5 anos', label: 'De história' },
]

export function AboutSection() {
  return (
    <section className="about-section" id="sobre" aria-label="Nossa história">
      <div className="about-grid">

        <div className="about-visual">
          <img
            className="hero-image"
            src={aboutImg}
            alt="Confeitaria Delicatte"
          />
        </div>

        <div className="about-text">
          <p className="section-eyebrow">
            <i className="ph ph-sparkle" /> Nossa história
          </p>
          <h2>
            Feito com{' '}
            <em style={{ color: 'var(--crimson)', fontStyle: 'italic' }}>afeto</em>
            <br />
            desde o início
          </h2>
          <p>
            A Delicatte nasceu da paixão por transformar ingredientes simples
            em momentos inesquecíveis. Cada receita carrega tradição, cuidado
            e a dedicação de quem entende que um bom doce vai muito além do sabor.
          </p>
          <p>
            Trabalhamos com ingredientes selecionados, sem conservantes artificiais,
            produção 100% artesanal e entrega em Recife e região.
          </p>

          <div className="about-stats">
            {/* .map() substitui o HTML repetitivo */}
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
