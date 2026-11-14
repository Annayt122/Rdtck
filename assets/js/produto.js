/*
 * WALLACE IMPORTS — página de produto (produto.html?p=slug)
 */
(function () {
  'use strict';
  const J = window.Loja, L = J.config, C = J.catalogo;
  const { $, $$, esc, icone, moeda } = J;

  function montar() {
    const p = J.produto(J.rota().params.get('p'));
    const conteudo = $('#conteudo');

    if (!p) {
      document.title = 'Produto não encontrado | Wallace Imports';
      conteudo.innerHTML = `<div class="container texto"><h1>Produto não encontrado</h1>
        <div class="texto-corpo"><p>Este produto saiu do ar ou o endereço foi digitado errado.</p><a class="btn" href="produtos.html">Ver todos os produtos</a></div></div>` +
        J.vitrine('Mais vendidos', C.produtos.slice().sort((a, b) => b.vendidos - a.vendidos).slice(0, 10), 4);
      J.ligarTrilhos(conteudo);
      return;
    }

    /* Texto padrão por tipo de produto. Um produto pode trazer o próprio `descricao`
       no catálogo ({ chamada, texto, itens }) para substituir este. */
    const TEXTOS = {
      tenis: { chamada: 'Conforto para o dia inteiro, do trabalho ao rolê', texto: 'Tênis leve, com palmilha macia e solado que não escorrega. Combina com calça, bermuda e conjunto.', itens: ['Cabedal com costura reforçada', 'Solado de borracha antiderrapante', 'Palmilha acolchoada', 'Forma padrão: peça o seu número habitual'] },
      camiseta: { chamada: 'Caimento certo e malha que não esquenta', texto: 'Camiseta de malha macia, gola reforçada e estampa que aguenta lavagem.', itens: ['Malha de algodão com toque macio', 'Gola canelada que não deforma', 'Modelagem regular', 'Lavar do avesso para conservar a estampa'] },
      polo: { chamada: 'Arrumada na medida, sem perder o conforto', texto: 'Tecido encorpado, gola firme e acabamento limpo para usar do almoço de domingo ao trabalho.', itens: ['Tecido com boa respirabilidade', 'Gola e punhos canelados', 'Abertura com botões', 'Modelagem regular'] },
      moletom: { chamada: 'Quentinho, macio e com capuz', texto: 'Moletom flanelado por dentro, com bolso canguru e punhos que seguram o frio.', itens: ['Interior flanelado', 'Capuz com cordão de ajuste', 'Bolso canguru', 'Punhos e barra canelados'] },
      jogger: { chamada: 'Conforto de moletom com corte ajustado', texto: 'Calça de moletom com cós de elástico e cordão, boa para treino, viagem e dia a dia.', itens: ['Cós com elástico e cordão', 'Bolsos laterais', 'Barra com punho', 'Interior flanelado'] },
      calca: { chamada: 'Jeans com elastano que acompanha o movimento', texto: 'Calça de lavagem uniforme, corte ajustado sem apertar e costura reforçada.', itens: ['Tecido com elastano', 'Cinco bolsos', 'Fechamento com zíper e botão', 'Consulte a tabela de medidas antes de escolher'] },
      bermuda: { chamada: 'Leve, com bolso e cordão de ajuste', texto: 'Bermuda para o calor: tecido leve, cós confortável e comprimento acima do joelho.', itens: ['Cós com elástico e cordão', 'Bolsos laterais', 'Comprimento acima do joelho', 'Secagem rápida'] },
      conjunto: { chamada: 'Camiseta e bermuda combinando, prontas para usar', texto: 'Conjunto leve para treino e dia a dia, com tecido que seca rápido.', itens: ['Camiseta + bermuda', 'Tecido leve de secagem rápida', 'Bermuda com bolsos e cordão', 'Os dois no mesmo tamanho'] },
      'conjunto-inverno': { chamada: 'Jaqueta e calça para os dias frios', texto: 'Conjunto de moletom com zíper, capuz e calça de punho, quente sem pesar.', itens: ['Jaqueta com zíper e capuz + calça', 'Bolsos com fechamento', 'Interior macio', 'Os dois no mesmo tamanho'] },
      bone: { chamada: 'Regulagem atrás, veste bem em qualquer cabeça', texto: 'Boné estruturado, com aba firme e bordado na frente.', itens: ['Fecho ajustável', 'Aba pré-curvada', 'Bordado frontal', 'Tamanho único'] },
      chinelo: { chamada: 'Macio no pé e firme no chão', texto: 'Slide com tira larga e palmilha anatômica para usar depois do treino ou em casa.', itens: ['Tira larga acolchoada', 'Palmilha anatômica', 'Solado antiderrapante', 'Pode molhar'] },
      relogio: { chamada: 'Presença no pulso sem pesar', texto: 'Relógio com pulseira de aço, fecho de segurança e mostrador fácil de ler.', itens: ['Pulseira de aço com ajuste', 'Resistente a respingos', 'Acompanha bateria', 'Ajustamos os elos antes do envio, se você pedir'] },
      perfume: { chamada: 'Fixação longa para o dia e para a noite', texto: 'Fragrância marcante, com boa projeção e frasco de 100 ml.', itens: ['Frasco de 100 ml com borrifador', 'Fixação prolongada', 'Lacrado', 'Manter longe do calor e da luz'] },
      oculos: { chamada: 'Proteção e estilo no mesmo óculos', texto: 'Armação leve, lentes escuras e encaixe firme no rosto.', itens: ['Lentes com proteção UV', 'Armação leve', 'Acompanha saquinho de proteção', 'Tamanho único'] },
      bolsa: { chamada: 'Cabe celular, carteira e chaves', texto: 'Shoulder bag compacta, com alça regulável e dois compartimentos com zíper.', itens: ['Alça regulável', 'Dois compartimentos com zíper', 'Tecido resistente à água', 'Tamanho único'] },
      carteira: { chamada: 'Fina no bolso, com espaço para o essencial', texto: 'Carteira slim com divisórias para cartões e cédulas.', itens: ['Divisórias para cartões', 'Compartimento para cédulas', 'Costura reforçada', 'Tamanho único'] },
      cinto: { chamada: 'Acabamento firme e fivela que não descasca', texto: 'Cinto com fivela dourada e furação regulável.', itens: ['Fivela em metal', 'Cinco furos de ajuste', 'Pode ser encurtado', 'Escolha pelo comprimento total'] },
      meia: { chamada: 'Kit com três pares para a semana toda', texto: 'Meias de cano alto, com punho que não aperta e calcanhar reforçado.', itens: ['Kit com 3 pares', 'Punho canelado', 'Calcanhar e ponta reforçados', 'Veste do 39 ao 43'] },
      cueca: { chamada: 'Kit com três cuecas boxer', texto: 'Tecido macio com elastano e cós que não enrola.', itens: ['Kit com 3 unidades', 'Tecido com elastano', 'Cós de elástico macio', 'Cores conforme a foto'] }
    };
    TEXTOS.raglan = TEXTOS.mangalonga = TEXTOS.camiseta;
    const texto = p.descricao || TEXTOS[p.forma] || { chamada: '', texto: '', itens: [] };

    const fotos = J.fotos(p);
    const promo = J.promoDe(p);
    const [catSlug, subSlug] = p.cat.split('/');
    const cat = J.categoria(catSlug), sub = J.subcategoria(catSlug, subSlug);
    const pix = J.precoPix(p.preco);
    const endereco = location.href.split('#')[0];

    /* ---------- cabeça do documento ---------- */
    document.title = `${p.nome} | Wallace Imports`;
    const definir = (sel, valor) => { const m = $(sel); if (m) m.setAttribute('content', valor); };
    const resumo = `${p.nome} por ${moeda(p.preco).replace(/ /g, ' ')} ou ${moeda(pix).replace(/ /g, ' ')} no Pix. ${texto.texto}`;
    definir('meta[name="description"]', resumo);
    definir('meta[property="og:title"]', p.nome);
    definir('meta[property="og:description"]', resumo);
    definir('meta[property="og:image"]', new URL(fotos[0], location.href).href);
    const ldAntigo = document.getElementById('ld-produto');
    if (ldAntigo) ldAntigo.remove();
    const ld = document.createElement('script');
    ld.id = 'ld-produto';
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Product', name: p.nome, image: fotos.map((f) => new URL(f, location.href).href),
      description: texto.texto, color: p.cor, brand: { '@type': 'Brand', name: L.nome },
      offers: { '@type': 'Offer', url: endereco, priceCurrency: 'BRL', price: p.preco.toFixed(2), availability: 'https://schema.org/' + (J.temEstoque(p) ? 'InStock' : 'OutOfStock') }
    });
    document.head.appendChild(ld);

    /* ---------- blocos ---------- */
    const migalhas = [['Início', 'index.html']];
    if (promo) migalhas.push([J.categoria(promo.cat).nome, J.linkCat(promo.cat)], [promo.nome, J.linkCat(promo.cat, promo.sub)]);
    else { migalhas.push([cat.nome, J.linkCat(cat.slug)]); if (sub) migalhas.push([sub.nome, J.linkCat(cat.slug, sub.slug)]); }
    migalhas.push([p.nome]);

    let blocoPromo = '';
    if (promo) {
      const pct = Math.round((1 - (promo.por / promo.leve) / p.preco) * 100);
      blocoPromo = `<div class="pdp-promo"><strong>${pct}% OFF comprando ${promo.leve} ou mais!</strong>
        Vale para este produto e para todos da promoção <a class="link" href="${J.linkCat(promo.cat, promo.sub)}">${esc(promo.nome)}</a>.<br>
        Pode combinar modelos e tamanhos diferentes: o desconto entra sozinho no carrinho.</div>`;
    }

    const similares = C.produtos.filter((o) => o !== p && o.cat === p.cat)
      .concat(C.produtos.filter((o) => o !== p && o.cat !== p.cat && o.cat.split('/')[0] === catSlug))
      .slice(0, 10);

    conteudo.innerHTML = `<div class="container pdp">
        <div class="miniaturas"${fotos.length < 2 ? ' hidden' : ''}>
          <button class="seta so-desktop" type="button" data-mini="-1" aria-label="Fotos anteriores">${icone('cima')}</button>
          <div class="miniaturas-trilho" id="miniaturas">${fotos.map((f, i) => `
            <button class="miniatura" type="button" data-foto="${i}" aria-label="Foto ${i + 1} de ${fotos.length}" aria-current="${i === 0}"><img src="${f}" alt="" width="800" height="1000"></button>`).join('')}</div>
          <button class="seta so-desktop" type="button" data-mini="1" aria-label="Próximas fotos">${icone('baixo')}</button>
        </div>

        <div class="galeria">
          <div class="galeria-trilho" id="galeria">${fotos.map((f, i) => `<img src="${f}" alt="${esc(p.nome)}${i ? ' — foto ' + (i + 1) : ''}" width="800" height="1000" loading="${i ? 'lazy' : 'eager'}">`).join('')}</div>
          ${J.etiquetas(p)}
        </div>

        <div class="pdp-info">
          <nav class="migalhas" aria-label="Você está em">${migalhas.map((m, i) => (i ? '<span class="ponto">.</span>' : '') + (m[1] ? `<a href="${m[1]}">${esc(m[0])}</a>` : `<span>${esc(m[0])}</span>`)).join('')}</nav>
          <h1>${esc(p.nome)}</h1>
          ${J.precos(p, true)}
          <p class="pdp-pix"><b>${moeda(pix)}</b> com Pix</p>
          <div class="pdp-linhas">
            <span>${L.parcelas.maximo} x de ${moeda(J.parcela(p.preco))}</span>
            <span><span class="ouro">${J.pctPix()}% de desconto</span> pagando com Pix</span>
            <button class="com-icone" type="button" id="ver-pagamento">${icone('cartao')}<span class="link">Ver mais detalhes</span></button>
            <span class="com-icone">${icone('caminhao', 'ouro')}<span><span class="ouro">Frete grátis</span> a partir de ${moeda(L.frete.gratisAcimaDe)}</span></span>
          </div>
          ${blocoPromo}
          ${J.caixaCompra(p)}

          <div class="sanfona">
            <div class="sanfona-item">
              <button type="button" aria-expanded="false" aria-controls="painel-envio">${icone('caminhao')}<span>Meios de envio</span>${icone('mais')}</button>
              <div class="sanfona-painel" id="painel-envio" hidden></div>
            </div>
          </div>

          <div class="descricao">
            <h2>Descrição</h2>
            ${texto.chamada ? `<h3>${esc(texto.chamada)}</h3>` : ''}
            ${texto.texto ? `<p>${esc(texto.texto)}</p>` : ''}
            ${texto.itens && texto.itens.length ? `<ul>${texto.itens.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>` : ''}
            <p>${esc(L.frete.postagem)}</p>
            <p><b>Ganhe ${J.pctPix()}% de desconto</b> pagando com Pix.</p>
          </div>

          <div class="compartilhar">
            <a href="https://wa.me/?text=${encodeURIComponent(p.nome + ' na Wallace Imports: ' + endereco)}" target="_blank" rel="noopener">${icone('compartilhar')}<span class="link">Compartilhar</span></a>
            <button type="button" id="copiar-link">${icone('copiar')}<span class="link">Copiar link</span></button>
          </div>
        </div>
      </div>
      ${similares.length ? `<section class="similares"><div class="container">
        <h2 class="secao-titulo">Produtos similares</h2>
        <div class="trilho-area">
          <div class="trilho sangra colunas-5">${similares.map((o) => J.cartao(o)).join('')}</div>
          <button class="trilho-seta esq" type="button" aria-label="Produtos anteriores">${icone('esq')}</button>
          <button class="trilho-seta dir" type="button" aria-label="Próximos produtos">${icone('dir')}</button>
        </div></div></section>` : ''}`;

    J.ligarCaixa(conteudo);
    J.ligarTrilhos(conteudo);

    /* ---------- galeria ---------- */
    const galeria = $('#galeria'), minis = $$('.miniatura'), trilhoMini = $('#miniaturas');
    const irPara = (i) => galeria.scrollTo({ left: i * galeria.clientWidth, behavior: 'smooth' });
    minis.forEach((m) => m.addEventListener('click', () => irPara(Number(m.dataset.foto))));
    galeria.addEventListener('scroll', () => {
      const i = Math.round(galeria.scrollLeft / galeria.clientWidth);
      minis.forEach((m, n) => m.setAttribute('aria-current', String(n === i)));
    }, { passive: true });
    $$('[data-mini]').forEach((b) => b.addEventListener('click', () => trilhoMini.scrollBy({ top: Number(b.dataset.mini) * 176, behavior: 'smooth' })));

    /* ---------- frete ---------- */
    const painelEnvio = $('#painel-envio');
    const desenharEnvio = () => { painelEnvio.innerHTML = J.blocoCep(p.preco, false); J.ligarCep(painelEnvio, desenharEnvio); };
    desenharEnvio();
    $('.sanfona-item > button').addEventListener('click', (ev) => {
      const b = ev.currentTarget, abre = b.getAttribute('aria-expanded') !== 'true';
      b.setAttribute('aria-expanded', String(abre));
      painelEnvio.hidden = !abre;
    });

    /* ---------- formas de pagamento ---------- */
    $('#ver-pagamento').addEventListener('click', () => {
      const linhas = [];
      for (let n = 1; n <= L.parcelas.maximo; n++) {
        const valor = J.parcela(p.preco, n);
        const semJuros = n <= L.parcelas.semJuros;
        linhas.push(`<tr><td><b>${n}x</b> de ${moeda(valor)}${semJuros ? ' sem juros' : ''}</td><td>Total ${moeda(semJuros ? p.preco : valor * n)}</td></tr>`);
      }
      const el = J.abrirModal('Meios de pagamento', `
        <div class="abas" role="tablist">
          <button type="button" role="tab" aria-selected="true" data-aba="cartao">Cartão de crédito</button>
          <button type="button" role="tab" aria-selected="false" data-aba="pix">Pix</button>
        </div>
        <div data-painel="cartao"><table class="tabela-parcelas"><tbody>${linhas.join('')}</tbody></table>
          <p class="nota">Aceitamos ${L.bandeiras.filter((b) => b !== 'Pix').join(', ')}.</p></div>
        <div data-painel="pix" hidden><div class="pix-caixa">${icone('pix', 'ouro')}
          <p>${J.pctPix()}% de desconto pagando com Pix</p><strong>${moeda(pix)}</strong>
          <p class="nota">O desconto vale sobre o valor dos produtos, sem o frete, e a aprovação é na hora.</p></div></div>`);
      $('.pix-caixa .icone', el).style.cssText = 'width:40px;height:40px;margin:0 auto';
      $$('[data-aba]', el).forEach((aba) => aba.addEventListener('click', () => {
        $$('[data-aba]', el).forEach((a) => a.setAttribute('aria-selected', String(a === aba)));
        $$('[data-painel]', el).forEach((painel) => { painel.hidden = painel.dataset.painel !== aba.dataset.aba; });
      }));
    });

    /* ---------- compartilhar ---------- */
    const copiar = $('#copiar-link');
    copiar.addEventListener('click', () => {
      const feito = () => { const s = $('span', copiar); s.textContent = 'Link copiado'; setTimeout(() => { s.textContent = 'Copiar link'; }, 2200); };
      const mostrar = () => { $('span', copiar).textContent = endereco; };   // sem permissão de cópia: exibe o link
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(endereco).then(feito, mostrar);
      else mostrar();
    });
  }

  J.registrar('produto.html', montar);
})();
