#!/usr/bin/env node
/*
 * Gera as ilustrações de exemplo dos produtos (assets/img/produtos/*.svg)
 * e os recortes usados nos banners (assets/img/recortes/*.svg).
 *
 *   node tools/gerar-ilustracoes.js
 *
 * Só é necessário enquanto a loja não tiver as fotos reais: produtos com o
 * campo `fotos` no catálogo ignoram estas ilustrações.
 */
const fs = require('fs');
const path = require('path');
const { produtos } = require('../assets/js/catalogo.js');

const RAIZ = path.join(__dirname, '..');
const DIR_PRODUTOS = path.join(RAIZ, 'assets/img/produtos');
const DIR_RECORTES = path.join(RAIZ, 'assets/img/recortes');

/* ---------- cores ---------- */
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const hex = (c) => '#' + c.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
const mix = (a, b, t) => { const x = rgb(a), y = rgb(b); return hex(x.map((v, i) => v + (y[i] - v) * t)); };
const lum = (h) => { const [r, g, b] = rgb(h).map((v) => v / 255); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
function tons(tom, tom2) {
  const escuro = lum(tom) < 0.25;
  return {
    base: tom,
    dois: tom2 || (escuro ? '#e9e6dd' : '#17171a'),
    linha: escuro ? mix(tom, '#ffffff', 0.22) : mix(tom, '#000000', 0.2),
    dentro: escuro ? mix(tom, '#000000', 0.55) : mix(tom, '#000000', 0.38),
    rib: escuro ? mix(tom, '#ffffff', 0.08) : mix(tom, '#000000', 0.07),
    borda: mix(tom, '#000000', 0.4)
  };
}

/* ---------- marca: coroa simplificada ---------- */
function coroa(cx, cy, largura, cor, traco) {
  const s = largura / 100;
  const t = traco || 7;
  return `<g transform="translate(${cx - 50 * s} ${cy - 40 * s}) scale(${s})" fill="none" stroke="${cor}" stroke-width="${t}" stroke-linejoin="round" stroke-linecap="round">
    <path d="M8 22 L28 64 L50 20 L72 64 L92 22"/><path d="M24 76 Q50 66 76 76"/>
    <circle cx="8" cy="14" r="5" fill="${cor}" stroke="none"/><circle cx="50" cy="10" r="6" fill="${cor}" stroke="none"/><circle cx="92" cy="14" r="5" fill="${cor}" stroke="none"/>
    <circle cx="30" cy="12" r="4" fill="${cor}" stroke="none"/><circle cx="70" cy="12" r="4" fill="${cor}" stroke="none"/>
  </g>`;
}

/* ---------- estampas das camisetas (peito centrado em 400,430) ---------- */
function estampa(tipo, t) {
  const c = t.dois;
  switch (tipo) {
    case 'letreiro': {
      const larg = [26, 14, 30, 22, 12, 28, 20, 24];
      let x = 400 - (larg.reduce((a, b) => a + b, 0) + 7 * 8) / 2;
      const blocos = larg.map((w) => { const r = `<rect x="${x}" y="408" width="${w}" height="34" rx="3"/>`; x += w + 8; return r; }).join('');
      return `<g fill="${c}">${blocos}<rect x="288" y="454" width="224" height="5" rx="2" opacity=".85"/></g>`;
    }
    case 'quadro':
      return `<g fill="none" stroke="${c}" stroke-width="6"><rect x="322" y="372" width="156" height="176" rx="6"/></g>
        <g fill="${c}"><circle cx="372" cy="432" r="24"/><circle cx="430" cy="432" r="24"/><rect x="344" y="482" width="112" height="12" rx="3"/><rect x="362" y="506" width="76" height="9" rx="3" opacity=".8"/></g>`;
    case 'onda':
      return `<g fill="none" stroke="${c}" stroke-linecap="round"><path d="M286 418 q28 -34 57 0 t57 0 t57 0 t57 0" stroke-width="12"/><path d="M286 452 q28 -34 57 0 t57 0 t57 0 t57 0" stroke-width="7" opacity=".75"/><path d="M286 482 q28 -34 57 0 t57 0 t57 0 t57 0" stroke-width="4" opacity=".5"/></g>`;
    case 'faixas':
      return `<g fill="${c}"><rect x="232" y="392" width="340" height="26"/><rect x="232" y="428" width="340" height="14" opacity=".8"/><rect x="232" y="452" width="340" height="7" opacity=".6"/></g>`;
    case 'mini':
      return coroa(476, 352, 38, c, 9);
    case 'coroa':
      return coroa(400, 440, 170, c, 6) + `<g fill="${c}"><rect x="340" y="522" width="120" height="9" rx="2"/><rect x="362" y="540" width="76" height="6" rx="2" opacity=".8"/></g>`;
    case 'circulo':
      return `<g fill="none" stroke="${c}" stroke-width="7"><circle cx="400" cy="450" r="74"/></g><g fill="${c}"><rect x="330" y="446" width="140" height="8"/><rect x="340" y="468" width="120" height="7" opacity=".8"/><rect x="356" y="488" width="88" height="6" opacity=".6"/></g>`;
    case 'arco':
      return `<g fill="none" stroke="${c}" stroke-linecap="round"><path d="M312 470 A88 88 0 0 1 488 470" stroke-width="16"/><path d="M344 470 A56 56 0 0 1 456 470" stroke-width="9" opacity=".75"/></g><rect x="322" y="492" width="156" height="10" rx="3" fill="${c}"/>`;
    case 'escudo':
      return `<path d="M452 330 h44 v30 q0 26 -22 36 q-22 -10 -22 -36 z" fill="${c}"/><path d="M462 342 h24 v16 q0 14 -12 20 q-12 -6 -12 -20 z" fill="${t.base}" opacity=".9"/>`;
    default:
      return '';
  }
}

/* ---------- formas: cada uma devolve { box:[x,y,w,h], svg } ---------- */
const CORPO_CAMISETA = 'M296 236 C340 252 460 252 504 236 L688 322 Q701 329 697 343 L654 474 Q649 487 637 482 L570 452 L574 790 Q574 803 561 804 Q400 814 239 804 Q226 803 226 790 L230 452 L163 482 Q151 487 146 474 L103 343 Q99 329 112 322 Z';
const CORPO_LONGO = 'M300 252 L214 282 Q172 298 162 342 L97 722 Q93 744 114 749 L170 762 Q190 766 196 746 L246 500 L242 822 Q242 837 257 837 L543 837 Q558 837 558 822 L554 500 L604 746 Q610 766 630 762 L686 749 Q707 744 703 722 L638 342 Q628 298 586 282 L500 252 Q400 300 300 252 Z';

const FORMAS = {
  camiseta(t, p) {
    return { box: [99, 236, 602, 578], svg: `
      <path d="${CORPO_CAMISETA}" fill="${t.base}" stroke="${t.borda}" stroke-width="1.5"/>
      <path d="${CORPO_CAMISETA}" fill="url(#luz)"/>
      <path d="M308 237 C345 250 455 250 492 237 Q400 304 308 237 Z" fill="${t.dentro}"/>
      <path d="M296 236 Q400 324 504 236 L491 237 Q400 304 309 237 Z" fill="${t.rib}" stroke="${t.linha}" stroke-width="1.4"/>
      <g fill="none" stroke="${t.linha}" stroke-width="1.6" opacity=".75">
        <path d="M118 339 L160 470"/><path d="M682 339 L640 470"/><path d="M228 780 Q400 790 572 780"/>
        <path d="M296 236 L226 268" opacity=".5"/><path d="M504 236 L574 268" opacity=".5"/>
      </g>
      ${estampa(p.estampa, t)}` };
  },

  raglan(t, p) {
    const m = `fill="${t.dois}"`;
    return { box: [99, 236, 602, 578], svg: `
      <path d="${CORPO_CAMISETA}" fill="${t.base}" stroke="${t.borda}" stroke-width="1.5"/>
      <path d="M296 236 L112 322 Q99 329 103 343 L146 474 Q151 487 163 482 L230 452 Z" ${m}/>
      <path d="M504 236 L688 322 Q701 329 697 343 L654 474 Q649 487 637 482 L570 452 Z" ${m}/>
      <path d="${CORPO_CAMISETA}" fill="url(#luz)"/>
      <path d="M308 237 C345 250 455 250 492 237 Q400 304 308 237 Z" fill="${mix(t.dois, '#000000', 0.5)}"/>
      <path d="M296 236 Q400 324 504 236 L491 237 Q400 304 309 237 Z" ${m}/>
      <path d="M228 780 Q400 790 572 780" fill="none" stroke="${t.linha}" stroke-width="1.6" opacity=".75"/>
      ${estampa(p.estampa, t)}` };
  },

  polo(t, p) {
    const gola = p.estampa === 'escudo' ? t.dois : t.rib;
    const punho = p.estampa === 'escudo'
      ? `<path d="M103 343 L146 474 Q151 487 163 482 L176 476 L128 334 L112 322 Q99 329 103 343 Z" fill="${t.dois}"/><path d="M697 343 L654 474 Q649 487 637 482 L624 476 L672 334 L688 322 Q701 329 697 343 Z" fill="${t.dois}"/>`
      : '';
    return { box: [99, 222, 602, 592], svg: `
      <path d="${CORPO_CAMISETA}" fill="${t.base}" stroke="${t.borda}" stroke-width="1.5"/>
      ${punho}
      <path d="${CORPO_CAMISETA}" fill="url(#luz)"/>
      <path d="M318 240 L400 318 L482 240 C450 250 350 250 318 240 Z" fill="${t.dentro}"/>
      <rect x="381" y="304" width="38" height="104" fill="${t.rib}" stroke="${t.linha}" stroke-width="1.4"/>
      <circle cx="400" cy="336" r="5" fill="${t.linha}"/><circle cx="400" cy="374" r="5" fill="${t.linha}"/>
      <path d="M294 234 L350 222 L398 306 L338 330 Z" fill="${gola}" stroke="${t.linha}" stroke-width="1.4"/>
      <path d="M506 234 L450 222 L402 306 L462 330 Z" fill="${gola}" stroke="${t.linha}" stroke-width="1.4"/>
      <g fill="none" stroke="${t.linha}" stroke-width="1.6" opacity=".75"><path d="M118 339 L160 470"/><path d="M682 339 L640 470"/><path d="M228 780 Q400 790 572 780"/></g>
      ${estampa(p.estampa, t)}` };
  },

  mangalonga(t, p) {
    return { box: [93, 236, 614, 601], svg: `
      <g transform="translate(0 -14)">
      <path d="${CORPO_LONGO}" fill="${t.base}" stroke="${t.borda}" stroke-width="1.5"/>
      <path d="${CORPO_LONGO}" fill="url(#luz)"/>
      <path d="M312 256 Q400 296 488 256 Q400 318 312 256 Z" fill="${t.dentro}"/>
      <path d="M300 252 Q400 336 500 252 L488 256 Q400 318 312 256 Z" fill="${t.rib}" stroke="${t.linha}" stroke-width="1.4"/>
      <g fill="none" stroke="${t.linha}" stroke-width="1.6" opacity=".75"><path d="M102 694 L203 716"/><path d="M698 694 L597 716"/><path d="M243 812 L557 812"/></g>
      <g transform="translate(0 30)">${estampa(p.estampa, t)}</g>
      </g>` };
  },

  moletom(t, p) {
    const ribs = Array.from({ length: 22 }, (_, i) => `<path d="M${250 + i * 14} 806 v27"/>`).join('');
    const cord = t.dois;
    return { box: [93, 108, 614, 729], svg: `
      <path d="${CORPO_LONGO}" fill="${t.base}" stroke="${t.borda}" stroke-width="1.5"/>
      <path d="${CORPO_LONGO}" fill="url(#luz)"/>
      <path d="M298 256 C262 176 318 108 400 108 C482 108 538 176 502 256 C470 300 330 300 298 256 Z" fill="${t.base}" stroke="${t.borda}" stroke-width="1.5"/>
      <path d="M298 256 C262 176 318 108 400 108 C482 108 538 176 502 256 C470 300 330 300 298 256 Z" fill="url(#luz)"/>
      <path d="M328 250 C308 196 348 152 400 152 C452 152 492 196 472 250 C446 280 354 280 328 250 Z" fill="${t.dentro}"/>
      <g fill="none" stroke="${t.linha}" stroke-width="1.8" opacity=".8">
        <path d="M400 108 V152"/><path d="M102 694 L203 716"/><path d="M698 694 L597 716"/><path d="M243 802 H557"/>
        <path d="M292 640 H508 L536 768 Q537 778 527 778 H273 Q263 778 264 768 Z"/>
        <g opacity=".55">${ribs}</g>
      </g>
      ${p.ziper ? `<path d="M400 282 V837" stroke="${t.linha}" stroke-width="4"/><rect x="393" y="292" width="14" height="30" rx="4" fill="${t.dois}"/>` : ''}
      <g stroke="${cord}" stroke-width="6" stroke-linecap="round"><path d="M376 284 L368 404"/><path d="M424 284 L432 404"/></g>
      <g fill="${mix(cord, '#000000', 0.25)}"><rect x="363" y="398" width="10" height="20" rx="3"/><rect x="427" y="398" width="10" height="20" rx="3"/></g>` };
  },

  calca(t, p) {
    const pernas = 'M266 207 H534 L562 868 Q563 884 547 884 H442 Q428 884 427 870 L400 430 L373 870 Q372 884 358 884 H253 Q237 884 238 868 Z';
    const fio = p.tom2 || t.linha;
    return { box: [237, 165, 326, 719], svg: `
      <path d="${pernas}" fill="${t.base}" stroke="${t.borda}" stroke-width="1.5"/>
      <path d="${pernas}" fill="url(#luz)"/>
      <rect x="264" y="165" width="272" height="44" rx="4" fill="${t.base}" stroke="${t.borda}" stroke-width="1.5"/>
      <g fill="${t.rib}" stroke="${t.linha}" stroke-width="1"><rect x="296" y="160" width="12" height="54" rx="2"/><rect x="492" y="160" width="12" height="54" rx="2"/><rect x="394" y="160" width="12" height="54" rx="2"/></g>
      <circle cx="400" cy="187" r="8" fill="${fio}" opacity=".9"/>
      <g fill="none" stroke="${fio}" stroke-width="2" stroke-dasharray="7 5" opacity=".8">
        <path d="M284 209 Q290 268 344 276"/><path d="M516 209 Q510 268 456 276"/><path d="M400 209 V318 Q398 344 372 350"/>
        <path d="M242 852 H370"/><path d="M430 852 H558"/>
      </g>
      <path d="M400 430 V320" stroke="${t.linha}" stroke-width="1.6" opacity=".7"/>` };
  },

  jogger(t, p) {
    const pernas = 'M266 207 H534 L550 842 H444 L400 440 L356 842 H250 Z';
    const cord = p.tom2 || t.dois;
    const ribs = (x) => Array.from({ length: 7 }, (_, i) => `<path d="M${x + 10 + i * 13} 846 v32"/>`).join('');
    return { box: [246, 165, 308, 719], svg: `
      <path d="${pernas}" fill="${t.base}" stroke="${t.borda}" stroke-width="1.5"/>
      <path d="${pernas}" fill="url(#luz)"/>
      <rect x="264" y="165" width="272" height="46" rx="8" fill="${t.rib}" stroke="${t.borda}" stroke-width="1.5"/>
      <rect x="248" y="840" width="110" height="44" rx="8" fill="${t.rib}" stroke="${t.borda}" stroke-width="1.5"/>
      <rect x="442" y="840" width="110" height="44" rx="8" fill="${t.rib}" stroke="${t.borda}" stroke-width="1.5"/>
      <g fill="none" stroke="${t.linha}" stroke-width="1.6" opacity=".6">${ribs(248)}${ribs(442)}
        <path d="M286 211 Q292 286 330 300"/><path d="M514 211 Q508 286 470 300"/><path d="M400 440 V211"/>
      </g>
      <g stroke="${cord}" stroke-width="5" stroke-linecap="round"><path d="M388 196 L380 286"/><path d="M412 196 L420 286"/></g>` };
  },

  bermuda(t, p) {
    const pernas = 'M230 346 H570 L610 700 Q612 717 595 718 L432 722 Q420 722 418 710 L400 500 L382 710 Q380 722 368 722 L205 718 Q188 717 190 700 Z';
    const listra = p.listra
      ? `<path d="M230 346 H254 L216 718 L205 718 Q188 717 190 700 Z" fill="${t.dois}"/><path d="M570 346 H546 L584 718 L595 718 Q612 717 610 700 Z" fill="${t.dois}"/>`
      : '';
    return { box: [188, 300, 424, 422], svg: `
      <path d="${pernas}" fill="${t.base}" stroke="${t.borda}" stroke-width="1.5"/>
      ${listra}
      <path d="${pernas}" fill="url(#luz)"/>
      <rect x="228" y="300" width="344" height="48" rx="8" fill="${t.rib}" stroke="${t.borda}" stroke-width="1.5"/>
      <g fill="none" stroke="${t.linha}" stroke-width="1.6" opacity=".75">
        <path d="M262 348 Q268 426 316 440"/><path d="M538 348 Q532 426 484 440"/><path d="M400 500 V348"/>
        <path d="M194 690 L384 695"/><path d="M606 690 L416 695"/>
      </g>
      <g stroke="${t.dois}" stroke-width="5" stroke-linecap="round" opacity=".95"><path d="M388 332 L378 416"/><path d="M412 332 L422 416"/></g>` };
  },

  tenis(t, p) {
    const sola = p.sola || '#f2f1ed';
    const escuraSola = lum(sola) < 0.3;
    const cadarco = lum(t.base) < 0.3 && escuraSola ? '#2e2e33' : (lum(t.base) < 0.3 ? '#111113' : '#fbfaf6');
    const A = [240, 104], B = [350, 36], C = [268, 128], D = [372, 62];
    const lerp = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
    const lacos = [0.1, 0.3, 0.5, 0.7, 0.9].map((k) => { const s = lerp(A, B, k), e = lerp(C, D, k + 0.04); return `<path d="M${s[0].toFixed(1)} ${s[1].toFixed(1)} L${e[0].toFixed(1)} ${e[1].toFixed(1)}"/>`; }).join('');
    const cabedal = 'M60 214 C36 176 60 156 100 148 C160 136 205 122 240 104 L350 36 Q364 24 382 30 C400 58 432 84 470 84 C512 84 532 50 556 34 Q576 24 581 48 C592 112 600 170 604 214 C500 230 380 228 60 214 Z';
    return { box: [10, 22, 604, 264], svg: `
      <path d="${cabedal}" fill="${t.base}" stroke="${t.borda}" stroke-width="1.5"/>
      <path d="M486 224 C492 160 520 108 580 60 C592 112 600 170 604 214 C560 222 520 224 486 224 Z" fill="${t.dois}"/>
      <path d="M60 214 C36 176 60 156 100 148 C128 142 150 138 166 134 C186 162 192 192 194 219 Z" fill="${t.dois}" opacity=".85"/>
      <path d="${cabedal}" fill="url(#luz)"/>
      <path d="M240 104 L350 36 L372 62 L268 128 Z" fill="${t.dentro}"/>
      <g stroke="${cadarco}" stroke-width="8" stroke-linecap="round">${lacos}</g>
      <path d="M382 30 C400 58 432 84 470 84 C512 84 532 50 556 34" fill="none" stroke="${t.dentro}" stroke-width="11" stroke-linecap="round"/>
      <g fill="none" stroke="${t.linha}" stroke-width="1.8" opacity=".8"><path d="M196 218 C300 184 400 136 470 88"/><path d="M268 128 C300 150 330 190 340 224"/></g>
      <path d="M22 236 Q10 262 40 270 H588 Q612 268 610 244 L604 212 C500 228 380 226 60 212 Q32 212 22 236 Z" fill="${sola}" stroke="${mix(sola, '#000000', 0.3)}" stroke-width="1.5"/>
      <path d="M30 250 H604" stroke="${mix(sola, '#000000', 0.18)}" stroke-width="2"/>
      <path d="M36 270 H592 Q594 286 580 286 H52 Q36 286 36 270 Z" fill="${escuraSola ? '#0d0d0e' : mix(sola, '#000000', 0.6)}"/>` };
  },

  bone(t, p) {
    const copa = 'M128 252 C114 120 190 44 300 44 C410 44 486 120 472 252 Q300 214 128 252 Z';
    const frente = 'M196 238 C200 170 240 100 300 48 C360 100 400 170 404 238 Q300 216 196 238 Z';
    const aba = 'M116 250 Q300 206 484 250 C528 276 496 322 300 328 C104 322 72 276 116 250 Z';
    const marca = p.tela ? t.base : t.dois;
    return { box: [80, 36, 440, 294], svg: `
      <defs><pattern id="tela" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0H12M0 0V12" stroke="${t.linha}" stroke-width="1.6" opacity=".7"/></pattern></defs>
      <path d="${copa}" fill="${t.base}" stroke="${t.borda}" stroke-width="1.5"/>
      ${p.tela ? `<path d="${copa}" fill="url(#tela)"/><path d="${frente}" fill="${t.dois}"/>` : ''}
      <path d="${copa}" fill="url(#luz)"/>
      <g fill="none" stroke="${p.tela ? mix(t.dois, '#000000', 0.2) : t.linha}" stroke-width="1.8" opacity=".8"><path d="M300 48 C296 110 296 170 300 222"/></g>
      <g fill="none" stroke="${t.linha}" stroke-width="1.8" opacity=".8"><path d="M300 48 C240 100 200 170 196 238"/><path d="M300 48 C360 100 400 170 404 238"/></g>
      <circle cx="300" cy="46" r="10" fill="${t.rib}" stroke="${t.linha}" stroke-width="1.5"/>
      ${coroa(300, 150, 64, marca, 9)}
      <path d="${aba}" fill="${t.base}" stroke="${t.borda}" stroke-width="1.5"/>
      <path d="${aba}" fill="url(#luz)"/>
      <g fill="none" stroke="${t.linha}" stroke-width="1.6" opacity=".7"><path d="M112 270 Q300 226 488 270"/><path d="M118 292 Q300 250 482 292"/></g>` };
  },

  chinelo(t, p) {
    const sola = 'M90 0 C150 0 180 60 176 140 C172 220 168 300 164 370 C160 420 130 440 90 440 C50 440 20 420 16 370 C12 300 8 220 4 140 C0 60 30 0 90 0 Z';
    const um = (x, rot, espelho) => `<g transform="translate(${x} 0) rotate(${rot} 90 220)${espelho ? ' translate(180 0) scale(-1 1)' : ''}">
        <path d="${sola}" fill="${t.base}" stroke="${t.borda}" stroke-width="1.5"/>
        <path d="M90 22 C136 22 158 70 154 142 C150 220 148 296 144 364 C141 402 120 418 90 418 C60 418 39 402 36 364 C32 296 30 220 26 142 C22 70 44 22 90 22 Z" fill="${t.dentro}" opacity=".55"/>
        <path d="M-8 122 C40 96 140 96 188 122 L192 236 C140 216 40 216 -12 236 Z" fill="${t.base}" stroke="${t.borda}" stroke-width="1.5"/>
        <path d="M-8 122 C40 96 140 96 188 122 L192 236 C140 216 40 216 -12 236 Z" fill="url(#luz)"/>
        ${coroa(90, 166, 62, t.dois, 9)}
      </g>`;
    return { box: [-16, -6, 440, 452], svg: um(0, -5, false) + um(228, 5, true) };
  },

  relogio(t, p) {
    const elo = (y) => `<path d="M322 ${y} H478" />`;
    const elos = [176, 210, 244, 278, 312, 346, 654, 688, 722, 756, 790, 824].map(elo).join('');
    const marcas = Array.from({ length: 12 }, (_, i) => `<rect x="397" y="386" width="6" height="${i % 3 === 0 ? 22 : 12}" rx="2" transform="rotate(${i * 30} 400 500)"/>`).join('');
    return { box: [238, 140, 334, 720], svg: `
      <path d="M330 140 H470 L486 400 H314 Z" fill="${t.base}" stroke="${t.borda}" stroke-width="1.5"/>
      <path d="M314 600 H486 L470 860 H330 Z" fill="${t.base}" stroke="${t.borda}" stroke-width="1.5"/>
      <path d="M330 140 H470 L486 400 H314 Z" fill="url(#metal)"/><path d="M314 600 H486 L470 860 H330 Z" fill="url(#metal)"/>
      <g stroke="${t.borda}" stroke-width="2" opacity=".55">${elos}</g>
      <rect x="546" y="482" width="26" height="36" rx="6" fill="${t.base}" stroke="${t.borda}" stroke-width="1.5"/>
      <circle cx="400" cy="500" r="158" fill="${t.base}" stroke="${t.borda}" stroke-width="1.5"/>
      <circle cx="400" cy="500" r="158" fill="url(#metal)"/>
      <circle cx="400" cy="500" r="132" fill="${t.dois}" stroke="${mix(t.base, '#000000', 0.3)}" stroke-width="3"/>
      <g fill="${t.base}">${marcas}</g>
      <g stroke="${t.base}" stroke-linecap="round"><path d="M400 500 L400 418" stroke-width="8"/><path d="M400 500 L462 536" stroke-width="6"/><path d="M400 500 L352 572" stroke-width="2.5" stroke="#c8302f"/></g>
      <circle cx="400" cy="500" r="9" fill="${t.base}"/>` };
  },

  perfume(t, p) {
    const vidro = t.base, tampa = t.dois;
    const claro = lum(vidro) > 0.3;
    return { box: [246, 160, 308, 680], svg: `
      <rect x="336" y="160" width="128" height="162" rx="10" fill="${tampa}" stroke="${mix(tampa, '#000000', 0.4)}" stroke-width="1.5"/>
      <rect x="336" y="160" width="128" height="162" rx="10" fill="url(#metal)"/>
      <rect x="366" y="320" width="68" height="36" fill="${mix(tampa, '#000000', 0.25)}"/>
      <rect x="250" y="352" width="300" height="484" rx="28" fill="${vidro}" stroke="${t.borda}" stroke-width="1.5"/>
      <rect x="270" y="372" width="260" height="444" rx="16" fill="${claro ? mix(vidro, '#ffffff', 0.28) : mix(vidro, '#ffffff', 0.07)}"/>
      <rect x="250" y="352" width="300" height="484" rx="28" fill="url(#luz)"/>
      <rect x="282" y="384" width="26" height="420" rx="13" fill="#ffffff" opacity="${claro ? 0.32 : 0.1}"/>
      <rect x="316" y="520" width="168" height="150" rx="4" fill="${claro ? '#17171a' : tampa}"/>
      ${coroa(400, 566, 58, claro ? tampa === '#17171a' ? '#f0c22b' : tampa : '#17171a', 9)}
      <g fill="${claro ? '#f0c22b' : '#17171a'}"><rect x="344" y="614" width="112" height="9" rx="2"/><rect x="364" y="634" width="72" height="6" rx="2" opacity=".8"/></g>` };
  },

  oculos(t, p) {
    const lente = 'M150 420 Q150 398 174 398 L348 398 Q372 398 372 422 Q372 520 302 560 Q260 582 218 566 Q152 540 150 420 Z';
    return { box: [112, 384, 576, 200], svg: `
      <defs><linearGradient id="lente" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${mix(t.dois, '#ffffff', 0.25)}"/><stop offset=".55" stop-color="${t.dois}"/><stop offset="1" stop-color="${mix(t.dois, '#000000', 0.45)}"/></linearGradient></defs>
      <g stroke="${t.base}" stroke-width="14" stroke-linecap="round" fill="none"><path d="M152 414 L120 430"/><path d="M648 414 L680 430"/><path d="M372 428 Q400 404 428 428"/></g>
      <path d="${lente}" fill="url(#lente)" stroke="${t.base}" stroke-width="13" stroke-linejoin="round"/>
      <path d="${lente}" transform="translate(800 0) scale(-1 1)" fill="url(#lente)" stroke="${t.base}" stroke-width="13" stroke-linejoin="round"/>
      <g fill="#ffffff" opacity=".22"><path d="M178 414 L250 414 L196 500 Z"/><path d="M458 414 L530 414 L476 500 Z"/></g>` };
  },

  bolsa(t, p) {
    return { box: [218, 150, 364, 700], svg: `
      <path d="M292 430 C246 210 356 162 400 162 C444 162 554 210 508 430" fill="none" stroke="${t.rib}" stroke-width="26" stroke-linecap="round"/>
      <path d="M292 430 C246 210 356 162 400 162 C444 162 554 210 508 430" fill="none" stroke="${t.borda}" stroke-width="1.5" opacity=".6"/>
      <rect x="230" y="400" width="340" height="448" rx="30" fill="${t.base}" stroke="${t.borda}" stroke-width="1.5"/>
      <rect x="230" y="400" width="340" height="448" rx="30" fill="url(#luz)"/>
      <g fill="none" stroke="${t.linha}" stroke-width="2" opacity=".85"><path d="M258 446 H542" stroke-dasharray="5 4" stroke-width="5"/><rect x="262" y="566" width="276" height="244" rx="18"/><path d="M286 602 H514" stroke-dasharray="5 4" stroke-width="5"/></g>
      <rect x="520" y="436" width="14" height="34" rx="4" fill="${t.dois}"/><rect x="494" y="592" width="12" height="30" rx="4" fill="${t.dois}"/>
      <rect x="364" y="490" width="72" height="26" rx="3" fill="${t.dois}"/>` };
  },

  carteira(t, p) {
    return { box: [166, 326, 468, 348], svg: `
      <rect x="186" y="326" width="448" height="318" rx="22" fill="${mix(t.base, '#ffffff', 0.1)}" stroke="${t.borda}" stroke-width="1.5"/>
      <rect x="166" y="352" width="448" height="322" rx="22" fill="${t.base}" stroke="${t.borda}" stroke-width="1.5"/>
      <rect x="166" y="352" width="448" height="322" rx="22" fill="url(#luz)"/>
      <rect x="182" y="368" width="416" height="290" rx="14" fill="none" stroke="${t.dois}" stroke-width="2" stroke-dasharray="8 6" opacity=".7"/>
      ${coroa(540, 610, 60, t.dois, 8)}` };
  },

  cinto: function (t, p) {
    return { box: [208, 308, 462, 364], svg: `
      <circle cx="380" cy="500" r="150" fill="none" stroke="${t.base}" stroke-width="44"/>
      <circle cx="380" cy="500" r="150" fill="none" stroke="${t.linha}" stroke-width="1.6" opacity=".5"/>
      <circle cx="380" cy="500" r="102" fill="none" stroke="${mix(t.base, '#ffffff', 0.08)}" stroke-width="44"/>
      <circle cx="380" cy="500" r="56" fill="none" stroke="${t.base}" stroke-width="40"/>
      <rect x="380" y="328" width="214" height="44" fill="${t.base}"/>
      <g fill="${t.dentro}"><circle cx="430" cy="350" r="5"/><circle cx="462" cy="350" r="5"/><circle cx="494" cy="350" r="5"/></g>
      <rect x="566" y="314" width="92" height="72" rx="10" fill="none" stroke="${t.dois}" stroke-width="13"/>
      <path d="M566 350 H640" stroke="${t.dois}" stroke-width="9" stroke-linecap="round"/>` };
  },

  meia(t, p) {
    const forma = 'M10 0 H120 V235 C120 268 140 290 172 300 L250 326 C292 340 296 392 262 412 C250 420 236 420 222 420 H96 C40 420 10 385 10 330 Z';
    const uma = (x, y, rot, cor) => `<g transform="translate(${x} ${y}) rotate(${rot} 65 0)">
        <path d="${forma}" fill="${cor}" stroke="${mix(cor, '#000000', 0.4)}" stroke-width="1.5"/>
        <path d="${forma}" fill="url(#luz)"/>
        <rect x="10" y="38" width="110" height="13" fill="${t.dois}"/><rect x="10" y="62" width="110" height="13" fill="${t.dois}"/>
        <path d="M222 420 C262 420 292 392 280 352 C272 372 250 392 214 392 Z" fill="${mix(cor, '#000000', 0.16)}"/>
      </g>`;
    return { box: [-40, -10, 470, 470], svg: uma(-10, 40, -14, mix(t.base, '#000000', 0.12)) + uma(70, 14, 0, mix(t.base, '#000000', 0.05)) + uma(150, 30, 14, t.base) };
  },

  cueca(t, p) {
    const corpo = 'M210 372 H590 L616 640 Q617 654 603 655 L440 668 Q428 668 425 656 L400 560 L375 656 Q372 668 360 668 L197 655 Q183 654 184 640 Z';
    const uma = (dx, dy, base, cos) => `<g transform="translate(${dx} ${dy})">
        <path d="${corpo}" fill="${base}" stroke="${mix(base, '#000000', 0.4)}" stroke-width="1.5"/><path d="${corpo}" fill="url(#luz)"/>
        <rect x="208" y="322" width="384" height="52" rx="6" fill="${cos}" stroke="${mix(cos, '#000000', 0.3)}" stroke-width="1.5"/>
        <g fill="${base}" opacity=".85"><rect x="350" y="340" width="26" height="14" rx="2"/><rect x="384" y="340" width="14" height="14" rx="2"/><rect x="406" y="340" width="30" height="14" rx="2"/></g>
        <g fill="none" stroke="${mix(base, lum(base) < 0.25 ? '#ffffff' : '#000000', 0.2)}" stroke-width="1.6" opacity=".8"><path d="M366 374 Q372 500 400 560"/><path d="M434 374 Q428 500 400 560"/></g>
      </g>`;
    return { box: [150, 262, 470, 410], svg: uma(-34, -60, '#8b8d94', '#17171a') + uma(-17, -30, '#f1efe9', '#17171a') + uma(0, 0, t.base, t.dois) };
  },

  conjunto(t, p) {
    const c = FORMAS.camiseta(t, p), b = FORMAS.bermuda(t, p);
    return { box: [70, 60, 660, 880], svg: `
      <g transform="translate(400 330) scale(.84) translate(-400 -525)">${c.svg}</g>
      <g transform="translate(400 760) scale(.84) translate(-400 -511)">${b.svg}</g>` };
  },

  'conjunto-inverno'(t, p) {
    const m = FORMAS.moletom(t, p), j = FORMAS.jogger(t, p);
    return { box: [20, 110, 760, 780], svg: `
      <g transform="translate(560 540) rotate(4) scale(.9) translate(-400 -525)">${j.svg}</g>
      <g transform="translate(300 470) rotate(-4) scale(.9) translate(-400 -472)">${m.svg}</g>` };
  }
};

/* ---------- composição ---------- */
function por(f, cx, cy, escala, rot, espelho) {
  const [x, y, w, h] = f.box;
  return `<g transform="translate(${cx} ${cy}) rotate(${rot || 0}) scale(${espelho ? -escala : escala} ${escala}) translate(${-(x + w / 2)} ${-(y + h / 2)})">${f.svg}</g>`;
}
function caber(f, largura, altura) {
  return Math.min(largura / f.box[2], altura / f.box[3]);
}
const DEFS = `<defs>
  <radialGradient id="chao" cx=".42" cy=".36" r=".85"><stop offset="0" stop-color="#aeaaa2"/><stop offset=".6" stop-color="#9a968e"/><stop offset="1" stop-color="#7f7b74"/></radialGradient>
  <pattern id="trama" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(32)"><path d="M0 1H7" stroke="#000" stroke-width="1" opacity=".05"/><path d="M1 0V7" stroke="#fff" stroke-width="1" opacity=".05"/></pattern>
  <linearGradient id="luz" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".16"/></linearGradient>
  <linearGradient id="metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset=".3" stop-color="#fff" stop-opacity=".3"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".26"/></linearGradient>
  <filter id="sombra" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur in="SourceAlpha" stdDeviation="13"/><feOffset dx="9" dy="16"/><feComponentTransfer><feFuncA type="linear" slope=".42"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>`;
const CARTAO = `<g transform="translate(600 880) rotate(-17)" filter="url(#sombra)">
  <rect x="-82" y="-50" width="164" height="100" rx="5" fill="#0c0c0d"/>
  ${coroa(-38, -2, 46, '#f0c22b', 9)}
  <g fill="#f4f1ea"><rect x="-4" y="-16" width="66" height="9" rx="1"/></g><rect x="-4" y="2" width="44" height="5" rx="1" fill="#9a968e"/>
</g>`;

function svg(conteudo, fundo) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">${DEFS}` +
    (fundo ? `<rect width="800" height="1000" fill="url(#chao)"/><rect width="800" height="1000" fill="url(#trama)"/>` : '') +
    conteudo + '</svg>';
}

