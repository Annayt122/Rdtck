/*
 * WALLACE IMPORTS — catálogo
 * ---------------------------------------------------------------
 * CATEGORIAS  → montam o menu, os filtros e as páginas de listagem.
 * PROMOCOES   → "leve N por X": o desconto entra sozinho no carrinho.
 * PRODUTOS    → um objeto por produto. Campos:
 *
 *   slug     endereço do produto (produto.html?p=slug) — sem espaços ou acentos
 *   nome     nome exibido
 *   cat      'categoria/subcategoria' (use os slugs de CATEGORIAS)
 *   preco    preço de venda            de: preço riscado (opcional)
 *   cor      nome da cor (vira filtro)
 *   tam      tamanhos disponíveis      sem: tamanhos esgotados (opcional)
 *   promo    chave de PROMOCOES (opcional)
 *   selos    'destaque' | 'novo' | 'oferta' — define em quais vitrines da home aparece
 *   vendidos número usado para ordenar por "mais vendidos"
 *   fotos    ['assets/img/produtos/arquivo.jpg', ...]  ← FOTOS REAIS
 *            Sem `fotos`, o site usa as ilustrações de exemplo
 *            (forma/tom/tom2/estampa só servem para desenhá-las).
 *
 * Os produtos abaixo são de EXEMPLO: troque nomes, preços e fotos.
 */
