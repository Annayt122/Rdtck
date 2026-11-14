# Wallace Imports — loja virtual

Site estático (HTML, CSS e JavaScript puro, sem etapa de build) da Wallace Imports, em preto e dourado.
Funciona em qualquer hospedagem de arquivos: GitHub Pages, Netlify, Vercel, Hostinger, cPanel.

## Rodar no computador

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

Abrir o `index.html` direto do disco também funciona para conferir o visual.

## Estrutura

| Arquivo | O que é |
| --- | --- |
| `index.html` | Home: banner rotativo, categorias, banners, vitrines, vantagens, sobre, vídeo |
| `produtos.html` | Listagem com filtros (categoria, cor, tamanho, preço), ordenação e busca |
| `produto.html` | Página do produto: galeria, tamanhos, parcelas, frete, descrição, similares |
| `como-comprar.html`, `perguntas-frequentes.html`, `trocas-e-devolucoes.html`, `politica-de-privacidade.html`, `contato.html`, `conta.html`, `404.html` | Páginas institucionais |
| `assets/js/config.js` | **Dados da loja**: contatos, frete, parcelamento, faixa de avisos, banners, vídeo |
| `assets/js/catalogo.js` | **Categorias, promoções e produtos** |
| `assets/js/loja.js` | Cabeçalho, rodapé, busca, menu, carrinho e compra rápida |
| `assets/js/home.js`, `listagem.js`, `produto.js` | Montagem de cada página |
| `assets/css/estilo.css` | Todo o visual |
| `tools/gerar-ilustracoes.js` | Gera as imagens provisórias dos produtos |

Endereços: `produtos.html?cat=camisetas&sub=basicas`, `produtos.html?q=tenis`, `produtos.html?lista=mais-vendidos`, `produto.html?p=slug-do-produto`.

## Antes de publicar

Os itens abaixo estão com **dados de exemplo** e precisam ser trocados pelos da loja.

1. **`assets/js/config.js`**
   - `whatsapp` e `whatsappExibicao`: todo pedido, contato e cadastro de newsletter vai para esse número.
   - `email`, `endereco`, `horario`, `instagram`, `cnpj`.
   - `grupoVip`: link do grupo de ofertas (o banner "Grupo VIP" usa esse link).
   - `frete.regioes`: valores e prazos de PAC e SEDEX por região, e `frete.gratisAcimaDe`.
   - `parcelas`: número de parcelas, quantas são sem juros e o juro mensal das demais.
   - `video.youtubeId`: código do vídeo da loja. Sem ele, o bloco "Conheça a loja" leva ao Instagram.
2. **`assets/js/catalogo.js`**: nomes, preços, tamanhos, estoque e promoções.
3. **Fotos dos produtos**: veja abaixo.
4. **Textos das páginas institucionais**: prazos de troca, política de privacidade e respostas do FAQ são um ponto de partida e devem ser revisados pela loja.

## Produtos

Cada produto é um objeto em `assets/js/catalogo.js`:

```js
{ slug: 'tenis-low-street-black', nome: 'Tênis Low Street Black', cat: 'calcados/tenis',
  preco: 199.99, de: 299.99, cor: 'Preto',
  tam: ['38', '39', '40', '41', '42', '43'], sem: ['42'],      // sem = tamanhos esgotados
  promo: 'tenis-299', selos: ['destaque'], vendidos: 530,
  fotos: ['assets/img/produtos/low-street-black-1.jpg', 'assets/img/produtos/low-street-black-2.jpg'] }
```

- `selos`: `destaque`, `novo` e `oferta` definem em quais vitrines da home o produto aparece.
- `vendidos`: usado na ordenação "Mais vendidos".
- `descricao` (opcional): `{ chamada: '...', texto: '...', itens: ['...', '...'] }` substitui o texto padrão da categoria.

### Fotos

Enquanto um produto não tem o campo `fotos`, o site mostra ilustrações provisórias (`assets/img/produtos/<slug>-1.svg`, `-2.svg`, `-3.svg`).
Para usar fotos reais, salve os arquivos em `assets/img/produtos/` e liste-os em `fotos`. Proporção recomendada: **4:5** (por exemplo 1200 × 1500 px), em JPG ou WebP.

Ao criar um produto novo sem fotos, gere a ilustração dele com:

```bash
node tools/gerar-ilustracoes.js
```

### Promoções "leve N por X"

Em `PROMOCOES`, no mesmo arquivo:

```js
'tenis-299': { leve: 2, por: 299.99, etiqueta: '2 Tênis por R$ 299,99', cat: 'black-friday', sub: '2-tenis-por-299-99', nome: '2 Tênis por 299,99' }
```

Todo produto com `promo: 'tenis-299'` entra na promoção. Quando o carrinho junta a quantidade (`leve`), o desconto é aplicado sozinho; com menos itens, o carrinho mostra quantos faltam.

## Banners da home

Os banners rotativos ficam em `banners`, no `config.js`. Por padrão são montados em HTML (título, faixa, preço).
Para usar uma arte pronta, informe `imagem` (1920 × 770 px) e `imagemCelular` (780 × 744 px) no banner.

Os quadradinhos de categoria e os banners de apoio ficam no topo de `assets/js/home.js`.

## Como o pedido é fechado

O site não tem servidor nem meio de pagamento próprio. O carrinho fica salvo no navegador do cliente e o botão **Finalizar pedido** abre o WhatsApp da loja com a lista de produtos, tamanhos, frete e forma de pagamento. A equipe confirma os dados e envia a chave Pix ou o link de pagamento.

Por isso não existe login: o ícone de conta leva à página **Acompanhar pedido**, que também usa o WhatsApp.

## Fontes

Lexend Exa, Nunito Sans e Anton, hospedadas em `assets/fonts/` sob a SIL Open Font License 1.1.