function vistas(p) {
  const t = tons(p.tom, p.tom2);
  const f = FORMAS[p.forma](t, p);
  const s = caber(f, 610, 740);
  let v1, v2, v3;
  if (p.forma === 'tenis') {
    const e = 0.98;
    v1 = `<g filter="url(#sombra)">${por(f, 440, 360, e * 0.94, -7)}</g><g filter="url(#sombra)">${por(f, 366, 590, e, -7)}</g>${CARTAO}`;
    v2 = `<g filter="url(#sombra)">${por(f, 470, 500, 1.55, -12)}</g>`;
    v3 = `<g filter="url(#sombra)">${por(f, 400, 340, e, 5, true)}</g><g filter="url(#sombra)">${por(f, 400, 650, e, -5)}</g>`;
  } else {
    const alto = f.box[3] * s > 700;
    v1 = `<g filter="url(#sombra)">${por(f, 400, alto ? 480 : 470, s, 0)}</g>${CARTAO}`;
    v2 = `<g filter="url(#sombra)">${por(f, 400, 500 + f.box[3] * s * 0.42, s * 1.75, -7)}</g>`;
    v3 = `<g filter="url(#sombra)">${por(f, 400, 490, s * 0.9, 9, true)}</g>`;
  }
  return [svg(v1, true), svg(v2, true), svg(v3, true)];
}

