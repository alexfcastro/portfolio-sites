import type { Project, ProjectFeature, ProjectMedia } from "@/types/project";

/*
 * Matriz única dos projetos conceituais. Todos os negócios são fictícios.
 * Demos implementadas: barbearia (Fase 2) e as da Fase 3 conforme forem validadas. As demais estão `planned`, com
 * recursos “previstos” e prévias conceituais.
 * Para adicionar um case: inclua um item aqui e a capa em public/projects/<slug>/.
 */

function planned(title: string, description: string): ProjectFeature {
  return { title, description, status: "planned" };
}

function implemented(title: string, description: string): ProjectFeature {
  return { title, description, status: "implemented" };
}

/** Captura real de uma demo implementada (gerada por scripts/capture-screenshots.mjs). */
function screenshot(
  slug: string,
  file: string,
  size: { width: number; height: number },
  alt: string,
  caption: string,
): ProjectMedia {
  return { src: `/projects/${slug}/${file}`, alt, ...size, kind: "screenshot", caption };
}

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 780, height: 1688 };

/** Stack comum das demos implementadas (cada uma é um app Next.js independente). */
const DEMO_STACK = ["Next.js", "React", "TypeScript", "Tailwind CSS"];

function conceptCover(slug: string, name: string, description: string): ProjectMedia {
  return {
    src: `/projects/${slug}/cover.svg`,
    alt: `Prévia conceitual do site ${name}: ${description}`,
    width: 1600,
    height: 1000,
    kind: "concept",
    caption: "Prévia conceitual — composição ilustrativa, não é captura de um sistema em funcionamento.",
  };
}

