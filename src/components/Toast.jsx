// src/components/Toast.jsx
// ─────────────────────────────────────────────
// No HTML: Toast era um módulo que criava
// elementos DOM com createElement e os removia
// com setTimeout.
//
// Em React: é um componente declarativo.
// A lógica de exibição fica no pai (ProductsSection),
// aqui só a apresentação visual.
// ─────────────────────────────────────────────

const ICONS = {
  success: 'ph-check-circle',
  error:   'ph-warning-circle',
  info:    'ph-info',
}

export function Toast({ message, type = 'info' }) {
  return (
    <div
      className={`toast ${type}`}
      role="alert"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 9999,
      }}
    >
      <i className={`ph ${ICONS[type] ?? ICONS.info}`} style={{ fontSize: '1.1rem', flexShrink: 0 }} />
      <span>{message}</span>
    </div>
  )
}
