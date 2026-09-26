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
    demoStatus: "planned",
    featuredOrder: 2,
    features: [
      planned("Cardápio por categorias", "Navegação rápida entre entradas, pratos, bebidas e sobremesas."),
      planned("Adicionais por item", "Opções compatíveis com cada prato, com preço somado corretamente."),
      planned("Carrinho com total", "Cálculo em centavos, sem erros de arredondamento."),
      planned("Retirada ou entrega", "Campos condicionais conforme a escolha do cliente."),
      planned("Horário de funcionamento", "Informação visível antes de o cliente montar o pedido."),
      planned("Pedido pelo WhatsApp", "Na demo, gera apenas uma prévia local da mensagem."),
    ],
    media: [conceptCover("restaurante", "Sabor & Brasa", "cardápio com categorias e carrinho em tons de vermelho-brasa, com versão de celular.")],
    technologies: [],
    seo: {
      title: "Sabor & Brasa — case conceitual de cardápio digital",
      description:
        "Projeto conceitual de cardápio digital com adicionais, carrinho e resumo do pedido. Restaurante fictício, demo em breve.",
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
    demoStatus: "planned",
    featuredOrder: null,
    features: [
      planned("Formulário de triagem", "Perguntas em etapas, adaptadas ao tipo de problema."),
      planned("Dados do veículo", "Campos objetivos que evitam idas e vindas."),
      planned("Fotos com prévia local", "Seleção de imagens limitada por tipo e tamanho, sem upload real."),
      planned("Serviços oferecidos", "Lista clara do que a oficina realiza."),
      planned("Acompanhamento demonstrativo", "Etapas simuladas do orçamento até a entrega."),
    ],
    media: [conceptCover("oficina", "Torque Auto Center", "formulário de orçamento com dados do veículo em grafite e laranja, com versão de celular.")],
    technologies: [],
    seo: {
      title: "Torque Auto Center — case conceitual de orçamento para oficina",
      description:
        "Projeto conceitual de site para oficina com triagem de orçamento, dados do veículo e fotos. Negócio fictício, demo em breve.",
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
    demoStatus: "planned",
    featuredOrder: null,
    features: [
      planned("Catálogo de serviços", "Cada tipo de serviço com o que está incluído."),
      planned("Verificação de região", "Evita solicitações de locais não atendidos."),
      planned("Descrição guiada", "Perguntas que ajudam o cliente a explicar o problema."),
      planned("Portfólio de trabalhos", "Exemplos ilustrativos identificados como demonstrativos."),
      planned("Disponibilidade", "Escolha de período preferido para visita técnica."),
    ],
    media: [conceptCover("servicos", "Resolve Serviços", "seleção de tipo de serviço e região em azul-petróleo e amarelo, com versão de celular.")],
    technologies: [],
    seo: {
      title: "Resolve Serviços — case conceitual para prestadores de serviço",
      description:
        "Projeto conceitual de site para prestadores de serviço com solicitação por tipo, região e descrição. Negócio fictício, demo em breve.",
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
    demoStatus: "planned",
    featuredOrder: null,
    features: [
      planned("Apresentação profissional", "Posicionamento, área de atuação e forma de trabalho."),
      planned("Serviços descritos", "O que está incluído em cada serviço oferecido."),
      planned("Portfólio organizado", "Trabalhos agrupados por tipo, com descrição."),
      planned("Pedido de proposta", "Formulário que reúne escopo e expectativas do cliente."),
      planned("Redes configuráveis", "Links para perfis exibidos apenas quando informados."),
      planned("Perguntas frequentes", "Respostas sobre prazos, formatos e atendimento."),
    ],
    media: [conceptCover("autonomo", "Linha Direta Profissional", "página pessoal com portfólio e formulário de proposta em tons de areia e tinta, com versão de celular.")],
    technologies: [],
    seo: {
      title: "Linha Direta Profissional — case conceitual para autônomos",
      description:
        "Projeto conceitual de site para profissional autônomo com portfólio, serviços e pedido de proposta. Perfil fictício, demo em breve.",
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
    demoStatus: "planned",
    featuredOrder: null,
    features: [
      planned("Páginas por área de atuação", "Estrutura preparada para conteúdo e busca orgânica."),
      planned("Perfis da equipe", "Apresentação fictícia, sem registros profissionais inventados."),
      planned("Artigos informativos", "Conteúdos organizados por tema."),
      planned("Contato para conversa inicial", "Formulário simulado, sem envio real."),
      planned("Avisos e privacidade", "Espaço para textos legais revisados antes de uso real."),
    ],
    media: [conceptCover("advocacia", "Almeida & Prado Advocacia", "página institucional com áreas de atuação em azul-marinho e marfim, com versão de celular.")],
    technologies: [],
    seo: {
      title: "Almeida & Prado Advocacia — case conceitual de site institucional",
      description:
        "Projeto conceitual de site institucional para advocacia com áreas de atuação e conteúdo informativo. Escritório fictício, demo em breve.",
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
    demoStatus: "planned",
    featuredOrder: 3,
    features: [
      planned("Busca e filtros combinados", "Finalidade, tipo, bairro, preço e quartos."),
      planned("Página do imóvel", "Galeria, características e descrição completa."),
      planned("Favoritos demonstrativos", "Lista salva apenas no navegador do visitante."),
      planned("Interesse com código do imóvel", "O corretor sabe exatamente qual imóvel interessou."),
      planned("Anuncie seu imóvel", "Formulário para proprietários, simulado na demo."),
      planned("Perfil do corretor", "Apresentação da equipe fictícia."),
    ],
    media: [conceptCover("imobiliaria", "Horizonte Imóveis", "busca de imóveis com filtros e cards de resultados em azul-horizonte, com versão de celular.")],
    technologies: [],
    seo: {
      title: "Horizonte Imóveis — case conceitual de busca de imóveis",
      description:
        "Projeto conceitual de site para imobiliária com busca, filtros, páginas de imóvel e formulário de interesse. Negócio fictício, demo em breve.",
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
    demoStatus: "planned",
    featuredOrder: null,
    features: [
      planned("Cadastro básico do pet", "Espécie e porte definem serviços e duração."),
      planned("Serviços e pacotes", "Planos demonstrativos com valores fictícios."),
      planned("Agendamento com data e horário", "Somente horários compatíveis com o serviço."),
      planned("Galeria", "Fotos ilustrativas do espaço e dos serviços."),
      planned("Lembrete preparado", "Estrutura pronta para uma futura integração de lembretes."),
    ],
    media: [conceptCover("petshop", "PetVille", "cadastro do pet e escolha de serviço em tons de coral e creme, com versão de celular.")],
    technologies: [],
    seo: {
      title: "PetVille — case conceitual de agendamento para pet shop",
      description:
        "Projeto conceitual de site para pet shop com cadastro do pet, serviços e agendamento. Negócio fictício, demo em breve.",
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
    demoStatus: "planned",
    featuredOrder: null,
    features: [
      planned("Modalidades e professores", "Apresentação de cada aula e de quem a conduz."),
      planned("Grade de horários", "Consulta por dia e por modalidade, fácil de atualizar."),
      planned("Aula experimental", "Agendamento simulado para a turma escolhida."),
      planned("Planos", "Comparação clara entre planos demonstrativos."),
      planned("Painel da grade", "Gestão simples de horários na demo."),
    ],
    media: [conceptCover("academia", "Pulse Studio", "grade de aulas por modalidade em preto e verde-limão, com versão de celular.")],
    technologies: [],
    seo: {
      title: "Pulse Studio — case conceitual de site para academia",
      description:
        "Projeto conceitual de site para estúdio fitness com modalidades, grade de horários e aula experimental. Negócio fictício, demo em breve.",
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
    demoStatus: "planned",
    featuredOrder: null,
    features: [
      planned("Catálogo por categorias", "Navegação entre dezenas de categorias típicas."),
      planned("Venda por peso", "Frações de peso com regra de arredondamento explícita."),
      planned("Carrinho com vários itens", "Totais em centavos, sem erros de cálculo."),
      planned("Informações do produto", "Uso, conservação, origem e alergênicos, sem alegações de saúde."),
      planned("Kits e promoções", "Seleções temáticas demonstrativas."),
      planned("Pedido pelo WhatsApp", "Na demo, gera apenas uma prévia local da mensagem."),
    ],
    media: [conceptCover("produtos-naturais", "Raiz & Grão", "catálogo com seleção de peso e carrinho em verde-oliva e terracota, com versão de celular.")],
    technologies: [],
    seo: {
      title: "Raiz & Grão — case conceitual de catálogo a granel",
      description:
        "Projeto conceitual de catálogo para loja de produtos naturais com venda por peso e carrinho. Loja fictícia, demo em breve.",
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