export const projects: Project[] = [
  {
    slug: "barbearia",
    name: "Bravus Barbearia",
    categoryId: "servicos",
    solutionIds: ["agendamento", "painel"],
    isConceptual: true,
    audience: "Barbearias e salões com agenda por profissional",
    summary: "Agendamento on-line com escolha de serviço, barbeiro e horário, sem troca longa de mensagens.",
    problem:
      "Em muitas barbearias, marcar um horário depende de conversas no WhatsApp que se estendem: o cliente pergunta o preço, depois quem está livre, depois qual horário sobra. Enquanto isso, o barbeiro interrompe o atendimento para responder, e horários vagos ficam sem ser preenchidos.",
    solution:
      "Um site com identidade forte que mostra serviços, duração e valores de forma clara e conduz o cliente por um agendamento em poucos passos. A equipe acompanha os horários marcados em um painel simples.",
    flow: [
      { title: "Serviço", description: "O cliente escolhe corte, barba ou combo, vendo duração e valor." },
      { title: "Profissional", description: "Aparecem apenas os barbeiros que realizam aquele serviço." },
      { title: "Horário", description: "A agenda mostra somente horários livres para a duração escolhida." },
      { title: "Resumo", description: "Serviço, profissional, data e valor são revisados antes de confirmar." },
    ],
    demoStatus: "available",
    featuredOrder: 1,
    features: [
      implemented(
        "Agendamento em etapas",
        "Serviço, profissional, data e horário, com o horário revalidado no momento de confirmar.",
      ),
      implemented(
        "Agenda sem conflitos",
        "Bloqueia horários passados, pausa de almoço, fechamento e sobreposição para o mesmo profissional.",
      ),
      implemented("Serviços com duração e preço", "Valores em centavos e duração visíveis antes de escolher."),
      implemented(
        "Painel demonstrativo",
        "Filtros por período, profissional e situação; concluir, cancelar, reativar e restaurar a agenda.",
      ),
      implemented("Equipe, galeria e avaliações", "Profissionais fictícios, estilos ilustrados e avaliações marcadas como fictícias."),
      implemented("Prévia de mensagem no WhatsApp", "Mostra a mensagem de confirmação sem enviar nada nem ter destinatário real."),
    ],
    media: [
      screenshot(
        "barbearia",
        "desktop-inicio.png",
        DESKTOP,
        "Página inicial da demo Bravus Barbearia no computador: título “Seu horário, sem espera”, botão Agendar horário e faixa de projeto demonstrativo no topo.",
        "Página inicial da demonstração (computador).",
      ),
      screenshot(
        "barbearia",
        "desktop-agendamento.png",
        DESKTOP,
        "Etapa de data e horário no computador: faixa de datas com dias lotados e fechados e grade de horários livres, com um horário selecionado.",
        "Escolha de data e horário: só aparecem horários livres para a duração do serviço.",
      ),
      screenshot(
        "barbearia",
        "mobile-agendamento.png",
        MOBILE,
        "Etapa de data e horário no celular: datas roláveis na horizontal, horários livres e botão Continuar.",
        "O mesmo fluxo no celular.",
      ),
      screenshot(
        "barbearia",
        "desktop-painel.png",
        DESKTOP,
        "Painel demonstrativo com totais, filtros por período, profissional e situação e a lista de agendamentos fictícios.",
        "Painel demonstrativo: público, sem login, com dados deste navegador.",
      ),
    ],
    technologies: DEMO_STACK,
    seo: {
      title: "Bravus Barbearia — case e demo de agendamento on-line",
      description:
        "Case de site para barbearia com agendamento por serviço, profissional e horário e painel demonstrativo. Negócio fictício, demo com dados de exemplo.",
    },
  },
  {
    slug: "clinica",
    name: "Vita Clínica",
    categoryId: "saude-bem-estar",
    solutionIds: ["agendamento", "institucional"],
    isConceptual: true,
    audience: "Clínicas e consultórios com mais de uma especialidade",
    summary: "Organização das especialidades e solicitação de horário com informações claras sobre o atendimento.",
    problem:
      "Pacientes costumam ligar só para descobrir quais especialidades a clínica atende, quais profissionais estão disponíveis e como funciona o primeiro atendimento. A recepção repete as mesmas informações o dia inteiro e as solicitações chegam incompletas.",
    solution:
      "Um site sereno e bem organizado que apresenta especialidades, profissionais e orientações de atendimento. O visitante solicita um horário escolhendo especialidade e profissional, e a equipe confirma depois.",
    flow: [
      { title: "Especialidade", description: "O paciente parte do que procura, não de uma lista de nomes." },
      { title: "Profissional", description: "Perfis com formação e forma de atendimento, sem dados inventados." },
      { title: "Solicitação", description: "Preferência de período e contato, sem pedir sintomas ou documentos." },
    ],
    demoStatus: "available",
    featuredOrder: 5,
    features: [
      implemented("Páginas de especialidades", "Uma página por área: para quem é, como se preparar e quem atende."),
      implemented("Perfis dos profissionais", "Equipe fictícia com abordagem e dias de atendimento, sem registros inventados."),
      implemented(
        "Solicitação de horário",
        "Especialidade, profissional ou primeiro disponível, dia e período — só opções em que há atendimento.",
      ),
      implemented("Acompanhamento", "Solicitações do navegador com confirmação simulada da recepção e cancelamento."),
      implemented("Informações de atendimento e dúvidas", "Como funciona, horários, particular ou convênio e perguntas frequentes."),
      implemented("Sem dados de saúde", "Nenhum campo para sintomas, exames ou documentos; identidade de paciente de exemplo."),
    ],
    media: [
      screenshot(
        "clinica",
        "desktop-inicio.png",
        DESKTOP,
        "Página inicial da demo Vita Clínica no computador: título “Cuidado com hora marcada e informação clara” e botão Solicitar horário.",
        "Página inicial da demonstração (computador).",
      ),
      screenshot(
        "clinica",
        "desktop-solicitacao.png",
        DESKTOP,
        "Etapa de preferência da solicitação: dias em que a dermatologista atende e escolha entre manhã e tarde.",
        "Preferência de dia e período: só aparecem os dias em que o profissional atende.",
      ),
      screenshot(
        "clinica",
        "mobile-solicitacao.png",
        MOBILE,
        "Escolha de especialidade no celular, com Psicologia selecionada.",
        "Escolha de especialidade no celular.",
      ),
      screenshot(
        "clinica",
        "desktop-especialidade.png",
        DESKTOP,
        "Página da especialidade Fisioterapia: para quem é, como se preparar e quem atende.",
        "Página de especialidade com orientações de preparo.",
      ),
    ],
    technologies: DEMO_STACK,
    seo: {
      title: "Vita Clínica — case e demo de site para clínica",
      description:
        "Case de site para clínica com páginas de especialidades, equipe e solicitação de horário sem dados de saúde. Negócio fictício, demo com dados de exemplo.",
    },
  },
  {
    slug: "restaurante",
    name: "Sabor & Brasa",
    categoryId: "alimentacao",
    solutionIds: ["catalogo", "pedidos"],
    isConceptual: true,
    audience: "Restaurantes, churrascarias e deliveries próprios",
    summary: "Cardápio digital com adicionais e carrinho que organiza o pedido antes de chegar ao atendimento.",
    problem:
      "Pedidos feitos por mensagem chegam desorganizados: falta o adicional, o endereço vem depois, o cliente pergunta o preço de cada item. Nos horários de pico, isso gera erros na cozinha e demora para responder.",
    solution:
      "Um cardápio apetitoso, dividido por categorias, em que o cliente monta o pedido com adicionais e observações e escolhe retirada ou entrega. O resumo chega pronto, com itens e valores calculados.",
    flow: [
      { title: "Cardápio", description: "Categorias, fotos e preços, com destaque para promoções do dia." },
      { title: "Adicionais", description: "Ponto da carne, acompanhamentos e observações por item." },
      { title: "Carrinho", description: "Quantidades e total atualizados a cada alteração." },
      { title: "Resumo", description: "Retirada ou entrega, com o pedido organizado para envio." },
    ],
    demoStatus: "available",
    featuredOrder: 2,
    features: [
      implemented("Cardápio por categorias", "Carnes, acompanhamentos, bebidas e sobremesas, com navegação fixa por categoria."),
      implemented("Adicionais por item", "Só os grupos que valem para cada prato, com obrigatórios, limite de escolhas e preço somado."),
      implemented("Carrinho com total", "Mesma configuração vira uma linha só; quantidades e totais calculados em centavos."),
      implemented("Retirada ou entrega", "Bairro e taxa só aparecem na entrega, com pedido mínimo verificado."),
      implemented("Horário de funcionamento", "Tabela de turnos e indicação de aberto/fechado pelo horário de Brasília."),
      implemented("Pedido pelo WhatsApp", "Gera um código e a prévia local da mensagem do pedido, sem envio."),
    ],
    media: [
      screenshot("restaurante", "desktop-cardapio.png", DESKTOP, "Cardápio da demo Sabor & Brasa no computador: categorias fixas no topo e cards de pratos com preço e botão Adicionar.", "Cardápio por categorias (computador)."),
      screenshot("restaurante", "desktop-adicionais.png", DESKTOP, "Diálogo de adicionais da picanha: ponto da carne obrigatório, dois acompanhamentos extras marcados e total atualizado.", "Adicionais com obrigatórios, limite e total atualizado na hora."),
      screenshot("restaurante", "mobile-adicionais.png", MOBILE, "Diálogo do suco natural no celular com sabor maracujá e tamanho 500 ml escolhidos.", "Escolha de adicionais no celular."),
      screenshot("restaurante", "desktop-carrinho.png", DESKTOP, "Carrinho com três itens, entrega no bairro Jardim das Palmeiras, taxa e total.", "Carrinho com entrega: bairro, taxa e total."),
    ],
    technologies: DEMO_STACK,
    seo: {
      title: "Sabor & Brasa — case e demo de cardápio digital",
      description: "Case de cardápio digital com adicionais, carrinho, retirada ou entrega e resumo do pedido. Restaurante fictício, demo com dados de exemplo.",
    },
  },
  {
    slug: "oficina",
    name: "Torque Auto Center",
    categoryId: "automotivo",
    solutionIds: ["orcamento"],
    isConceptual: true,
    audience: "Oficinas mecânicas e centros automotivos",
    summary: "Triagem de orçamento com dados do veículo, tipo de problema e fotos antes da visita.",
    problem:
      "Pedidos de orçamento chegam como “meu carro está fazendo um barulho”. Sem modelo, ano ou descrição do sintoma, a oficina precisa de várias mensagens para entender o caso e não consegue dar uma primeira orientação.",
    solution:
      "Um site direto e confiável que conduz o cliente por uma triagem: veículo, tipo de problema, descrição e fotos. A oficina recebe as informações organizadas e responde com mais precisão.",
    flow: [
      { title: "Veículo", description: "Marca, modelo, ano e quilometragem aproximada." },
      { title: "Problema", description: "Categorias como freios, suspensão, motor ou revisão." },
      { title: "Fotos", description: "Seleção e prévia local das imagens, sem envio na demo." },
      { title: "Orçamento", description: "Resumo da solicitação e acompanhamento simulado." },
    ],
    demoStatus: "available",
    featuredOrder: null,
    features: [
      implemented("Formulário de triagem", "Quatro etapas — veículo, problema, fotos e resumo — com validação em cada uma."),
      implemented("Dados do veículo", "Tipo, marca e modelo, ano e quilometragem, com limites plausíveis."),
      implemented("Sintomas por categoria", "Freios, suspensão, motor, elétrica, ar-condicionado e revisão, com perguntas objetivas."),
      implemented("Fotos com prévia local", "Até 4 fotos JPG, PNG ou WebP de até 5 MB, só no navegador; nada é enviado."),
      implemented("Estimativa inicial", "Faixa demonstrativa somada a partir dos serviços prováveis para os sintomas marcados."),
      implemented("Acompanhamento demonstrativo", "Seis etapas, do recebimento ao carro pronto, avançadas por simulação."),
    ],
    media: [
      screenshot("oficina", "desktop-inicio.png", DESKTOP, "Página inicial da demo Torque Auto Center: título “Conte o problema. A gente já chega sabendo.” e as quatro etapas do orçamento.", "Página inicial da demonstração (computador)."),
      screenshot("oficina", "desktop-estimativa.png", DESKTOP, "Resumo do orçamento com dados do veículo, sintomas de freio e estimativa inicial de R$ 440 a R$ 900 detalhada por serviço.", "Resumo com estimativa inicial detalhada por serviço."),
      screenshot("oficina", "mobile-fotos.png", MOBILE, "Etapa de fotos no celular com três prévias locais e contador “3 de 4 fotos”.", "Fotos com prévia local no celular (nada é enviado)."),
      screenshot("oficina", "desktop-acompanhamento.png", DESKTOP, "Acompanhamento com duas solicitações em etapas diferentes, de “Solicitação recebida” a “Pronto para retirada”.", "Acompanhamento demonstrativo das solicitações."),
    ],
    technologies: DEMO_STACK,
    seo: {
      title: "Torque Auto Center — case e demo de orçamento para oficina",
      description: "Case de site para oficina com triagem de orçamento, fotos em prévia local, estimativa inicial e acompanhamento. Oficina fictícia, demo com dados de exemplo.",
    },
  },
  {
    slug: "servicos",
    name: "Resolve Serviços",
    categoryId: "servicos",
    solutionIds: ["orcamento"],
    isConceptual: true,
    audience: "Eletricistas, pintores, técnicos e equipes de manutenção",
    summary: "Solicitação de serviço com região atendida, descrição do problema e disponibilidade.",
    problem:
      "Quem presta serviços em domicílio perde tempo com pedidos fora da região atendida ou sem informação suficiente para estimar o trabalho. O primeiro contato vira uma sequência de perguntas antes de qualquer orçamento.",
    solution:
      "Um site que apresenta os serviços com exemplos de trabalhos realizados e filtra a solicitação desde o início: tipo de serviço, região, descrição e melhor período para visita.",
    flow: [
      { title: "Serviço", description: "Elétrica, pintura, manutenção, ar-condicionado ou instalação." },
      { title: "Região", description: "Verificação da área atendida antes de seguir." },
      { title: "Descrição", description: "Detalhes do problema e fotos com prévia local." },
      { title: "Solicitação", description: "Resumo com disponibilidade preferida para a visita." },
    ],
    demoStatus: "available",
    featuredOrder: null,
    features: [
      implemented("Catálogo de serviços", "Elétrica, pintura, manutenção, ar-condicionado e hidráulica, com o que cada um inclui."),
      implemented("Verificação de região", "Regiões atendidas com taxa de deslocamento; fora da área, o pedido não segue."),
      implemented("Descrição guiada", "Perguntas específicas de cada serviço e urgência, com detalhes opcionais."),
      implemented("Portfólio de trabalhos", "Trabalhos ilustrativos por tipo de serviço, identificados como exemplos."),
      implemented("Disponibilidade", "Até três opções de dia e período para a visita, sem domingos e só manhã aos sábados."),
      implemented("Solicitação sem dados pessoais", "Gera um protocolo e a prévia local da mensagem; o navegador guarda só o contador."),
    ],
    media: [
      screenshot("servicos", "desktop-inicio.png", DESKTOP, "Página inicial da demo Resolve Serviços: título “Diga o que precisa. A gente chega preparado.” e botões Pedir orçamento e Ver regiões atendidas.", "Página inicial da demonstração (computador)."),
      screenshot("servicos", "desktop-regiao.png", DESKTOP, "Etapa de região: Zona Sul selecionada com a confirmação de atendimento e a taxa de deslocamento; regiões não atendidas marcadas.", "Verificação de região antes de seguir."),
      screenshot("servicos", "mobile-detalhes.png", MOBILE, "Perguntas guiadas de hidráulica no celular: problema “Vazamento” e local “Cozinha” selecionados.", "Descrição guiada no celular."),
      screenshot("servicos", "desktop-disponibilidade.png", DESKTOP, "Escolha de disponibilidade com três opções de dia e período marcadas e as demais desabilitadas.", "Até três opções de dia e período para a visita."),
    ],
    technologies: DEMO_STACK,
    seo: {
      title: "Resolve Serviços — case e demo para prestadores de serviço",
      description: "Case de site para prestador de serviços com verificação de região, perguntas guiadas e disponibilidade para visita. Negócio fictício, demo com dados de exemplo.",
    },
  },
  {
    slug: "autonomo",
    name: "Linha Direta Profissional",
    categoryId: "profissionais",
    solutionIds: ["institucional", "orcamento"],
    isConceptual: true,
    audience: "Fotógrafos, designers, consultores, professores e outros autônomos",
    summary: "Endereço digital próprio para apresentar trabalho, serviços e receber pedidos de proposta.",
    problem:
      "Muitos autônomos dependem só do Instagram e do WhatsApp. O trabalho fica espalhado entre publicações, os serviços não estão explicados em lugar nenhum e cada pedido de proposta começa do zero.",
    solution:
      "Um site pessoal com posicionamento claro, serviços bem descritos, portfólio organizado e um formulário de proposta que reúne as informações necessárias para responder com agilidade.",
    flow: [
      { title: "Apresentação", description: "Quem é o profissional e para quem ele trabalha." },
      { title: "Portfólio", description: "Trabalhos organizados por tipo, com contexto de cada um." },
      { title: "Proposta", description: "Formulário com escopo, prazo desejado e orçamento aproximado." },
    ],
    demoStatus: "available",
    featuredOrder: null,
    features: [
      implemented("Apresentação profissional", "Posicionamento claro, quem é a profissional e para quem trabalha."),
      implemented("Serviços descritos", "O que cada serviço inclui, com valor de referência demonstrativo."),
      implemented("Portfólio organizado", "Trabalhos filtráveis por tipo, com contexto de cada um (composições ilustrativas)."),
      implemented("Pedido de proposta", "Escopo, quantidade, prazo e investimento, com validação e mensagem pronta."),
      implemented("Pacote sugerido", "Estimativa por volume com desconto progressivo, calculada em centavos."),
      implemented("Redes configuráveis e dúvidas", "Links de redes só quando informados (nenhum inventado) e perguntas frequentes."),
    ],
    media: [
      screenshot("autonomo", "desktop-inicio.png", DESKTOP, "Página inicial da demo de profissional autônoma: título “Imagens que ajudam pequenas marcas a vender” e composições de produtos.", "Apresentação da profissional (computador)."),
      screenshot("autonomo", "desktop-portfolio.png", DESKTOP, "Seção de portfólio com filtros por tipo de trabalho e cards de trabalhos com contexto.", "Portfólio filtrável por tipo de trabalho."),
      screenshot("autonomo", "mobile-proposta.png", MOBILE, "Formulário de pedido de proposta no celular, preenchido com tipo de trabalho, quantidade, prazo e investimento.", "Pedido de proposta no celular."),
      screenshot("autonomo", "desktop-proposta.png", DESKTOP, "Pedido de proposta com o pacote sugerido “Completo” e a faixa de valor ao lado.", "Pacote sugerido atualizado conforme o escopo."),
    ],
    technologies: DEMO_STACK,
    seo: {
      title: "Linha Direta Profissional — case e demo para autônomos",
      description: "Case de site para profissional autônomo com apresentação, serviços, portfólio filtrável e pedido de proposta. Profissional fictícia, demo com dados de exemplo.",
    },
  },
  {
    slug: "advocacia",
    name: "Almeida & Prado Advocacia",
    categoryId: "profissionais",
    solutionIds: ["institucional"],
    isConceptual: true,
    audience: "Advogados autônomos e escritórios de advocacia",
    summary: "Site institucional sóbrio, com áreas de atuação e conteúdo informativo bem estruturado.",
    problem:
      "Escritórios precisam transmitir seriedade e explicar suas áreas de atuação sem recorrer a linguagem publicitária. Muitos sites acabam genéricos, desatualizados ou difíceis de ler no celular.",
    solution:
      "Um site elegante e discreto, com páginas por área de atuação, perfis da equipe e artigos informativos. O contato é apresentado de forma direta, sem promessas de resultado.",
    flow: [
      { title: "Área de atuação", description: "O visitante encontra a área que corresponde à sua dúvida." },
      { title: "Informação", description: "Conteúdo explicativo, sem sensacionalismo." },
      { title: "Contato", description: "Formulário simulado para solicitar uma conversa inicial." },
    ],
    demoStatus: "available",
    featuredOrder: null,
    features: [
      implemented("Páginas por área de atuação", "Uma página por área, com temas frequentes, quem atende e leituras relacionadas."),
      implemented("Perfis da equipe", "Equipe fictícia com áreas de atuação, sem números de registro inventados."),
      implemented("Artigos informativos", "Textos gerais por tema, com aviso de que não substituem análise individual."),
      implemented("Contato para conversa inicial", "Área, assunto e período, sem nomes, documentos ou detalhes do processo; nada é enviado."),
      implemented("Avisos e privacidade", "Página própria sobre o caráter informativo do conteúdo e o tratamento de dados."),
      implemented("Linguagem sem promessas", "Teste automático varre o conteúdo contra promessa de resultado, comparação e depoimentos."),
    ],
    media: [
      screenshot("advocacia", "desktop-inicio.png", DESKTOP, "Página inicial da demo Almeida & Prado: título “Orientação jurídica clara, com atenção a cada caso” sobre fundo azul-marinho.", "Página inicial institucional (computador)."),
      screenshot("advocacia", "desktop-area.png", DESKTOP, "Página da área Sucessões e Inventário, com temas frequentes, quem atende e artigo relacionado.", "Página de área de atuação."),
      screenshot("advocacia", "mobile-artigo.png", MOBILE, "Artigo “Quando o inventário pode ser feito em cartório” no celular.", "Artigo informativo no celular."),
      screenshot("advocacia", "desktop-contato.png", DESKTOP, "Formulário de conversa inicial com área, assunto e período, e aviso para não incluir dados do processo.", "Pedido de conversa inicial sem dados sensíveis."),
    ],
    technologies: DEMO_STACK,
    seo: {
      title: "Almeida & Prado Advocacia — case e demo de site institucional",
      description: "Case de site institucional para advocacia com páginas por área, equipe, artigos e contato para conversa inicial, sem promessas de resultado. Escritório fictício.",
    },
  },
  {
    slug: "imobiliaria",
    name: "Horizonte Imóveis",
    categoryId: "imoveis",
    solutionIds: ["catalogo"],
    isConceptual: true,
    audience: "Imobiliárias e corretores de imóveis",
    summary: "Busca com filtros, páginas de imóvel e registro de interesse ligado ao imóvel escolhido.",
    problem:
      "Quem procura imóvel quer filtrar por bairro, preço e número de quartos antes de falar com alguém. Quando o site não permite isso, o corretor recebe perguntas genéricas e perde tempo com imóveis que não interessam ao cliente.",
    solution:
      "Um site com busca por finalidade, tipo, localização, faixa de preço e quartos, galerias amplas e um formulário de interesse que já identifica o imóvel visitado.",
    flow: [
      { title: "Busca", description: "Venda ou aluguel, tipo de imóvel e localização." },
      { title: "Filtros", description: "Faixa de preço e quartos, com contagem de resultados." },
      { title: "Imóvel", description: "Galeria, características e localização ilustrativa." },
      { title: "Interesse", description: "Formulário que já leva o código do imóvel escolhido." },
    ],
    demoStatus: "available",
    featuredOrder: 3,
    features: [
      implemented("Busca e filtros combinados", "Finalidade, tipo, bairro, faixa de preço e quartos, com busca por texto e ordenação."),
      implemented("Página do imóvel", "Galeria (fachada, sala e quarto), características, descrição e localização ilustrativa."),
      implemented("Favoritos demonstrativos", "Imóveis salvos só neste navegador, sem cadastro."),
      implemented("Interesse com código do imóvel", "Motivo e período, com a mensagem já levando o código do imóvel."),
      implemented("Anuncie seu imóvel", "Formulário para proprietários, sem endereço, documentos ou contato."),
      implemented("Perfil dos corretores", "Equipe fictícia, sem registros profissionais inventados."),
    ],
    media: [
      screenshot("imobiliaria", "desktop-inicio.png", DESKTOP, "Página inicial da demo Horizonte Imóveis com busca por finalidade e texto e imóveis em destaque.", "Página inicial com busca (computador)."),
      screenshot("imobiliaria", "desktop-busca.png", DESKTOP, "Busca de imóveis à venda com o filtro de 3 quartos ou mais, quatro resultados e um imóvel marcado como favorito.", "Filtros combinados com contagem de resultados."),
      screenshot("imobiliaria", "mobile-imovel.png", MOBILE, "Página de um apartamento no celular, com galeria, código do imóvel e características.", "Página do imóvel no celular."),
      screenshot("imobiliaria", "desktop-imovel.png", DESKTOP, "Página do sobrado com a imagem da sala na galeria e o formulário de interesse ao lado.", "Galeria e interesse com código do imóvel."),
    ],
    technologies: DEMO_STACK,
    seo: {
      title: "Horizonte Imóveis — case e demo de busca de imóveis",
      description: "Case de site para imobiliária com busca e filtros combinados, página do imóvel, favoritos e interesse com código. Imobiliária fictícia, demo com dados de exemplo.",
    },
  },
  {
    slug: "petshop",
    name: "PetVille",
    categoryId: "servicos",
    solutionIds: ["agendamento"],
    isConceptual: true,
    audience: "Pet shops, banho e tosa e clínicas veterinárias",
    summary: "Agendamento de banho e tosa que começa pelo pet: espécie, porte e serviço adequado.",
    problem:
      "No pet shop, o horário depende do animal: porte, tipo de pelo e serviço mudam a duração e o preço. Sem essas informações, o agendamento por mensagem vira um questionário e erros de encaixe são comuns.",
    solution:
      "Um site acolhedor em que o tutor cadastra os dados básicos do pet e vê apenas serviços e horários compatíveis. O resumo reúne tutor, animal, serviço e data.",
    flow: [
      { title: "Pet", description: "Nome, espécie e porte do animal." },
      { title: "Serviço", description: "Banho, tosa ou pacotes compatíveis com o porte." },
      { title: "Data", description: "Horários livres considerando a duração do serviço." },
      { title: "Resumo", description: "Revisão completa antes da confirmação simulada." },
    ],
    demoStatus: "available",
    featuredOrder: null,
    features: [
      implemented("Cadastro do pet", "Nome, espécie e porte, com validação e mensagens de erro claras."),
      implemented("Serviços compatíveis", "Só aparecem os serviços para a espécie; gatos não recebem tosa."),
      implemented("Tempo e preço pelo porte", "Duração ajustada ao porte em blocos de 15 minutos e preço por porte, em centavos."),
      implemented("Data e horário livres", "Horários que comportam a duração, sem sobreposição com a agenda do profissional."),
      implemented("Lembrete preparado", "Resumo com lembrete para a véspera, só exibido como prévia, nunca enviado."),
      implemented("Galeria e pacotes", "Ilustrações de exemplo e pacotes informativos, sem fotos de clientes."),
    ],
    media: [
      screenshot("petshop", "desktop-inicio.png", DESKTOP, "Página inicial da demo PetVille com chamada para agendar banho e tosa e ilustrações de um cachorro e um gato.", "Página inicial (computador)."),
      screenshot("petshop", "desktop-servico.png", DESKTOP, "Etapa de serviço do agendamento para um cachorro de porte médio, com preço e tempo de cada serviço e a profissional Bia selecionada.", "Serviços com preço e tempo pelo porte."),
      screenshot("petshop", "mobile-horario.png", MOBILE, "Escolha de dia e horário no celular, com dias fechados desativados e horários livres em grade.", "Data e horário no celular."),
      screenshot("petshop", "desktop-confirmacao.png", DESKTOP, "Confirmação do agendamento de demonstração com código e lembrete preparado para a véspera.", "Confirmação com lembrete preparado."),
    ],
    technologies: DEMO_STACK,
    seo: {
      title: "PetVille — case e demo de agendamento para pet shop",
      description: "Case de site para pet shop com agendamento por pet, porte e serviço, horários livres e lembrete preparado. Pet shop fictício, demo com dados de exemplo.",
    },
  },
  {
    slug: "academia",
    name: "Pulse Studio",
    categoryId: "saude-bem-estar",
    solutionIds: ["agendamento", "painel"],
    isConceptual: true,
    audience: "Academias, estúdios de treino e personal trainers",
    summary: "Grade de aulas por modalidade e agendamento de aula experimental para novos alunos.",
    problem:
      "Interessados querem saber quais modalidades existem, em que horários acontecem e como experimentar antes de se matricular. Quando a grade está só em uma imagem nas redes sociais, a informação fica difícil de consultar e de manter atualizada.",
    solution:
      "Um site energético com modalidades, professores e uma grade de horários consultável, que termina no agendamento de uma aula experimental para a turma escolhida.",
    flow: [
      { title: "Modalidade", description: "Funcional, pilates, dança ou treino de força." },
      { title: "Grade", description: "Dias e horários da modalidade, com vagas demonstrativas." },
      { title: "Aula experimental", description: "Solicitação para a turma escolhida, com confirmação simulada." },
    ],
    demoStatus: "available",
    featuredOrder: null,
    features: [
      implemented("Modalidades e professores", "Seis modalidades com intensidade e quatro professores fictícios, sem registros inventados."),
      implemented("Grade filtrável", "Filtros por dia, modalidade, professor e período, com contagem de resultados."),
      implemented("Aula experimental com vagas", "Reserva com apelido e nível; aulas lotadas ou a menos de 30 minutos do início não aceitam reserva."),
      implemented("Uma reserva por pessoa", "Só uma aula experimental ativa por vez, com cancelamento e prévia da mensagem."),
      implemented("Planos", "Três planos de exemplo, sem contratação nem pagamento."),
      implemented("Painel da recepção", "Ocupação de cada aula por dia e reservas experimentais com presença e cancelamento."),
    ],
    media: [
      screenshot("academia", "desktop-inicio.png", DESKTOP, "Página inicial da demo Pulse Studio, em preto e verde-limão, com chamada para aula experimental e números do estúdio.", "Página inicial (computador)."),
      screenshot("academia", "desktop-grade.png", DESKTOP, "Grade de aulas filtrada pelo período da noite, com uma aula experimental de dança reservada em destaque e vagas por aula.", "Grade filtrável com reserva em destaque."),
      screenshot("academia", "mobile-reserva.png", MOBILE, "Janela de reserva de aula experimental no celular, com apelido, nível de experiência e vagas restantes.", "Reserva de aula experimental no celular."),
      screenshot("academia", "desktop-painel.png", DESKTOP, "Painel com indicadores da semana, tabela de ocupação das aulas de segunda-feira e a reserva experimental.", "Painel com ocupação por aula."),
    ],
    technologies: DEMO_STACK,
    seo: {
      title: "Pulse Studio — case e demo de grade de aulas para academia",
      description: "Case de site para academia com grade de aulas filtrável, aula experimental com controle de vagas, planos e painel de ocupação. Academia fictícia, demo com dados de exemplo.",
    },
  },
  {
    slug: "produtos-naturais",
    name: "Raiz & Grão",
    categoryId: "comercio",
    solutionIds: ["catalogo", "pedidos"],
    isConceptual: true,
    audience: "Casas de produtos naturais e lojas a granel",
    summary: "Catálogo amplo com venda por peso, unidade ou pacote e carrinho com preço atualizado.",
    problem:
      "Lojas de produtos naturais vendem centenas de itens em unidades diferentes: gramas, pacotes, potes. Em uma lista de preços ou por mensagem, o cliente não consegue calcular o valor do pedido e o atendimento vira uma calculadora.",
    solution:
      "Um catálogo organizado por categorias, com busca e filtros, em que cada produto indica sua unidade de venda. Ao escolher 100 g, 250 g ou 1 kg, o preço se atualiza, e o carrinho reúne vários itens em um único pedido.",
    flow: [
      { title: "Produto", description: "Busca e filtros entre chás, grãos, castanhas e temperos." },
      { title: "Unidade ou peso", description: "100 g, 250 g, 500 g, 1 kg, pacote ou unidade." },
      { title: "Quantidade", description: "Preço recalculado a cada alteração." },
      { title: "Carrinho", description: "Retirada ou entrega, com resumo do pedido." },
    ],
    demoStatus: "available",
    featuredOrder: null,
    features: [
      implemented("Catálogo por categorias", "Dez categorias com busca sem acento, filtros por característica e promoção, e ordenação."),
      implemented("Venda por peso", "100 g, 250 g, 500 g ou 1 kg em gramas inteiras, com preço pelo quilo arredondado ao centavo (meio centavo para cima)."),
      implemented("Carrinho com vários itens", "Mesmo produto e peso somam quantidade; totais, economia e peso total em centavos e gramas."),
      implemented("Retirada ou entrega", "Retirada sem taxa ou entrega por bairro fictício, com frete grátis acima de um valor mínimo."),
      implemented("Informações do produto", "Uso, conservação, origem, ingredientes e alergênicos, sem alegações de saúde (verificado em teste)."),
      implemented("Kits, promoções e favoritos", "Kits temáticos, preços promocionais, estoque demonstrativo e favoritos salvos só no navegador."),
    ],
    media: [
      screenshot("produtos-naturais", "desktop-inicio.png", DESKTOP, "Página inicial da demo Raiz & Grão, em verde-oliva e linho, com a chamada para comprar por peso e ilustrações de um saquinho a granel e um pote de mel.", "Página inicial (computador)."),
      screenshot("produtos-naturais", "desktop-catalogo.png", DESKTOP, "Catálogo filtrado por produtos sem glúten e ordenado pelo menor preço, com a lentilha em promoção e preços por 100 g.", "Catálogo com filtros e ordenação."),
      screenshot("produtos-naturais", "mobile-produto.png", MOBILE, "Página da canela em pó no celular, com a opção de 250 g selecionada, quantidade 2 e total do item atualizado.", "Escolha de peso e quantidade no celular."),
      screenshot("produtos-naturais", "desktop-carrinho.png", DESKTOP, "Carrinho com três itens, entrega para um bairro fictício, subtotal, taxa de entrega, total e quanto falta para a entrega grátis.", "Carrinho com entrega por bairro."),
    ],
    technologies: DEMO_STACK,
    seo: {
      title: "Raiz & Grão — case e demo de catálogo a granel",
      description: "Case de catálogo para loja de produtos naturais com venda por peso, carrinho em centavos e retirada ou entrega por bairro. Loja fictícia, demo com dados de exemplo.",
    },
  },
  {
    slug: "floricultura",
    name: "Flor & Afeto",
    categoryId: "comercio",
    solutionIds: ["catalogo", "pedidos"],
    isConceptual: true,
    audience: "Floriculturas e lojas de presentes",
    summary: "Compra por ocasião com personalização, mensagem do cartão e data de entrega.",
    problem:
      "Uma encomenda de flores envolve muitos detalhes: tamanho do arranjo, adicionais, texto do cartão, data, período e dados de quem recebe. Por mensagem, esses detalhes se perdem, e um erro na data ou no endereço estraga a surpresa.",
    solution:
      "Uma experiência visual e delicada, organizada por ocasião, que guia a personalização passo a passo e termina com um resumo completo do pedido antes de qualquer envio.",
    flow: [
      { title: "Produto", description: "Buquês, arranjos e cestas por ocasião e faixa de preço." },
      { title: "Personalização", description: "Tamanho, adicionais e mensagem do cartão." },
      { title: "Data", description: "Entrega ou retirada, data e período." },
      { title: "Resumo", description: "Revisão completa, com prévia local da mensagem do pedido." },
    ],
    demoStatus: "planned",
    featuredOrder: 4,
    features: [
      planned("Catálogo por ocasião", "Aniversário, romance, maternidade, condolências e mais."),
      planned("Personalização do pedido", "Tamanho, adicionais e texto do cartão."),
      planned("Data e período de entrega", "Com opção de retirada na loja."),
      planned("Dados do destinatário", "Campos condicionais à forma de entrega."),
      planned("Resumo do pedido", "Tudo revisado antes da prévia local da mensagem."),
    ],
    media: [conceptCover("floricultura", "Flor & Afeto", "página de buquê com personalização e mensagem do cartão em rosa-antigo e verde-sálvia, com versão de celular.")],
    technologies: [],
    seo: {
      title: "Flor & Afeto — case conceitual de floricultura on-line",
      description:
        "Projeto conceitual de site para floricultura com personalização, mensagem do cartão e data de entrega. Loja fictícia, demo em breve.",
    },
  },
];

export const projectSlugs: readonly string[] = projects.map((project) => project.slug);

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects
    .filter((project) => project.featuredOrder !== null)
    .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0));
}

export function getCaseUrl(slug: string): string {
  return `/projetos/${slug}`;
}
