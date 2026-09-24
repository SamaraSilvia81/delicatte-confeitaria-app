# Modelo de dados

As classes que o app usa no Back4App. Cada classe funciona como uma tabela. Além dos campos abaixo, o Parse cria automaticamente `objectId`, `createdAt`, `updatedAt` e `ACL` em todas.

---

## Product

Produtos da vitrine. São criados pelo painel admin ou pelo script de seed da [versão em JavaScript puro](https://github.com/SamaraSilvia81/delicatte-app-demo).

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `name` | String | sim | Nome do produto |
| `price` | Number | sim | Preço em reais |
| `category` | String | sim | `bolos`, `tortas`, `docinhos` ou `sobremesas` |
| `description` | String | não | Descrição exibida no card e no modal |
| `imageUrl` | String | não | URL da foto |
| `featured` | Boolean | não | Produto em destaque |
| `serves` | String | não | Rendimento, ex.: `"10–12 fatias"` |
| `weight` | String | não | Peso, ex.: `"1,2 kg"` |

O formulário do painel admin edita `name`, `price`, `category`, `description`, `imageUrl` e `featured`. Os campos `serves` e `weight` vêm do seed.

---

## Order

Pedidos feitos na loja.

| Campo | Tipo | Descrição |
|---|---|---|
| `items` | Array | Produtos do carrinho, cada um com os dados do produto e `qty` |
| `total` | Number | Valor total, calculado no navegador |
| `status` | String | Etapa do pedido (tabela abaixo) |
| `customerId` | String | `objectId` do cliente, ou `"guest"` sem login |
| `customerName` | String | Nome do cliente, ou `"Visitante"` sem login |

### Etapas do pedido

O painel admin avança o pedido uma etapa por vez:

```
pending → confirmed → preparing → ready → delivered
```

| `status` | Rótulo na tela |
|---|---|
| `pending` | Pendente |
| `confirmed` | Confirmado |
| `preparing` | Preparando |
| `ready` | Pronto |
| `delivered` | Entregue |
| `cancelled` | Cancelado (existe o rótulo, mas nenhuma tela leva a esse estado ainda) |

---

## _User

Classe de usuários do próprio Parse. O app acrescenta alguns campos.

| Campo | Tipo | Descrição |
|---|---|---|
| `username` | String | Igual ao e-mail |
| `email` | String | E-mail |
| `password` | String | Senha. O Parse guarda criptografada e nunca devolve |
| `name` | String | Nome exibido |
| `role` | String | `customer` ou `admin` |
| `phone` | String | Telefone ou WhatsApp, preenchido no perfil |
| `avatar` | String | Imagem do perfil |

---

## Category

Aparece em `config.js` (`CLASSES.CATEGORY`), mas o app ainda não lê essa classe: as categorias são textos fixos no campo `category` de `Product`.
