// src/services/config.js
// ─────────────────────────────────────────────
// PADRÃO: Singleton de configuração
// Todas as credenciais e constantes em um lugar.
// Em produção: usar variáveis de ambiente (.env)
// ─────────────────────────────────────────────

export const CONFIG = {
  // Back4App — App: delicatte-app
  BACK4APP: {
    BASE_URL:   'https://parseapi.back4app.com',
    APP_ID:     'gIzxO3tBSpMQ5yf8vEc16I4fRjeutu3a8mIuKdse',
    JS_KEY:     'AU5VUjzMDF86hEwqotbU4fK05BGUvRZwxRougn3G',
    REST_KEY:   'nUaXboH7fQKOi4p9N409P2xALHLWeJbXedaiUUV6',
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