/* ---------- execução ---------- */
for (const dir of [DIR_PRODUTOS, DIR_RECORTES]) fs.mkdirSync(dir, { recursive: true });
for (const arq of fs.readdirSync(DIR_PRODUTOS)) if (arq.endsWith('.svg')) fs.unlinkSync(path.join(DIR_PRODUTOS, arq));

let total = 0;
for (const p of produtos) {
  if (!FORMAS[p.forma]) throw new Error(`Produto ${p.slug}: forma "${p.forma}" não existe`);
  vistas(p).forEach((conteudo, i) => { fs.writeFileSync(path.join(DIR_PRODUTOS, `${p.slug}-${i + 1}.svg`), conteudo); total++; });
}

/* Recortes sem fundo para os banners. */
const RECORTES = {
  'tenis-preto': { forma: 'tenis', tom: '#18181a', tom2: '#2a2a2e', sola: '#f3f3f1' },
  'tenis-branco': { forma: 'tenis', tom: '#f1f0ec', tom2: '#dcdad3', sola: '#f7f6f2' },
  'camiseta-preta': { forma: 'camiseta', tom: '#17171a', tom2: '#f0c22b', estampa: 'coroa' },
  'camiseta-branca': { forma: 'camiseta', tom: '#f2f0ea', tom2: '#17171a', estampa: 'letreiro' },
  'camiseta-vermelha': { forma: 'camiseta', tom: '#b3191f', tom2: '#f4f1ea', estampa: 'letreiro' },
  'camiseta-premium': { forma: 'camiseta', tom: '#131315', tom2: '#f0c22b', estampa: 'arco' },
  'bone-preto': { forma: 'bone', tom: '#17171a', tom2: '#f0c22b' },
  'bone-branco': { forma: 'bone', tom: '#f1efe9', tom2: '#17171a' }
};
for (const [nome, p] of Object.entries(RECORTES)) {
  const f = FORMAS[p.forma](tons(p.tom, p.tom2), p);
  const [x, y, w, h] = f.box;
  const m = 40;
  const corpo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x - m} ${y - m} ${w + m * 2} ${h + m * 2}" width="${w + m * 2}" height="${h + m * 2}">${DEFS}<g filter="url(#sombra)">${f.svg}</g></svg>`;
  fs.writeFileSync(path.join(DIR_RECORTES, `${nome}.svg`), corpo);
}
console.log(`${total} ilustrações de produto e ${Object.keys(RECORTES).length} recortes gerados.`);
