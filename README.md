# Delicatte Confeitaria — React

> Versão React do projeto Delicatte · Módulo 3 · ETE Cícero Dias  
> Migração a partir da versão HTML/CSS/JS vanilla (v9)

---

## Como rodar

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`

---

## Estrutura de pastas

```
src/
│
├── main.jsx                ← Ponto de entrada. Monta o React no DOM.
├── App.jsx                 ← Componente raiz. Organiza Providers + layout.
│
├── assets/img/             ← Imagens importadas como módulos JS
│
├── context/                ← Estado global (substitui Observer Pattern do JS puro)
│   ├── CartContext.jsx     ← Carrinho acessível em qualquer componente
│   └── ThemeContext.jsx    ← Tema dark/light global
│
├── hooks/                  ← Lógica reutilizável encapsulada
│   ├── useProducts.js      ← Busca produtos na API (substitui loadProducts())
│   └── useToast.js         ← Sistema de notificações
│
├── services/               ← Comunicação com backend (igual à versão HTML)
│   ├── config.js           ← Credenciais e constantes
│   └── api.js              ← Axios + ProductService, SessionService
│
├── components/             ← Blocos visuais reutilizáveis
│   ├── Navbar.jsx
│   ├── Banner.jsx
│   ├── Hero.jsx
│   ├── ProductCard.jsx     ← Recebe um produto via props
│   ├── ProductsSection.jsx ← Filtros + lista de cards
│   ├── AboutSection.jsx
│   ├── CartDrawer.jsx      ← Painel lateral do carrinho
│   ├── Footer.jsx
│   └── Toast.jsx
│
├── pages/                  ← Uma "tela" = composição de componentes
│   └── Home.jsx
│
└── styles/
    ├── global.css          ← Design tokens, tipografia, botões
    ├── index.css           ← Estilos da landing page
    └── cart.css            ← Drawer, cards, skeleton, toast
```

---

## HTML puro → React: comparativo

| Conceito HTML puro | Equivalente React |
|---|---|
| `innerHTML` / `createElement` | JSX (componentes) |
| `querySelector` + `classList` | `useState` + re-render |
| `addEventListener('click', fn)` | `onClick={fn}` |
| Observer Pattern (cart.js) | Context API + useReducer |
| ThemeManager singleton | ThemeContext + useEffect |
| `loadProducts()` + DOM | hook `useProducts()` |
| `display: none` para esconder | `{condition && <Component />}` |
| `forEach` + `innerHTML` | `.map()` em JSX |

---

## Próximos passos

- [ ] `react-router-dom` para navegação (Login, Perfil)
- [ ] Checkout como componente React
- [ ] Página de Login e Perfil
