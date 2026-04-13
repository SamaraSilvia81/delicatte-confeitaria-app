// src/components/Footer.jsx

export function Footer() {
  return (
    <footer id="contato" role="contentinfo">
      <div className="footer-inner">

        <div className="footer-logo">
          Deli<em>catte</em>
        </div>

        <div className="footer-grid">
          <div>
            <p className="footer-desc">
              Confeitaria artesanal em Recife.
              Ingredientes selecionados e muito carinho em cada preparo.
            </p>
          </div>

          <div>
            <div className="footer-section-title">Navegação</div>
            <ul className="footer-links">
              <li><a href="#produtos">Produtos</a></li>
              <li><a href="#sobre">Nossa história</a></li>
              <li><a href="#">Acompanhar pedido</a></li>
            </ul>
          </div>

          <div>
            <div className="footer-section-title">Contato</div>
            <ul className="footer-links">
              <li>
                <a href="https://wa.me/5581999999999">
                  <i className="ph ph-whatsapp-logo" /> WhatsApp
                </a>
              </li>
              <li>
                <a href="mailto:ola@delicatte.com.br">
                  <i className="ph ph-envelope-simple" /> E-mail
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="ph ph-instagram-logo" /> Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2025 Delicatte Confeitaria. Todos os direitos reservados.</span>
          <span>
            Feito com <i className="ph ph-heart" style={{ color: 'var(--blush)' }} /> em Recife
          </span>
        </div>

      </div>
    </footer>
  )
}
