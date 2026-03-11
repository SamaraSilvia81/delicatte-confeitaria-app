// scripts/seed.js
// ─────────────────────────────────────────────
// Popula o Back4App com 15 produtos da Delicatte.
// Rodar: npm run seed
// ─────────────────────────────────────────────

const APP_ID   = 'gIzxO3tBSpMQ5yf8vEc16I4fRjeutu3a8mIuKdse'
const REST_KEY = 'nUaXboH7fQKOi4p9N409P2xALHLWeJbXedaiUUV6'
const BASE_URL = 'https://parseapi.back4app.com'

const HEADERS = {
  'X-Parse-Application-Id':  APP_ID,
  'X-Parse-REST-API-Key':     REST_KEY,
  'Content-Type':             'application/json',
}

// ── 15 produtos da confeitaria ─────────────
const PRODUCTS = [
  {
    name:        'Bolo Red Velvet',
    description: 'Massa aveludada cor vinho com recheio e cobertura de cream cheese suave. Uma experiência única em cada fatia.',
    price:        89.90,
    category:    'bolos',
    featured:     true,
    imageUrl:    'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&q=80',
    serves:       '10–12 fatias',
    weight:       '1,2 kg',
  },
  {
    name:        'Torta de Limão Siciliano',
    description: 'Base crocante de biscoito amanteigado, creme cítrico intenso e merengue italiano tostado na hora do pedido.',
    price:        72.00,
    category:    'tortas',
    featured:     true,
    imageUrl:    'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=600&q=80',
    serves:       '8–10 fatias',
    weight:       '900 g',
  },
  {
    name:        'Brigadeiro Gourmet Belga',
    description: 'Feito com cacau premium belga 70%, manteiga francesa e granulado artesanal. Vendido por unidade.',
    price:         6.50,
    category:    'docinhos',
    featured:     true,
    imageUrl:    'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80',
    serves:       '1 unidade',
    weight:       '25 g',
  },
  {
    name:        'Cheesecake de Morango',
    description: 'Base de biscoito, recheio de cream cheese New York style com calda de morango fresco ao topo.',
    price:        78.00,
    category:    'tortas',
    featured:     false,
    imageUrl:    'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&q=80',
    serves:       '8–10 fatias',
    weight:       '950 g',
  },
  {
    name:        'Bolo de Cenoura com Chocolate',
    description: 'Clássico revisitado. Cenoura fresca processada na massa, cobertura de ganache de chocolate meio amargo.',
    price:        55.00,
    category:    'bolos',
    featured:     false,
    imageUrl:    'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=600&q=80',
    serves:       '10–12 fatias',
    weight:       '1,0 kg',
  },
  {
    name:        'Mousse de Maracujá',
    description: 'Leve e aerado, feito com polpa de maracujá fresco, sem gelatina. Servido em taça individual.',
    price:        19.00,
    category:    'sobremesas',
    featured:     false,
    imageUrl:    'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80',
    serves:       '1 taça (200g)',
    weight:       '200 g',
  },
  {
    name:        'Bem-casado Tradicional',
    description: 'Pão de ló fofo e dourado com recheio generoso de doce de leite artesanal. Embalado individualmente.',
    price:         5.00,
    category:    'docinhos',
    featured:     false,
    imageUrl:    'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&q=80',
    serves:       '1 unidade',
    weight:       '40 g',
  },
  {
    name:        'Pavê de Chocolate Belga',
    description: 'Camadas generosas de biscoito champagne, creme de chocolate premium e chantilly natural. Porção para 2.',
    price:        26.00,
    category:    'sobremesas',
    featured:     true,
    imageUrl:    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80',
    serves:       '1 taça (300g)',
    weight:       '300 g',
  },
  {
    name:        'Macaron Francês',
    description: 'Casquinha crocante de merengue de amêndoa, recheios variados: pistache, framboesa e caramelo salgado.',
    price:         8.50,
    category:    'docinhos',
    featured:     false,
    imageUrl:    'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=600&q=80',
    serves:       '1 unidade',
    weight:       '20 g',
  },
  {
    name:        'Torta de Chocolate Intenso',
    description: 'Para os amantes de chocolate: massa úmida, recheio de ganache 65% e cobertura espelhada de cacau.',
    price:        85.00,
    category:    'tortas',
    featured:     false,
    imageUrl:    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80',
    serves:       '8–10 fatias',
    weight:       '1,1 kg',
  },
  {
    name:        'Bolo Naked de Frutas Vermelhas',
    description: 'Visual rústico elegante. Massa de baunilha com recheio de chantilly e frutas vermelhas frescas.',
    price:        95.00,
    category:    'bolos',
    featured:     false,
    imageUrl:    'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&q=80',
    serves:       '12–15 fatias',
    weight:       '1,5 kg',
  },
  {
    name:        'Pudim de Leite Condensado',
    description: 'Receita da avó. Textura cremosa perfeita, calda de caramelo líquido dourado. Porção individual.',
    price:        14.00,
    category:    'sobremesas',
    featured:     false,
    imageUrl:    'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&q=80',
    serves:       '1 unidade (150g)',
    weight:       '150 g',
  },
  {
    name:        'Trufa de Pistache',
    description: 'Interior cremoso de ganache de pistache com extrato natural, coberta em chocolate branco e pistache granulado.',
    price:         9.00,
    category:    'docinhos',
    featured:     false,
    imageUrl:    'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=600&q=80',
    serves:       '1 unidade',
    weight:       '30 g',
  },
  {
    name:        'Cheesecake de Maracujá',
    description: 'Versão tropical do clássico americano. Creme aveludado com calda ácida de maracujá fresco.',
    price:        75.00,
    category:    'tortas',
    featured:     false,
    imageUrl:    'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&q=80',
    serves:       '8–10 fatias',
    weight:       '900 g',
  },
  {
    name:        'Caixa de Docinhos Sortidos',
    description: 'Caixa com 12 unidades sortidas: brigadeiro, beijinho, bicho-de-pé, casadinho e cajuzinho. Ideal para presentes.',
    price:        68.00,
    category:    'docinhos',
    featured:     true,
    imageUrl:    'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&q=80',
    serves:       '12 unidades',
    weight:       '360 g',
  },
]

// ── Seed function ──────────────────────────
async function seed() {
  console.log('\n🍰 Delicatte Confeitaria — Seed Back4App\n')
  console.log(`📦 Enviando ${PRODUCTS.length} produtos...\n`)

  let success = 0
  let failed  = 0

  for (const product of PRODUCTS) {
    try {
      const res = await fetch(`${BASE_URL}/classes/Product`, {
        method:  'POST',
        headers: HEADERS,
        body:    JSON.stringify(product),
      })

      const data = await res.json()

      if (res.ok) {
        success++
        console.log(`✅ [${success.toString().padStart(2,'0')}] ${product.name} → ID: ${data.objectId}`)
      } else {
        failed++
        console.log(`❌ Erro em "${product.name}": ${data.error}`)
      }
    } catch (err) {
      failed++
      console.log(`❌ Falha de rede em "${product.name}": ${err.message}`)
    }

    // Pequena pausa para não sobrecarregar a API
    await new Promise(r => setTimeout(r, 150))
  }

  console.log(`\n─────────────────────────────`)
  console.log(`✅ Sucesso: ${success} produtos`)
  if (failed > 0) console.log(`❌ Falhas:  ${failed} produtos`)
  console.log(`\n🎉 Seed concluído! Acesse o Back4App para verificar.`)
  console.log(`   https://dashboard.back4app.com/apps/delicatte-app/browser/Product\n`)
}

seed()
