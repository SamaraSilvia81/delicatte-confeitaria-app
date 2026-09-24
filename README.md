# Delicatte Confeitaria — React

<div align="center">

![Status](https://img.shields.io/static/v1?label=STATUS&message=Em%20andamento&color=860120&style=for-the-badge)
![Tipo](https://img.shields.io/static/v1?label=TIPO&message=Projeto%20did%C3%A1tico&color=5c0116&style=for-the-badge)
![React](https://img.shields.io/static/v1?label=REACT&message=18&color=149eca&style=for-the-badge)
![Backend](https://img.shields.io/static/v1?label=BACKEND&message=Back4App&color=231f20&style=for-the-badge)

</div>

Loja virtual de uma confeitaria artesanal: vitrine de produtos, carrinho, cadastro e login de clientes, perfil com histórico de pedidos e painel administrativo.

Esta é a **versão React** do projeto. Ela nasceu da migração da [versão em HTML, CSS e JavaScript puro](https://github.com/SamaraSilvia81/delicatte-app-demo), que continua disponível como referência. O objetivo é mostrar, lado a lado, como cada conceito do JavaScript puro vira um conceito do React.

> Projeto didático desenvolvido para o Módulo 3 do curso técnico em Desenvolvimento de Sistemas da ETE Cícero Dias (Recife, PE).

---

## As versões do projeto

| Repositório | Stack | O que tem |
|---|---|---|
| [menu-delicatte](https://github.com/SamaraSilvia81/menu-delicatte) | HTML e CSS | Cardápio digital para uso via QR code |
| [delicatte-app-demo](https://github.com/SamaraSilvia81/delicatte-app-demo) | HTML, CSS e JavaScript (Vite) | Loja completa, incluindo checkout |
| **delicatte-confeitaria-app** (este) | React | Migração da loja para React |

## O que já funciona

| Funcionalidade | Status |
|---|---|
| Vitrine com filtro por categoria | Pronto |
| Carrinho em painel lateral | Pronto |
| Tema claro e escuro | Pronto |
| Cadastro e login de clientes | Pronto |
| Perfil: dados, troca de senha e histórico de pedidos | Pronto |
| Painel admin: produtos (CRUD), pedidos e métricas | Pronto |
| Finalizar pedido (checkout) | Ainda não. O botão mostra um aviso; na versão em JavaScript puro ele já funciona |

---

## Como rodar

**Pré-requisitos:** Node.js 18 ou superior e um app no [Back4App](https://back4app.com).

```bash
yarn                  # instala as dependências
cp .env.example .env  # depois preencha com as chaves do seu app no Back4App
yarn dev
```

Acesse `http://localhost:5173`.

| Variável | Onde encontrar |
|---|---|
| `VITE_BACK4APP_APP_ID` | Back4App → App Settings → Security & Keys → Application ID |
| `VITE_BACK4APP_JS_KEY` | Back4App → App Settings → Security & Keys → JavaScript key |

O `.env` está no `.gitignore` e nunca deve ser commitado. Para criar as classes, popular o banco e configurar as permissões, siga [Configurando o Back4App](docs/configurando-o-back4app.md).

| Rota | Tela |
|---|---|
| `/` | Loja |
| `/#/login` | Login e cadastro |
| `/#/profile` | Perfil do cliente |
| `/#/admin` | Painel administrativo (exige usuário com `role` igual a `admin`) |

---

## Documentação

| Se você quer... | Leia |
|---|---|
| Entender como o código está organizado | [Arquitetura](docs/arquitetura.md) |
| Ver cada chamada feita ao Back4App | [Referência da API](docs/api-back4app.md) |
| Conhecer as classes e os campos do banco | [Modelo de dados](docs/modelo-de-dados.md) |
| Configurar chaves, dados e permissões | [Configurando o Back4App](docs/configurando-o-back4app.md) |
| Comparar a versão em JavaScript puro com a React | [Migração JS → React](docs/migracao-js-para-react.md) |
| Saber o que ainda tem problema | [Problemas conhecidos](docs/problemas-conhecidos.md) |

---

## Próximos passos

- [ ] Checkout com `OrderService.create`, como na versão em JavaScript puro
- [ ] Trocar o roteamento por hash por `react-router-dom`
- [ ] Resolver os itens de [Problemas conhecidos](docs/problemas-conhecidos.md)

---

<div align="center">
  <sub>Projeto didático — ETE Cícero Dias · Recife, PE</sub>
</div>
