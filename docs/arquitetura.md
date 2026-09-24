# Arquitetura

O app é um frontend React sem servidor próprio. Todos os dados ficam no [Back4App](https://back4app.com), acessado pela API REST do Parse.

## Camadas

```
pages/          Telas: Home, LoginPage, ProfilePage, AdminPage
   │
components/     Blocos visuais reutilizáveis (Navbar, ProductCard, CartDrawer...)
   │
context/ hooks/ Estado global e lógica reutilizável
   │            AuthContext, CartContext, ThemeContext, useProducts, useToast
   │
services/       Toda comunicação com o backend
   │            api.js (ApiService, AuthService, ProductService, OrderService, SessionService)
   │            config.js (credenciais e constantes)
   ▼
Back4App        API REST do Parse Server
```

**Regra:** componentes e páginas nunca chamam o `axios` diretamente. Tudo passa pelos serviços de `api.js`. Assim, trocar o backend significaria mexer só nessa camada.

---

## Padrões de projeto usados

| Padrão | Onde | Para quê |
|---|---|---|
| **Singleton** | `ApiService` | Uma única instância do Axios, criada na primeira chamada, com a URL base e os cabeçalhos do Back4App |
| **Module Pattern** | `ApiService` (IIFE) | Esconde a instância e as funções internas; só `get`, `post`, `put` e `delete` ficam públicas |
| **Facade** | `SessionService` | Interface simples (`save`, `get`, `clear`, `isLoggedIn`, `isAdmin`) sobre o `localStorage` |
| **Interceptor** | `ApiService` | Injeta o token da sessão em toda requisição e trata sessão expirada |
| **Context API** | `CartContext`, `ThemeContext`, `AuthContext` | Estado global. Substitui o Observer Pattern da versão em JavaScript puro |

---

## Autenticação e sessão

1. O login chama `AuthService.login`, que autentica no Back4App e recebe um `sessionToken`.
2. O papel do usuário (`customer` ou `admin`) é lido do campo `role` do usuário.
3. A sessão é salva no `localStorage`, na chave `delicatte_session`:

   ```json
   {
     "token": "r:abc123...",
     "userId": "FhYiyWSjF7",
     "username": "cliente@email.com",
     "name": "Carla",
     "role": "customer",
     "avatar": null
   }
   ```

4. A partir daí, o interceptor do `ApiService` envia o token no cabeçalho `X-Parse-Session-Token` de toda requisição.

> O acesso ao painel admin é decidido no navegador, lendo o `role` da sessão. Isso organiza a navegação, mas não é uma barreira de segurança. Quem protege os dados são as permissões do Back4App. Veja [Problemas conhecidos](problemas-conhecidos.md).

---

## Roteamento

Não há `react-router`. O `App.jsx` lê o hash da URL e decide qual tela mostrar:

| Hash | Tela |
|---|---|
| vazio ou `#/` | Home (loja) |
| `#/login` | LoginPage |
| `#/profile` | ProfilePage |
| `#/admin` | AdminPage |

O botão voltar do navegador funciona porque o app escuta o evento `hashchange`.

---

## Dados guardados no navegador

| Chave do `localStorage` | Conteúdo |
|---|---|
| `delicatte_session` | Sessão do usuário logado |
| `delicatte_cart` | Itens do carrinho |
| `delicatte_theme` | Tema escolhido (claro ou escuro) |
| `delicatte_sidebar` | Estado da barra lateral do painel admin |

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
│   ├── AuthContext.jsx     ← Sessão do usuário logado
│   ├── CartContext.jsx     ← Carrinho acessível em qualquer componente
│   └── ThemeContext.jsx    ← Tema dark/light global
│
├── hooks/                  ← Lógica reutilizável encapsulada
│   ├── useProducts.js      ← Busca produtos na API (substitui loadProducts())
│   └── useToast.js         ← Sistema de notificações
│
├── services/               ← Comunicação com backend (igual à versão HTML)
│   ├── config.js           ← Credenciais e constantes
│   └── api.js              ← Axios + Api, Auth, Product, Order e Session services
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
│   ├── Home.jsx            ← Loja
│   ├── LoginPage.jsx       ← Login e cadastro
│   ├── ProfilePage.jsx     ← Perfil e histórico de pedidos
│   └── AdminPage.jsx       ← Painel administrativo
│
└── styles/
    ├── global.css          ← Design tokens, tipografia, botões
    ├── index.css           ← Estilos da landing page
    ├── cart.css            ← Drawer, cards, skeleton, toast
    ├── login.css           ← Tela de login
    └── admin.css           ← Painel administrativo
```
