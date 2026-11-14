/*
 * WALLACE IMPORTS — listagem (produtos.html)
 *   ?cat=camisetas&sub=basicas   categoria / subcategoria
 *   ?q=termo                     busca
 *   ?lista=mais-vendidos|novidades|ofertas|destaques
 * Filtros (cor, tamanho, preço) e ordenação ficam na URL, então o link pode ser compartilhado.
 */
(function () {
  'use strict';
  const J = window.Loja, C = J.catalogo;
  const { $, $$, esc, icone, moeda } = J;

  const CORES = { 'Preto': '#0a0a0a', 'Branco': '#ffffff', 'Cinza': '#8d8d8f', 'Azul marinho': '#1b2540', 'Azul claro': '#9fb9d6', 'Vermelho': '#b3191f', 'Verde': '#3d4a36', 'Bege': '#d9cbb0', 'Amarelo': '#f3cf1f', 'Dourado': '#d2a53a' };
  const ORDENS = [
    ['mais-vendidos', 'Mais vendidos'],
    ['menor-preco', 'Preço: menor ao maior'],
    ['maior-preco', 'Preço: maior ao menor'],
    ['a-z', 'A - Z'],
    ['z-a', 'Z - A'],
    ['novos', 'Mais novo ao mais antigo'],
    ['antigos', 'Mais antigo ao mais novo']
  ];
  const LISTAS = {
    'mais-vendidos': { titulo: 'Mais Vendidos', texto: 'O que mais sai na Wallace Imports, atualizado a cada reposição.', filtro: () => true },
    'novidades': { titulo: 'Novidades', texto: 'Acabou de chegar.', filtro: (p) => (p.selos || []).includes('novo') },
    'ofertas': { titulo: 'Ofertas', texto: 'Preço reduzido enquanto durar o estoque.', filtro: (p) => (p.selos || []).includes('oferta') },
    'destaques': { titulo: 'Destaques', texto: '', filtro: (p) => (p.selos || []).includes('destaque') }
  };
  const POR_PAGINA = 20;
  const ORDEM_TAM = ['PP', 'P', 'M', 'G', 'GG', 'XGG'];

  const url = new URLSearchParams(location.search);
  const lista = (v) => (v ? v.split(',').filter(Boolean) : []);
  const numero = (v) => { const n = parseFloat(String(v || '').replace(',', '.')); return isFinite(n) && n >= 0 ? n : null; };
  const estado = {
    cat: url.get('cat') || '', sub: url.get('sub') || '',
    busca: (url.get('q') || '').trim(), lista: url.get('lista') || '',
    ordem: url.get('ordem') || '',
    cores: lista(url.get('cor')), tams: lista(url.get('tam')),
    min: numero(url.get('min')), max: numero(url.get('max')),
    mostrados: POR_PAGINA
  };
  if (!ORDENS.some((o) => o[0] === estado.ordem)) estado.ordem = 'mais-vendidos';

  /* ---------- o que esta página lista ---------- */
  const cat = estado.cat ? J.categoria(estado.cat) : null;
  const sub = cat && estado.sub ? J.subcategoria(estado.cat, estado.sub) : null;
  const contexto = (function () {
    const inicio = [['Início', 'index.html']];
    if (estado.busca) return { titulo: `Resultados para “${estado.busca}”`, migalhas: inicio.concat([['Busca']]), base: J.buscar(estado.busca), texto: '' };
    if (LISTAS[estado.lista]) { const l = LISTAS[estado.lista]; return { titulo: l.titulo, migalhas: inicio.concat([[l.titulo]]), base: C.produtos.filter(l.filtro), texto: l.texto }; }
    if (estado.cat && !cat) return { titulo: 'Categoria não encontrada', migalhas: inicio, base: [], texto: '' };
    if (cat && estado.sub && !sub) return { titulo: cat.nome, migalhas: inicio.concat([[cat.nome]]), base: J.produtosDa(cat.slug), texto: '' };
    if (sub) return { titulo: sub.nome, migalhas: inicio.concat([[cat.nome, J.linkCat(cat.slug)], [sub.nome]]), base: J.produtosDa(cat.slug, sub.slug), texto: '' };
    if (cat) return { titulo: cat.nome, migalhas: inicio.concat([[cat.nome]]), base: J.produtosDa(cat.slug), texto: '' };
    return { titulo: 'Todos os Produtos', migalhas: inicio.concat([['Todos os Produtos']]), base: C.produtos.slice(), texto: '' };
  })();
  const base = contexto.base;

  /* ---------- opções de filtro (contadas sobre a lista base) ---------- */
  const contar = (valores) => valores.reduce((m, v) => { m[v] = (m[v] || 0) + 1; return m; }, {});
  const coresBase = contar(base.map((p) => p.cor));
  const tamsBase = contar([].concat.apply([], base.map((p) => p.tam.filter((t) => J.temEstoque(p) && !(p.sem || []).includes(t)))));
  const pesoTam = (t) => { const i = ORDEM_TAM.indexOf(t); if (i >= 0) return i; const n = parseFloat(t); return isFinite(n) ? 100 + n : 1000; };
  const tamsOrdenados = Object.keys(tamsBase).sort((a, b) => pesoTam(a) - pesoTam(b) || a.localeCompare(b));
  estado.cores = estado.cores.filter((c) => coresBase[c]);
  estado.tams = estado.tams.filter((t) => tamsBase[t]);

  function filtrados() {
    let r = base.filter((p) =>
      (!estado.cores.length || estado.cores.includes(p.cor)) &&
      (!estado.tams.length || estado.tams.some((t) => p.tam.includes(t) && !(p.sem || []).includes(t))) &&
      (estado.min == null || p.preco >= estado.min) &&
      (estado.max == null || p.preco <= estado.max));
    const por = {
      'mais-vendidos': (a, b) => b.vendidos - a.vendidos,
      'menor-preco': (a, b) => a.preco - b.preco || b.vendidos - a.vendidos,
      'maior-preco': (a, b) => b.preco - a.preco || b.vendidos - a.vendidos,
      'a-z': (a, b) => a.nome.localeCompare(b.nome, 'pt-BR'),
      'z-a': (a, b) => b.nome.localeCompare(a.nome, 'pt-BR'),
      'novos': (a, b) => ((b.selos || []).includes('novo') - (a.selos || []).includes('novo')) || b.ordem - a.ordem,
      'antigos': (a, b) => ((a.selos || []).includes('novo') - (b.selos || []).includes('novo')) || a.ordem - b.ordem
    }[estado.ordem];
    return r.slice().sort(por);
  }

  /* ---------- HTML ---------- */
  function htmlFiltros(prefixo) {
    let categorias = '';
    if (cat && cat.filhos) {
      categorias = cat.filhos.map((f) => `<a href="${J.linkCat(cat.slug, f.slug)}"${sub && sub.slug === f.slug ? ' aria-current="page"' : ''}>${esc(f.nome)}</a>`).join('') +
        (sub ? `<a href="${J.linkCat(cat.slug)}">Ver tudo em ${esc(cat.nome)}</a>` : '');
    } else if (!cat) {
      categorias = C.categorias.map((c) => `<a href="${J.linkCat(c.slug)}">${esc(c.nome)}</a>`).join('');
    }
    const cores = Object.keys(coresBase).sort((a, b) => coresBase[b] - coresBase[a]).map((c) => `
      <label class="marcar"><input type="checkbox" data-cor="${esc(c)}" id="${prefixo}-cor-${J.semAcento(c).replace(/\s+/g, '-')}"${estado.cores.includes(c) ? ' checked' : ''}>
        <span>${esc(c)} <small>(${coresBase[c]})</small></span><i class="bolinha" style="background:${CORES[c] || '#777'}"></i></label>`).join('');
    const tams = tamsOrdenados.map((t) => `
      <label class="marcar"><input type="checkbox" data-tam="${esc(t)}" id="${prefixo}-tam-${J.semAcento(t).replace(/\s+/g, '-')}"${estado.tams.includes(t) ? ' checked' : ''}>
        <span>${esc(t)} <small>(${tamsBase[t]})</small></span></label>`).join('');
    return (categorias ? `<div class="filtro"><h2>Categorias</h2><div class="filtro-links">${categorias}</div></div>` : '') +
      (Object.keys(coresBase).length > 1 ? `<div class="filtro"><h2>Cor</h2>${cores}</div>` : '') +
      (tamsOrdenados.length > 1 ? `<div class="filtro"><h2>Tamanho</h2>${tams}</div>` : '') +
      `<form class="filtro" data-preco novalidate><h2>Preço</h2>
        <div class="faixa-preco">
          <input class="campo" type="text" inputmode="decimal" name="min" placeholder="Desde" aria-label="Preço mínimo" value="${estado.min != null ? String(estado.min).replace('.', ',') : ''}">
          <input class="campo" type="text" inputmode="decimal" name="max" placeholder="Até" aria-label="Preço máximo" value="${estado.max != null ? String(estado.max).replace('.', ',') : ''}">
        </div>
        <button class="btn btn-p btn-contorno" type="submit">Aplicar</button></form>`;
  }
  function htmlOrdem() {
    return `<div class="filtro"><h2><label for="ordem">Ordenar por</label></h2>
      <select class="campo" id="ordem" data-ordem>${ORDENS.map((o) => `<option value="${o[0]}"${o[0] === estado.ordem ? ' selected' : ''}>${o[1]}</option>`).join('')}</select></div>`;
  }
  function htmlAtivos() {
    const chips = estado.cores.map((c) => `<button type="button" data-tirar="cor" data-valor="${esc(c)}">${esc(c)}${icone('fechar')}</button>`)
      .concat(estado.tams.map((t) => `<button type="button" data-tirar="tam" data-valor="${esc(t)}">Tam. ${esc(t)}${icone('fechar')}</button>`));
    if (estado.min != null || estado.max != null) {
      const texto = estado.min != null && estado.max != null ? `${moeda(estado.min)} a ${moeda(estado.max)}` : (estado.min != null ? `A partir de ${moeda(estado.min)}` : `Até ${moeda(estado.max)}`);
      chips.push(`<button type="button" data-tirar="preco">${texto}${icone('fechar')}</button>`);
    }
    if (chips.length > 1) chips.push('<button type="button" data-tirar="tudo">Limpar filtros</button>');
    return chips.length ? `<div class="ativos">${chips.join('')}</div>` : '';
  }
  function htmlGrade() {
    const r = filtrados();
    if (!base.length) {
      return `<div class="sem-resultado"><h2>${estado.busca ? 'Não encontramos nada com esse termo' : 'Ainda não há produtos aqui'}</h2>
        <p>${estado.busca ? 'Confira a escrita ou busque por um nome mais curto, como “tênis” ou “camiseta preta”.' : 'Veja o que acabou de chegar na loja.'}</p>
        <a class="btn" href="produtos.html">Ver todos os produtos</a></div>`;
    }
    if (!r.length) {
      return htmlAtivos() + `<div class="sem-resultado"><h2>Nenhum produto com esses filtros</h2><p>Tire um dos filtros para ver mais opções.</p>
        <button class="btn" type="button" data-tirar="tudo">Limpar filtros</button></div>`;
    }
    const visiveis = r.slice(0, estado.mostrados);
    return htmlAtivos() +
      `<p class="lista-contagem" aria-live="polite">${r.length} ${r.length === 1 ? 'produto' : 'produtos'}</p>
      <div class="grade cinco">${visiveis.map((p, i) => J.cartao(p, i < 5)).join('')}</div>` +
      (r.length > visiveis.length ? `<div class="lista-mais"><button class="btn btn-contorno" type="button" data-mais>Mostrar mais produtos</button></div>` : '');
  }

  /* ---------- montagem ---------- */
  document.title = `${contexto.titulo} | Wallace Imports`;
  const meta = $('meta[name="description"]');
  if (meta) meta.content = `${contexto.titulo} na Wallace Imports. Frete grátis acima de ${moeda(J.config.frete.gratisAcimaDe).replace(/ /g, ' ')}, ${J.pctPix()}% OFF no Pix e até ${J.config.parcelas.maximo}x no cartão.`;

  $('#conteudo').innerHTML = `<div class="container">
      <div class="lista-topo">
        <nav class="migalhas" aria-label="Você está em">${contexto.migalhas.map((m, i) => (i ? '<span class="ponto">.</span>' : '') + (m[1] ? `<a href="${m[1]}">${esc(m[0])}</a>` : `<span>${esc(m[0])}</span>`)).join('')}</nav>
        <h1>${esc(contexto.titulo)}</h1>
        ${contexto.texto ? `<p>${esc(contexto.texto)}</p>` : ''}
      </div>
      ${base.length ? `<div class="lista-barra">
        <button type="button" data-abrir="gaveta-ordem">${icone('ordenar')}Ordenar</button>
        <button type="button" data-abrir="gaveta-filtros">${icone('filtro')}Filtrar</button>
      </div>` : ''}
      <div class="lista">
        <aside class="filtros" id="filtros" aria-label="Filtros"></aside>
        <div id="resultado"></div>
      </div>
    </div>`;

  document.body.insertAdjacentHTML('beforeend', `
    <aside class="gaveta direita" id="gaveta-filtros" role="dialog" aria-modal="true" aria-label="Filtrar" aria-hidden="true" tabindex="-1">
      <div class="gaveta-topo"><h2>Filtrar</h2><button class="fechar" type="button" data-fechar aria-label="Fechar filtros">${icone('fechar')}</button></div>
      <div class="gaveta-corpo" id="filtros-celular"></div>
      <div class="gaveta-pe"><button class="btn btn-bloco" type="button" data-fechar id="filtros-ver"></button></div>
    </aside>
    <aside class="gaveta direita" id="gaveta-ordem" role="dialog" aria-modal="true" aria-label="Ordenar" aria-hidden="true" tabindex="-1">
      <div class="gaveta-topo"><h2>Ordenar por</h2><button class="fechar" type="button" data-fechar aria-label="Fechar ordenação">${icone('fechar')}</button></div>
      <div class="gaveta-corpo" style="padding:0"><ul class="menu-lista" id="ordem-celular"></ul></div>
    </aside>`);

  function gravarUrl() {
    const u = new URLSearchParams();
    if (estado.cat) u.set('cat', estado.cat);
    if (estado.sub) u.set('sub', estado.sub);
    if (estado.busca) u.set('q', estado.busca);
    if (estado.lista) u.set('lista', estado.lista);
    if (estado.ordem !== 'mais-vendidos') u.set('ordem', estado.ordem);
    if (estado.cores.length) u.set('cor', estado.cores.join(','));
    if (estado.tams.length) u.set('tam', estado.tams.join(','));
    if (estado.min != null) u.set('min', estado.min);
    if (estado.max != null) u.set('max', estado.max);
    const s = u.toString();
    history.replaceState(null, '', location.pathname + (s ? '?' + s : ''));
  }
  function desenhar(focarId) {
    $('#filtros').innerHTML = base.length ? htmlOrdem() + htmlFiltros('d') : '';
    $('#filtros-celular').innerHTML = htmlFiltros('c');
    $('#ordem-celular').innerHTML = ORDENS.map((o) => `<li><button type="button" data-ordem-valor="${o[0]}"${o[0] === estado.ordem ? ' style="color:var(--ouro)"' : ''}>${o[1]}</button></li>`).join('');
    $('#resultado').innerHTML = htmlGrade();
    const n = filtrados().length;
    $('#filtros-ver').textContent = `Ver ${n} ${n === 1 ? 'produto' : 'produtos'}`;
    if (focarId) { const el = document.getElementById(focarId); if (el) el.focus({ preventScroll: true }); }
  }
  function mudar(focarId) { estado.mostrados = POR_PAGINA; gravarUrl(); desenhar(focarId); }
  const alternar = (arr, v) => { const i = arr.indexOf(v); if (i >= 0) arr.splice(i, 1); else arr.push(v); };

  document.addEventListener('change', (ev) => {
    const t = ev.target;
    if (t.dataset.cor) { alternar(estado.cores, t.dataset.cor); mudar(t.id); }
    else if (t.dataset.tam) { alternar(estado.tams, t.dataset.tam); mudar(t.id); }
    else if (t.hasAttribute('data-ordem')) { estado.ordem = t.value; mudar('ordem'); }
  });
  document.addEventListener('submit', (ev) => {
    if (!ev.target.hasAttribute('data-preco')) return;
    ev.preventDefault();
    let min = numero(ev.target.min.value), max = numero(ev.target.max.value);
    if (min != null && max != null && min > max) { const troca = min; min = max; max = troca; }
    estado.min = min; estado.max = max;
    mudar();
  });
  document.addEventListener('click', (ev) => {
    const tirar = ev.target.closest('[data-tirar]');
    const ordem = ev.target.closest('[data-ordem-valor]');
    if (tirar) {
      const tipo = tirar.dataset.tirar, v = tirar.dataset.valor;
      if (tipo === 'cor') alternar(estado.cores, v);
      if (tipo === 'tam') alternar(estado.tams, v);
      if (tipo === 'preco' || tipo === 'tudo') { estado.min = null; estado.max = null; }
      if (tipo === 'tudo') { estado.cores = []; estado.tams = []; }
      mudar();
    } else if (ordem) {
      estado.ordem = ordem.dataset.ordemValor; mudar(); J.fechar();
    } else if (ev.target.closest('[data-mais]')) {
      const antes = estado.mostrados;
      estado.mostrados += POR_PAGINA;
      desenhar();
      const primeiroNovo = $$('#resultado .produto-nome')[antes];
      if (primeiroNovo) primeiroNovo.focus({ preventScroll: true });
    }
  });

  desenhar();
})();
