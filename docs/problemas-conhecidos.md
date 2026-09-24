# Problemas conhecidos

Limitações e bugs identificados na revisão do código. Como é um projeto didático, eles estão registrados aqui em vez de escondidos. Vários são bons exercícios de correção.

---

## Segurança

### Qualquer pessoa pode se cadastrar como admin

O cadastro envia `role: "customer"` a partir do navegador. Quem chamar a API diretamente pode enviar `role: "admin"` e ganhar acesso ao painel. As permissões de classe não impedem isso, porque controlam a classe inteira, não campos específicos.

**Correção:** um gatilho `beforeSave` no Cloud Code do Back4App que ignore o `role` enviado pelo cliente, ou usar as Roles do próprio Parse (`_Role`) no lugar do campo `role`.

### O acesso ao painel admin é decidido no navegador

`requireAdmin()` e `isAdmin()` leem o `role` salvo no `localStorage`. Isso controla a navegação, mas não protege os dados: quem protege são as permissões do Back4App.

### Todo usuário logado consegue ler todos os pedidos

`OrderService.getAll()` busca todos os pedidos, e o perfil filtra os do cliente no navegador, por `customerId` ou por `customerName`. Na prática:

- qualquer usuário logado consegue consultar os pedidos de todos pela API;
- dois clientes com o mesmo nome veem os pedidos um do outro no perfil.

**Correção:** filtrar no servidor com `where={"customerId":"..."}` e usar permissão por registro (ACL) em cada pedido.

### O total do pedido é calculado no navegador

O `total` é enviado pelo cliente. Quem chamar a API diretamente pode criar um pedido com qualquer valor. Na correção, o total seria recalculado no Cloud Code a partir dos preços reais.

### A senha vai na URL no login

O login usa `GET /login?username=...&password=...`. O Parse aceita, mas dados na URL podem ficar registrados em logs e no histórico. A API do Parse também aceita `POST /login` com os dados no corpo, que é a forma recomendada.

---

## Bugs

### Sessão expirada não é detectada

O interceptor do `ApiService` verifica `err.response?.status === 209`. Mas o Parse responde com status HTTP **400** e o código `209` no corpo da resposta. A condição nunca é verdadeira, e o usuário com sessão expirada não é deslogado.

**Correção:**

```js
if (err.response?.data?.code === 209) {
```

### O redirecionamento aponta para uma rota que não existe

Quando a sessão expira (depois da correção acima), o interceptor manda para `/login`, e `requireAuth()` faz o mesmo. Mas o app usa rotas com hash: a tela de login está em `/#/login`. Em hospedagem estática, `/login` pode dar erro 404.

### O checkout ainda não funciona na versão React

O botão **Finalizar pedido** mostra um aviso. O `OrderService.create` já existe e funciona na versão em JavaScript puro; falta chamar no `CartDrawer`.
