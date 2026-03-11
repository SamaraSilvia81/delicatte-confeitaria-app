# Delicatte Confeitaria

## Rodando o projeto

```bash
npm install   # ou: yarn
npm run dev   # inicia em localhost:3000
```

## Mapa de rotas

| URL | O que é |
|-----|---------|
| `localhost:3000/` | Landing page (loja pública) |
| `localhost:3000/admin` | **Login secreto do admin** ← entre aqui |
| `localhost:3000/src/admin/index.html` | Painel admin (só abre se já logado como admin) |
| `localhost:3000/src/pages/login.html` | Login do cliente |

## Para ativar sua conta como admin

1. Acesse [back4app.com](https://back4app.com) → seu app → **Database → _User**
2. Encontre seu usuário
3. Adicione o campo `role` com o valor `"admin"`
4. Salve

Depois disso, ao fazer login em `localhost:3000/admin`, você vai direto pro painel.

## Painel admin — o que tem

- **Dashboard** — métricas de pedidos, faturamento, clientes
- **Produtos** — criar, editar, excluir produtos
- **Pedidos** — ver e atualizar status dos pedidos
- **Configurações** — perfil do admin, toggle de tema
