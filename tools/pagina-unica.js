/*
 * Navegação da prévia de página única (ver tools/gerar-previa.js).
 * Em vez de carregar outro arquivo .html, troca o miolo da página no lugar.
 * Não é usado no site publicado.
 */
(function () {
  'use strict';
  const J = window.Loja;
  const TEXTOS = window.LOJA_PAGINAS_TEXTO || {};

  function mostrar(pagina) {
    const conteudo = document.getElementById('conteudo');
    if (J.paginas[pagina]) { J.paginas[pagina](); return; }
    const texto = TEXTOS[pagina] || TEXTOS['404.html'];
    document.title = texto.titulo;
    conteudo.innerHTML = texto.html;
    J.preencher();
  }

  function navegar(href, semHistorico) {
    const limpo = String(href).split('#')[0];
    const corte = limpo.indexOf('?');
    const pagina = (corte < 0 ? limpo : limpo.slice(0, corte)) || 'index.html';
    J.definirRota(pagina, corte < 0 ? '' : limpo.slice(corte + 1));
    J.fechar();
    mostrar(pagina);
    J.marcarMenu();
    window.scrollTo(0, 0);
    if (!semHistorico) { try { history.pushState({ href: limpo }, ''); } catch (e) { /* sem histórico no quadro */ } }
  }

  document.addEventListener('click', (ev) => {
    if (ev.defaultPrevented || ev.button || ev.metaKey || ev.ctrlKey) return;
    const a = ev.target.closest('a[href]');
    if (!a || a.target === '_blank') return;
    const href = a.getAttribute('href');
    if (!/^[\w-]+\.html(\?|#|$)/.test(href)) return;
    ev.preventDefault();
    navegar(href);
  });

  // As buscas do cabeçalho e da camada de busca enviariam o formulário para produtos.html.
  document.addEventListener('submit', (ev) => {
    const f = ev.target;
    if (f.getAttribute('action') !== 'produtos.html') return;
    ev.preventDefault();
    const termo = (f.q.value || '').trim();
    navegar('produtos.html' + (termo ? '?q=' + encodeURIComponent(termo) : ''));
  });

  window.addEventListener('popstate', (ev) => navegar((ev.state && ev.state.href) || 'index.html', true));

  try { history.replaceState({ href: 'index.html' }, ''); } catch (e) { /* idem */ }
  navegar('index.html', true);
})();
