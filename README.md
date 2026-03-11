# 🍰 Delicatte Confeitaria

> Sistema de loja virtual artesanal com painel administrativo integrado — desenvolvido para pequenos negócios de confeitaria que precisam de presença digital com gestão própria.

---

## 📌 O que é este projeto?

**Delicatte** é uma aplicação web completa para uma confeitaria artesanal. Ela combina uma vitrine pública para clientes com um painel administrativo privado, permitindo que o negócio gerencie produtos e pedidos sem depender de plataformas de terceiros como iFood ou Instagram.

O projeto é inteiramente **frontend**, sem servidor próprio — toda a persistência de dados é feita via **Back4App** (Backend as a Service baseado em Parse Server).

---

## 🎯 Objetivo

Oferecer à proprietária de uma confeitaria artesanal uma ferramenta simples e bonita que:

- Mostre os produtos de forma atrativa para clientes
- Permita que clientes façam pedidos e acompanhem o histórico
- Dê à administradora controle total sobre produtos, pedidos e status — sem precisar de um desenvolvedor para operações do dia a dia

---

## 🛠️ Stack Técnica

| Tecnologia | Papel |
|---|---|
| **Vite** | Bundler e servidor de desenvolvimento |
| **Vanilla JS (ES Modules)** | Lógica da aplicação |
| **TailwindCSS** | Utilitários de estilo |
| **CSS customizado** | Design system próprio (variáveis, temas) |
| **Axios** | Requisições HTTP |
| **Back4App (Parse)** | Banco de dados, autenticação, armazenamento |
| **Phosphor Icons** | Ícones |

---

## ⚙️ Requisitos

