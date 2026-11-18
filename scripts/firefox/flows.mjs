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
/** Demos no catálogo (as 12 originais e as de beleza já prontas). */
const TOTAL_DEMOS = 19;

// Data de entrega dos pedidos de teste: a próxima sexta-feira a pelo menos 2 dias de hoje (datas fixas vencem).
const proximaSexta = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  while (d.getDay() !== 5) d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
})();
const port = (n) => `http://localhost:${3100 + n}`;

export const flows = [
  {
    name: "portfólio: listagem com todas as demos, 7 landing pages e contato com projeto pré-selecionado",
    base: P,
    path: "/projetos",
    steps: [],
    check: s(`return {
      cards: $$('main article').filter((a) => !a.closest('#landing-pages')).length === ${TOTAL_DEMOS} || $$('main article').length,
      landings: $$('#landing-pages article').length === 7 || $$('#landing-pages article').length,
      abrir: $$('a').filter((a) => a.textContent.includes('Abrir demonstração')).length === ${TOTAL_DEMOS},
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
      // Escolhe um dia seguinte com horários livres (hoje pode já não ter, dependendo da hora do teste).
      s(`const dias = $$('input[name=date]:not(:disabled)'); dias[Math.min(1, dias.length - 1)].click(); return true;`),
      s(`$$('input[name=time]:not(:disabled)')[2].click(); return true;`),
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
          { productId: "buque-campo", sizeId: "m", addonIds: ["chocolates", "vaso-vidro"], card: "Oi", fulfillment: "entrega", regionId: "jardim-primavera", date: proximaSexta, period: "tarde", personName: "Ana" },
          { productId: "cesta-cafe", sizeId: "p", addonIds: [], card: "", fulfillment: "entrega", regionId: "jardim-primavera", date: proximaSexta, period: "tarde", personName: "ana " },
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
  {
    name: "Linha Fina: comparador e avaliação com micropigmentação anterior",
    base: port(14),
    path: "/?procedimento=fio-a-fio",
    steps: [
      s(`const r = $('main input[type=range]'); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(r, '20'); r.dispatchEvent(new Event('input', { bubbles: true })); return true;`),
      s(`await new Promise((r) => setTimeout(r, 300)); window.__comparador = $('main input[type=range]').value === '20'; $$('input[name=anterior]')[1].click(); return true;`),
      s(`await new Promise((r) => setTimeout(r, 300)); $$('input[name=tempo]')[2].click(); $$('input[name=cor]')[1].click(); return true;`),
      s(`await new Promise((r) => setTimeout(r, 300)); window.__sugestao = text().includes('avaliar uma correção'); click('Avaliar correção', 'main button'); return true;`),
      s(`await new Promise((r) => setTimeout(r, 300)); $$('#campo-horario .grid button:not([disabled])')[0].click(); setV($('#nome'), 'Cláudia'); setV($('#whatsapp'), '11977776666'); return true;`),
      s(`await new Promise((r) => setTimeout(r, 300)); click('Reservar avaliação', 'main button'); return true;`),
    ],
    check: s(`await new Promise((r) => setTimeout(r, 400)); return {
      comparador: window.__comparador,
      sugeriuCorrecao: window.__sugestao,
      confirmada: /LF-\\d{5}/.test(text()) || text().slice(0, 200),
      procedimento: text().includes('Correção de trabalho antigo'),
      salvo: (localStorage.getItem('ax-linha-fina-demo') || '').includes('correcao'),
    };`),
  },
  {
    name: "Clínica Núcleo: montador de protocolo e avaliação com o resumo",
    base: port(15),
    path: "/",
    steps: [
      s(`localStorage.removeItem('ax-nucleo-demo'); await new Promise((r) => setTimeout(r, 300)); $$('input[name=objetivo]')[0].click(); return true;`),
      s(`await new Promise((r) => setTimeout(r, 300)); $$('input[name=pos-operatorio-cirurgia]')[0].click(); $$('input[name=pos-operatorio-dias]')[1].click(); $$('input[name=pos-operatorio-liberacao]')[1].click(); return true;`),
      s(`await new Promise((r) => setTimeout(r, 300)); window.__protocolo = text().includes('10 sessões') && text().includes('1.275,00') && text().includes('liberação de quem operou'); return true;`),
      s(`$$('#campo-horario .grid button:not([disabled])')[0].click(); setV($('#nome'), 'Paula'); setV($('#whatsapp'), '11966665555'); return true;`),
      s(`await new Promise((r) => setTimeout(r, 300)); click('Reservar avaliação', 'main button'); return true;`),
    ],
    check: s(`await new Promise((r) => setTimeout(r, 400)); return {
      protocolo: window.__protocolo,
      confirmada: /NC-\\d{5}/.test(text()) || text().slice(0, 200),
      levouResumo: text().includes('Drenagem linfática pós-operatória'),
      salvo: (localStorage.getItem('ax-nucleo-demo') || '').includes('NC-'),
    };`),
  },
  {
    name: "Lash Lab: porta da aluna e reserva de vaga que reduz a contagem",
    base: port(16),
    path: "/",
    steps: [
      s(`localStorage.removeItem('ax-lash-lab-demo'); await new Promise((r) => setTimeout(r, 300)); click('Quero aprender', 'main button'); return true;`),
      s(`await new Promise((r) => setTimeout(r, 500)); window.__antes = text().includes('2 de 3 restantes'); window.__semCliente = !text().includes('Quatro técnicas'); return true;`),
      s(`setV($('#nome'), 'Bia Souza'); setV($('#whatsapp'), '11955554444'); $$('input[name=experiencia]')[0].click(); $$('input[name=pagamento]')[1].click(); return true;`),
      s(`await new Promise((r) => setTimeout(r, 300)); click('Reservar minha vaga', 'main button'); return true;`),
    ],
    check: s(`await new Promise((r) => setTimeout(r, 500)); return {
      contagemInicial: window.__antes,
      soCaminhoDaAluna: window.__semCliente,
      reservada: /CT-\\d{5}/.test(text()) || text().slice(0, 200),
      vagaSaiu: text().includes('1 de 3 restante'),
      urlComCaminho: location.search.includes('caminho=aluna'),
    };`),
  },
  {
    name: "Ateliê Véu: grupo da noiva, data livre e pedido de orçamento",
    base: port(17),
    path: "/",
    steps: [
      s(`localStorage.removeItem('ax-atelie-veu-demo'); await new Promise((r) => setTimeout(r, 300)); window.__antes = text().includes('Comecem às 11:30'); $$('#montador button').filter((b) => b.textContent.includes('Mais uma'))[1].click(); return true;`),
      s(`await new Promise((r) => setTimeout(r, 300)); window.__depois = (text().includes('5 pessoas') && text().includes('2 cabeleireiras')) || text().slice(text().indexOf('Grupo'), text().indexOf('Grupo') + 60); const livre = $$('#disponibilidade button[aria-pressed]').filter((b) => !b.disabled); livre[0].click(); return true;`),
      s(`await new Promise((r) => setTimeout(r, 300)); setV($('#nome'), 'Aline'); setV($('#whatsapp'), '11944443333'); click('Pedir orçamento', 'main button'); return true;`),
    ],
    check: s(`await new Promise((r) => setTimeout(r, 400)); return {
      calculoInicial: window.__antes,
      recalculou: window.__depois,
      pedido: /AV-\\d{5}/.test(text()) || text().slice(0, 200),
      resumoComGrupo: text().includes('3 madrinhas: cabelo e maquiagem'),
      salvo: (localStorage.getItem('ax-atelie-veu-demo') || '').includes('AV-'),
    };`),
  },
  {
    name: "Meia-Lua: foto do catálogo, montador e plano de manutenção",
    base: port(18),
    path: "/",
    steps: [
      s(`localStorage.removeItem('ax-meia-lua-demo'); await new Promise((r) => setTimeout(r, 300)); click('Stiletto', '#catalogo button'); return true;`),
      s(`await new Promise((r) => setTimeout(r, 300)); window.__filtro = $('#catalogo [role=status]').textContent.trim(); $$('#catalogo button').find((b) => b.textContent.includes('Quero esta')).click(); return true;`),
      s(`await new Promise((r) => setTimeout(r, 500)); window.__montado = text().includes('Combinação da foto Cromado longo') && /R\\$\\s285,00/.test(text()); $$('input[name=plano]')[1].click(); return true;`),
      s(`await new Promise((r) => setTimeout(r, 300)); $$('#campo-horario .grid button:not([disabled])')[0].click(); setV($('#nome'), 'Júlia'); setV($('#whatsapp'), '11933332222'); return true;`),
      s(`await new Promise((r) => setTimeout(r, 300)); click('Reservar plano', 'main button'); return true;`),
    ],
    check: s(`await new Promise((r) => setTimeout(r, 400)); return {
      filtro: window.__filtro === '1 inspiração' || window.__filtro,
      montado: window.__montado,
      plano: /ML-\\d{5}/.test(text()) || text().slice(0, 200),
      proximasDatas: text().includes('Suas próximas manutenções'),
      salvo: (localStorage.getItem('ax-meia-lua-demo') || '').includes('ML-'),
    };`),
  },
  {
    name: "Fio Nobre: questionário com orientação e avaliação agendada",
    base: port(19),
    path: "/",
    steps: [
      s(`localStorage.removeItem('ax-fio-nobre-demo'); await new Promise((r) => setTimeout(r, 300)); const refazer = $$('#questionario button').find((b) => b.textContent.includes('Refazer')); if (refazer) refazer.click(); return true;`),
      s(`const escolhas = [1, 0, 0, 1, 0, 0]; for (const i of escolhas) { await new Promise((r) => setTimeout(r, 250)); $$('#questionario fieldset button')[i].click(); } return true;`),
      s(`await new Promise((r) => setTimeout(r, 400)); window.__orientacao = text().includes('Tratamento para a queda e para o fio') && text().includes('Isto não é um diagnóstico') && text().includes('passar também com um médico'); $$('#campo-horario .grid button:not([disabled])')[0].click(); setV($('#nome'), 'Marta'); setV($('#whatsapp'), '11922221111'); return true;`),
      s(`await new Promise((r) => setTimeout(r, 300)); click('Reservar avaliação', 'main button'); return true;`),
    ],
    check: s(`await new Promise((r) => setTimeout(r, 400)); return {
      orientacao: window.__orientacao,
      reservada: /FN-\\d{5}/.test(text()) || text().slice(0, 200),
      salvo: (localStorage.getItem('ax-fio-nobre-demo') || '').includes('FN-'),
    };`),
  },
  {
    name: "Casa Serena: vale-presente com valor livre, prévia do cartão e finalização",
    base: port(20),
    path: "/",
    steps: [
      s(`localStorage.removeItem('ax-casa-serena-demo'); await new Promise((r) => setTimeout(r, 300)); const f = $('#vale-presente form'); const radios = [...f.querySelectorAll('input[type=radio]')]; radios[4].click(); return true;`),
      s(`await new Promise((r) => setTimeout(r, 300)); click('R$ 500,00', '#vale-presente button'); const f = $('#vale-presente form'); const campos = [...f.querySelectorAll('input:not([type=radio]), textarea')]; setV(campos.find((c) => c.placeholder === 'Ex.: Mãe'), 'Mãe'); setV(campos.find((c) => c.placeholder === 'Ex.: Ana e Pedro'), 'Ana'); const t = f.querySelector('textarea'); Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(t, 'Para você descansar.'); t.dispatchEvent(new Event('input', { bubbles: true })); setV(campos.find((c) => c.type === 'email'), 'mae@exemplo.com.br'); return true;`),
      s(`await new Promise((r) => setTimeout(r, 300)); window.__previa = $('#vale-presente figure').textContent.includes('Para você descansar.') && $('#vale-presente figure').textContent.includes('500,00 em experiências'); click('Finalizar vale-presente', '#vale-presente button'); return true;`),
    ],
    check: s(`await new Promise((r) => setTimeout(r, 400)); return {
      previaAoVivo: window.__previa,
      pronto: text().includes('Vale-presente pronto') || text().slice(0, 200),
      codigo: /[A-Z2-9]{3}-[A-Z2-9]{3}-[A-Z2-9]{3}/.test($('#vale-presente').textContent),
      salvo: (localStorage.getItem('ax-casa-serena-demo') || '').includes('validoAte'),
    };`),
  },
  {
    name: "Volume Perfeito: parcelamento e reserva de vaga que reduz a contagem",
    base: port(13),
    path: "/volume-perfeito",
    steps: [
      s(`localStorage.removeItem('ax-volume-perfeito-demo'); await new Promise((r) => setTimeout(r, 400)); window.__antes = text().includes('4 de 6 vagas'); const sel = $$('#reserva select')[0]; Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set.call(sel, '6'); sel.dispatchEvent(new Event('change', { bubbles: true })); return true;`),
      s(`await new Promise((r) => setTimeout(r, 300)); window.__parcela = /6× de R\\$\\s498,33/.test(text()); const campos = $$('#reserva input:not([type=radio])'); setV(campos[0], 'Kelly'); setV(campos[1], '11911110000'); click('Reservar minha vaga', '#reserva button'); return true;`),
    ],
    check: s(`await new Promise((r) => setTimeout(r, 400)); return {
      contagemInicial: window.__antes,
      parcela: window.__parcela,
      reservada: /VP-\\d{5}/.test(text()) || text().slice(0, 200),
      vagaSaiu: text().includes('3 de 6 vagas'),
    };`),
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
