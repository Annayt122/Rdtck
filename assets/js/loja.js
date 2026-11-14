/*
 * WALLACE IMPORTS — núcleo da loja
 * Cabeçalho, rodapé, busca, menu, carrinho, compra rápida e utilidades
 * usadas pelas páginas (home.js, listagem.js, produto.js).
 */
(function () {
  'use strict';

  const L = window.LOJA;
  const C = window.CATALOGO;
  const doc = document;

  /* ------------------------------------------------------------------ utilidades */
  const $ = (sel, ctx) => (ctx || doc).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || doc).querySelectorAll(sel));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const arred = (v) => Math.round((v + Number.EPSILON) * 100) / 100;
  const moeda = (v) => 'R$ ' + arred(v).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const semAcento = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const guardar = (chave, valor) => { try { localStorage.setItem(chave, JSON.stringify(valor)); } catch (e) { /* navegação privada */ } };
  const lerGuardado = (chave, padrao) => { try { const v = JSON.parse(localStorage.getItem(chave)); return v == null ? padrao : v; } catch (e) { return padrao; } };

  /* ------------------------------------------------------------------ rota e arquivos
   * No site publicado, a página e os parâmetros vêm do endereço. Na prévia de página
   * única (tools/gerar-previa.js) a rota fica em memória e os arquivos vêm embutidos. */
  const UNICA = !!window.LOJA_PAGINA_UNICA;
  let rotaMemoria = null;
  const rota = () => rotaMemoria || { pagina: location.pathname.split('/').pop() || 'index.html', params: new URLSearchParams(location.search) };
  const definirRota = (pagina, consulta) => { rotaMemoria = { pagina: pagina || 'index.html', params: new URLSearchParams(consulta || '') }; };
  function gravarParams(params) {
    const s = params.toString();
    if (UNICA) { rotaMemoria = { pagina: rota().pagina, params: new URLSearchParams(s) }; return; }
    history.replaceState(null, '', location.pathname + (s ? '?' + s : ''));
  }
  const paginas = {};
  const registrar = (nome, montar) => { paginas[nome] = montar; if (!UNICA) montar(); };
  const embutidos = window.LOJA_ARQUIVOS || null;
  const arquivo = (caminho) => (embutidos && embutidos[caminho]) || caminho;
  // Abre um endereço externo em outra aba sem depender de window.open.
  function abrirLink(url) {
    const a = doc.createElement('a');
    a.href = url; a.target = '_blank'; a.rel = 'noopener';
    doc.body.appendChild(a); a.click(); a.remove();
  }

  const ICONES = {
    busca: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.7-3.7"/>',
    usuario: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c.8-4 3.8-6 7.5-6s6.7 2 7.5 6"/>',
    carrinho: '<path d="M3 4h2.4l2.2 11h10.2l1.9-8H6.6"/><circle cx="9" cy="19.2" r="1.3"/><circle cx="17" cy="19.2" r="1.3"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    fechar: '<path d="m6 6 12 12M18 6 6 18"/>',
    esq: '<path d="m14.5 5-7 7 7 7"/>',
    dir: '<path d="m9.5 5 7 7-7 7"/>',
    cima: '<path d="m5 14.5 7-7 7 7"/>',
    baixo: '<path d="m5 9.5 7 7 7-7"/>',
    mais: '<path d="M12 5v14M5 12h14"/>',
    menos: '<path d="M5 12h14"/>',
    lixeira: '<path d="M4.5 7h15M9.5 7V4.8h5V7M6.5 7l.8 12.2h9.4L17.5 7M10 10.5V16M14 10.5V16"/>',
    caminhao: '<path d="M2.5 6.5h11V16h-11zM13.5 9.5h4l3 3.2V16h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
    cartao: '<rect x="2.5" y="5.5" width="19" height="13" rx="2"/><path d="M2.5 10h19M6 14.5h4"/>',
    cadeado: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7M12 14.5v2.2"/>',
    whatsapp: '<path d="M12 3.2a8.7 8.7 0 0 0-7.5 13.2l-1.2 4.4 4.5-1.2A8.7 8.7 0 1 0 12 3.2Z"/><path d="M9.2 7.8c-.4 0-.8.2-1 .7-.4 1-.3 2.2.6 3.6 1 1.5 2.3 2.6 3.8 3.2 1 .4 1.9.2 2.4-.4.3-.4.4-.7.3-1l-1.7-.9-.8.8c-1-.4-2-1.3-2.6-2.4l.7-.8-.8-1.7c-.2-.1-.5-.1-.9-.1Z" fill="currentColor" stroke="none"/>',
    instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r="1" fill="currentColor" stroke="none"/>',
    email: '<rect x="3" y="5.5" width="18" height="13" rx="1.5"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/>',
    local: '<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.3"/>',
    relogio: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    compartilhar: '<circle cx="6" cy="12" r="2.2"/><circle cx="17.5" cy="6" r="2.2"/><circle cx="17.5" cy="18" r="2.2"/><path d="m8 11 7.5-4M8 13l7.5 4"/>',
    filtro: '<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
    ordenar: '<path d="M7 5v14m0 0-3-3m3 3 3-3M17 19V5m0 0-3 3m3-3 3 3"/>',
    play: '<path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/>',
    copiar: '<rect x="8.5" y="8.5" width="11" height="11" rx="1.5"/><path d="M15.5 8.5v-3a1 1 0 0 0-1-1h-9a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3"/>',
    troca: '<path d="M4 9h13l-3-3M20 15H7l3 3"/>',
    pix: '<path d="m12 3.5 8.5 8.5-8.5 8.5L3.5 12Z"/><path d="m8.5 8.5 3.5 3.5 3.5-3.5M8.5 15.5l3.5-3.5 3.5 3.5"/>',
    pacote: '<path d="M3.5 7.5 12 3.5l8.5 4v9L12 20.5l-8.5-4zM3.5 7.5 12 11.5l8.5-4M12 11.5v9"/>'
  };
  const icone = (nome, classe) => `<svg class="icone${classe ? ' ' + classe : ''}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONES[nome]}</svg>`;

  /* ------------------------------------------------------------------ catálogo */
  const porSlug = {};
  C.produtos.forEach((p, i) => { p.ordem = i; porSlug[p.slug] = p; });

  const produto = (slug) => porSlug[slug] || null;
  const categoria = (slug) => C.categorias.find((c) => c.slug === slug) || null;
  const subcategoria = (cat, sub) => { const c = categoria(cat); return (c && c.filhos || []).find((f) => f.slug === sub) || null; };
  const fotos = (p) => (p.fotos && p.fotos.length ? p.fotos : [1, 2, 3].map((n) => `assets/img/produtos/${p.slug}-${n}.svg`)).map(arquivo);
  const linkProduto = (p) => 'produto.html?p=' + p.slug;
  const linkCat = (cat, sub) => 'produtos.html?cat=' + cat + (sub ? '&sub=' + sub : '');
  const disponivel = (p, tam) => !(p.sem || []).includes(tam);
  const temEstoque = (p) => p.tam.some((t) => disponivel(p, t));
  const promoDe = (p) => (p.promo && C.promocoes[p.promo]) || null;
  const precoPix = (v) => arred(v * (1 - L.descontoPix));
  const pctPix = () => String(Math.round(L.descontoPix * 1000) / 10).replace('.', ',');
  function parcela(valor, n) {
    n = n || L.parcelas.maximo;
    if (n <= L.parcelas.semJuros || !L.parcelas.jurosMensal) return arred(valor / n);
    const j = L.parcelas.jurosMensal;
    return arred(valor * j / (1 - Math.pow(1 + j, -n)));
  }
  function produtosDa(cat, sub) {
    if (!cat) return C.produtos.slice();
    if (cat === 'black-friday') {
      return C.produtos.filter((p) => { const pr = promoDe(p); return pr && pr.cat === cat && (!sub || pr.sub === sub); });
    }
    return C.produtos.filter((p) => { const [a, b] = p.cat.split('/'); return a === cat && (!sub || b === sub); });
  }
  function buscar(termo) {
    const palavras = semAcento(termo).split(/\s+/).filter(Boolean);
    if (!palavras.length) return [];
    return C.produtos.filter((p) => {
      const c = categoria(p.cat.split('/')[0]);
      const s = subcategoria(p.cat.split('/')[0], p.cat.split('/')[1]);
      const alvo = semAcento([p.nome, p.cor, c && c.nome, s && s.nome].join(' '));
      return palavras.every((w) => alvo.includes(w) || alvo.includes(w.replace(/s$/, '')));
    });
  }
  const zap = (texto) => `https://wa.me/${L.whatsapp}${texto ? '?text=' + encodeURIComponent(texto) : ''}`;

  /* ------------------------------------------------------------------ cartão de produto */
  function precos(p, grande) {
    const pr = promoDe(p);
    return `<div class="preco-linha"><span class="${grande ? 'pdp-preco' : 'preco'}">${moeda(p.preco)}</span>${pr ? `<span class="promo-rotulo">${esc(pr.etiqueta)}</span>` : ''}</div>` +
      (p.de ? `<span class="preco-de">${moeda(p.de)}</span>` : '');
  }
  function etiquetas(p) {
    let h = '';
    if (!temEstoque(p)) h += '<span class="etiqueta">Esgotado</span>';
    else {
      if ((p.selos || []).includes('novo')) h += '<span class="etiqueta ouro">Novo</span>';
      if (p.preco >= L.frete.gratisAcimaDe) h += '<span class="etiqueta">Frete grátis</span>';
    }
    return h ? `<span class="etiquetas">${h}</span>` : '';
  }
  function cartao(p, prioridade) {
    const f = fotos(p);
    const carga = prioridade ? 'eager' : 'lazy';
    return `<article class="produto">
      <a class="produto-foto" href="${linkProduto(p)}" tabindex="-1" aria-hidden="true">
        <img class="foto-1" src="${f[0]}" alt="" width="800" height="1000" loading="${carga}" decoding="async">
        ${f[1] ? `<img class="foto-2" src="${f[1]}" alt="" width="800" height="1000" loading="lazy" decoding="async">` : ''}
        ${etiquetas(p)}
      </a>
      <div class="produto-info">
        <a class="produto-nome" href="${linkProduto(p)}">${esc(p.nome)}</a>
        ${precos(p)}
        <span class="preco-pix"><b>${moeda(precoPix(p.preco))}</b> com Pix</span>
        <span class="parcelas">${L.parcelas.maximo} x de ${moeda(parcela(p.preco))}</span>
        <div class="produto-acao">${temEstoque(p)
          ? `<button class="btn btn-p" type="button" data-comprar="${p.slug}">Comprar</button>`
          : `<a class="btn btn-p btn-contorno" href="${linkProduto(p)}">Ver produto</a>`}</div>
      </div>
    </article>`;
  }
  function vitrine(titulo, lista, colunas, link) {
    if (!lista.length) return '';
    return `<section class="secao"><div class="container">
      <h2 class="secao-titulo">${link ? `<a href="${link}">${esc(titulo)}</a>` : esc(titulo)}</h2>
      <div class="trilho-area">
        <div class="trilho sangra colunas-${colunas}">${lista.map((p) => cartao(p)).join('')}</div>
        <button class="trilho-seta esq" type="button" aria-label="Produtos anteriores">${icone('esq')}</button>
        <button class="trilho-seta dir" type="button" aria-label="Próximos produtos">${icone('dir')}</button>
      </div>
    </div></section>`;
  }
  function ligarTrilhos(raiz) {
    $$('.trilho-area', raiz).forEach((area) => {
      const t = $('.trilho', area), esq = $('.trilho-seta.esq', area), dir = $('.trilho-seta.dir', area);
      if (!t || !esq || !dir || area.dataset.ligado) return;
      area.dataset.ligado = '1';
      const estado = () => {
        const cabe = t.scrollWidth <= t.clientWidth + 2;
        esq.hidden = dir.hidden = cabe;
        esq.disabled = t.scrollLeft <= 2;
        dir.disabled = t.scrollLeft + t.clientWidth >= t.scrollWidth - 2;
      };
      const rolar = (sentido) => t.scrollBy({ left: sentido * Math.max(200, t.clientWidth - 40), behavior: 'smooth' });
      esq.addEventListener('click', () => rolar(-1));
      dir.addEventListener('click', () => rolar(1));
      t.addEventListener('scroll', estado, { passive: true });
      window.addEventListener('resize', estado);
      estado();
    });
  }

  /* ------------------------------------------------------------------ cabeçalho */
  function subMenu(cat) {
    return `<div class="nav-sub"><div class="container nav-sub-dentro">
      <div class="nav-sub-coluna"><a class="nav-sub-titulo" href="${linkCat(cat.slug)}">Ver tudo em ${esc(cat.nome)}</a>
      ${cat.filhos.map((f) => `<a href="${linkCat(cat.slug, f.slug)}">${esc(f.nome)}</a>`).join('')}</div>
    </div></div>`;
  }
  function megaMenu() {
    return `<div class="nav-sub"><div class="container nav-sub-dentro"><div class="nav-sub-todos">
      ${C.categorias.map((c) => `<div><a class="nav-sub-titulo" href="${linkCat(c.slug)}">${esc(c.nome)}</a>
        ${(c.filhos || []).map((f) => `<a href="${linkCat(c.slug, f.slug)}">${esc(f.nome)}</a>`).join('')}</div>`).join('')}
      <div><a class="nav-sub-titulo" href="produtos.html?lista=mais-vendidos">Mais vendidos</a>
        <a href="produtos.html?lista=novidades">Novidades</a><a href="produtos.html?lista=ofertas">Ofertas</a></div>
    </div></div></div>`;
  }
  function itensMenu() {
    return C.menu.map((m) => {
      const cat = m.cat && categoria(m.cat);
      return {
        nome: m.nome || (cat && (cat.menu || cat.nome)),
        link: m.link || linkCat(m.cat),
        cat: cat,
        todos: !!m.todos,
        forte: /^[^a-zà-ú]+$/.test(m.nome || (cat && cat.menu) || 'a')
      };
    });
  }
  function ehAtual(link) {
    const aqui = rota();
    const [pagina, consulta] = link.split('?');
    if (pagina !== aqui.pagina) return false;
    if (pagina !== 'produtos.html') return true;
    const a = aqui.params, b = new URLSearchParams(consulta || '');
    return (a.get('cat') || '') === (b.get('cat') || '') && (a.get('lista') || '') === (b.get('lista') || '') && (!b.get('sub') || a.get('sub') === b.get('sub')) && !a.get('q');
  }
  function marcarMenu() {
    $$('#cabecalho .nav-lista > li > a').forEach((a) => {
      if (ehAtual(a.getAttribute('href'))) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }

  function montarTopo() {
    const itens = itensMenu();
    const nav = itens.map((m) => `<li class="nav-item${m.forte ? ' forte' : ''}">
        <a href="${m.link}"${ehAtual(m.link) ? ' aria-current="page"' : ''}>${esc(m.nome)}</a>
        ${m.todos ? megaMenu() : (m.cat && m.cat.filhos ? subMenu(m.cat) : '')}
      </li>`).join('');
    const avisos = L.avisos.map((a) => `<span class="avisos-item">${esc(a)}</span>`).join('');
    const repetir = Math.max(2, Math.ceil(10 / L.avisos.length));
    const bloco = new Array(repetir + 1).join(avisos);

    $('#topo').outerHTML = `
    <header class="topo" id="cabecalho">
      <div class="container topo-barra">
        <button class="topo-icone so-celular" type="button" data-abrir="menu" aria-label="Abrir menu">${icone('menu')}</button>
        <a class="topo-logo" href="index.html" aria-label="Wallace Imports — página inicial">
          <img src="${arquivo('assets/img/logo-horizontal.png')}" alt="Wallace Imports" width="993" height="272">
        </a>
        <nav class="nav so-desktop" aria-label="Categorias">
          <button class="nav-seta" type="button" data-nav="-1" aria-label="Voltar o menu">${icone('esq')}</button>
          <ul class="nav-lista">${nav}</ul>
          <button class="nav-seta" type="button" data-nav="1" aria-label="Avançar o menu">${icone('dir')}</button>
        </nav>
        <div class="topo-acoes">
          <button class="topo-icone so-desktop" type="button" data-abrir="busca" aria-label="Buscar">${icone('busca')}</button>
          <a class="topo-icone so-desktop" href="conta.html" aria-label="Minha conta">${icone('usuario')}</a>
          <button class="topo-icone" type="button" data-abrir="carrinho" aria-label="Abrir carrinho">${icone('carrinho')}<span class="selo-qtd" data-qtd>0</span></button>
        </div>
      </div>
      <form class="topo-busca so-celular" action="produtos.html" role="search">
        <input class="campo" type="search" name="q" placeholder="Buscar" aria-label="Buscar produtos" autocomplete="off" data-abrir-busca>
        <button type="submit" aria-label="Buscar">${icone('busca')}</button>
      </form>
    </header>
    <div class="avisos" role="note" aria-label="${esc(L.avisos.join(' · '))}"><div class="avisos-trilho" aria-hidden="true">${bloco}${bloco}</div></div>`;

    const topo = $('#cabecalho');
    const lista = $('.nav-lista', topo);
    const setas = $$('.nav-seta', topo);
    const estadoSetas = () => {
      setas[0].disabled = lista.scrollLeft <= 2;
      setas[1].disabled = lista.scrollLeft + lista.clientWidth >= lista.scrollWidth - 2;
    };
    setas.forEach((s) => s.addEventListener('click', () => lista.scrollBy({ left: Number(s.dataset.nav) * 260, behavior: 'smooth' })));
    lista.addEventListener('scroll', estadoSetas, { passive: true });
    window.addEventListener('resize', estadoSetas);
    const atual = $('[aria-current]', lista);
    if (atual && atual.offsetLeft + atual.offsetWidth > lista.clientWidth) lista.scrollLeft = atual.offsetLeft - 40;
    estadoSetas();
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(estadoSetas);

    let marcado = false;
    const aoRolar = () => {
      const compacto = window.scrollY > 60;
      if (compacto !== marcado) { marcado = compacto; topo.classList.toggle('compacto', compacto); }
    };
    window.addEventListener('scroll', aoRolar, { passive: true });
    aoRolar();
  }

  /* ------------------------------------------------------------------ rodapé + camadas */
  function montarRodape() {
    const ano = new Date().getFullYear();
    const navegacao = itensMenu().map((m) => `<li><a href="${m.link}">${esc(m.nome)}</a></li>`).join('');
    const coluna = (titulo, conteudo, classe) => `<div class="rodape-coluna${classe ? ' ' + classe : ''}">
        <h3><button class="rodape-titulo" type="button">${titulo}${icone('mais')}</button></h3><ul>${conteudo}</ul></div>`;

    $('#rodape').outerHTML = `
    <footer class="rodape">
      <section class="novidades" aria-labelledby="novidades-titulo"><div class="container novidades-dentro">
        <h2 id="novidades-titulo">Newsletter</h2>
        <p>Cadastre-se e receba nossas ofertas.</p>
        <form id="novidades-form" novalidate>
          <input class="campo" type="email" name="email" placeholder="Cadastre seu e-mail..." aria-label="Seu e-mail" autocomplete="email" required>
          <button type="submit">Enviar</button>
        </form>
        <p class="retorno" id="novidades-retorno" role="status" hidden></p>
      </div></section>

      <div class="container rodape-colunas">
        ${coluna('Institucional', `
          <li><a href="politica-de-privacidade.html">Política de Privacidade</a></li>
          <li><a href="como-comprar.html">Como Comprar</a></li>
          <li><a href="perguntas-frequentes.html">Perguntas Frequentes</a></li>
          <li><a href="trocas-e-devolucoes.html">Trocas e Devoluções</a></li>
          <li><a href="contato.html">Fale Conosco</a></li>
          <li><a href="conta.html">Acompanhar Pedido</a></li>`)}
        ${coluna('Navegação', navegacao)}
        ${coluna('Entre em contato', `
          <li>${icone('whatsapp')}<a href="${zap('Olá! Vim pelo site da Wallace Imports.')}" target="_blank" rel="noopener">${esc(L.whatsappExibicao)}</a></li>
          <li>${icone('email')}<a href="mailto:${esc(L.email)}">${esc(L.email)}</a></li>
          <li>${icone('local')}<span>${esc(L.endereco)}</span></li>
          <li>${icone('relogio')}<span>${esc(L.horario)}</span></li>`, 'rodape-contato aberta')}
        <div class="rodape-marca">
          <img src="${arquivo('assets/img/logo-wallace-imports.png')}" alt="Wallace Imports" width="626" height="539" loading="lazy">
          <div class="redes">
            <a href="https://instagram.com/${esc(L.instagram)}" target="_blank" rel="noopener" aria-label="Instagram da Wallace Imports">${icone('instagram')}</a>
            <a href="${zap('Olá! Vim pelo site da Wallace Imports.')}" target="_blank" rel="noopener" aria-label="WhatsApp da Wallace Imports">${icone('whatsapp')}</a>
          </div>
        </div>
      </div>

      <div class="rodape-meios"><div class="container">
        <div><h3>Meios de pagamento</h3><div class="chips">${L.bandeiras.map((b) => `<span class="chip">${esc(b)}</span>`).join('')}</div></div>
        <div><h3>Meios de envio</h3><div class="chips">${L.frete.transportadoras.map((b) => `<span class="chip">${esc(b)}</span>`).join('')}</div></div>
      </div></div>
      <div class="rodape-legal"><div class="container">Copyright ${esc(L.nome)} - CNPJ ${esc(L.cnpj)} - ${ano}. Todos os direitos reservados.</div></div>
    </footer>

    <div class="veu" id="veu"></div>

    <aside class="gaveta direita" id="carrinho" role="dialog" aria-modal="true" aria-label="Carrinho de compras" aria-hidden="true" tabindex="-1">
      <div class="gaveta-topo"><h2>Carrinho de compras</h2><button class="fechar" type="button" data-fechar aria-label="Fechar carrinho">${icone('fechar')}</button></div>
      <div class="gaveta-corpo" id="carrinho-corpo"></div>
      <div class="gaveta-pe" id="carrinho-pe"></div>
    </aside>

    <aside class="gaveta esquerda" id="menu" role="dialog" aria-modal="true" aria-label="Menu" aria-hidden="true" tabindex="-1">
      <div class="gaveta-topo"><a class="link" href="conta.html">Acompanhar pedido</a><button class="fechar" type="button" data-fechar aria-label="Fechar menu">${icone('fechar')}</button></div>
      <div class="gaveta-corpo" style="padding:0;position:relative" id="menu-corpo"></div>
    </aside>

    <div class="busca" id="busca" role="dialog" aria-modal="true" aria-label="Busca" aria-hidden="true"><div class="container">
      <form class="busca-form" action="produtos.html" role="search">
        <input class="campo" type="search" name="q" placeholder="O que você procura?" aria-label="Buscar produtos" autocomplete="off" id="busca-campo">
        <button class="busca-enviar" type="submit" aria-label="Buscar">${icone('busca')}</button>
        <button class="fechar" type="button" data-fechar aria-label="Fechar busca">${icone('fechar')}</button>
      </form>
      <div class="sugestoes" id="sugestoes"></div>
    </div></div>

    <div class="modal" id="rapida" role="dialog" aria-modal="true" aria-label="Compra rápida" aria-hidden="true" tabindex="-1"></div>
    <div class="modal estreito" id="modal" role="dialog" aria-modal="true" aria-hidden="true" tabindex="-1"></div>

    <a class="zap" href="${zap('Olá! Vim pelo site da Wallace Imports e quero atendimento.')}" target="_blank" rel="noopener" aria-label="Falar com a Wallace Imports no WhatsApp">${icone('whatsapp')}</a>`;

    // rodapé em sanfona no celular
    $$('.rodape-titulo').forEach((b) => b.addEventListener('click', () => {
      if (window.matchMedia('(max-width: 991px)').matches) b.closest('.rodape-coluna').classList.toggle('aberta');
    }));

    // newsletter: sem servidor próprio, o cadastro chega pelo WhatsApp da loja
    const form = $('#novidades-form'), retorno = $('#novidades-retorno');
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const email = form.email.value.trim();
      retorno.hidden = false;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { retorno.textContent = 'Confira o e-mail digitado e tente de novo.'; form.email.focus(); return; }
      retorno.textContent = 'Abrimos o WhatsApp para confirmar seu cadastro. É só enviar a mensagem.';
      abrirLink(zap(`Olá! Quero receber as ofertas da Wallace Imports. Meu e-mail: ${email}`));
      form.reset();
    });

    // formulários de contato e de acompanhamento de pedido: a mensagem segue pelo WhatsApp
    doc.addEventListener('submit', (ev) => {
      const f = ev.target;
      if (f.id !== 'form-contato' && f.id !== 'form-pedido') return;
      ev.preventDefault();
      const contato = f.id === 'form-contato';
      const erro = $('.erro', f);
      const obrigatorios = contato ? [f.nome, f.mensagem] : [f.nome, f.pedido];
      if (obrigatorios.some((c) => !c.value.trim())) {
        erro.hidden = false;
        erro.textContent = contato ? 'Preencha seu nome e a mensagem.' : 'Preencha os dois campos para localizarmos o pedido.';
        return;
      }
      erro.hidden = true;
      abrirLink(zap(contato
        ? `Olá! Sou ${f.nome.value.trim()}.\nAssunto: ${f.assunto.value}\n\n${f.mensagem.value.trim()}`
        : `Olá! Quero acompanhar meu pedido.\nNome: ${f.nome.value.trim()}\nTelefone/pedido: ${f.pedido.value.trim()}`));
    });

    preencher();
    montarMenuCelular();
    montarCookies();
    ligarCamadas();
    ligarBusca();
    desenharCarrinho();
  }

  /* Preenche, nas páginas de texto, os dados que vêm de config.js. */
  function preencher() {
    const valores = {
      nome: L.nome, whatsappExibicao: L.whatsappExibicao, email: L.email, endereco: L.endereco, horario: L.horario, cnpj: L.cnpj,
      freteGratis: moeda(L.frete.gratisAcimaDe), pix: pctPix(), parcelas: L.parcelas.maximo, postagem: L.frete.postagem
    };
    $$('[data-loja]').forEach((el) => { if (valores[el.dataset.loja] != null) el.textContent = valores[el.dataset.loja]; });
    $$('[data-zap]').forEach((el) => { el.href = zap(el.dataset.zap); });
    $$('[data-email]').forEach((el) => { el.href = 'mailto:' + L.email; el.textContent = L.email; });
    $$('[data-email-botao]').forEach((el) => { el.href = 'mailto:' + L.email; });
    $$('[data-instagram]').forEach((el) => { el.href = 'https://instagram.com/' + L.instagram; });
    $$('[data-icone]').forEach((el) => { el.outerHTML = icone(el.dataset.icone); });
  }

  function montarMenuCelular() {
    const itens = itensMenu();
    let paineis = '';
    const lista = itens.map((m, i) => {
      const filhos = m.todos
        ? [{ nome: 'Ver todos os produtos', link: 'produtos.html' }].concat(C.categorias.map((c) => ({ nome: c.nome, link: linkCat(c.slug) })))
        : (m.cat && m.cat.filhos ? [{ nome: 'Ver tudo em ' + m.cat.nome, link: m.link }].concat(m.cat.filhos.map((f) => ({ nome: f.nome, link: linkCat(m.cat.slug, f.slug) }))) : null);
      if (!filhos) return `<li><a href="${m.link}">${esc(m.nome)}</a></li>`;
      paineis += `<div class="menu-painel" id="painel-${i}" aria-hidden="true">
        <button class="voltar" type="button" data-painel-voltar>${icone('esq')}${esc(m.nome)}</button>
        <ul class="menu-lista">${filhos.map((f) => `<li><a href="${f.link}">${esc(f.nome)}</a></li>`).join('')}</ul></div>`;
      return `<li><button type="button" data-painel="painel-${i}">${esc(m.nome)}${icone('dir')}</button></li>`;
    }).join('');
    const corpo = $('#menu-corpo');
    corpo.innerHTML = `<ul class="menu-lista">${lista}
      <li><a href="contato.html">Fale Conosco</a></li></ul>${paineis}`;
    corpo.addEventListener('click', (ev) => {
      const abre = ev.target.closest('[data-painel]');
      const volta = ev.target.closest('[data-painel-voltar]');
      if (abre) { const p = $('#' + abre.dataset.painel); p.classList.add('aberto'); p.setAttribute('aria-hidden', 'false'); $('.voltar', p).focus(); }
      if (volta) { const p = volta.closest('.menu-painel'); p.classList.remove('aberto'); p.setAttribute('aria-hidden', 'true'); }
    });
  }

  function montarCookies() {
    if (lerGuardado('wallace.cookies', false)) return;
    const el = doc.createElement('div');
    el.className = 'cookies';
    el.setAttribute('role', 'region');
    el.setAttribute('aria-label', 'Aviso de cookies');
    el.innerHTML = 'Usamos cookies para lembrar do seu carrinho e deixar a compra mais rápida. Ao continuar, você concorda com a nossa <a class="link" href="politica-de-privacidade.html">política de privacidade</a>. <button type="button">Entendi</button>';
    doc.body.appendChild(el);
    $('button', el).addEventListener('click', () => { guardar('wallace.cookies', true); el.remove(); });
  }

  /* ------------------------------------------------------------------ camadas (gavetas, modais, busca) */
  let camada = null, focoAnterior = null;
  function abrir(id) {
    const el = typeof id === 'string' ? $('#' + id) : id;
    if (!el) return;
    if (camada && camada !== el) fechar(true);
    if (!camada) focoAnterior = doc.activeElement;
    camada = el;
    el.classList.add('aberto');
    el.setAttribute('aria-hidden', 'false');
    $('#veu').classList.add('aberto');
    doc.body.classList.add('travado');
    const alvo = $('[data-foco]', el) || (el.id === 'busca' ? $('#busca-campo') : el);
    setTimeout(() => alvo.focus({ preventScroll: true }), 60);
  }
  function fechar(troca) {
    if (!camada) return;
    camada.classList.remove('aberto');
    camada.setAttribute('aria-hidden', 'true');
    $$('.menu-painel.aberto', camada).forEach((p) => p.classList.remove('aberto'));
    camada = null;
    if (troca === true) return;
    $('#veu').classList.remove('aberto');
    doc.body.classList.remove('travado');
    if (focoAnterior && focoAnterior.focus) focoAnterior.focus({ preventScroll: true });
  }
  function ligarCamadas() {
    $('#veu').addEventListener('click', () => fechar());
    doc.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape' && camada) fechar();
      if (ev.key === 'Tab' && camada) {
        const focaveis = $$('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex="0"]', camada).filter((e) => e.offsetParent !== null);
        if (!focaveis.length) return;
        const primeiro = focaveis[0], ultimo = focaveis[focaveis.length - 1];
        if (ev.shiftKey && (doc.activeElement === primeiro || doc.activeElement === camada)) { ev.preventDefault(); ultimo.focus(); }
        else if (!ev.shiftKey && doc.activeElement === ultimo) { ev.preventDefault(); primeiro.focus(); }
      }
    });
    doc.addEventListener('click', (ev) => {
      const abre = ev.target.closest('[data-abrir]');
      if (abre) { ev.preventDefault(); abrir(abre.dataset.abrir); return; }
      if (ev.target.closest('[data-fechar]')) { ev.preventDefault(); fechar(); return; }
      const compra = ev.target.closest('[data-comprar]');
      if (compra) { ev.preventDefault(); compraRapida(compra.dataset.comprar); }
    });
  }

  /* ------------------------------------------------------------------ busca */
  const TERMOS = ['Tênis', 'Camiseta preta', 'Moletom', 'Conjunto', 'Boné', 'Bermuda', 'Perfume', 'Relógio'];
  function ligarBusca() {
    const campo = $('#busca-campo'), caixa = $('#sugestoes');
    const desenhar = () => {
      const termo = campo.value.trim();
      if (termo.length < 2) {
        caixa.innerHTML = `<p class="sugestoes-titulo">Mais buscados</p><div class="sugestoes-termos">${TERMOS.map((t) => `<a href="produtos.html?q=${encodeURIComponent(t)}">${t}</a>`).join('')}</div>`;
        return;
      }
      const achados = buscar(termo);
      if (!achados.length) { caixa.innerHTML = `<p>Nada encontrado para “${esc(termo)}”. Tente outro termo ou <a class="link" href="produtos.html">veja todos os produtos</a>.</p>`; return; }
      caixa.innerHTML = `<p class="sugestoes-titulo">Produtos</p>` + achados.slice(0, 6).map((p) => `
        <a class="sugestao" href="${linkProduto(p)}"><img src="${fotos(p)[0]}" alt="" width="56" height="70" loading="lazy"><span>${esc(p.nome)}</span><b>${moeda(p.preco)}</b></a>`).join('') +
        (achados.length > 6 ? `<a class="link" href="produtos.html?q=${encodeURIComponent(termo)}">Ver os ${achados.length} resultados</a>` : '');
    };
    campo.addEventListener('input', desenhar);
    desenhar();
    $$('[data-abrir-busca]').forEach((c) => c.addEventListener('focus', () => { c.blur(); abrir('busca'); }));
  }

  /* ------------------------------------------------------------------ carrinho */
  const CHAVE = 'wallace.carrinho.v1';
  const itensSalvos = () => lerGuardado(CHAVE, []).filter((i) => i && produto(i.slug) && produto(i.slug).tam.includes(i.tam) && i.qtd > 0);
  const salvarItens = (itens) => { guardar(CHAVE, itens); desenharCarrinho(); };

  function adicionar(slug, tam, qtd) {
    const itens = itensSalvos();
    const igual = itens.find((i) => i.slug === slug && i.tam === tam);
    if (igual) igual.qtd = Math.min(20, igual.qtd + qtd); else itens.push({ slug: slug, tam: tam, qtd: qtd });
    salvarItens(itens);
  }

  function regiaoDoCep(cep) {
    const d = String(cep).replace(/\D/g, '');
    if (d.length !== 8) return null;
    return L.frete.regioes.find((r) => r.digitos.includes(d[0])) || null;
  }
  function opcoesFrete(cep, valorProdutos) {
    const r = regiaoDoCep(cep);
    if (!r) return null;
    const gratis = valorProdutos >= L.frete.gratisAcimaDe;
    return {
      regiao: r.nome,
      opcoes: [
        { id: 'pac', nome: 'Correios PAC', valor: gratis ? 0 : r.pac[0], prazo: r.pac[1] },
        { id: 'sedex', nome: 'Correios SEDEX', valor: r.sedex[0], prazo: r.sedex[1] }
      ]
    };
  }
  const mascaraCep = (v) => { const d = String(v).replace(/\D/g, '').slice(0, 8); return d.length > 5 ? d.slice(0, 5) + '-' + d.slice(5) : d; };

  function calcular(itens) {
    const linhas = itens.map((i) => { const p = produto(i.slug); return { slug: i.slug, tam: i.tam, qtd: i.qtd, p: p, total: arred(p.preco * i.qtd) }; });
    const subtotal = arred(linhas.reduce((s, l) => s + l.total, 0));
    const descontos = [], dicas = [];
    Object.keys(C.promocoes).forEach((chave) => {
      const pr = C.promocoes[chave];
      const dentro = linhas.filter((l) => l.p.promo === chave);
      const qtd = dentro.reduce((s, l) => s + l.qtd, 0);
      if (!qtd) return;
      if (qtd >= pr.leve) {
        const unidade = pr.por / pr.leve;
        const valor = arred(dentro.reduce((s, l) => s + l.qtd * Math.max(0, l.p.preco - unidade), 0));
        if (valor > 0) descontos.push({ nome: pr.etiqueta, valor: valor });
      } else {
        const falta = pr.leve - qtd;
        dicas.push({ texto: `Adicione mais ${falta} ${falta > 1 ? 'itens' : 'item'} da promoção e leve <b>${esc(pr.etiqueta)}</b>.`, link: linkCat(pr.cat, pr.sub) });
      }
    });
    const produtos = arred(subtotal - descontos.reduce((s, d) => s + d.valor, 0));
    const cep = lerGuardado('wallace.cep', null);
    let frete = null;
    if (cep && linhas.length) {
      const f = opcoesFrete(cep.cep, produtos);
      if (f) { const escolhida = f.opcoes.find((o) => o.id === cep.opcao) || f.opcoes[0]; frete = { cep: cep.cep, regiao: f.regiao, opcoes: f.opcoes, escolhida: escolhida }; }
    }
    const valorFrete = frete ? frete.escolhida.valor : 0;
    return {
      linhas: linhas,
      qtd: linhas.reduce((s, l) => s + l.qtd, 0),
      subtotal: subtotal, descontos: descontos, dicas: dicas, produtos: produtos,
      frete: frete,
      total: arred(produtos + valorFrete),
      totalPix: arred(precoPix(produtos) + valorFrete),
      faltaFrete: Math.max(0, arred(L.frete.gratisAcimaDe - produtos))
    };
  }

  function metaFrete(valorProdutos) {
    const falta = Math.max(0, arred(L.frete.gratisAcimaDe - valorProdutos));
    const pct = Math.min(100, Math.round(valorProdutos / L.frete.gratisAcimaDe * 100));
    return `<div class="meta-frete">${falta > 0
      ? `Faltam <b>${moeda(falta)}</b> para o frete grátis.`
      : '<b>Você ganhou frete grátis</b> no envio econômico.'}<div class="barra"><i style="width:${pct}%"></i></div></div>`;
  }

  function blocoCep(valorProdutos, comEscolha) {
    const salvo = lerGuardado('wallace.cep', null);
    const f = salvo ? opcoesFrete(salvo.cep, valorProdutos) : null;
    let resultado = '';
    if (f) {
      resultado = `<p class="cep-destino">Entrega para o CEP ${mascaraCep(salvo.cep)} · ${esc(f.regiao)}</p><div class="cep-opcoes">` +
        f.opcoes.map((o) => `<label class="cep-opcao">
          ${comEscolha ? `<input type="radio" name="frete" value="${o.id}"${(salvo.opcao || 'pac') === o.id ? ' checked' : ''}>` : '<span></span>'}
          <span>${o.nome}<small>${o.prazo}</small></span><b>${o.valor ? moeda(o.valor) : 'Grátis'}</b></label>`).join('') + '</div>';
    }
    return `<div class="cep" data-cep>
      <div class="cep-rotulo">${icone('caminhao')}<span>Calcule o frete e o prazo</span></div>
      <form class="cep-form" novalidate>
        <input class="campo" type="text" inputmode="numeric" name="cep" placeholder="Seu CEP" aria-label="CEP" maxlength="9" autocomplete="postal-code" value="${salvo ? mascaraCep(salvo.cep) : ''}">
        <button class="btn btn-contorno" type="submit">Calcular</button>
      </form>
      <a class="cep-ajuda link" href="https://buscacepinter.correios.com.br/app/endereco/index.php" target="_blank" rel="noopener">Não sei meu CEP</a>
      <p class="cep-erro" role="alert" hidden></p>
      <div data-cep-resultado>${resultado}</div>
    </div>`;
  }
  // Liga os formulários de CEP dentro de `raiz`; `aoMudar` redesenha quem usa o resultado.
  function ligarCep(raiz, aoMudar) {
    $$('[data-cep]', raiz).forEach((bloco) => {
      const form = $('form', bloco), erro = $('.cep-erro', bloco);
      form.cep.addEventListener('input', () => { form.cep.value = mascaraCep(form.cep.value); });
      form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        const digitos = form.cep.value.replace(/\D/g, '');
        if (!regiaoDoCep(digitos)) { erro.hidden = false; erro.textContent = 'Não encontramos esse CEP. Confira os 8 números.'; return; }
        erro.hidden = true;
        const salvo = lerGuardado('wallace.cep', null);
        guardar('wallace.cep', { cep: digitos, opcao: (salvo && salvo.opcao) || 'pac' });
        aoMudar();
      });
      bloco.addEventListener('change', (ev) => {
        if (ev.target.name !== 'frete') return;
        const salvo = lerGuardado('wallace.cep', null);
        if (salvo) { salvo.opcao = ev.target.value; guardar('wallace.cep', salvo); aoMudar(); }
      });
    });
  }

  function desenharCarrinho() {
    const corpo = $('#carrinho-corpo'), pe = $('#carrinho-pe');
    const itens = itensSalvos();
    const c = calcular(itens);
    $$('[data-qtd]').forEach((el) => { el.textContent = c.qtd; });
    if (!corpo) return;

    if (!c.linhas.length) {
      corpo.innerHTML = `<div class="carrinho-vazio">${icone('carrinho')}<p>Seu carrinho está vazio.</p><a class="btn" href="produtos.html">Ver produtos</a></div>`;
      pe.hidden = true;
      return;
    }
    pe.hidden = false;
    const pagamento = lerGuardado('wallace.pagamento', 'pix');

    corpo.innerHTML = c.linhas.map((l, i) => {
      const pr = promoDe(l.p);
      return `<div class="item">
        <a class="item-foto" href="${linkProduto(l.p)}" tabindex="-1" aria-hidden="true"><img src="${fotos(l.p)[0]}" alt="" width="78" height="98" loading="lazy"></a>
        <div>
          <a class="item-nome" href="${linkProduto(l.p)}">${esc(l.p.nome)}</a>
          <small>${l.tam === 'Único' ? 'Tamanho único' : 'Tamanho: ' + esc(l.tam)}</small>
          ${pr ? `<span class="ouro">${esc(pr.etiqueta)}</span>` : ''}
          <div class="qtd" role="group" aria-label="Quantidade">
            <button type="button" data-item="${i}" data-passo="-1" aria-label="Diminuir quantidade">${icone('menos')}</button>
            <output aria-live="polite">${l.qtd}</output>
            <button type="button" data-item="${i}" data-passo="1" aria-label="Aumentar quantidade">${icone('mais')}</button>
          </div>
        </div>
        <div class="item-lado">
          <span class="item-preco">${moeda(l.total)}</span>
          <button class="item-remover" type="button" data-remover="${i}" aria-label="Remover ${esc(l.p.nome)}">${icone('lixeira')}</button>
        </div>
      </div>`;
    }).join('') +
      metaFrete(c.produtos) +
      c.dicas.map((d) => `<p class="dica-promo">${d.texto} <a href="${d.link}">Ver produtos</a></p>`).join('') +
      blocoCep(c.produtos, true);

    pe.innerHTML = `<div class="resumo">
        <div><span>Subtotal</span><span>${moeda(c.subtotal)}</span></div>
        ${c.descontos.map((d) => `<div class="desconto"><span>${esc(d.nome)}</span><span>- ${moeda(d.valor)}</span></div>`).join('')}
        <div><span>Frete</span><span>${c.frete ? (c.frete.escolhida.valor ? moeda(c.frete.escolhida.valor) : 'Grátis') : 'Informe o CEP'}</span></div>
        <div class="total"><span>Total</span><span>${moeda(pagamento === 'pix' ? c.totalPix : c.total)}</span></div>
        <div class="pix">${pagamento === 'pix'
          ? `${pctPix()}% de desconto no Pix já aplicado`
          : `ou <b>${moeda(c.totalPix)}</b> no Pix · até ${L.parcelas.maximo}x de ${moeda(parcela(c.total))}`}</div>
      </div>
      <div class="pagamento" role="radiogroup" aria-label="Forma de pagamento">
        <label><input type="radio" name="pagamento" value="pix"${pagamento === 'pix' ? ' checked' : ''}>Pix</label>
        <label><input type="radio" name="pagamento" value="cartao"${pagamento === 'cartao' ? ' checked' : ''}>Cartão</label>
      </div>
      <a class="btn btn-bloco" id="finalizar" href="${zap(mensagemPedido(c, pagamento))}" target="_blank" rel="noopener">${icone('whatsapp')}Finalizar pedido</a>
      <a class="link" href="produtos.html">Ver mais produtos</a>
      <p class="nota">O pedido é concluído com a nossa equipe pelo WhatsApp: confirmamos tamanho, endereço e enviamos o link de pagamento.</p>`;

    ligarCep(corpo, desenharCarrinho);
  }

  function mensagemPedido(c, pagamento) {
    const linhas = ['Olá! Quero fechar este pedido na Wallace Imports:', ''];
    c.linhas.forEach((l) => linhas.push(`• ${l.qtd}x ${l.p.nome}${l.tam === 'Único' ? '' : ' — tam. ' + l.tam} — ${moeda(l.total)}`));
    linhas.push('', `Subtotal: ${moeda(c.subtotal)}`);
    c.descontos.forEach((d) => linhas.push(`Promoção ${d.nome}: - ${moeda(d.valor)}`));
    if (c.frete) linhas.push(`Frete: ${c.frete.escolhida.nome} para o CEP ${mascaraCep(c.frete.cep)} — ${c.frete.escolhida.valor ? moeda(c.frete.escolhida.valor) : 'grátis'}`);
    else linhas.push('Frete: a calcular');
    if (pagamento === 'pix') linhas.push(`Pagamento: Pix (${pctPix()}% de desconto)`, `Total: ${moeda(c.totalPix)}`);
    else linhas.push('Pagamento: cartão de crédito', `Total: ${moeda(c.total)}`);
    return linhas.join('\n').replace(/ /g, ' ');
  }

  doc.addEventListener('click', (ev) => {
    const passo = ev.target.closest('[data-item]');
    const remove = ev.target.closest('[data-remover]');
    if (!passo && !remove) return;
    const itens = itensSalvos();
    if (passo) {
      const i = Number(passo.dataset.item);
      itens[i].qtd = Math.max(1, Math.min(20, itens[i].qtd + Number(passo.dataset.passo)));
    } else itens.splice(Number(remove.dataset.remover), 1);
    salvarItens(itens);
  });
  doc.addEventListener('change', (ev) => {
    if (ev.target.name === 'pagamento') { guardar('wallace.pagamento', ev.target.value); desenharCarrinho(); }
  });
  window.addEventListener('storage', (ev) => { if (ev.key === CHAVE) desenharCarrinho(); });

  /* ------------------------------------------------------------------ caixa de compra (tamanho + quantidade + botão) */
  function caixaCompra(p) {
    const unico = p.tam.length === 1;
    const primeiro = p.tam.find((t) => disponivel(p, t));
    const tamanhos = p.tam.map((t) => {
      const ok = disponivel(p, t);
      return `<button class="tamanho${ok ? '' : ' esgotado'}" type="button" data-tam="${esc(t)}" aria-pressed="${t === primeiro}"${ok ? '' : ' aria-disabled="true" title="Esgotado"'}>${esc(t)}</button>`;
    }).join('');
    return `<div data-caixa="${p.slug}">
      <div class="variacao"${unico ? ' hidden' : ''}>
        <p class="variacao-rotulo">Tamanho: <b data-tam-atual>${primeiro ? esc(primeiro) : '—'}</b></p>
        <div class="tamanhos" role="group" aria-label="Tamanho">${tamanhos}</div>
      </div>
      <p class="erro" role="alert" hidden></p>
      ${primeiro ? `<div class="comprar-linha">
        <div class="qtd" role="group" aria-label="Quantidade">
          <button type="button" data-qtd-passo="-1" aria-label="Diminuir quantidade">${icone('menos')}</button>
          <input type="number" min="1" max="20" value="1" aria-label="Quantidade" inputmode="numeric">
          <button type="button" data-qtd-passo="1" aria-label="Aumentar quantidade">${icone('mais')}</button>
        </div>
        <button class="btn" type="button" data-adicionar>Comprar</button>
      </div>` : `<a class="btn btn-bloco btn-contorno" href="${zap('Olá! Quero ser avisado quando chegar reposição de: ' + p.nome)}" target="_blank" rel="noopener">Avise-me quando chegar</a>`}
    </div>`;
  }
  function ligarCaixa(raiz, aoAdicionar) {
    $$('[data-caixa]', raiz).forEach((caixa) => {
      const p = produto(caixa.dataset.caixa);
      const campo = $('input[type="number"]', caixa), erro = $('.erro', caixa);
      caixa.addEventListener('click', (ev) => {
        const tam = ev.target.closest('[data-tam]');
        const passo = ev.target.closest('[data-qtd-passo]');
        if (tam) {
          if (tam.classList.contains('esgotado')) { erro.hidden = false; erro.textContent = `O tamanho ${tam.dataset.tam} está esgotado. Escolha outro.`; return; }
          erro.hidden = true;
          $$('[data-tam]', caixa).forEach((b) => b.setAttribute('aria-pressed', String(b === tam)));
          $('[data-tam-atual]', caixa).textContent = tam.dataset.tam;
        }
        if (passo && campo) campo.value = Math.max(1, Math.min(20, (parseInt(campo.value, 10) || 1) + Number(passo.dataset.qtdPasso)));
        if (ev.target.closest('[data-adicionar]')) {
          const escolhido = $('[data-tam][aria-pressed="true"]', caixa);
          if (!escolhido) { erro.hidden = false; erro.textContent = 'Escolha um tamanho.'; return; }
          const qtd = Math.max(1, Math.min(20, parseInt(campo.value, 10) || 1));
          adicionar(p.slug, escolhido.dataset.tam, qtd);
          if (aoAdicionar) aoAdicionar();
          abrir('carrinho');
        }
      });
    });
  }

  function compraRapida(slug) {
    const p = produto(slug);
    if (!p) return;
    if (p.tam.length === 1 && temEstoque(p)) { adicionar(p.slug, p.tam[0], 1); abrir('carrinho'); return; }
    const el = $('#rapida');
    el.setAttribute('aria-label', 'Comprar ' + p.nome);
    el.innerHTML = `<button class="fechar" type="button" data-fechar aria-label="Fechar">${icone('fechar')}</button>
      <div class="rapida">
        <div class="rapida-foto"><img src="${fotos(p)[0]}" alt="${esc(p.nome)}" width="800" height="1000"></div>
        <div class="rapida-info">
          <h2>${esc(p.nome)}</h2>
          ${precos(p)}
          <span class="preco-pix"><b>${moeda(precoPix(p.preco))}</b> com Pix</span>
          <span class="parcelas">${L.parcelas.maximo} x de ${moeda(parcela(p.preco))}</span>
          ${caixaCompra(p)}
          <a class="link" href="${linkProduto(p)}">Ver detalhes do produto</a>
        </div>
      </div>`;
    ligarCaixa(el);
    abrir(el);
  }

  function abrirModal(titulo, html) {
    const el = $('#modal');
    el.setAttribute('aria-label', titulo);
    el.innerHTML = `<button class="fechar" type="button" data-fechar aria-label="Fechar">${icone('fechar')}</button><h2 class="modal-titulo">${esc(titulo)}</h2><div class="modal-corpo">${html}</div>`;
    abrir(el);
    return el;
  }

  /* ------------------------------------------------------------------ API para as páginas */
  window.Loja = {
    config: L, catalogo: C,
    $: $, $$: $$, esc: esc, moeda: moeda, icone: icone, semAcento: semAcento,
    produto: produto, categoria: categoria, subcategoria: subcategoria, produtosDa: produtosDa, buscar: buscar,
    fotos: fotos, linkProduto: linkProduto, linkCat: linkCat, promoDe: promoDe, temEstoque: temEstoque,
    precoPix: precoPix, pctPix: pctPix, parcela: parcela, zap: zap,
    cartao: cartao, vitrine: vitrine, ligarTrilhos: ligarTrilhos, precos: precos, etiquetas: etiquetas,
    caixaCompra: caixaCompra, ligarCaixa: ligarCaixa, blocoCep: blocoCep, ligarCep: ligarCep, metaFrete: metaFrete,
    abrir: abrir, fechar: fechar, abrirModal: abrirModal, calcular: calcular, itens: itensSalvos,
    unica: UNICA, rota: rota, definirRota: definirRota, gravarParams: gravarParams, registrar: registrar, paginas: paginas,
    arquivo: arquivo, abrirLink: abrirLink, preencher: preencher, marcarMenu: marcarMenu,
    topo: montarTopo, rodape: montarRodape
  };
})();
