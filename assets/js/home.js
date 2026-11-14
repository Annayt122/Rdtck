/*
 * WALLACE IMPORTS — página inicial
 * Ordem das seções: banner rotativo, categorias, banners, vitrines,
 * faixa de vantagens, mais vitrines, sobre e vídeo.
 */
(function () {
  'use strict';
  const J = window.Loja, L = J.config, C = J.catalogo;
  const { $, $$, esc, icone } = J;

  /* Quadradinhos de categoria: `foto` é o slug de um produto que ilustra a categoria. */
  const CATEGORIAS = [
    { nome: 'Camisetas', link: J.linkCat('camisetas'), foto: 'camiseta-coroa-dourada-preta' },
    { nome: 'Bermudas', link: J.linkCat('bermudas'), foto: 'bermuda-dry-fit-preta' },
    { nome: 'Peças de inverno', rotulo: 'Inverno', link: J.linkCat('pecas-de-inverno'), foto: 'moletom-canguru-preto' },
    { nome: 'Tênis', link: J.linkCat('calcados', 'tenis'), foto: 'tenis-retro-runner-white-silver' },
    { nome: 'Calças', link: J.linkCat('calcas'), foto: 'calca-jeans-slim-clara' },
    { nome: 'Bonés', link: J.linkCat('bones'), foto: 'bone-aba-curva-branco' },
    { nome: 'Acessórios', link: J.linkCat('acessorios'), foto: 'oculos-de-sol-sport-ruby' }
  ];
  /* Banners de apoio. `marca: true` mostra a coroa em vez do título em cartaz. */
  const BANNERS_MARCA = [
    { titulo: 'Linha Premium', chamada: 'Camisetas fio 30.1', link: J.linkCat('camisetas', 'premium'), foto: 'camiseta-premium-color-lines', vista: 2, marca: true },
    { titulo: 'Coleção de Inverno', chamada: 'Moletons e conjuntos', link: J.linkCat('pecas-de-inverno'), foto: 'moletom-canguru-preto', vista: 2, marca: true }
  ];
  const BANNERS_PROMO = [
    { titulo: 'Tênis Cápsula', chamada: 'Confira aqui', link: J.linkCat('calcados', 'tenis'), foto: 'tenis-capsula-silver-black', vista: 2 },
    { titulo: 'Camisetas Premium', chamada: 'Confira aqui', link: J.linkCat('camisetas', 'premium'), foto: 'camiseta-premium-signature-preta', vista: 2 },
    { titulo: 'Acessórios', chamada: 'Confira aqui', link: J.linkCat('acessorios'), foto: 'relogio-aco-dourado', vista: 2 }
  ];
  const BANNERS_NOVIDADES = [
    { titulo: 'Camisetas Básicas', chamada: '3 por R$ 119,99', link: J.linkCat('black-friday', '3-camisetas-por-119-99'), foto: 'camiseta-letreiro-vermelha', vista: 2 },
    { titulo: 'Bermudas', chamada: 'A partir de R$ 59,99', link: J.linkCat('bermudas'), foto: 'bermuda-jeans-clara', vista: 2 }
  ];

  const foto = (slug, vista) => { const p = J.produto(slug); return p ? J.fotos(p)[(vista || 1) - 1] || J.fotos(p)[0] : ''; };
  const selo = (nome) => C.produtos.filter((p) => (p.selos || []).includes(nome));
  const maisVendidos = (lista) => lista.slice().sort((a, b) => b.vendidos - a.vendidos);

  /* ---------- banner rotativo ---------- */
  function arte(tipo) {
    const r = (nome, classe) => `<img class="${classe}" src="assets/img/recortes/${nome}.svg" alt="" loading="eager">`;
    const coroa = '<img class="slide-coroa" src="assets/img/coroa.png" alt="" style="filter:none">';
    switch (tipo) {
      case 'tenis': return `<div class="slide-arte arte-tenis"><span class="slide-placa">Black<br>Friday</span>${r('tenis-preto', 't1')}${r('tenis-branco', 't2')}</div>`;
      case 'camisetas': return `<div class="slide-arte arte-camisetas">${coroa}${r('camiseta-vermelha', 'c1')}${r('camiseta-branca', 'c2')}${r('camiseta-preta', 'c3')}</div>`;
      case 'premium': return `<div class="slide-arte arte-premium"><span class="anel"></span><span class="anel"></span>${r('camiseta-premium', 'c1')}</div>`;
      case 'bones': return `<div class="slide-arte arte-bones">${coroa}${r('bone-branco', 'b1')}${r('bone-preto', 'b2')}</div>`;
      case 'grupo': return `<div class="slide-arte arte-grupo">
        <div class="balao"><b>Reposição</b>Low Street Black voltou do 38 ao 43.</div>
        <div class="balao"><b>Só no grupo</b>Cupom relâmpago liberado até meia-noite.</div>
        <div class="balao"><b>Lançamento</b>Chegaram as camisetas Premium Gold Label.</div></div>`;
      default: return `<div class="slide-arte">${coroa}</div>`;
    }
  }
  function slide(b, i) {
    const link = b.link === 'whatsapp-grupo'
      ? (L.grupoVip || J.zap('Olá! Quero entrar no grupo VIP de ofertas da Wallace Imports.'))
      : b.link;
    const externo = /^https?:/.test(link) ? ' target="_blank" rel="noopener"' : '';
    const rotulo = [b.titulo, b.faixa, b.preco ? 'R$ ' + b.preco : ''].filter(Boolean).join(' ');
    if (b.imagem) {
      return `<a class="slide" href="${link}"${externo} aria-label="${esc(rotulo)}"><picture>
        ${b.imagemCelular ? `<source media="(max-width: 700px)" srcset="${b.imagemCelular}">` : ''}
        <img class="slide-imagem" src="${b.imagem}" alt="${esc(rotulo)}" loading="${i ? 'lazy' : 'eager'}"></picture></a>`;
    }
    const preco = b.preco ? b.preco.split(',') : null;
    return `<a class="slide" href="${link}"${externo} aria-label="${esc(rotulo)}">
      <div class="slide-fundo"></div>
      ${arte(b.arte)}
      <div class="slide-texto">
        ${b.selo ? `<span class="slide-selo">${esc(b.selo)}</span>` : ''}
        <strong class="slide-titulo${b.titulo.length > 12 ? ' longo' : ''}">${esc(b.titulo)}</strong>
        ${b.faixa ? `<span class="slide-faixa">${esc(b.faixa)}</span>` : ''}
        ${preco ? `<span class="slide-preco"><small>R$</small>${esc(preco[0])}<sup>,${esc(preco[1] || '00')}</sup></span>` : ''}
        ${b.de ? `<span class="slide-de">${esc(b.de)}</span>` : ''}
        ${b.texto ? `<span class="slide-frase">${esc(b.texto)}</span>` : ''}
        ${b.botao ? `<span class="slide-botao">${esc(b.botao)}</span>` : ''}
        ${b.obs ? `<span class="slide-obs">${esc(b.obs)}</span>` : ''}
      </div>
    </a>`;
  }
  function rotativo() {
    return `<section class="vitrine" aria-roledescription="carrossel" aria-label="Destaques da loja">
      <div class="vitrine-trilho" id="rotativo">${L.banners.map(slide).join('')}</div>
      <button class="vitrine-seta esq" type="button" aria-label="Banner anterior">${icone('esq')}</button>
      <button class="vitrine-seta dir" type="button" aria-label="Próximo banner">${icone('dir')}</button>
      <div class="vitrine-pontos">${L.banners.map((b, i) => `<button type="button" aria-label="Banner ${i + 1} de ${L.banners.length}" aria-current="${i === 0}"></button>`).join('')}</div>
    </section>`;
  }
  function ligarRotativo() {
    const trilho = $('#rotativo'), area = trilho.parentElement;
    const pontos = $$('.vitrine-pontos button', area);
    const total = pontos.length;
    let atual = 0, relogio = null;
    const ir = (i, suave) => { atual = (i + total) % total; trilho.scrollTo({ left: atual * trilho.clientWidth, behavior: suave === false ? 'auto' : 'smooth' }); };
    const marcar = () => {
      const i = Math.round(trilho.scrollLeft / trilho.clientWidth);
      if (i !== atual || pontos[i].getAttribute('aria-current') !== 'true') { atual = i; pontos.forEach((p, n) => p.setAttribute('aria-current', String(n === i))); }
    };
    const parar = () => { clearInterval(relogio); relogio = null; };
    const tocar = () => {
      parar();
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || total < 2) return;
      relogio = setInterval(() => { if (!document.hidden) ir(atual + 1); }, 6000);
    };
    trilho.addEventListener('scroll', marcar, { passive: true });
    $('.vitrine-seta.esq', area).addEventListener('click', () => { ir(atual - 1); tocar(); });
    $('.vitrine-seta.dir', area).addEventListener('click', () => { ir(atual + 1); tocar(); });
    pontos.forEach((p, i) => p.addEventListener('click', () => { ir(i); tocar(); }));
    ['pointerenter', 'focusin', 'touchstart'].forEach((e) => area.addEventListener(e, parar, { passive: true }));
    ['pointerleave', 'focusout'].forEach((e) => area.addEventListener(e, tocar));
    window.addEventListener('resize', () => ir(atual, false));
    tocar();
  }

  /* ---------- blocos ---------- */
  function categorias() {
    return `<section class="cats" aria-label="Categorias"><div class="container"><div class="trilho-area">
      <div class="trilho sangra">${CATEGORIAS.map((c) => `
        <a class="cat" href="${c.link}">
          <span class="cat-foto"><img src="${foto(c.foto)}" alt="" width="800" height="1000" loading="eager">
            <span class="cat-rotulo"><b>${esc(c.rotulo || c.nome)}</b><i>Confira</i></span></span>
          <span class="cat-nome">${esc(c.nome)}</span>
        </a>`).join('')}</div>
      <button class="trilho-seta esq" type="button" aria-label="Categorias anteriores">${icone('esq')}</button>
      <button class="trilho-seta dir" type="button" aria-label="Próximas categorias">${icone('dir')}</button>
    </div></div></section>`;
  }
  function banner(b) {
    return `<a class="banner" href="${b.link}">
      <img class="banner-foto" src="${foto(b.foto, b.vista)}" alt="" width="800" height="1000" loading="lazy">
      <span class="banner-texto${b.marca ? ' marca' : ''}">
        ${b.marca ? '<img class="banner-marca" src="assets/img/coroa.png" alt="" width="367" height="284" loading="lazy">' : ''}
        <b>${esc(b.titulo)}</b><i>${esc(b.chamada)}</i>
      </span></a>`;
  }
  function banners(lista, rotulo) {
    return `<section class="secao" aria-label="${rotulo}"><div class="container"><div class="trilho-area">
      <div class="trilho sangra colunas-2">${lista.map(banner).join('')}</div>
      <button class="trilho-seta esq" type="button" aria-label="Banners anteriores">${icone('esq')}</button>
      <button class="trilho-seta dir" type="button" aria-label="Próximos banners">${icone('dir')}</button>
    </div></div></section>`;
  }
  function vantagens() {
    const itens = [
      ['caminhao', 'Frete grátis', `Para todo o Brasil em compras acima de ${J.moeda(L.frete.gratisAcimaDe)}`],
      ['cartao', `Parcele em até ${L.parcelas.maximo}x`, `No cartão de crédito ou ${J.pctPix()}% OFF no Pix`],
      ['cadeado', 'Compra segura', 'Pedido confirmado direto com a nossa equipe'],
      ['whatsapp', 'Atendimento personalizado', 'Tem dúvidas? É só mandar mensagem no nosso WhatsApp']
    ];
    return `<section class="vantagens" aria-label="Vantagens de comprar na Wallace Imports"><div class="container vantagens-lista">
      ${itens.map((v) => `<div class="vantagem">${icone(v[0])}<div><h3>${esc(v[1])}</h3><p>${esc(v[2])}</p></div></div>`).join('')}
    </div></section>`;
  }
  function ofertas() {
    const lista = maisVendidos(selo('oferta')).slice(0, 8);
    return `<section class="secao"><div class="container">
      <h2 class="secao-titulo"><a href="produtos.html?lista=ofertas">Ofertas</a></h2>
      <div class="grade">${lista.map((p) => J.cartao(p)).join('')}</div>
    </div></section>`;
  }
  function sobre() {
    return `<section class="sobre" id="sobre"><div class="container">
      <img src="assets/img/coroa.png" alt="" width="367" height="284" loading="lazy">
      <h2 class="titulo-grande">${esc(L.sobre.titulo)}</h2>
      <p>${esc(L.sobre.texto)}</p>
    </div></section>`;
  }
  function video() {
    const capas = ['tenis-low-street-black', 'camiseta-coroa-dourada-preta', 'moletom-club-ziper-cinza', 'bone-aba-curva-preto', 'relogio-aco-dourado'];
    const temVideo = !!L.video.youtubeId;
    const dentro = `<span class="video-capa">${capas.map((s) => `<img src="${foto(s)}" alt="" width="800" height="1000" loading="lazy">`).join('')}</span>
      <span class="video-play">${icone('play')}</span>
      <span class="video-legenda">${temVideo ? 'Assistir ao vídeo' : 'Ver a loja no Instagram'}</span>`;
    return `<section class="video"><div class="container">
      ${temVideo
        ? `<button class="video-quadro" type="button" id="video" aria-label="Assistir ao vídeo da loja">${dentro}</button>`
        : `<a class="video-quadro" href="https://instagram.com/${esc(L.instagram)}" target="_blank" rel="noopener" aria-label="Ver a loja no Instagram">${dentro}</a>`}
      <h2 class="titulo-grande">Conheça a loja</h2>
    </div></section>`;
  }

  /* ---------- montagem ---------- */
  const promo = (chave) => maisVendidos(C.produtos.filter((p) => p.promo === chave));
  const P = C.promocoes;
  $('#conteudo').innerHTML =
    '<h1 class="so-leitor">Wallace Imports</h1>' +
    rotativo() +
    categorias() +
    banners(BANNERS_MARCA, 'Coleções') +
    J.vitrine(P['tenis-299'].nome, promo('tenis-299'), 4, J.linkCat(P['tenis-299'].cat, P['tenis-299'].sub)) +
    J.vitrine('Destaques', maisVendidos(selo('destaque')), 4, 'produtos.html?lista=destaques') +
    banners(BANNERS_PROMO, 'Promoções') +
    vantagens() +
    J.vitrine(P['premium-149'].nome, promo('premium-149'), 6, J.linkCat(P['premium-149'].cat, P['premium-149'].sub)) +
    J.vitrine(P['camisetas-119'].nome, promo('camisetas-119'), 6, J.linkCat(P['camisetas-119'].cat, P['camisetas-119'].sub)) +
    banners(BANNERS_NOVIDADES, 'Novidades') +
    ofertas() +
    sobre() +
    video();

  ligarRotativo();
  J.ligarTrilhos($('#conteudo'));

  const botaoVideo = $('#video');
  if (botaoVideo) botaoVideo.addEventListener('click', () => {
    const quadro = document.createElement('div');
    quadro.className = 'video-quadro';
    quadro.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(L.video.youtubeId)}?autoplay=1&rel=0" title="Vídeo da Wallace Imports" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
    botaoVideo.replaceWith(quadro);
  });
})();
