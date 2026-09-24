# Migração: JavaScript puro → React

Este projeto é a migração da [versão em HTML, CSS e JavaScript puro](https://github.com/SamaraSilvia81/delicatte-app-demo) para React. A camada de serviços (`src/services/`) foi mantida praticamente igual; o que mudou foi a forma de montar a interface e de guardar o estado.

A tabela abaixo mostra como cada técnica da versão original ficou no React.

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

## O que não mudou

- **`services/api.js` e `services/config.js`** são os mesmos nas duas versões. Por isso a [referência da API](api-back4app.md) vale para as duas.
- **O banco** é o mesmo app no Back4App.
- **Os estilos** vieram da versão original, divididos por tela em `src/styles/`.
