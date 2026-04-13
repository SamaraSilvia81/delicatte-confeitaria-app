// src/pages/Home.jsx
// ─────────────────────────────────────────────
// No HTML: tudo estava em um único index.html
// com 900+ linhas misturando estrutura, estilo
// e comportamento.
//
// Em React: cada seção é um componente separado.
// A página é só a composição deles.
// Isso é o princípio de Single Responsibility.
// ─────────────────────────────────────────────

import { Hero }            from '../components/Hero.jsx'
import { ProductsSection } from '../components/ProductsSection.jsx'
import { AboutSection }    from '../components/AboutSection.jsx'

export function Home() {
  return (
    <main>
      <Hero />
      <ProductsSection />
      <AboutSection />
    </main>
  )
}
