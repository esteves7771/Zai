const KEY = 'zai_allergens'
const SHOWN_KEY = 'zai_allergen_setup_shown'

export const ALLERGEN_LIST = [
  {
    id: 'gluten', tag: 'en:gluten', emoji: '🌾',
    keywords: [
      'gluten', 'wheat', 'barley', 'rye', 'oats', 'spelt', 'kamut',   // EN
      'trigo', 'aveia', 'cevada', 'centeio', 'espelta',                 // PT
      'trigo', 'avena', 'cebada', 'centeno',                            // ES
      'ble', 'avoine', 'orge', 'seigle', 'epeautre',                   // FR
      'weizen', 'hafer', 'gerste', 'roggen', 'dinkel',                  // DE
      'frumento', 'avena', 'orzo', 'segale', 'farro',                   // IT
    ]
  },
  {
    id: 'lactose', tag: 'en:milk', emoji: '🥛',
    keywords: [
      'milk', 'lactose', 'dairy', 'cream', 'cheese', 'butter', 'whey', 'casein', 'lactos',  // EN
      'leite', 'lactose', 'nata', 'queijo', 'manteiga', 'soro', 'caseina',                  // PT
      'leche', 'lactosa', 'nata', 'queso', 'mantequilla', 'suero',                          // ES
      'lait', 'lactose', 'creme', 'fromage', 'beurre', 'lactoserum', 'caseine',             // FR
      'milch', 'laktose', 'sahne', 'kase', 'butter', 'molke', 'kasein',                     // DE
      'latte', 'lattosio', 'panna', 'formaggio', 'burro', 'siero', 'caseina',               // IT
    ]
  },
  {
    id: 'nuts', tag: 'en:nuts', emoji: '🥜',
    keywords: [
      'nuts', 'almond', 'cashew', 'walnut', 'hazelnut', 'pistachio', 'pecan', 'macadamia',  // EN
      'amendoa', 'castanha', 'noz', 'avela', 'pistache',                                     // PT
      'almendra', 'anacardo', 'nuez', 'avellana', 'pistacion',                               // ES
      'amande', 'noix', 'noisette', 'pistache', 'cajou',                                     // FR
      'mandel', 'cashew', 'walnuss', 'haselnuss', 'pistazie', 'pekannuss',                  // DE
      'mandorla', 'anacardio', 'noce', 'nocciola', 'pistacchio', 'pecan',                   // IT
    ]
  },
  {
    id: 'peanuts', tag: 'en:peanuts', emoji: '🥜',
    keywords: [
      'peanut', 'groundnut', 'arachis',           // EN
      'amendoim',                                  // PT
      'cacahuete', 'cacahuate', 'mani',            // ES
      'arachide', 'cacahouete',                    // FR
      'erdnuss',                                   // DE
      'arachide', 'nocciolina americana',          // IT
    ]
  },
  {
    id: 'eggs', tag: 'en:eggs', emoji: '🥚',
    keywords: [
      'egg', 'albumin', 'albumen', 'lysozyme',    // EN
      'ovo', 'ovos', 'albumina',                  // PT
      'huevo', 'huevos', 'albumina',              // ES
      'oeuf', 'oeufs', 'albumine', 'lysozyme',    // FR
      'ei', 'eier', 'albumin', 'lysozym',         // DE
      'uovo', 'uova', 'albumina', 'lisozima',     // IT
    ]
  },
  {
    id: 'soy', tag: 'en:soybeans', emoji: '🫘',
    keywords: [
      'soy', 'soya', 'tofu', 'tempeh', 'edamame', 'miso',  // EN
      'soja', 'tofu',                                        // PT
      'soja', 'tofu',                                        // ES
      'soja', 'tofu',                                        // FR
      'soja', 'sojaprotein', 'tofu',                         // DE
      'soia', 'tofu',                                        // IT
    ]
  },
  {
    id: 'fish', tag: 'en:fish', emoji: '🐟',
    keywords: [
      'fish', 'cod', 'salmon', 'tuna', 'anchovy', 'sardine', 'herring', 'mackerel',  // EN
      'peixe', 'bacalhau', 'salmao', 'atum', 'anchova', 'sardinha', 'arenque',       // PT
      'pescado', 'bacalao', 'salmon', 'atun', 'anchoa', 'sardina', 'arenque',        // ES
      'poisson', 'morue', 'saumon', 'thon', 'anchois', 'sardine', 'hareng',          // FR
      'fisch', 'kabeljau', 'lachs', 'thunfisch', 'sardelle', 'sardine', 'hering',    // DE
      'pesce', 'merluzzo', 'salmone', 'tonno', 'acciuga', 'sardina', 'aringa',       // IT
    ]
  },
  {
    id: 'shellfish', tag: 'en:crustaceans', emoji: '🦐',
    keywords: [
      'shellfish', 'shrimp', 'prawn', 'crab', 'lobster', 'crayfish',   // EN
      'camaro', 'camarao', 'caranguejo', 'lagosta',                     // PT
      'camaron', 'gamba', 'cangrejo', 'langosta',                       // ES
      'crevette', 'crabe', 'homard', 'ecrevisse',                       // FR
      'garnele', 'krabbe', 'hummer', 'krebs',                           // DE
      'gambero', 'granchio', 'aragosta', 'gamberetto',                  // IT
    ]
  },
  {
    id: 'sesame', tag: 'en:sesame-seeds', emoji: '🌰',
    keywords: [
      'sesame', 'tahini', 'tahine', 'sesam',          // EN/shared
      'gergelim', 'sesamo',                            // PT
      'sesamo', 'tahini',                              // ES
      'sesame', 'tahini',                              // FR
      'sesam', 'tahini',                               // DE
      'sesamo', 'tahini',                              // IT
    ]
  },
  {
    id: 'celery', tag: 'en:celery', emoji: '🥬',
    keywords: [
      'celery', 'celeriac',       // EN
      'aipo', 'aipo-rabano',      // PT
      'apio',                     // ES
      'celeri', 'celeri-rave',    // FR
      'sellerie', 'knollensellerie',  // DE
      'sedano', 'sedano rapa',    // IT
    ]
  },
  {
    id: 'mustard', tag: 'en:mustard', emoji: '🌿',
    keywords: [
      'mustard',       // EN
      'mostarda',      // PT
      'mostaza',       // ES
      'moutarde',      // FR
      'senf',          // DE
      'senape',        // IT
    ]
  },
  {
    id: 'sulphites', tag: 'en:sulphur-dioxide', emoji: '🍷',
    keywords: [
      'sulphite', 'sulfite', 'sulphur dioxide', 'sulfur dioxide',
      'e220', 'e221', 'e222', 'e223', 'e224', 'e225', 'e226', 'e227', 'e228',  // all
      'sulfito', 'dioxido de enxofre',   // PT
      'sulfito', 'dioxido de azufre',    // ES
      'sulfite', 'anhydride sulfureux',  // FR
      'sulfit', 'schwefeldioxid',        // DE
      'solfito', 'anidride solforosa',   // IT
    ]
  },
]

export function getAllergens() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}

export function setAllergens(ids) {
  localStorage.setItem(KEY, JSON.stringify(ids))
}

export function hasSeenAllergenSetup() {
  return localStorage.getItem(SHOWN_KEY) === 'true'
}

export function markAllergenSetupSeen() {
  localStorage.setItem(SHOWN_KEY, 'true')
}

export function checkAllergens(product) {
  const userAllergens = getAllergens()
  if (!userAllergens.length) return []

  const productAllergenTags = (product.allergensTags || []).map(t => t.toLowerCase())
  const ingredientsText = (product.ingredients || '').toLowerCase()

  return ALLERGEN_LIST.filter(a => {
    if (!userAllergens.includes(a.id)) return false

    // 1. Check official allergen tags
    if (productAllergenTags.some(tag =>
      tag === a.tag ||
      tag.includes(a.id) ||
      tag.includes(a.tag.replace('en:', ''))
    )) return true

    // 2. Check tags for keyword matches
    if (productAllergenTags.some(tag =>
      a.keywords.some(kw => tag.includes(kw))
    )) return true

    // 3. Scan ingredients text in any language
    if (ingredientsText && a.keywords.some(kw => ingredientsText.includes(kw))) return true

    return false
  })
}