- Node.js `>= 18`
- npm ou yarn
- Conta no [Back4App](https://back4app.com) com as classes `Product`, `Order` e `_User` configuradas

---

## 🚀 Como rodar

```bash
# 1. Instalar dependências
npm install

# 2. Popular banco com produtos de exemplo (opcional)
npm run seed

# 3. Iniciar servidor de desenvolvimento
npm run dev
# → http://localhost:3000
```

---

## 🗺️ Mapa de rotas

| URL | O que é |
|---|---|
| `localhost:3000/` | Loja pública (vitrine de produtos) |
| `localhost:3000/src/pages/login.html` | Login e cadastro do cliente |
| `localhost:3000/src/pages/profile.html` | Perfil do cliente + histórico de pedidos |
| `localhost:3000/admin` | Login do administrador (área restrita) |
| `localhost:3000/src/admin/index.html` | Painel administrativo (só acessa com role `admin`) |

> **Como o sistema diferencia admin de cliente:** pela URL de acesso. Quem entra por `/admin` está no fluxo de administrador. A sessão salva o campo `role` (`admin` ou `customer`) e os guards de rota protegem cada área.

---

## 🔐 Configuração do usuário admin

O sistema não cria um admin automaticamente. Para ativar:

1. Acesse [back4app.com](https://back4app.com) → seu app → **Database → _User**
2. Encontre (ou crie) o usuário desejado
3. Adicione o campo `role` com o valor `"admin"`
4. Salve

A partir disso, ao logar em `/admin`, o sistema reconhece o papel e libera o painel.

---

## 📁 Estrutura do projeto

```
delicatte/
├── index.html                  # Loja pública
├── admin/
│   └── index.html              # Login admin
├── src/
│   ├── admin/
│   │   └── index.html          # Painel admin (dashboard, produtos, pedidos)
│   ├── pages/
│   │   ├── login.html          # Login + cadastro de clientes
│   │   └── profile.html        # Perfil do cliente
│   ├── services/
│   │   ├── api.js              # ApiService, AuthService, ProductService, OrderService
│   │   └── config.js           # Configurações e credenciais Back4App
│   ├── hooks/
│   │   └── cart.js             # CartService (estado do carrinho)
│   ├── components/
│   │   └── ProductCard.js      # Componente de card de produto
│   ├── utils/
│   │   └── ui.js               # ThemeManager, Toast, Validators, helpers
│   └── styles/                 # CSS global, componentes, temas
└── scripts/
    └── seed.js                 # Script de seed de produtos
```

---

## 🧠 Design Thinking

### Empatia — Entendendo o contexto

O projeto partiu de uma observação real: **pequenas confeitarias artesanais dependem quase que exclusivamente de WhatsApp e Instagram** para vender. Isso cria fricção para o cliente (que não tem histórico de pedidos, precisa negociar por mensagem) e sobrecarga para a proprietária (que gerencia tudo manualmente).

A pergunta central foi:

> *"Como podemos dar a uma confeiteira artesanal o mesmo poder de uma loja virtual, sem a complexidade de uma?"*

---

### Personas

#### 👩‍🍳 Hailey — A Proprietária (Administradora)

| | |
|---|---|
| **Idade** | 34 anos |
| **Contexto** | Confeiteira por paixão, empreendedora por necessidade. Gerencia tudo sozinha — produção, vendas e entrega. |
| **Tecnologia** | Usa smartphone bem, computador razoavelmente. Não tem conhecimento técnico. |
| **Dores** | Perde pedidos por esquecer conversas no WhatsApp. Não sabe quais produtos vendem mais. Tem medo de mexer em "sistema". |
| **Desejos** | Ver os pedidos organizados. Mudar o preço de um produto sem pedir ajuda para ninguém. Sentir que o negócio tem cara profissional. |
| **Frase** | *"Eu sei fazer o bolo. Só quero que o sistema não me atrapalhe."* |

---

#### 🛍️ Carla — A Cliente Fiel

| | |
|---|---|
| **Idade** | 28 anos |
| **Contexto** | Trabalha em escritório, compra doces para eventos do trabalho e datas especiais. Já é cliente recorrente. |
| **Tecnologia** | Nativa digital, compra online com frequência. |
| **Dores** | Não lembra o que pediu da última vez. Precisa ficar mandando mensagem para saber se o pedido foi confirmado. |
| **Desejos** | Ver o cardápio completo com fotos e preços. Ter confirmação do pedido. Rever o histórico antes de encomendar de novo. |
| **Frase** | *"Se tivesse um site bonitinho eu já tinha indicado pra todo mundo."* |

---

### Jornada do Usuário

#### Jornada da Cliente (Carla)

```
[Descoberta]
Recebe indicação → Acessa o site → Vê a vitrine de produtos
        ↓
[Consideração]
Navega pelos produtos → Filtra por categoria → Lê descrições e preços
        ↓
[Decisão]
Adiciona ao carrinho → Revisa o pedido → Faz login (ou cria conta)
        ↓
[Compra]
Finaliza o pedido → Recebe confirmação → Pedido registrado no perfil
        ↓
[Pós-compra]
Acessa "Meus pedidos" → Acompanha o status → Repete o pedido facilmente
```

#### Jornada da Administradora (Samara)

```
[Gestão diária]
Acessa /admin → Faz login → Vai ao Dashboard
        ↓
[Pedidos]
Vê novos pedidos → Atualiza status (pendente → confirmado → entregue)
        ↓
[Cardápio]
Precisa mudar preço → Vai em Produtos → Edita direto na listagem
        ↓
[Novos produtos]
Cria produto novo → Preenche nome, preço, categoria, imagem → Publica
        ↓
[Controle]
Verifica faturamento no dashboard → Identifica produtos mais vendidos
```

---

### Definição do problema (POV — Point of View)

> Samara, uma confeiteira artesanal que gerencia tudo sozinha, **precisa de uma forma de organizar pedidos e manter seu cardápio atualizado** porque hoje ela perde vendas e tempo gerenciando tudo por conversas de WhatsApp.

> Carla, uma cliente fiel de confeitaria, **precisa ver o cardápio completo e acompanhar seus pedidos** porque hoje ela não tem visibilidade do status e precisa ficar perguntando por mensagem.

---

### Como poderíamos...? (HMW)

- Como poderíamos deixar o cadastro de produto tão simples que a Samara não precisasse de ajuda?
- Como poderíamos dar à Carla a sensação de que seu pedido está sendo cuidado?
- Como poderíamos separar a área do admin da loja sem confundir quem acessa?
- Como poderíamos mostrar o histórico de pedidos de forma que a Carla queira repetir a compra?

---

### Prototipação — Decisões de design

| Decisão | Justificativa |
|---|---|
| **Identificação por URL** (`/admin`) | Evita um seletor "sou cliente / sou admin" que confunde. A URL é a intenção. |
| **Tema claro para loja, escuro para admin** | Reforça visualmente a separação de contextos. |
| **Sem redirecionamento automático na loja** | Admin pode navegar na vitrine normalmente. O botão "Painel Admin" é o caminho, não uma armadilha. |
| **Sessão única por contexto** | Ao acessar `/admin`, sessão de cliente é limpa automaticamente para evitar conflitos. |
| **Perfil com histórico de pedidos** | Principal motivador de cadastro para o cliente. Sem isso, criar conta não faz sentido. |
| **Toast de feedback em todas as ações** | Reduz ansiedade do usuário — sempre sabe se a ação funcionou. |

---

## 🔄 Padrões de código

O projeto aplica alguns padrões intencionais documentados no código:

- **Singleton** — `ApiService` e `CONFIG` têm instância única
- **Module Pattern (IIFE)** — encapsula estado interno sem poluir o escopo global
- **Facade** — `SessionService` abstrai o `localStorage`
- **Strategy Pattern** — validação de formulários com array de validators plugáveis
- **Observer** — `CartService.subscribe()` notifica componentes sobre mudanças no carrinho

---

## 📝 Licença

Projeto desenvolvido para uso interno da Delicatte Confeitaria.