(function () {
  var ROUPA = ['P', 'M', 'G', 'GG', 'XGG'];
  var CALCADO = ['38', '39', '40', '41', '42', '43'];
  var NUMERACAO = ['38', '40', '42', '44', '46'];
  var UNICO = ['Único'];

  var CATEGORIAS = [
    { slug: 'black-friday', nome: 'Black Friday', menu: 'BLACK FRIDAY', filhos: [
      { slug: '3-camisetas-por-119-99', nome: '3 Camisetas por 119,99' },
      { slug: '3-camisetas-premium-por-149-99', nome: '3 Camisetas Premium por 149,99' },
      { slug: '2-tenis-por-299-99', nome: '2 Tênis por 299,99' }
    ] },
    { slug: 'pecas-de-inverno', nome: 'Peças de Inverno', filhos: [
      { slug: 'moletom', nome: 'Moletom' },
      { slug: 'calca-moletom', nome: 'Calça Moletom' },
      { slug: 'conjunto', nome: 'Conjunto' }
    ] },
    { slug: 'camisetas', nome: 'Camisetas', filhos: [
      { slug: 'basicas', nome: 'Camisetas Básicas' },
      { slug: 'premium', nome: 'Camisetas Premium' },
      { slug: 'oversized', nome: 'Camisetas Oversized' },
      { slug: 'dry-fit', nome: 'Camisetas Dry Fit' },
      { slug: 'de-time', nome: 'Camisetas de Time' },
      { slug: 'polo', nome: 'Camisetas Polo' }
    ] },
    { slug: 'bermudas', nome: 'Bermudas', filhos: [
      { slug: 'elastano', nome: 'Elastano' },
      { slug: 'dry-fit', nome: 'Dry Fit' },
      { slug: 'jeans-sarja', nome: 'Jeans/Sarja' },
      { slug: 'moletom', nome: 'Moletom' }
    ] },
    { slug: 'conjuntos', nome: 'Conjuntos' },
    { slug: 'calcas', nome: 'Calças', filhos: [
      { slug: 'jeans', nome: 'Jeans' },
      { slug: 'moletom', nome: 'Moletom' }
    ] },
    { slug: 'acessorios', nome: 'Acessórios', filhos: [
      { slug: 'perfume', nome: 'Perfume' },
      { slug: 'relogios', nome: 'Relógios' },
      { slug: 'carteiras', nome: 'Carteiras' },
      { slug: 'shoulder-bag', nome: 'Shoulder Bag' },
      { slug: 'oculos-de-sol', nome: 'Óculos de Sol' },
      { slug: 'cuecas', nome: 'Cuecas' },
      { slug: 'meias', nome: 'Meias' },
      { slug: 'cintos', nome: 'Cintos' }
    ] },
    { slug: 'bones', nome: 'Bonés', filhos: [
      { slug: 'aba-curva', nome: 'Aba Curva' },
      { slug: 'trucker', nome: 'Trucker' }
    ] },
    { slug: 'calcados', nome: 'Calçados', filhos: [
      { slug: 'tenis', nome: 'Tênis' },
      { slug: 'chinelos', nome: 'Chinelos' }
    ] }
  ];

  /* Itens do menu principal, na ordem em que aparecem. */
  var MENU = [
    { nome: 'Início', link: 'index.html' },
    { nome: 'Todos os Produtos', link: 'produtos.html', todos: true },
    { cat: 'black-friday' },
    { cat: 'pecas-de-inverno' },
    { cat: 'camisetas' },
    { cat: 'bermudas' },
    { cat: 'conjuntos' },
    { cat: 'calcas' },
    { cat: 'acessorios' },
    { cat: 'bones' },
    { nome: 'Tênis', link: 'produtos.html?cat=calcados&sub=tenis' },
    { nome: 'Chinelos', link: 'produtos.html?cat=calcados&sub=chinelos' },
    { nome: 'MAIS VENDIDOS', link: 'produtos.html?lista=mais-vendidos' },
    { nome: 'Trocas e devoluções', link: 'trocas-e-devolucoes.html' }
  ];

  var PROMOCOES = {
    'camisetas-119': { leve: 3, por: 119.99, etiqueta: '3 camisetas por R$ 119,99', cat: 'black-friday', sub: '3-camisetas-por-119-99', nome: '3 Camisetas por 119,99' },
    'premium-149':   { leve: 3, por: 149.99, etiqueta: '3 camisetas por R$ 149,99', cat: 'black-friday', sub: '3-camisetas-premium-por-149-99', nome: '3 Camisetas Premium por 149,99' },
    'tenis-299':     { leve: 2, por: 299.99, etiqueta: '2 Tênis por R$ 299,99', cat: 'black-friday', sub: '2-tenis-por-299-99', nome: '2 Tênis por 299,99' }
  };

  var PRODUTOS = [
    /* ---------------- Tênis — 2 por 299,99 ---------------- */
    { slug: 'tenis-runner-black-gray', nome: 'Tênis Runner Black/Gray', cat: 'calcados/tenis', preco: 199.99, de: 299.99, cor: 'Preto', tam: CALCADO, sem: ['39', '40', '43'], promo: 'tenis-299', selos: ['oferta'], vendidos: 412, forma: 'tenis', tom: '#1c1c20', tom2: '#5b5d68', sola: '#e6dfcf' },
    { slug: 'tenis-retro-runner-white-silver', nome: 'Tênis Retrô Runner White/Silver', cat: 'calcados/tenis', preco: 199.99, de: 299.99, cor: 'Branco', tam: CALCADO, sem: ['38'], promo: 'tenis-299', selos: ['novo'], vendidos: 268, forma: 'tenis', tom: '#ecebe6', tom2: '#a9abb0', sola: '#f4f1e8' },
    { slug: 'tenis-casual-couro-preto', nome: 'Tênis Casual Couro Preto', cat: 'calcados/tenis', preco: 199.99, de: 299.99, cor: 'Preto', tam: CALCADO, promo: 'tenis-299', vendidos: 190, forma: 'tenis', tom: '#19191b', tom2: '#2c2c30', sola: '#f2f2f0' },
    { slug: 'tenis-low-street-black', nome: 'Tênis Low Street Black', cat: 'calcados/tenis', preco: 199.99, de: 299.99, cor: 'Preto', tam: CALCADO, sem: ['42'], promo: 'tenis-299', selos: ['destaque'], vendidos: 530, forma: 'tenis', tom: '#18181a', tom2: '#26262a', sola: '#f3f3f1' },
    { slug: 'tenis-low-street-white', nome: 'Tênis Low Street White', cat: 'calcados/tenis', preco: 199.99, de: 299.99, cor: 'Branco', tam: CALCADO, promo: 'tenis-299', vendidos: 488, forma: 'tenis', tom: '#f1f0ec', tom2: '#dcdad3', sola: '#f7f6f2' },
    { slug: 'tenis-low-street-all-black', nome: 'Tênis Low Street All Black 2.0', cat: 'calcados/tenis', preco: 199.99, de: 299.99, cor: 'Preto', tam: CALCADO, sem: ['38', '43'], promo: 'tenis-299', vendidos: 301, forma: 'tenis', tom: '#161618', tom2: '#202023', sola: '#1f1f22' },
    { slug: 'tenis-low-street-grey-suede', nome: 'Tênis Low Street Grey Suede', cat: 'calcados/tenis', preco: 199.99, de: 299.99, cor: 'Cinza', tam: CALCADO, promo: 'tenis-299', vendidos: 156, forma: 'tenis', tom: '#8d8d8f', tom2: '#6f7073', sola: '#f1f0ec' },
    { slug: 'tenis-court-classic-branco', nome: 'Tênis Court Classic Branco', cat: 'calcados/tenis', preco: 199.99, de: 299.99, cor: 'Branco', tam: CALCADO, sem: ['41'], promo: 'tenis-299', vendidos: 233, forma: 'tenis', tom: '#f3f2ee', tom2: '#1d1d20', sola: '#f6f5f1' },
    { slug: 'tenis-capsula-triple-black', nome: 'Tênis Cápsula Triple Black', cat: 'calcados/tenis', preco: 279.99, de: 349.99, cor: 'Preto', tam: CALCADO, sem: ['38', '39'], selos: ['destaque', 'novo'], vendidos: 97, forma: 'tenis', tom: '#151517', tom2: '#2a2a2e', sola: '#1b1b1e' },
    { slug: 'tenis-capsula-silver-black', nome: 'Tênis Cápsula Silver/Black', cat: 'calcados/tenis', preco: 279.99, de: 349.99, cor: 'Cinza', tam: CALCADO, selos: ['oferta'], vendidos: 84, forma: 'tenis', tom: '#c9cace', tom2: '#1a1a1d', sola: '#ededeb' },

    /* ---------------- Camisetas — 3 por 119,99 ---------------- */
    { slug: 'camiseta-letreiro-preta', nome: 'Camiseta Letreiro Preta', cat: 'camisetas/basicas', preco: 59.99, de: 69.99, cor: 'Preto', tam: ROUPA, promo: 'camisetas-119', selos: ['oferta'], vendidos: 640, forma: 'camiseta', tom: '#17171a', tom2: '#f1efe9', estampa: 'letreiro' },
    { slug: 'camiseta-mascaras-preta', nome: 'Camiseta Máscaras Preta', cat: 'camisetas/basicas', preco: 59.99, de: 69.99, cor: 'Preto', tam: ROUPA, sem: ['XGG'], promo: 'camisetas-119', vendidos: 512, forma: 'camiseta', tom: '#17171a', tom2: '#e9e6dd', estampa: 'quadro' },
    { slug: 'camiseta-letreiro-vermelha', nome: 'Camiseta Letreiro Vermelha', cat: 'camisetas/basicas', preco: 59.99, de: 69.99, cor: 'Vermelho', tam: ROUPA, promo: 'camisetas-119', vendidos: 377, forma: 'camiseta', tom: '#b3191f', tom2: '#f4f1ea', estampa: 'letreiro' },
    { slug: 'camiseta-onda-preta', nome: 'Camiseta Onda Preta', cat: 'camisetas/basicas', preco: 59.99, de: 69.99, cor: 'Preto', tam: ROUPA, sem: ['P'], promo: 'camisetas-119', vendidos: 455, forma: 'camiseta', tom: '#18181b', tom2: '#dcdad3', estampa: 'onda' },
    { slug: 'camiseta-degrade-preta', nome: 'Camiseta Degradê Preta', cat: 'camisetas/basicas', preco: 59.99, de: 69.99, cor: 'Preto', tam: ROUPA, promo: 'camisetas-119', vendidos: 298, forma: 'camiseta', tom: '#17171a', tom2: '#c8302f', estampa: 'faixas' },
    { slug: 'camiseta-basica-branca', nome: 'Camiseta Básica Branca', cat: 'camisetas/basicas', preco: 59.99, de: 69.99, cor: 'Branco', tam: ROUPA, promo: 'camisetas-119', selos: ['oferta'], vendidos: 590, forma: 'camiseta', tom: '#f2f0ea', tom2: '#17171a', estampa: 'mini' },
    { slug: 'camiseta-basica-off-white', nome: 'Camiseta Básica Off White', cat: 'camisetas/basicas', preco: 59.99, de: 69.99, cor: 'Bege', tam: ROUPA, promo: 'camisetas-119', vendidos: 204, forma: 'camiseta', tom: '#e2d9c5', tom2: '#3a342a', estampa: 'mini' },
    { slug: 'camiseta-street-lines-marinho', nome: 'Camiseta Street Lines Marinho', cat: 'camisetas/basicas', preco: 59.99, de: 69.99, cor: 'Azul marinho', tam: ROUPA, sem: ['GG'], promo: 'camisetas-119', vendidos: 187, forma: 'camiseta', tom: '#1b2540', tom2: '#e9e6dd', estampa: 'faixas' },
    { slug: 'camiseta-coroa-dourada-preta', nome: 'Camiseta Coroa Dourada Preta', cat: 'camisetas/basicas', preco: 59.99, de: 69.99, cor: 'Preto', tam: ROUPA, promo: 'camisetas-119', selos: ['destaque', 'novo'], vendidos: 331, forma: 'camiseta', tom: '#141416', tom2: '#f0c22b', estampa: 'coroa' },
    { slug: 'camiseta-sunset-verde-militar', nome: 'Camiseta Sunset Verde Militar', cat: 'camisetas/basicas', preco: 59.99, de: 69.99, cor: 'Verde', tam: ROUPA, promo: 'camisetas-119', vendidos: 143, forma: 'camiseta', tom: '#3d4a36', tom2: '#e6dcc0', estampa: 'circulo' },

    /* ---------------- Camisetas Premium — 3 por 149,99 ---------------- */
    { slug: 'camiseta-premium-signature-preta', nome: 'Camiseta Premium Signature Preta', cat: 'camisetas/premium', preco: 69.99, de: 89.99, cor: 'Preto', tam: ROUPA, promo: 'premium-149', selos: ['novo'], vendidos: 420, forma: 'camiseta', tom: '#151517', tom2: '#f3f1eb', estampa: 'onda' },
    { slug: 'camiseta-premium-varsity-preta', nome: 'Camiseta Premium Varsity Preta/Amarela', cat: 'camisetas/premium', preco: 69.99, de: 89.99, cor: 'Preto', tam: ROUPA, sem: ['P', 'XGG'], promo: 'premium-149', vendidos: 366, forma: 'camiseta', tom: '#151517', tom2: '#f0c22b', estampa: 'letreiro' },
    { slug: 'camiseta-premium-arco-preta', nome: 'Camiseta Premium Arco Preta', cat: 'camisetas/premium', preco: 69.99, de: 89.99, cor: 'Preto', tam: ROUPA, promo: 'premium-149', vendidos: 274, forma: 'camiseta', tom: '#16161a', tom2: '#ffffff', estampa: 'arco' },
    { slug: 'camiseta-premium-color-lines', nome: 'Camiseta Premium Color Lines', cat: 'camisetas/premium', preco: 69.99, de: 89.99, cor: 'Preto', tam: ROUPA, promo: 'premium-149', vendidos: 251, forma: 'camiseta', tom: '#17171a', tom2: '#d8a11c', estampa: 'faixas' },
    { slug: 'camiseta-premium-college-preta', nome: 'Camiseta Premium College Preta', cat: 'camisetas/premium', preco: 69.99, de: 89.99, cor: 'Preto', tam: ROUPA, sem: ['G'], promo: 'premium-149', vendidos: 233, forma: 'camiseta', tom: '#151517', tom2: '#efede6', estampa: 'quadro' },
    { slug: 'camiseta-premium-orbit-preta', nome: 'Camiseta Premium Orbit Preta', cat: 'camisetas/premium', preco: 69.99, de: 89.99, cor: 'Preto', tam: ROUPA, promo: 'premium-149', vendidos: 198, forma: 'camiseta', tom: '#141416', tom2: '#bdbdbd', estampa: 'circulo' },
    { slug: 'camiseta-premium-orbit-branca', nome: 'Camiseta Premium Orbit Branca', cat: 'camisetas/premium', preco: 69.99, de: 89.99, cor: 'Branco', tam: ROUPA, promo: 'premium-149', vendidos: 176, forma: 'camiseta', tom: '#f3f1ec', tom2: '#17171a', estampa: 'circulo' },
    { slug: 'camiseta-premium-gold-label', nome: 'Camiseta Premium Gold Label', cat: 'camisetas/premium', preco: 69.99, de: 89.99, cor: 'Preto', tam: ROUPA, promo: 'premium-149', selos: ['destaque'], vendidos: 305, forma: 'camiseta', tom: '#131315', tom2: '#f0c22b', estampa: 'mini' },

    /* ---------------- Outras camisetas ---------------- */
    { slug: 'camiseta-oversized-raglan', nome: 'Camiseta Oversized Raglan Preta/Branca', cat: 'camisetas/oversized', preco: 99.99, de: 119.99, cor: 'Preto', tam: ROUPA, selos: ['destaque'], vendidos: 221, forma: 'raglan', tom: '#f1efe9', tom2: '#17171a', estampa: 'arco' },
    { slug: 'camiseta-manga-longa-cross-preta', nome: 'Camiseta Manga Longa Cross Preta', cat: 'camisetas/oversized', preco: 99.99, de: 119.99, cor: 'Preto', tam: ROUPA, sem: ['P'], selos: ['destaque'], vendidos: 164, forma: 'mangalonga', tom: '#17171a', tom2: '#efede6', estampa: 'quadro' },
    { slug: 'camiseta-oversized-heavy-off', nome: 'Camiseta Oversized Heavy Off White', cat: 'camisetas/oversized', preco: 109.99, cor: 'Bege', tam: ROUPA, selos: ['novo'], vendidos: 88, forma: 'camiseta', tom: '#ded5c0', tom2: '#2b2823', estampa: 'mini' },
    { slug: 'camiseta-dry-fit-treino-preta', nome: 'Camiseta Dry Fit Treino Preta', cat: 'camisetas/dry-fit', preco: 49.99, de: 64.99, cor: 'Preto', tam: ROUPA, selos: ['oferta'], vendidos: 340, forma: 'camiseta', tom: '#1b1b1f', tom2: '#8b8d94', estampa: 'mini' },
    { slug: 'camiseta-dry-fit-treino-cinza', nome: 'Camiseta Dry Fit Treino Cinza', cat: 'camisetas/dry-fit', preco: 49.99, de: 64.99, cor: 'Cinza', tam: ROUPA, vendidos: 215, forma: 'camiseta', tom: '#85878d', tom2: '#17171a', estampa: 'mini' },
    { slug: 'camisa-torcedor-amarela', nome: 'Camisa Torcedor Amarela', cat: 'camisetas/de-time', preco: 129.99, de: 159.99, cor: 'Amarelo', tam: ROUPA, sem: ['XGG'], selos: ['oferta'], vendidos: 402, forma: 'polo', tom: '#f3cf1f', tom2: '#1f7a45', estampa: 'escudo' },
    { slug: 'camisa-torcedor-azul', nome: 'Camisa Torcedor Azul', cat: 'camisetas/de-time', preco: 129.99, de: 159.99, cor: 'Azul marinho', tam: ROUPA, vendidos: 219, forma: 'polo', tom: '#1e3f8f', tom2: '#f3cf1f', estampa: 'escudo' },
    { slug: 'camiseta-polo-piquet-preta', nome: 'Camiseta Polo Piquet Preta', cat: 'camisetas/polo', preco: 89.99, de: 109.99, cor: 'Preto', tam: ROUPA, vendidos: 172, forma: 'polo', tom: '#18181b', tom2: '#f0c22b', estampa: 'mini' },
    { slug: 'camiseta-polo-piquet-branca', nome: 'Camiseta Polo Piquet Branca', cat: 'camisetas/polo', preco: 89.99, de: 109.99, cor: 'Branco', tam: ROUPA, sem: ['M'], vendidos: 131, forma: 'polo', tom: '#f2f0ea', tom2: '#17171a', estampa: 'mini' },

    /* ---------------- Peças de inverno ---------------- */
    { slug: 'moletom-club-ziper-cinza', nome: 'Moletom Club Zíper Cinza', cat: 'pecas-de-inverno/moletom', preco: 189.99, de: 239.99, cor: 'Cinza', tam: ROUPA, selos: ['destaque'], vendidos: 260, forma: 'moletom', tom: '#b9bbc0', tom2: '#ecebe6', ziper: true },
    { slug: 'moletom-canguru-preto', nome: 'Moletom Canguru Preto', cat: 'pecas-de-inverno/moletom', preco: 169.99, de: 219.99, cor: 'Preto', tam: ROUPA, sem: ['GG'], selos: ['oferta'], vendidos: 318, forma: 'moletom', tom: '#18181b', tom2: '#dcdad3' },
    { slug: 'moletom-canguru-off-white', nome: 'Moletom Canguru Off White', cat: 'pecas-de-inverno/moletom', preco: 169.99, de: 219.99, cor: 'Bege', tam: ROUPA, vendidos: 122, forma: 'moletom', tom: '#e0d7c2', tom2: '#3a342a' },
    { slug: 'calca-moletom-jogger-preta', nome: 'Calça Moletom Jogger Preta', cat: 'pecas-de-inverno/calca-moletom', preco: 139.99, de: 169.99, cor: 'Preto', tam: ROUPA, vendidos: 207, forma: 'jogger', tom: '#19191c', tom2: '#dcdad3' },
    { slug: 'calca-moletom-jogger-cinza', nome: 'Calça Moletom Jogger Cinza', cat: 'pecas-de-inverno/calca-moletom', preco: 139.99, de: 169.99, cor: 'Cinza', tam: ROUPA, sem: ['P'], vendidos: 149, forma: 'jogger', tom: '#b4b6bb', tom2: '#ecebe6' },
    { slug: 'conjunto-moletom-tech-preto', nome: 'Conjunto Moletom Tech Preto', cat: 'pecas-de-inverno/conjunto', preco: 299.99, de: 369.99, cor: 'Preto', tam: ROUPA, selos: ['destaque', 'oferta'], vendidos: 185, forma: 'conjunto-inverno', tom: '#17171a', tom2: '#55575f', ziper: true },
    { slug: 'conjunto-moletom-tech-cinza', nome: 'Conjunto Moletom Tech Cinza', cat: 'pecas-de-inverno/conjunto', preco: 299.99, de: 369.99, cor: 'Cinza', tam: ROUPA, sem: ['XGG'], vendidos: 96, forma: 'conjunto-inverno', tom: '#aeb0b6', tom2: '#17171a', ziper: true },

    /* ---------------- Conjuntos ---------------- */
    { slug: 'conjunto-treino-preto-dourado', nome: 'Conjunto de Treino Preto/Dourado', cat: 'conjuntos', preco: 189.99, de: 229.99, cor: 'Preto', tam: ROUPA, selos: ['destaque', 'novo'], vendidos: 290, forma: 'conjunto', tom: '#151517', tom2: '#f0c22b', estampa: 'mini' },
    { slug: 'conjunto-treino-branco', nome: 'Conjunto de Treino Branco/Preto', cat: 'conjuntos', preco: 189.99, de: 229.99, cor: 'Branco', tam: ROUPA, sem: ['P'], vendidos: 174, forma: 'conjunto', tom: '#f2f0ea', tom2: '#17171a', estampa: 'mini' },
    { slug: 'conjunto-dry-fit-verao-marinho', nome: 'Conjunto Dry Fit Verão Marinho', cat: 'conjuntos', preco: 149.99, de: 179.99, cor: 'Azul marinho', tam: ROUPA, selos: ['oferta'], vendidos: 138, forma: 'conjunto', tom: '#1b2540', tom2: '#e9e6dd', estampa: 'faixas' },

    /* ---------------- Bermudas ---------------- */
    { slug: 'bermuda-elastano-preta', nome: 'Bermuda Elastano Preta', cat: 'bermudas/elastano', preco: 79.99, de: 99.99, cor: 'Preto', tam: NUMERACAO, selos: ['oferta'], vendidos: 356, forma: 'bermuda', tom: '#18181b', tom2: '#f1efe9' },
    { slug: 'bermuda-elastano-grafite', nome: 'Bermuda Elastano Grafite', cat: 'bermudas/elastano', preco: 79.99, de: 99.99, cor: 'Cinza', tam: NUMERACAO, sem: ['46'], vendidos: 198, forma: 'bermuda', tom: '#4b4d54', tom2: '#f1efe9' },
    { slug: 'bermuda-dry-fit-preta', nome: 'Bermuda Dry Fit Preta', cat: 'bermudas/dry-fit', preco: 59.99, de: 74.99, cor: 'Preto', tam: ROUPA, vendidos: 284, forma: 'bermuda', tom: '#1a1a1e', tom2: '#f0c22b', listra: true },
    { slug: 'bermuda-sarja-caqui', nome: 'Bermuda Sarja Caqui', cat: 'bermudas/jeans-sarja', preco: 99.99, de: 129.99, cor: 'Bege', tam: NUMERACAO, vendidos: 119, forma: 'bermuda', tom: '#b79f78', tom2: '#5c4d34' },
    { slug: 'bermuda-jeans-clara', nome: 'Bermuda Jeans Clara', cat: 'bermudas/jeans-sarja', preco: 109.99, de: 139.99, cor: 'Azul claro', tam: NUMERACAO, sem: ['38'], selos: ['novo'], vendidos: 141, forma: 'bermuda', tom: '#9fb9d6', tom2: '#f1efe9' },
    { slug: 'bermuda-moletom-cinza', nome: 'Bermuda Moletom Cinza', cat: 'bermudas/moletom', preco: 69.99, de: 89.99, cor: 'Cinza', tam: ROUPA, vendidos: 163, forma: 'bermuda', tom: '#b4b6bb', tom2: '#17171a' },

    /* ---------------- Calças ---------------- */
    { slug: 'calca-jeans-slim-clara', nome: 'Calça Jeans Slim Clara', cat: 'calcas/jeans', preco: 149.99, de: 189.99, cor: 'Azul claro', tam: NUMERACAO, selos: ['destaque'], vendidos: 226, forma: 'calca', tom: '#a9c3de', tom2: '#f1efe9' },
    { slug: 'calca-jeans-slim-escura', nome: 'Calça Jeans Slim Escura', cat: 'calcas/jeans', preco: 149.99, de: 189.99, cor: 'Azul marinho', tam: NUMERACAO, sem: ['44'], vendidos: 201, forma: 'calca', tom: '#243352', tom2: '#c9a45a' },
    { slug: 'calca-jeans-preta', nome: 'Calça Jeans Skinny Preta', cat: 'calcas/jeans', preco: 149.99, de: 189.99, cor: 'Preto', tam: NUMERACAO, vendidos: 188, forma: 'calca', tom: '#1a1a1d', tom2: '#55575f' },
    { slug: 'calca-moletom-reta-preta', nome: 'Calça Moletom Reta Preta', cat: 'calcas/moletom', preco: 129.99, de: 159.99, cor: 'Preto', tam: ROUPA, vendidos: 110, forma: 'jogger', tom: '#1a1a1d', tom2: '#f0c22b' },

    /* ---------------- Bonés ---------------- */
    { slug: 'bone-aba-curva-branco', nome: 'Boné Aba Curva Branco', cat: 'bones/aba-curva', preco: 69.99, de: 89.99, cor: 'Branco', tam: UNICO, selos: ['destaque'], vendidos: 310, forma: 'bone', tom: '#f1efe9', tom2: '#2c6b4a' },
    { slug: 'bone-aba-curva-preto', nome: 'Boné Aba Curva Preto', cat: 'bones/aba-curva', preco: 69.99, de: 89.99, cor: 'Preto', tam: UNICO, selos: ['oferta'], vendidos: 345, forma: 'bone', tom: '#17171a', tom2: '#f0c22b' },
    { slug: 'bone-aba-curva-bege', nome: 'Boné Aba Curva Bege', cat: 'bones/aba-curva', preco: 69.99, de: 89.99, cor: 'Bege', tam: UNICO, vendidos: 128, forma: 'bone', tom: '#d9cbb0', tom2: '#3a342a' },
    { slug: 'bone-trucker-preto', nome: 'Boné Trucker Preto', cat: 'bones/trucker', preco: 59.99, de: 79.99, cor: 'Preto', tam: UNICO, selos: ['novo'], vendidos: 205, forma: 'bone', tom: '#17171a', tom2: '#e9e6dd', tela: true },
    { slug: 'bone-trucker-marinho', nome: 'Boné Trucker Marinho/Branco', cat: 'bones/trucker', preco: 59.99, de: 79.99, cor: 'Azul marinho', tam: UNICO, vendidos: 117, forma: 'bone', tom: '#1b2540', tom2: '#f1efe9', tela: true },

    /* ---------------- Chinelos ---------------- */
    { slug: 'chinelo-slide-preto', nome: 'Chinelo Slide Preto', cat: 'calcados/chinelos', preco: 79.99, de: 99.99, cor: 'Preto', tam: CALCADO, selos: ['oferta'], vendidos: 277, forma: 'chinelo', tom: '#18181b', tom2: '#f1efe9' },
    { slug: 'chinelo-slide-branco', nome: 'Chinelo Slide Branco', cat: 'calcados/chinelos', preco: 79.99, de: 99.99, cor: 'Branco', tam: CALCADO, sem: ['38', '39'], vendidos: 162, forma: 'chinelo', tom: '#f1efe9', tom2: '#17171a' },

    /* ---------------- Acessórios ---------------- */
    { slug: 'perfume-noir-intense-100ml', nome: 'Perfume Noir Intense 100ml', cat: 'acessorios/perfume', preco: 149.99, de: 189.99, cor: 'Preto', tam: UNICO, selos: ['destaque'], vendidos: 240, forma: 'perfume', tom: '#1b1b1f', tom2: '#f0c22b' },
    { slug: 'perfume-gold-edition-100ml', nome: 'Perfume Gold Edition 100ml', cat: 'acessorios/perfume', preco: 159.99, de: 199.99, cor: 'Dourado', tam: UNICO, selos: ['novo'], vendidos: 133, forma: 'perfume', tom: '#c9972a', tom2: '#17171a' },
    { slug: 'relogio-aco-dourado', nome: 'Relógio Aço Dourado', cat: 'acessorios/relogios', preco: 179.99, de: 229.99, cor: 'Dourado', tam: UNICO, selos: ['destaque', 'oferta'], vendidos: 196, forma: 'relogio', tom: '#d2a53a', tom2: '#17171a' },
    { slug: 'relogio-aco-prata-fundo-preto', nome: 'Relógio Aço Prata Fundo Preto', cat: 'acessorios/relogios', preco: 169.99, de: 219.99, cor: 'Cinza', tam: UNICO, vendidos: 144, forma: 'relogio', tom: '#c3c5ca', tom2: '#17171a' },
    { slug: 'carteira-couro-slim-preta', nome: 'Carteira Couro Slim Preta', cat: 'acessorios/carteiras', preco: 59.99, de: 79.99, cor: 'Preto', tam: UNICO, vendidos: 158, forma: 'carteira', tom: '#1b1b1e', tom2: '#f0c22b' },
    { slug: 'shoulder-bag-nylon-preta', nome: 'Shoulder Bag Nylon Preta', cat: 'acessorios/shoulder-bag', preco: 89.99, de: 119.99, cor: 'Preto', tam: UNICO, selos: ['oferta'], vendidos: 265, forma: 'bolsa', tom: '#19191c', tom2: '#f0c22b' },
    { slug: 'oculos-de-sol-sport-ruby', nome: 'Óculos de Sol Sport Ruby', cat: 'acessorios/oculos-de-sol', preco: 89.99, de: 119.99, cor: 'Vermelho', tam: UNICO, selos: ['novo'], vendidos: 211, forma: 'oculos', tom: '#3a3b40', tom2: '#c8302f' },
    { slug: 'oculos-de-sol-classic-preto', nome: 'Óculos de Sol Classic Preto', cat: 'acessorios/oculos-de-sol', preco: 79.99, de: 99.99, cor: 'Preto', tam: UNICO, vendidos: 139, forma: 'oculos', tom: '#151517', tom2: '#2b2d33' },
    { slug: 'kit-3-cuecas-boxer', nome: 'Kit 3 Cuecas Boxer', cat: 'acessorios/cuecas', preco: 69.99, de: 89.99, cor: 'Preto', tam: ROUPA, vendidos: 302, forma: 'cueca', tom: '#18181b', tom2: '#f1efe9' },
    { slug: 'kit-3-pares-meia-cano-alto', nome: 'Kit 3 Pares Meia Cano Alto', cat: 'acessorios/meias', preco: 39.99, de: 49.99, cor: 'Branco', tam: ['39 ao 43'], selos: ['oferta'], vendidos: 388, forma: 'meia', tom: '#f2f0ea', tom2: '#17171a' },
    { slug: 'cinto-couro-fivela-dourada', nome: 'Cinto Couro Fivela Dourada', cat: 'acessorios/cintos', preco: 69.99, de: 89.99, cor: 'Preto', tam: ['100 cm', '110 cm', '120 cm'], vendidos: 101, forma: 'cinto', tom: '#1b1b1e', tom2: '#d2a53a' }
  ];

  var CATALOGO = { categorias: CATEGORIAS, menu: MENU, promocoes: PROMOCOES, produtos: PRODUTOS };
  if (typeof window !== 'undefined') window.CATALOGO = CATALOGO;
  if (typeof module !== 'undefined' && module.exports) module.exports = CATALOGO;
})();
