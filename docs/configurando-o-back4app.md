# Configurando o Back4App

Como preparar um app no Back4App para rodar o Delicatte: criar o app, pegar as chaves, popular o banco, criar o admin e configurar as permissões.

---

## 1. Criar o app e pegar as chaves

1. Crie um app em [back4app.com](https://back4app.com).
2. Vá em **App Settings → Security & Keys**.
3. Copie para o seu `.env`:
   - **Application ID** → `VITE_BACK4APP_APP_ID`
   - **JavaScript key** → `VITE_BACK4APP_JS_KEY`

### Quais chaves podem ir para o frontend

| Chave | No frontend? | Por quê |
|---|---|---|
| Application ID | Sim | Identifica o app. Não é segredo |
| JavaScript key | Sim | Feita para clientes JavaScript. Fica visível para quem abrir o site, e isso é esperado |
| REST API key | **Nunca** | Para servidores e scripts. Aqui, só no seed da versão em JavaScript puro |
| Master key | **Nunca** | Ignora todas as permissões |

Como a JavaScript key é pública por natureza, **quem protege os dados são as permissões** (passo 4).

### Se uma chave vazar

Em **Security & Keys**, clique em **Change** ao lado dela. A chave antiga para de funcionar na hora. Depois atualize o `.env` e as variáveis de qualquer ambiente de deploy.

---

## 2. Popular o banco

A classe `Product` é criada automaticamente na primeira gravação. Para ter os 15 produtos de exemplo, rode o seed da [versão em JavaScript puro](https://github.com/SamaraSilvia81/delicatte-app-demo#-como-rodar) apontando para o mesmo app. Rode só uma vez, senão os produtos são duplicados.

---

## 3. Criar o usuário admin

1. Cadastre-se normalmente pelo app, em `/#/login`.
2. No Back4App, vá em **Database → _User** e encontre o seu usuário.
3. Mude o campo `role` para `admin`.
4. Faça login de novo. O acesso a `/#/admin` passa a funcionar.

Anote o `objectId` desse usuário: ele é usado no próximo passo.

---

## 4. Permissões

Em **Database**, abra cada classe e clique no ícone de cadeado ao lado do nome dela para abrir as **Class Level Permissions** (CLP). A CLP diz quem pode ler e quem pode escrever em cada classe.

Para dar permissão a um usuário específico, digite o `objectId` dele no campo **Add Role** e confirme com Enter. Use o modo **Advanced** quando precisar separar criar, editar e apagar.

### Configuração recomendada

| Classe | Public | Authenticated | Usuário admin |
|---|---|---|---|
| `Product` | Leitura | — | Leitura e escrita |
| `Order` | Criar (só se o pedido sem login for desejado) | Criar e ler | Ler e editar |
| `_User` | Padrão do Parse, sem Add field | Padrão do Parse, sem Add field | — |
| `_Role`, `_Session` | Não alterar | Não alterar | — |

Em todas as classes, desmarque **Add field** para Public e Authenticated. Senão qualquer pessoa pode criar colunas novas no banco.

### Depois de configurar, teste

1. Abrir a loja sem login e ver os produtos.
2. Cadastrar e logar como cliente.
3. Ver o histórico no perfil.
4. No painel admin: editar um produto e avançar o status de um pedido.

Se algo parar de funcionar, falta liberar alguma permissão para aquele grupo.

As permissões resolvem boa parte da segurança, mas não tudo. O que elas não cobrem está em [Problemas conhecidos](problemas-conhecidos.md).
