// Fluxos principais verificados no Firefox por scripts/firefox-check.mjs.
// Cada fluxo: { name, base, path, width?, storage?, steps: string[], check: string } — `check` devolve um objeto em que
// cada valor deve ser `true`; qualquer outro valor é reportado como falha.

const H = `
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const byText = (t, sel = 'button, a', r = document) => $$(sel, r).find((b) => b.textContent.replace(/\\s+/g, ' ').includes(t));
const click = (t, sel, r) => { const el = byText(t, sel, r); if (!el) throw new Error('não achei: ' + t); el.click(); };
const setV = (el, v) => {
  const p = el.tagName === 'SELECT' ? HTMLSelectElement.prototype : el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(p, 'value').set.call(el, v);
  el.dispatchEvent(new Event(el.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }));
};
const text = () => document.body.innerText;
const dialogText = () => $('dialog[open]')?.innerText ?? '';
`;
const s = (code) => H + code;

const P = "http://localhost:3100";
const port = (n) => `http://localhost:${3100 + n}`;

export const flows = [
  {
    name: "portfólio: listagem com 12 demos e contato com projeto pré-selecionado",
    base: P,
    path: "/projetos",
    steps: [],
    check: s(`return {
      cards: $$('main article').length === 12 || $$('main article').length,
      abrir: $$('a').filter((a) => a.textContent.includes('Abrir demonstração')).length === 12,
    };`),
  },
  {
    name: "portfólio: contato com ?projeto=floricultura",
    base: P,
    path: "/contato?projeto=floricultura",
    steps: [s(`await new Promise((r) => setTimeout(r, 500)); return true;`)],
    check: s(`return {
      preSelecionado: $$('select').some((x) => x.value === 'floricultura') || $$('input:checked').some((x) => x.value === 'floricultura') || 'não pré-selecionado',
      semEnvioReal: !$$('form').some((f) => (f.getAttribute('action') || '').startsWith('http')),
    };`),
  },
  {
    name: "barbearia: agendamento completo",
    base: port(1),
    path: "/agendar?servico=combo",
    steps: [
      s(`$('input[name=professional][value=leo]').click(); return true;`),
      s(`click('Continuar', 'main button'); return true;`),
      s(`$$('input[name=time]')[2].click(); return true;`),
      s(`click('Continuar', 'main button'); return true;`),
      s(`click('Confirmar agendamento de demonstração', 'main button'); return true;`),
    ],
    check: s(`return { codigo: /BRV-\\d+/.test(text()) || text().slice(0, 300), salvo: (localStorage.getItem('ax-bravus-demo') || '').includes('BRV-') };`),
  },
  {
    name: "clínica: solicitação de horário",
    base: port(2),
    path: "/solicitar?especialidade=dermatologia",
    steps: [
      s(`$$('input[name=professional]')[1].click(); return true;`),
      s(`click('Continuar', 'main button'); return true;`),
      s(`$$('input[name=date]')[1].click(); return true;`),
      s(`$('input[name=period]').click(); return true;`),
      s(`click('Continuar', 'main button'); return true;`),
      // Revisão: forma de atendimento e primeira consulta são obrigatórias.
      s(`$$('input[name=payment]')[0].click(); $$('input[name=firstVisit]')[0].click(); return true;`),
      s(`click('Enviar solicitação de demonstração', 'main button'); return true;`),
    ],
    check: s(`return { protocolo: /VTA-\\d+/.test(text()) || text().slice(0, 300), semCampoLivre: $$('main textarea, main input[type=file]').length === 0 };`),
  },
  {
    name: "restaurante: carrinho → pedido",
    base: port(3),
    path: "/carrinho",
    storage: {
      "ax-sabor-demo": {
        version: 1,
        nextNumber: 1001,
        fulfillment: { type: "entrega", areaId: "jardim" },
        lines: [
          { key: "a", itemId: "picanha", addons: { ponto: ["ponto"], extras: ["farofa", "vinagrete"] }, quantity: 1, note: "" },
          { key: "c", itemId: "suco", addons: { "sabor-suco": ["maracuja"], "tamanho-suco": ["500"] }, quantity: 2, note: "sem gelo" },
        ],
      },
    },
    steps: [s(`click('Revisar pedido', 'main button'); return true;`), s(`click('Gerar pedido de demonstração', 'main button'); return true;`)],
    check: s(`return { pedido: /SB-\\d+/.test(text()) || text().slice(0, 300), carrinhoVazio: JSON.parse(localStorage.getItem('ax-sabor-demo')).lines.length === 0 };`),
  },
  {
    name: "restaurante: adicionais no cardápio",
    base: port(3),
    path: "/",
    steps: [
      s(`click('Picanha na brasa', 'main button'); return true;`),
      s(`const d = $('dialog[open]'); d.querySelectorAll('input[name="picanha-ponto"]')[1].click(); const x = d.querySelectorAll('input[type=checkbox]'); x[0].click(); x[1].click(); return true;`),
    ],
    check: s(`const d = $('dialog[open]'); return { dialogo: !!d, marcados: d && d.querySelectorAll('input:checked').length >= 3 };`),
  },
  {
    name: "oficina: orçamento com estimativa",
    base: port(4),
    path: "/orcamento",
    steps: [
      s(`$$('input[name=type]')[1].click(); const f = $$('input.field'); setV(f[0], 'Sedã 2.0 automático'); setV(f[1], '2018'); setV(f[2], '92000'); return true;`),
      s(`click('Continuar', 'main button'); return true;`),
      s(`$$('input[name=category]')[0].click(); return true;`),
      s(`const c = $$('main input[type=checkbox]'); c[0].click(); c[1].click(); return true;`),
      s(`click('Continuar', 'main button'); return true;`),
      s(`click('Continuar', 'main button'); return true;`),
      s(`click('Enviar solicitação de demonstração', 'main button'); return true;`),
    ],
    check: s(`return { codigo: /OF-\\d+/.test(text()) || text().slice(0, 300), faixa: /R\\$\\s?[\\d.,]+\\s?(–|a|-)\\s?R\\$/.test(text()) || 'sem faixa' };`),
  },
  {
    name: "Resolve: solicitação com disponibilidade",
    base: port(5),
    path: "/solicitar?servico=eletrica",
    steps: [
      s(`$$('input[name=region]')[0].click(); return true;`),
      s(`click('Continuar', 'main button'); return true;`),
      s(`for (const n of ['problema', 'imovel', 'urgencia']) $('input[name=' + n + ']').click(); return true;`),
      s(`click('Continuar', 'main button'); return true;`),
      s(`const b = $$('main input[type=checkbox]'); b[1].click(); b[2].click(); return true;`),
      s(`click('Gerar solicitação de demonstração', 'main button'); return true;`),
    ],
    check: s(`return { protocolo: /RS-\\d+/.test(text()) || text().slice(0, 300) };`),
  },
  {
    name: "Linha Direta: pedido de proposta com pacote sugerido",
    base: port(6),
    path: "/proposta",
    steps: [
      s(`const f = $('main form'); const x = f.querySelectorAll('select'); setV(x[0], 'ecommerce'); setV(f.querySelector('input[type=number]'), '12'); setV(x[1], 'Até 2 semanas'); setV(x[2], 'R$ 1.000 a R$ 3.000'); setV(f.querySelector('textarea'), 'Linha de 12 cafés especiais.'); return true;`),
      s(`$('main form button[type=submit]').click(); return true;`),
      s(`click('Prévia no WhatsApp', 'button'); return true;`),
    ],
    check: s(`return { previa: dialogText().includes('12') || dialogText().slice(0, 200), semEnvio: dialogText().includes('Nenhuma mensagem foi enviada') };`),
  },
  {
    name: "Almeida & Prado: conversa inicial",
    base: port(7),
    path: "/contato?area=familia",
    steps: [
      s(`$('input[name=subject]').click(); const x = $$('main select')[1]; setV(x, 'Manhã'); return true;`),
      s(`$('main form button[type=submit]').click(); return true;`),
      s(`click('Prévia no WhatsApp', 'button'); return true;`),
    ],
    check: s(`return { previa: dialogText().includes('Almeida') || dialogText().slice(0, 200), semEnvio: dialogText().includes('Nenhuma mensagem foi enviada') };`),
  },
  {
    name: "Horizonte: filtros, favorito e interesse",
    base: port(8),
    path: "/imoveis?finalidade=venda",
    steps: [
      s(`$$('input[name=bedrooms]')[3].click(); return true;`),
      s(`const fav = $$('main button[aria-pressed]')[0]; fav.click(); return true;`),
    ],
    check: s(`const st = JSON.parse(localStorage.getItem('ax-horizonte-demo') || '{}'); return {
      contagem: /\\d+ im[óo]ve(l|is)/i.test(text()) || text().slice(0, 200),
      favorito: Array.isArray(st.codes) && st.codes.length === 1 || JSON.stringify(st),
    };`),
  },
  {
    name: "PetVille: agendamento em 4 etapas",
    base: port(9),
    path: "/agendar",
    steps: [
      s(`setV($('main input:not([type])'), 'Tobias'); $('input[value=cao]').click(); $('input[value=grande]').click(); return true;`),
      s(`click('Continuar', 'main button'); return true;`),
      s(`$('input[value=banho-tosa]').click(); $('input[value=bia]').click(); return true;`),
      s(`click('Continuar', 'main button'); return true;`),
      s(`$('[aria-label="Horários livres"] button').click(); return true;`),
      s(`click('Continuar', 'main button'); return true;`),
      s(`click('Confirmar agendamento', 'main button'); return true;`),
    ],
    check: s(`return { codigo: /PV-\\d+/.test(text()) || text().slice(0, 300), lembrete: text().includes('Lembrete preparado'), valor: text().includes('145,00') || JSON.parse(localStorage.getItem('ax-petville-demo')).appointments[0]?.priceCents === 14500 };`),
  },
  {
    name: "Pulse Studio: reserva de aula experimental",
    base: port(10),
    path: "/aulas",
    steps: [
      s(`byText('Reservar', 'main li button').click(); return true;`),
      s(`setV($('dialog input:not([type])'), 'Jô'); return true;`),
      s(`$('dialog button[type=submit]').click(); return true;`),
    ],
    check: s(`return { fechado: !$('dialog[open]'), reserva: /PS-\\d+/.test(text()) || text().slice(0, 200), bloqueia: text().includes('Você já tem reserva') };`),
  },
  {
    name: "Raiz & Grão: peso, carrinho e pedido",
    base: port(11),
    path: "/produtos/canela-em-po",
    steps: [
      s(`$('input[name=peso][value="250"]').click(); return true;`),
      s(`click('Aumentar', 'main button'); return true;`),
      s(`click('Adicionar ao carrinho', 'main button'); return true;`),
      s(`location.href = '/carrinho'; return true;`),
      s(`await new Promise((r) => setTimeout(r, 1200)); $('input[value=entrega]').click(); return true;`),
      s(`setV($('aside select'), 'centro'); return true;`),
    ],
    check: s(`const dl = $('aside dl').innerText; return { subtotal: dl.includes('29,96') || dl, frete: dl.includes('8,00') || dl, total: dl.includes('37,96') || dl };`),
  },
  {
    name: "Flor & Afeto: personalização até o carrinho",
    base: port(12),
    path: "/produto/buque-campo",
    steps: [
      s(`const b = $$('main input[type=checkbox]'); b[0].click(); b[3].click(); return true;`),
      s(`$('main form button[type=submit]').click(); return true;`),
      s(`setV($('textarea'), 'Feliz aniversário!'); return true;`),
      s(`$('main form button[type=submit]').click(); return true;`),
      s(`$('input[value=entrega]').click(); return true;`),
      s(`setV($('main form select'), 'vila-das-rosas'); return true;`),
      s(`$$('[aria-labelledby=data-label] button')[1].click(); return true;`),
      s(`$('input[name=period][value=manha]').click(); return true;`),
      s(`$('main form button[type=submit]').click(); return true;`),
      s(`setV($('main form input:not([type])'), 'Ana (exemplo)'); return true;`),
      s(`$('main form button[type=submit]').click(); return true;`),
      s(`$('main form button[type=submit]').click(); return true;`),
    ],
    check: s(`const st = JSON.parse(localStorage.getItem('ax-flor-demo')); return { adicionado: text().includes('no carrinho'), item: st.cart.length === 1 || st.cart.length, contador: $('header a[href="/carrinho"]').textContent.includes('1') };`),
  },
  {
    name: "Flor & Afeto: carrinho com entrega agrupada e pedido",
    base: port(12),
    path: "/carrinho",
    storage: {
      "ax-flor-demo": {
        version: 2,
        nextNumber: 1001,
        cart: [
          { productId: "buque-campo", sizeId: "m", addonIds: ["chocolates", "vaso-vidro"], card: "Oi", fulfillment: "entrega", regionId: "jardim-primavera", date: "2026-10-02", period: "tarde", personName: "Ana" },
          { productId: "cesta-cafe", sizeId: "p", addonIds: [], card: "", fulfillment: "entrega", regionId: "jardim-primavera", date: "2026-10-02", period: "tarde", personName: "ana " },
        ],
      },
    },
    steps: [s(`click('Finalizar pedido', 'main button'); return true;`), s(`click('Ver mensagem do pedido', 'main button'); return true;`)],
    check: s(`return { codigo: /FA-1001/.test(text()), total: dialogText().includes('409,60') || dialogText().slice(0, 300), umaEntrega: dialogText().includes('Entregas (1)') };`),
  },
  {
    name: "diálogo: Tab não vai para o conteúdo atrás, Escape (tecla real) fecha e devolve o foco (PetVille)",
    base: port(9),
    path: "/agendamentos",
    storage: {
      "ax-petville-demo": {
        version: 1,
        nextNumber: 1002,
        appointments: [
          { id: "PV-1001", petName: "Tobias", species: "cao", size: "grande", serviceId: "banho-tosa", groomerId: "bia", date: "2026-10-02", startMin: 780, endMin: 915, priceCents: 14500, reminder: true, status: "agendado", origin: "visitor" },
        ],
      },
    },
    steps: [
      s(`const b = byText('Lembrete', 'main button'); b.focus(); b.click(); return true;`),
      s(`window.__abriu = !!$('dialog[open]'); return true;`),
      "KEY:Tab",
      // Com um só controle no diálogo, o Tab pode sair para a interface do navegador (o foco volta ao <body>);
      // o que não pode acontecer é o foco ir para o conteúdo atrás do diálogo modal.
      s(`const a = document.activeElement; window.__focoDentro = !!a.closest('dialog') || a === document.body || a === document.documentElement || ('foi para: ' + a.outerHTML.slice(0, 80)); return true;`),
      "KEY:Escape",
    ],
    check: s(`return { abriu: window.__abriu, focoDentro: window.__focoDentro, fechado: !$('dialog[open]'), foco: document.activeElement.textContent.includes('Lembrete') || document.activeElement.tagName };`),
  },
];

/** Capturas para revisão visual no Firefox (celular e desktop). */
export const shots = [
  { name: "portfolio-inicio-390", base: P, path: "/", width: 390, height: 844 },
  { name: "portfolio-case-1280", base: P, path: "/projetos/floricultura", width: 1280 },
  { name: "barbearia-agendar-390", base: port(1), path: "/agendar?servico=combo", width: 390, height: 844 },
  { name: "restaurante-inicio-1280", base: port(3), path: "/", width: 1280 },
  { name: "academia-aulas-390", base: port(10), path: "/aulas", width: 390, height: 844 },
  { name: "produtos-canela-390", base: port(11), path: "/produtos/canela-em-po", width: 390, height: 844 },
  { name: "floricultura-inicio-1280", base: port(12), path: "/", width: 1280 },
  { name: "petshop-agendar-1280", base: port(9), path: "/agendar", width: 1280 },
];
