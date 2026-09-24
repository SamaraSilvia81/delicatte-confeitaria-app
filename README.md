# Delicatte Confeitaria — React

<div align="center">

![Status](https://img.shields.io/static/v1?label=STATUS&message=Em%20andamento&color=860120&style=for-the-badge)
![Tipo](https://img.shields.io/static/v1?label=TIPO&message=Projeto%20did%C3%A1tico&color=5c0116&style=for-the-badge)
![React](https://img.shields.io/static/v1?label=REACT&message=18&color=149eca&style=for-the-badge)
![Backend](https://img.shields.io/static/v1?label=BACKEND&message=Back4App&color=231f20&style=for-the-badge)

</div>

Loja virtual de uma confeitaria artesanal, com vitrine de produtos, carrinho e tema claro/escuro.

Esta é a **versão React** do projeto. Ela nasceu da migração da [versão em HTML, CSS e JavaScript puro](https://github.com/SamaraSilvia81/delicatte-app-demo), que continua disponível como referência. O objetivo é mostrar, lado a lado, como cada conceito do JavaScript puro vira um conceito do React.

> Projeto didático desenvolvido para o Módulo 3 do curso técnico em Desenvolvimento de Sistemas da ETE Cícero Dias (Recife, PE).

---

## As versões do projeto

| Repositório | Stack | O que tem |
|---|---|---|
| [menu-delicatte](https://github.com/SamaraSilvia81/menu-delicatte) | HTML e CSS | Cardápio digital para uso via QR code |
| [delicatte-app-demo](https://github.com/SamaraSilvia81/delicatte-app-demo) | HTML, CSS e JavaScript (Vite) | Loja completa: vitrine, login, perfil e painel administrativo |
| **delicatte-confeitaria-app** (este) | React | Migração da vitrine e do carrinho para React |

---

## Como rodar

**Pré-requisitos:** Node.js 18 ou superior e um app no [Back4App](https://back4app.com) com a classe `Product`.

```bash
# 1. Instalar dependências
npm install

# 2. Configurar as credenciais
cp .env.example .env
#    abra o .env e preencha com as chaves do seu app no Back4App

# 3. Iniciar
npm run dev
```

Acesse `http://localhost:5173`.

Para popular o banco com os 15 produtos de exemplo, use o script `npm run seed` do [delicatte-app-demo](https://github.com/SamaraSilvia81/delicatte-app-demo#-como-rodar). Os dois projetos usam o mesmo app no Back4App.

### Variáveis de ambiente

| Variável | Onde encontrar |
|---|---|
| `VITE_BACK4APP_APP_ID` | Back4App → App Settings → Security & Keys → Application ID |
| `VITE_BACK4APP_JS_KEY` | Back4App → App Settings → Security & Keys → JavaScript Key |

O arquivo `.env` está no `.gitignore` e nunca deve ser commitado.

> **Sobre segurança:** a JavaScript Key vai para o código que roda no navegador, então qualquer pessoa pode vê-la. Isso é esperado no Parse. O que protege os dados são as **Class Level Permissions** (CLP) de cada classe no Back4App: a vitrine só precisa de leitura pública em `Product`. A **REST Key** e a **Master Key** nunca devem aparecer no frontend.

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

---

## Próximos passos

- [ ] `react-router-dom` para navegação entre páginas
- [ ] Página de login e perfil, portando as da versão em JavaScript puro
- [ ] Checkout como componente React
- [ ] Painel administrativo

---

<div align="center">
  <sub>Projeto didático — ETE Cícero Dias · Recife, PE</sub>
</div>
