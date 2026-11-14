/*
 * WALLACE IMPORTS — configurações da loja
 * ---------------------------------------------------------------
 * Tudo que muda de loja para loja fica aqui: contatos, frete,
 * parcelamento, faixa de avisos, banners da home e vídeo.
 * Os itens marcados com  << TROCAR >>  estão com dados de exemplo.
 */
window.LOJA = {
  nome: 'Wallace Imports',
  descricao: 'Tênis, camisetas, conjuntos, bonés e acessórios importados com envio para todo o Brasil.',

  /* ---------- Contato  << TROCAR >> ---------- */
  whatsapp: '5500000000000',              // só números, com 55 + DDD
  whatsappExibicao: '(00) 00000-0000',
  grupoVip: '',                           // link do grupo de ofertas no WhatsApp (opcional)
  email: 'contato@seudominio.com.br',
  endereco: 'Rua Exemplo, 000 - Centro, Sua Cidade - UF',
  horario: 'Seg. a sex. das 9h às 18h · Sáb. das 9h às 13h',
  instagram: 'wallaceimports',            // só o @, sem arroba
  cnpj: '00.000.000/0001-00',

  /* ---------- Pagamento ---------- */
  descontoPix: 0.03,                      // 3% OFF no Pix
  parcelas: {
    maximo: 12,                           // até 12x no cartão
    semJuros: 1,                          // quantas parcelas sem juros
    jurosMensal: 0.033                    // juros ao mês das demais (ajuste conforme a maquininha/gateway)
  },
  bandeiras: ['Visa', 'Mastercard', 'Elo', 'Amex', 'Hipercard', 'Pix'],

  /* ---------- Frete  << TROCAR valores e prazos >> ---------- */
  frete: {
    gratisAcimaDe: 399.99,
    postagem: 'Postamos em até 24h úteis depois da confirmação do pagamento.',
    transportadoras: ['Correios PAC', 'Correios SEDEX'],
    // A região é identificada pelo primeiro dígito do CEP.
    regioes: [
      { digitos: '01', nome: 'São Paulo',                   pac: [18.90, '3 a 6 dias úteis'],  sedex: [27.90, '1 a 3 dias úteis'] },
      { digitos: '23', nome: 'RJ, ES e MG',                 pac: [22.90, '4 a 8 dias úteis'],  sedex: [34.90, '2 a 4 dias úteis'] },
      { digitos: '89', nome: 'Sul',                         pac: [24.90, '5 a 9 dias úteis'],  sedex: [38.90, '2 a 4 dias úteis'] },
      { digitos: '7',  nome: 'Centro-Oeste',                pac: [26.90, '6 a 10 dias úteis'], sedex: [42.90, '3 a 5 dias úteis'] },
      { digitos: '45', nome: 'Nordeste',                    pac: [29.90, '7 a 12 dias úteis'], sedex: [49.90, '3 a 6 dias úteis'] },
      { digitos: '6',  nome: 'Norte e Nordeste',            pac: [34.90, '9 a 15 dias úteis'], sedex: [58.90, '4 a 7 dias úteis'] }
    ]
  },

  /* ---------- Faixa de avisos (passa abaixo do menu) ---------- */
  avisos: [
    'BLACK FRIDAY WALLACE',
    'FRETE GRÁTIS ACIMA DE R$ 399,99',
    '3% OFF NO PIX',
    'ATÉ 12X NO CARTÃO'
  ],

  /* ---------- Banners rotativos da home ----------
   * Cada banner é montado em HTML (título, faixa, preço).
   * Para usar uma arte pronta, informe `imagem` (1920x770) e
   * `imagemCelular` (780x744): o texto deixa de ser exibido.
   */
  banners: [
    {
      selo: 'Black Friday',
      titulo: '3 Camisetas',
      faixa: 'por apenas',
      de: 'De R$ 179,97',
      preco: '119,99',
      obs: '*Válido para as camisetas da coleção Black Friday. Pode misturar os modelos.',
      link: 'produtos.html?cat=black-friday&sub=3-camisetas-por-119-99',
      arte: 'camisetas'
    },
    {
      selo: 'Black Friday',
      titulo: '2 Tênis',
      faixa: 'por apenas',
      de: 'De R$ 399,98',
      preco: '299,99',
      obs: '*Válido para os modelos Low Street, Runner, Retrô e Court.',
      link: 'produtos.html?cat=black-friday&sub=2-tenis-por-299-99',
      arte: 'tenis'
    },
    {
      selo: 'Linha Premium',
      titulo: '3 Camisetas Premium',
      faixa: 'por apenas',
      de: 'De R$ 209,97',
      preco: '149,99',
      obs: '*Malha penteada fio 30.1. Leve três ou mais e o desconto entra sozinho no carrinho.',
      link: 'produtos.html?cat=black-friday&sub=3-camisetas-premium-por-149-99',
      arte: 'premium'
    },
    {
      selo: 'Grupo VIP',
      titulo: 'Ofertas primeiro no WhatsApp',
      faixa: 'entre no grupo',
      texto: 'Reposição, lançamentos e cupons chegam antes para quem está no grupo.',
      botao: 'Quero entrar',
      link: 'whatsapp-grupo',
      arte: 'grupo'
    },
    {
      selo: 'Acabou de chegar',
      titulo: 'Bonés',
      faixa: 'aba curva e trucker',
      texto: 'Modelos com regulagem, a partir de R$ 59,99.',
      botao: 'Ver bonés',
      link: 'produtos.html?cat=bones',
      arte: 'bones'
    }
  ],

  /* ---------- Vídeo "Conheça a loja" ----------
   * Cole o código do vídeo do YouTube (o trecho depois de "v=").
   * Sem código, o bloco leva o cliente para o Instagram da loja.
   */
  video: { youtubeId: '' },

  sobre: {
    titulo: 'Sobre a Wallace Imports',
    texto: 'A Wallace Imports nasceu para quem gosta de andar bem vestido sem pagar preço de vitrine de shopping. ' +
      'Escolhemos peça por peça, conferimos acabamento, costura e numeração antes de enviar e atendemos cada cliente pelo WhatsApp, do pedido até a entrega. ' +
      'Aqui você encontra tênis, camisetas, conjuntos, bonés e acessórios importados, com envio para todo o Brasil e troca sem dor de cabeça.'
  }
};
