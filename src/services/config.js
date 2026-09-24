// src/services/config.js
// ─────────────────────────────────────────────
// PADRÃO: Singleton de configuração
// Todas as credenciais e constantes em um lugar.
// Credenciais: lidas das variáveis de ambiente (.env)
// ─────────────────────────────────────────────

export const CONFIG = {
  // Back4App — App: delicatte-app
  // As credenciais vêm do arquivo .env (veja .env.example).
  // Nunca escreva chaves direto neste arquivo.
  BACK4APP: {
    BASE_URL: 'https://parseapi.back4app.com',
    APP_ID:   import.meta.env.VITE_BACK4APP_APP_ID,
    JS_KEY:   import.meta.env.VITE_BACK4APP_JS_KEY,
  },

  // Chaves de localStorage
  STORAGE: {
    SESSION:  'delicatte_session',
    CART:     'delicatte_cart',
    THEME:    'delicatte_theme',
    SIDEBAR:  'delicatte_sidebar',
  },

  // Classes do Back4App
  CLASSES: {
    PRODUCT:  'Product',
    ORDER:    'Order',
    CATEGORY: 'Category',
  },
}
