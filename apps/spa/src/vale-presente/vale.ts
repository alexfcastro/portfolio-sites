/*
 * Vale-presente — lógica reaproveitável (sem React, sem nada do site em volta).
 * Serve para qualquer negócio de beleza e bem-estar em datas como Dia das Mães e Natal: basta passar outra
 * configuração (ValeConfig). Valores em centavos. Veja o README.md desta pasta.
 */

export interface ExperienciaVale {
  id: string;
  nome: string;
  descricao: string;
  valor: number;
}

export interface ValeConfig {
  /** Nome do negócio, como aparece no cartão e na mensagem. */
  negocio: string;
  experiencias: ExperienciaVale[];
  /** Limites do valor livre. */
  valorMin: number;
  valorMax: number;
  /** Valores sugeridos para o valor livre. */
  sugestoes: number[];
  validadeMeses: number;
  entrega: {
    email: { rotulo: string; detalhe: string; taxa: number };
    impresso: { rotulo: string; detalhe: string; taxa: number };
  };
  /** Limite de caracteres da mensagem pessoal. */
  maxMensagem: number;
}

export type TipoVale = "experiencia" | "valor";
export type Entrega = "email" | "impresso";

export interface Vale {
  tipo: TipoVale;
  experienciaId: string;
  valor: number;
  de: string;
  para: string;
  mensagem: string;
  entrega: Entrega;
  /** E-mail de quem recebe (entrega por e-mail). */
  emailPara: string;
}

export function valeVazio(config: ValeConfig): Vale {
  return {
    tipo: "experiencia",
    experienciaId: config.experiencias[0]?.id ?? "",
    valor: config.sugestoes[1] ?? config.valorMin,
    de: "",
    para: "",
    mensagem: "",
    entrega: "email",
    emailPara: "",
  };
}

/** Valor do presente (sem a taxa de entrega). */
export function valorDoVale(vale: Vale, config: ValeConfig): number {
  if (vale.tipo === "experiencia") return config.experiencias.find((e) => e.id === vale.experienciaId)?.valor ?? 0;
  return vale.valor;
}

export function taxaEntrega(vale: Vale, config: ValeConfig): number {
  return config.entrega[vale.entrega].taxa;
}

export function totalVale(vale: Vale, config: ValeConfig): number {
  return valorDoVale(vale, config) + taxaEntrega(vale, config);
}

/** O que está escrito no cartão como presente ("Ritual Serenidade" ou "R$ 300,00 em experiências"). */
export function tituloDoPresente(vale: Vale, config: ValeConfig): string {
  if (vale.tipo === "experiencia") return config.experiencias.find((e) => e.id === vale.experienciaId)?.nome ?? "";
  return `${formatBRL(vale.valor)} em experiências`;
}

export type ErrosVale = Partial<Record<"presente" | "valor" | "de" | "para" | "mensagem" | "emailPara", string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validarVale(vale: Vale, config: ValeConfig): ErrosVale {
  const erros: ErrosVale = {};
  if (vale.tipo === "experiencia" && !config.experiencias.some((e) => e.id === vale.experienciaId)) erros.presente = "Escolha uma experiência.";
  if (vale.tipo === "valor" && (vale.valor < config.valorMin || vale.valor > config.valorMax)) {
    erros.valor = `Escolha um valor entre ${formatBRL(config.valorMin)} e ${formatBRL(config.valorMax)}.`;
  }
  if (vale.de.trim().length < 2) erros.de = "Escreva quem está dando o presente.";
  if (vale.para.trim().length < 2) erros.para = "Escreva para quem é o presente.";
  if (vale.mensagem.length > config.maxMensagem) erros.mensagem = `A mensagem pode ter até ${config.maxMensagem} caracteres.`;
  if (vale.entrega === "email" && !EMAIL.test(vale.emailPara.trim())) erros.emailPara = "Informe o e-mail de quem vai receber.";
  return erros;
}

/** Validade a partir de uma data (YYYY-MM-DD): mesmo dia, N meses depois. */
export function validade(desde: string, meses: number): string {
  const [ano, mes, dia] = desde.split("-").map(Number) as [number, number, number];
  const total = ano * 12 + (mes - 1) + meses;
  const anoFinal = Math.floor(total / 12);
  const mesFinal = (total % 12) + 1;
  const ultimoDia = new Date(Date.UTC(anoFinal, mesFinal, 0)).getUTCDate();
  return `${anoFinal}-${String(mesFinal).padStart(2, "0")}-${String(Math.min(dia, ultimoDia)).padStart(2, "0")}`;
}

/** Código do vale: 3 blocos legíveis, sem letras que confundem (0/O, 1/I). */
export function codigoVale(semente: number): string {
  const letras = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let n = Math.abs(Math.floor(semente)) || 1;
  let codigo = "";
  for (let i = 0; i < 9; i += 1) {
    n = (n * 1103515245 + 12345) % 2147483648;
    codigo += letras[n % letras.length];
    if (i === 2 || i === 5) codigo += "-";
  }
  return codigo;
}

/** Mensagem pronta para o WhatsApp do negócio, com tudo o que foi montado. */
export function mensagemPedido(vale: Vale, config: ValeConfig): string {
  const linhas = [
    `Olá, ${config.negocio}! Quero um vale-presente.`,
    `Presente: ${tituloDoPresente(vale, config)}`,
    `De: ${vale.de.trim() || "—"} · Para: ${vale.para.trim() || "—"}`,
    `Entrega: ${config.entrega[vale.entrega].rotulo}${vale.entrega === "email" && vale.emailPara.trim() ? ` (${vale.emailPara.trim()})` : ""}`,
    `Total: ${formatBRL(totalVale(vale, config))}`,
  ];
  if (vale.mensagem.trim()) linhas.push(`Mensagem do cartão: "${vale.mensagem.trim()}"`);
  return linhas.join("\n");
}

export function formatBRL(centavos: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(centavos / 100);
}
