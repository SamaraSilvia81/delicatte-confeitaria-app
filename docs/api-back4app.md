# Referência da API

Todas as chamadas que o app faz ao Back4App. O Back4App roda o [Parse Server](https://docs.parseplatform.org/rest/guide/), então as rotas abaixo são as da API REST do Parse.

O código fica em `src/services/api.js` e é o mesmo na [versão em JavaScript puro](https://github.com/SamaraSilvia81/delicatte-app-demo).

**Nesta página:** [Configuração comum](#configuração-comum) · [AuthService](#authservice) · [ProductService](#productservice) · [OrderService](#orderservice) · [SessionService](#sessionservice) · [Erros](#erros)

---

## Configuração comum

**URL base:** `https://parseapi.back4app.com`

**Cabeçalhos enviados em toda requisição:**

| Cabeçalho | Valor | Quando |
|---|---|---|
| `X-Parse-Application-Id` | `VITE_BACK4APP_APP_ID` | Sempre |
| `X-Parse-JavaScript-Key` | `VITE_BACK4APP_JS_KEY` | Sempre |
| `Content-Type` | `application/json` | Sempre |
| `X-Parse-Session-Token` | Token da sessão | Quando há usuário logado. Injetado automaticamente pelo interceptor |

**Exemplo equivalente com cURL** (listar produtos):

```bash
curl -X GET "https://parseapi.back4app.com/classes/Product?order=name&limit=100" \
  -H "X-Parse-Application-Id: $VITE_BACK4APP_APP_ID" \
  -H "X-Parse-JavaScript-Key: $VITE_BACK4APP_JS_KEY"
```

**Coluna "Permissão necessária":** indica o que precisa estar liberado nas Class Level Permissions do Back4App para a chamada funcionar. Veja [Configurando o Back4App](configurando-o-back4app.md#permissões).

---

## AuthService

### `login(username, password)`

Autentica o usuário e salva a sessão.

| | |
|---|---|
| **Requisição** | `GET /login?username={username}&password={password}` |
| **Depois** | `GET /users/me` com o novo token, para ler o `role` |
| **Retorna** | O usuário do Parse com o campo `role` |
| **Efeito** | Salva a sessão em `delicatte_session` |

Se o login falhar e o valor digitado for um e-mail, o serviço tenta de novo com a parte antes do `@`. Isso cobre usuários cadastrados com um `username` diferente do e-mail.

Se o `role` não puder ser lido, o usuário entra como `customer`.

### `register({ name, email, password })`

Cria uma conta de cliente.

| | |
|---|---|
| **Requisição** | `POST /users` |
| **Retorna** | `{ objectId, createdAt, sessionToken }` |

Corpo enviado:

```json
{
  "username": "carla@email.com",
  "email": "carla@email.com",
  "password": "********",
  "name": "Carla",
  "role": "customer"
}
```

O e-mail é usado também como `username`. O cadastro não faz login sozinho: a `LoginPage` chama `login` logo em seguida.

### `logout()`

| | |
|---|---|
| **Requisição** | `POST /logout` |
| **Efeito** | Apaga a sessão local, mesmo se a requisição falhar |

### `updateProfile({ name, phone, avatar })`

Atualiza os dados do usuário logado. Só os campos informados são enviados.

| | |
|---|---|
| **Requisição** | `PUT /users/{userId}` |
| **Corpo** | `{ "name": "...", "phone": "...", "avatar": "..." }` |
| **Lança** | `Error('Não autenticado')` se não houver sessão |
| **Efeito** | Atualiza `name` e `avatar` na sessão local |

### `changePassword(oldPassword, newPassword)`

| | |
|---|---|
| **Requisição 1** | `GET /login` com a senha antiga, para confirmar que ela está certa |
| **Requisição 2** | `PUT /users/{userId}` com `{ "password": "..." }` |

Se a senha antiga estiver errada, a primeira requisição falha e a senha não é alterada.

### `requireAuth()` e `requireAdmin()`

Guardas de navegação. Não fazem requisição.

| Função | Sem sessão | Com sessão, mas sem permissão |
|---|---|---|
| `requireAuth` | Redireciona para `/login` | — |
| `requireAdmin` | Redireciona para `/admin` e retorna `false` | Redireciona para `/` e retorna `false` |

---

## ProductService

Classe no Back4App: `Product`. Campos em [Modelo de dados](modelo-de-dados.md#product).

| Função | Requisição | Retorna | Usada em | Permissão necessária |
|---|---|---|---|---|
| `getAll(filters)` | `GET /classes/Product` | Lista de produtos | Loja, painel admin | Leitura pública |
| `getById(id)` | `GET /classes/Product/{id}` | Um produto | — | Leitura pública |
| `create(data)` | `POST /classes/Product` | `{ objectId, createdAt }` | Painel admin | Escrita para o admin |
| `update(id, data)` | `PUT /classes/Product/{id}` | `{ updatedAt }` | Painel admin | Escrita para o admin |
| `delete(id)` | `DELETE /classes/Product/{id}` | `{}` | Painel admin | Escrita para o admin |

### Filtros de `getAll`

| Filtro | Tipo | Efeito |
|---|---|---|
| `category` | `string` | Só produtos da categoria. `'all'` ou ausente não filtra |
| `featured` | `boolean` | Se `true`, só produtos em destaque |

A lista vem ordenada por nome, com no máximo 100 produtos. Os filtros viram o parâmetro `where` do Parse:

```
GET /classes/Product?order=name&limit=100&where={"category":"bolos","featured":true}
```

---

## OrderService

Classe no Back4App: `Order`. Campos em [Modelo de dados](modelo-de-dados.md#order).

| Função | Requisição | Retorna | Usada em | Permissão necessária |
|---|---|---|---|---|
| `getAll()` | `GET /classes/Order?order=-createdAt&limit=100` | Lista de pedidos, do mais recente para o mais antigo | Perfil, painel admin | Leitura para usuários logados |
| `create(items, total)` | `POST /classes/Order` | `{ objectId, createdAt }` | Só na versão em JavaScript puro | Criação para visitantes e usuários logados |
| `updateStatus(id, status)` | `PUT /classes/Order/{id}` | `{ updatedAt }` | Painel admin | Escrita para o admin |

### Corpo de `create`

```json
{
  "items": [ { "objectId": "abc123", "name": "Bolo Red Velvet", "price": 89.9, "qty": 2 } ],
  "total": 179.8,
  "status": "pending",
  "customerId": "ApejlT1Cq0",
  "customerName": "Carla"
}
```

Sem usuário logado, `customerId` vira `"guest"` e `customerName` vira `"Visitante"`.

> `getAll` traz **todos** os pedidos. O perfil filtra os do cliente no navegador. Veja [Problemas conhecidos](problemas-conhecidos.md).

---

## SessionService

Não faz requisições. Lê e grava a sessão no `localStorage`, na chave `delicatte_session`.

| Função | Retorna |
|---|---|
| `save(data)` | — |
| `get()` | O objeto da sessão, ou `null` |
| `clear()` | — |
| `isLoggedIn()` | `true` se houver token |
| `isAdmin()` | `true` se `role` for `admin` |

---

## Erros

O Parse responde erros com status HTTP 4xx e um corpo neste formato:

```json
{ "code": 101, "error": "Invalid username/password." }
```

Códigos mais comuns neste app:

| `code` | Significado | Onde aparece |
|---|---|---|
| `101` | Usuário ou senha inválidos, ou objeto não encontrado | Login, troca de senha |
| `119` | Operação bloqueada pelas permissões da classe | Qualquer escrita sem permissão |
| `202` | Nome de usuário já existe | Cadastro |
| `203` | E-mail já cadastrado | Cadastro |
| `209` | Token de sessão inválido ou expirado | Qualquer chamada autenticada |

Os serviços não traduzem esses erros: eles repassam o erro do Axios para quem chamou. A mensagem do Parse fica em `err.response.data.error`.
