#!/usr/bin/env node
/*
 * Gera a prévia de página única: um só arquivo HTML com o site inteiro
 * (estilos, scripts, fontes, logo e ilustrações embutidos).
 *
 *   node tools/gerar-previa.js [saida.html]      padrão: previa/index.html
 *
 * Serve para mostrar o site em lugares que aceitam apenas um arquivo, como uma
 * prévia no Claude. O site publicado continua sendo o de várias páginas.
 */
const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const saida = path.resolve(process.argv[2] || path.join(RAIZ, 'previa/index.html'));
const ler = (rel) => fs.readFileSync(path.join(RAIZ, rel), 'utf8');
const base64 = (rel, tipo) => `data:${tipo};base64,${fs.readFileSync(path.join(RAIZ, rel)).toString('base64')}`;
const paraScript = (valor) => JSON.stringify(valor).replace(/</g, '\\u003c').replace(new RegExp('[\\u2028\\u2029]', 'g'), '');

/* ---------- estilos, com as fontes embutidas ---------- */
const css = ler('assets/css/estilo.css').replace(/url\('\.\.\/fonts\/([\w.-]+\.woff2)'\)/g, (_, arq) => `url('${base64('assets/fonts/' + arq, 'font/woff2')}')`);

/* ---------- imagens ---------- */
const arquivos = {};
for (const arq of ['coroa.png', 'logo-horizontal.png', 'logo-wallace-imports.png']) arquivos['assets/img/' + arq] = base64('assets/img/' + arq, 'image/png');
const svgs = {};
for (const pasta of ['assets/img/produtos', 'assets/img/recortes']) {
  for (const arq of fs.readdirSync(path.join(RAIZ, pasta))) {
    if (arq.endsWith('.svg')) svgs[pasta + '/' + arq] = ler(pasta + '/' + arq);
  }
}
const { produtos } = require(path.join(RAIZ, 'assets/js/catalogo.js'));
for (const p of produtos) {
  for (const foto of p.fotos || []) {
    const tipo = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml' }[path.extname(foto).toLowerCase()];
    if (tipo && fs.existsSync(path.join(RAIZ, foto))) arquivos[foto] = base64(foto, tipo);
  }
}

/* ---------- miolo das páginas de texto ---------- */
const textos = {};
for (const arq of fs.readdirSync(RAIZ)) {
  if (!arq.endsWith('.html') || ['index.html', 'produtos.html', 'produto.html'].includes(arq)) continue;
  const html = ler(arq);
  const miolo = html.match(/<main id="conteudo">([\s\S]*?)<\/main>/);
  const titulo = html.match(/<title>([\s\S]*?)<\/title>/);
  if (miolo) textos[arq] = { titulo: titulo ? titulo[1] : 'Wallace Imports', html: miolo[1] };
}

const favicon = base64('assets/img/favicon.png', 'image/png');
const script = (rel) => `<script>\n${ler(rel).replace(/<\/script/gi, '<\\/script')}\n</script>`;

const pagina = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Wallace Imports</title>
  <meta name="description" content="Prévia da loja Wallace Imports.">
  <meta name="theme-color" content="#000000">
  <link rel="icon" type="image/png" href="${favicon}">
  <style>
${css}
  </style>
</head>
<body>
  <div id="topo"></div>
  <main id="conteudo"></main>
  <div id="rodape"></div>
  <script>
    window.LOJA_PAGINA_UNICA = true;
    window.LOJA_PAGINAS_TEXTO = ${paraScript(textos)};
    // Imagens embutidas: PNG e fotos já em data URI; ilustrações SVG viram data URI ao serem pedidas.
    (function () {
      var prontos = ${paraScript(arquivos)};
      var svgs = ${paraScript(svgs)};
      window.LOJA_ARQUIVOS = new Proxy(prontos, {
        get: function (alvo, caminho) {
          if (typeof caminho !== 'string') return undefined;
          if (!(caminho in alvo) && caminho in svgs) alvo[caminho] = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgs[caminho]);
          return alvo[caminho];
        }
      });
    })();
  </script>
  ${script('assets/js/config.js')}
  ${script('assets/js/catalogo.js')}
  ${script('assets/js/loja.js')}
  <script>Loja.topo(); Loja.rodape();</script>
  ${script('assets/js/home.js')}
  ${script('assets/js/listagem.js')}
  ${script('assets/js/produto.js')}
  ${script('tools/pagina-unica.js')}
</body>
</html>
`;

fs.mkdirSync(path.dirname(saida), { recursive: true });
fs.writeFileSync(saida, pagina);
console.log(`${path.relative(process.cwd(), saida)} gerado: ${(Buffer.byteLength(pagina) / 1048576).toFixed(2)} MB, ${Object.keys(svgs).length} ilustrações, ${Object.keys(textos).length} páginas de texto.`);
