import type { Project, ProjectFeature, ProjectMedia } from "@/types/project";

/*
 * Matriz única dos projetos conceituais. Todos os negócios são fictícios.
 * As demos estão implementadas, com recursos implementados e capturas reais em public/projects/<slug>/.
 * Um case novo começa como `planned`, com recursos `status: "planned"` e mídia `kind: "concept"`.
 */

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
      implemented("Equipe, galeria e avaliações", "Profissionais fictícios, estilos em fotos geradas por IA e avaliações marcadas como fictícias."),
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
      screenshot("restaurante", "desktop-cardapio.png", DESKTOP, "Página inicial da demo Sabor & Brasa no computador: foto da churrasqueira em brasa, título “Da brasa para a sua mesa” e botão Ver cardápio.", "Página inicial da demonstração (computador)."),
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
      implemented("Portfólio de trabalhos", "Fotos de trabalhos geradas por IA, por tipo de serviço, identificadas como exemplos."),
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
      implemented("Portfólio organizado", "Trabalhos filtráveis por tipo, com contexto de cada um (fotos ilustrativas geradas por IA)."),
      implemented("Pedido de proposta", "Escopo, quantidade, prazo e investimento, com validação e mensagem pronta."),
      implemented("Pacote sugerido", "Estimativa por volume com desconto progressivo, calculada em centavos."),
      implemented("Redes configuráveis e dúvidas", "Links de redes só quando informados (nenhum inventado) e perguntas frequentes."),
    ],
    media: [
      screenshot("autonomo", "desktop-inicio.png", DESKTOP, "Página inicial da demo de profissional autônoma: título “Imagens que ajudam pequenas marcas a vender” e fotos de produtos.", "Apresentação da profissional (computador)."),
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
    featuredOrder: 6,
    features: [
      implemented("Cadastro do pet", "Nome, espécie e porte, com validação e mensagens de erro claras."),
      implemented("Serviços compatíveis", "Só aparecem os serviços para a espécie; gatos não recebem tosa."),
      implemented("Tempo e preço pelo porte", "Duração ajustada ao porte em blocos de 15 minutos e preço por porte, em centavos."),
      implemented("Data e horário livres", "Horários que comportam a duração, sem sobreposição com a agenda do profissional."),
      implemented("Lembrete preparado", "Resumo com lembrete para a véspera, só exibido como prévia, nunca enviado."),
      implemented("Galeria e pacotes", "Ilustrações de exemplo e pacotes informativos, sem fotos de clientes."),
    ],
    media: [
      screenshot("petshop", "desktop-inicio.png", DESKTOP, "Página inicial da demo PetVille com chamada para agendar banho e tosa e fotos de um cachorro e de um gato.", "Página inicial (computador)."),
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
      screenshot("produtos-naturais", "desktop-inicio.png", DESKTOP, "Página inicial da demo Raiz & Grão, em verde-oliva e linho, com a chamada para comprar por peso e fotos de uma tigela de granola e de um pote de mel.", "Página inicial (computador)."),
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
      { title: "Carrinho", description: "Vários presentes num pedido, com revisão completa e prévia local da mensagem." },
    ],
    demoStatus: "available",
    featuredOrder: 4,
    features: [
      implemented("Catálogo por ocasião", "Aniversário, amor, maternidade, agradecimento e condolências, com filtros por tipo, faixa de preço e busca."),
      implemented("Personalização do pedido", "Tamanho e adicionais; adicionais incompatíveis ficam desativados (por exemplo, balão em arranjo de condolências)."),
      implemented("Mensagem do cartão", "Até 200 caracteres e 6 linhas, com contador e prévia do cartão."),
      implemented("Data e período de entrega", "Entrega por bairro fictício ou retirada; sem domingos, e pedidos para hoje só à tarde e até as 11h."),
      implemented("Dados do destinatário", "Só um nome fictício, conforme entrega ou retirada; sem telefone nem endereço."),
      implemented("Carrinho e resumo", "Vários presentes num pedido; mesmo destino e horário pagam uma entrega só; revisão completa antes da prévia da mensagem."),
    ],
    media: [
      screenshot("floricultura", "desktop-inicio.png", DESKTOP, "Página inicial da demo Flor & Afeto, em rosa-antigo e verde-sálvia, com a foto de um buquê de rosas em moldura arredondada.", "Página inicial (computador)."),
      screenshot("floricultura", "desktop-catalogo.png", DESKTOP, "Catálogo filtrado pela ocasião aniversário, com fotos de buquês e de um arranjo e preços a partir do menor tamanho.", "Catálogo por ocasião."),
      screenshot("floricultura", "mobile-cartao.png", MOBILE, "Etapa de mensagem do cartão no celular, com contador de caracteres, prévia do cartão e valor parcial do pedido.", "Mensagem do cartão no celular."),
      screenshot("floricultura", "desktop-carrinho.png", DESKTOP, "Carrinho com dois presentes para a mesma pessoa, bairro, dia e período, cobrando uma única entrega, e o resumo com o total.", "Carrinho com entrega agrupada."),
    ],
    technologies: DEMO_STACK,
    seo: {
      title: "Flor & Afeto — case e demo de floricultura on-line",
      description: "Case de site para floricultura com catálogo por ocasião, personalização, mensagem do cartão, data e período de entrega e resumo. Loja fictícia, demo com dados de exemplo.",
    },
  },
  {
    slug: "sobrancelhas",
    name: "Studio Linha Fina",
    categoryId: "beleza",
    solutionIds: ["agendamento", "institucional"],
    isConceptual: true,
    audience: "Designers de sobrancelhas, micropigmentadoras e estúdios de beleza que atendem com hora marcada",
    summary: "Comparador de antes e depois e marcação de avaliação que já pergunta sobre micropigmentação anterior.",
    tryIt: "Arraste a linha sobre a foto, escolha um procedimento e marque a avaliação contando se já fez micropigmentação.",
    problem:
      "Micropigmentação é um procedimento no rosto que dura meses. A cliente tem medo de errar, pesquisa muito antes e só marca quando vê resultado de verdade e entende o processo. Quem já tem um trabalho antigo ainda chega sem saber se dá para corrigir.",
    solution:
      "Uma página em que as fotos são protagonistas: comparador de antes e depois do mesmo rosto, galeria por tipo de sobrancelha, explicação da avaliação e dos cuidados, e uma marcação que pergunta sobre pigmento antigo e já orienta o que a profissional precisa saber.",
    flow: [
      { title: "Comparar", description: "Arrastar a linha sobre a foto e ver o antes e o depois do mesmo rosto." },
      { title: "Escolher", description: "Ver duração, durabilidade e faixa de preço de cada procedimento." },
      { title: "Contar o histórico", description: "Informar se já tem micropigmentação, há quanto tempo e a cor de hoje." },
      { title: "Marcar a avaliação", description: "Escolher dia e horário livres e enviar o resumo pronto pelo WhatsApp." },
    ],
    demoStatus: "available",
    featuredOrder: null,
    features: [
      implemented("Comparador de antes e depois", "Linha arrastável sobre o mesmo rosto, que funciona com mouse, dedo e teclado (fotos ilustrativas geradas por IA)."),
      implemented("Galeria por tipo de sobrancelha", "Casos com falhas, ralos, assimétricos e correção de trabalho antigo, cada um com o que foi feito."),
      implemented("Procedimentos com faixa de preço", "Duração, quanto tempo dura e o que está incluído, com valores de referência demonstrativos."),
      implemented("Histórico de micropigmentação", "Quem já fez responde tempo, cor e remoção; a página indica correção quando a cor está alterada."),
      implemented("Marcação de avaliação", "Dias de terça a sábado e horários livres, com validação e resumo ao lado."),
      implemented("Mensagem pronta para o WhatsApp", "Prévia com procedimento, histórico e horário escolhidos (nada é enviado)."),
    ],
    considerations: [
      "As fotos são o elemento principal: o comparador está no topo, antes de qualquer texto longo.",
      "O comparador é um controle deslizante de verdade por baixo da foto: dá para usar pelo teclado e o leitor de tela anuncia a posição.",
      "No celular, arrastar na horizontal move a linha e arrastar na vertical continua rolando a página.",
      "Pigmento antigo muda a avaliação: a página pergunta tempo, cor e remoção, e explica por que isso importa.",
      "Preços aparecem em faixas, com o aviso de que o valor exato sai na avaliação; não há promessa de resultado.",
      "Depoimentos e fotos são exemplos marcados como tal, para não serem confundidos com resultados reais.",
    ],
    media: [
      screenshot("sobrancelhas", "desktop-inicio.png", DESKTOP, "Página inicial do Studio Linha Fina: título “Sobrancelhas que parecem suas. Só que completas.” e o comparador de antes e depois ao lado.", "Topo com o comparador de antes e depois (computador)."),
      screenshot("sobrancelhas", "desktop-galeria.png", DESKTOP, "Galeria de antes e depois com os tipos de sobrancelha à esquerda e o comparador do caso escolhido.", "Galeria separada por tipo de sobrancelha."),
      screenshot("sobrancelhas", "mobile-avaliacao.png", MOBILE, "Marcação de avaliação no celular, com a pergunta sobre micropigmentação anterior respondida e as perguntas de tempo e cor.", "Histórico de micropigmentação no celular."),
      screenshot("sobrancelhas", "desktop-avaliacao.png", DESKTOP, "Formulário de avaliação preenchido, com horário escolhido e o resumo ao lado listando o que a profissional precisa saber.", "Resumo da avaliação com as orientações."),
    ],
    technologies: DEMO_STACK,
    seo: {
      title: "Studio Linha Fina — case e demo de site para sobrancelhas e micropigmentação",
      description: "Case de site para estúdio de sobrancelhas com comparador de antes e depois, procedimentos com faixa de preço e marcação de avaliação. Negócio fictício, demo com dados de exemplo.",
    },
  },
  {
    slug: "estetica",
    name: "Clínica Núcleo",
    categoryId: "beleza",
    solutionIds: ["orcamento", "agendamento"],
    isConceptual: true,
    audience: "Clínicas e esteticistas que vendem tratamentos em pacote de sessões",
    summary: "Montador de protocolo que mostra sessões, intervalo e investimento total antes da avaliação.",
    tryIt: "Escolha um objetivo, responda duas ou três perguntas e agende a avaliação levando o protocolo montado.",
    problem:
      "Quase tudo em estética é vendido em pacote, mas a cliente não sabe quantas sessões precisa nem quanto vai gastar no total, e desiste quando não encontra essa resposta. Quem acabou de operar tem pressa e quer saber se já pode começar.",
    solution:
      "Um montador de protocolo que, a partir do objetivo e de poucas perguntas, mostra número de sessões, intervalo, duração e investimento total do pacote, com avisos honestos sobre limites e liberação médica. O resumo vai junto para o agendamento da avaliação.",
    flow: [
      { title: "Objetivo", description: "Recuperação pós-operatória, manchas, flacidez ou acne." },
      { title: "Perguntas", description: "Duas ou três perguntas curtas sobre o caso." },
      { title: "Protocolo", description: "Sessões, intervalo, semanas e investimento total do pacote." },
      { title: "Avaliação", description: "Dia e horário, com o resumo do protocolo na mensagem do WhatsApp." },
    ],
    demoStatus: "available",
    featuredOrder: null,
    features: [
      implemented("Montador de protocolo", "Quatro objetivos com perguntas próprias e protocolo calculado na hora."),
      implemented("Investimento do pacote", "Total com desconto por faixa de sessões e parcelamento, em valores de demonstração."),
      implemented("Pós-operatório com prazo", "Quando começar a drenagem por tipo de cirurgia, sempre condicionado à liberação do cirurgião."),
      implemented("Avisos sem promessa", "Limites de cada tratamento (ex.: melasma tem controle, não cura) e indicação de dermatologista quando cabe."),
      implemented("Agendamento com resumo", "A avaliação leva o protocolo montado; prévia da mensagem no WhatsApp (nada é enviado)."),
      implemented("Equipe e estrutura", "Esteticistas com formação e espaço reservado para o número de registro real."),
    ],
    considerations: [
      "O preço aparece como total do pacote, não só por sessão: é a dúvida que faz a cliente desistir.",
      "Nenhuma promessa de resultado. Cada protocolo traz os próprios limites e a frase de que o plano final sai na avaliação.",
      "No pós-operatório, a página nunca diz para começar sem liberação médica e oferece reservar a agenda antes da cirurgia.",
      "Os números de registro profissional ficam como espaço reservado: um site real mostra os números verdadeiros, nunca inventados.",
      "O protocolo montado fica salvo no navegador e aparece no agendamento, para a cliente não repetir tudo.",
      "Fotos discretas, com o corpo coberto, adequadas ao tom de clínica séria.",
    ],
    media: [
      screenshot("estetica", "desktop-inicio.png", DESKTOP, "Página inicial da Clínica Núcleo: título “Saiba quantas sessões e quanto vai investir, antes de começar.” e foto da sala de atendimento.", "Abertura com a proposta do montador (computador)."),
      screenshot("estetica", "desktop-protocolo.png", DESKTOP, "Montador com o objetivo de recuperação pós-operatória escolhido e o protocolo ao lado: 10 sessões, intervalo e investimento total.", "Protocolo montado com sessões e investimento."),
      screenshot("estetica", "mobile-protocolo.png", MOBILE, "Montador no celular, com as perguntas de manchas respondidas e o resultado do protocolo.", "Montador de protocolo no celular."),
      screenshot("estetica", "desktop-agendar.png", DESKTOP, "Agendamento da avaliação com dia e horário escolhidos e o resumo do protocolo ao lado.", "Avaliação agendada levando o resumo."),
    ],
    technologies: DEMO_STACK,
    seo: {
      title: "Clínica Núcleo — case e demo de site para clínica de estética",
      description: "Case de site para clínica de estética com montador de protocolo (sessões, intervalo e investimento), pós-operatório e agendamento de avaliação. Negócio fictício.",
    },
  },
  {
    slug: "cilios",
    name: "Lash Lab",
    categoryId: "beleza",
    solutionIds: ["agendamento", "pedidos"],
    isConceptual: true,
    audience: "Lash designers e profissionais de beleza que atendem clientes e também dão cursos",
    summary: "Duas portas no topo: um caminho para a cliente marcar e outro para a aluna reservar vaga na turma.",
    tryIt: "Entre por “Quero aprender”, escolha a forma de pagamento e reserve uma vaga: a contagem de vagas diminui.",
    problem:
      "O mesmo site precisa servir dois públicos muito diferentes. A cliente quer ver o resultado e marcar; a aluna quer saber conteúdo, data, preço e se vai conseguir trabalhar depois. Misturar os dois no mesmo texto confunde as duas.",
    solution:
      "Duas portas logo no topo, cada uma abrindo um caminho próprio da mesma página, com link direto para cada público. A cliente vê técnicas, durabilidade e horários; a aluna vê a turma com data, vagas restantes, conteúdo por dia, parcelamento e um formulário curto de reserva.",
    flow: [
      { title: "Escolher a porta", description: "“Quero fazer meus cílios” ou “Quero aprender”." },
      { title: "Ver o que importa", description: "Técnicas e manutenção, ou turma, conteúdo e investimento." },
      { title: "Decidir", description: "Horário livre para a cliente; forma de pagamento e parcelas para a aluna." },
      { title: "Reservar", description: "A vaga sai da contagem e a mensagem pronta vai para o WhatsApp." },
    ],
    demoStatus: "available",
    featuredOrder: null,
    features: [
      implemented("Duas portas, dois caminhos", "Cada público vê só o próprio conteúdo, com link direto (?caminho=cliente ou aluna)."),
      implemented("Técnicas com manutenção", "Durabilidade, intervalo de manutenção, tempo de aplicação e preço de cada técnica."),
      implemented("Agendamento da cliente", "Técnica, primeira vez ou manutenção, dia e horário livres, com mensagem pronta."),
      implemented("Turma com vagas restantes", "Data calculada, turma de três alunas e contagem que diminui a cada reserva."),
      implemented("Parcelamento na hora", "Pix com sinal ou cartão em até 10× sem juros, com o valor de cada parcela."),
      implemented("Lista de espera", "Com a turma completa, o formulário vira pedido de lista de espera."),
    ],
    considerations: [
      "A primeira pergunta da página é para quem a pessoa veio; nenhum dos dois públicos precisa ler o texto do outro.",
      "Cada caminho tem o próprio link, útil para divulgar o curso sem mostrar a agenda de clientes, e vice-versa.",
      "Vagas e parcelas aparecem antes do formulário: são as duas dúvidas que fazem a aluna desistir.",
      "Trabalhos de ex-alunas são exemplos marcados, para não serem lidos como prova de resultado.",
      "As portas são botões de verdade, com estado anunciado e foco visível; a troca de caminho leva o foco para o conteúdo novo.",
    ],
    media: [
      screenshot("cilios", "desktop-inicio.png", DESKTOP, "Topo do Lash Lab em fundo preto com a pergunta “Você veio para fazer os cílios ou para aprender a fazer?” e as duas portas com fotos.", "As duas portas do topo (computador)."),
      screenshot("cilios", "desktop-turma.png", DESKTOP, "Caminho da aluna com a data da próxima turma, as vagas restantes e o conteúdo de cada dia.", "Turma com data, vagas e conteúdo."),
      screenshot("cilios", "mobile-reserva.png", MOBILE, "Reserva de vaga no celular, com pagamento no cartão e o valor das parcelas.", "Reserva de vaga no celular."),
      screenshot("cilios", "desktop-tecnicas.png", DESKTOP, "Caminho da cliente com as quatro técnicas, cada uma com durabilidade, manutenção, tempo de aplicação e preço.", "Técnicas para quem quer fazer os cílios."),
    ],
    technologies: DEMO_STACK,
    seo: {
      title: "Lash Lab — case e demo de site para lash designer com curso",
      description: "Case de site para lash designer que atende e forma alunas: duas portas, técnicas, agendamento e reserva de vaga com parcelamento. Negócio fictício.",
    },
  },
  {
    slug: "noivas",
    name: "Ateliê Véu",
    categoryId: "beleza",
    solutionIds: ["orcamento", "agendamento"],
    isConceptual: true,
    audience: "Salões, maquiadoras e cabeleireiras que fecham pacotes de dia da noiva",
    summary: "Orçamento em grupo que calcula o tempo de produção, o horário de começar e o valor estimado.",
    tryIt: "Monte o grupo da noiva, mude o horário da cerimônia e veja a que horas vocês precisam começar.",
    problem:
      "O orçamento do dia da noiva depende de quantas pessoas se arrumam, do horário da cerimônia e de quanto tempo leva cada produção. Hoje isso são dezenas de mensagens antes de qualquer número aparecer, enquanto a noiva pede orçamento a três salões ao mesmo tempo.",
    solution:
      "Um montador do grupo que, com quem se arruma e o serviço de cada uma, calcula na hora o tempo total (cabelo e maquiagem em paralelo), o horário de início para a noiva terminar uma hora antes e o valor estimado, com profissional extra quando o grupo pede. A data sai de um calendário com as datas já ocupadas.",
    flow: [
      { title: "Montar o grupo", description: "Noiva, mãe, madrinhas e convidadas, com cabelo, maquiagem ou os dois." },
      { title: "Ver o cálculo", description: "Tempo de produção, horário de começar e valor estimado." },
      { title: "Escolher a data", description: "Calendário por mês com as datas ocupadas riscadas." },
      { title: "Pedir o orçamento", description: "Resumo completo e mensagem pronta para o WhatsApp." },
    ],
    demoStatus: "available",
    featuredOrder: null,
    features: [
      implemented("Montador do grupo", "Quantidade e serviço por tipo de pessoa, com limites e penteado infantil."),
      implemented("Cálculo de horário", "Cabelo e maquiagem em paralelo, com margem, para a noiva ficar pronta 1h antes."),
      implemented("Valor estimado", "Serviços, profissional extra e deslocamento quando é no local da festa."),
      implemented("Disponibilidade por mês", "Calendário navegável com datas ocupadas e prazo mínimo de 30 dias."),
      implemented("Pedido com resumo", "Data, grupo, horário e valor numa mensagem pronta (nada é enviado)."),
      implemented("Portfólio e teste", "Penteados e maquiagens, o que o pacote inclui e como funciona o teste."),
    ],
    considerations: [
      "O número aparece antes da conversa: é o que faz a noiva escolher entre três salões.",
      "O horário de início é calculado de trás para frente, a partir da cerimônia, como o salão faz na prática.",
      "Grupo grande não quebra a conta: a página inclui profissional extra e avisa quando começaria cedo demais.",
      "Datas ocupadas aparecem riscadas e são anunciadas como ocupadas para quem usa leitor de tela.",
      "Visual elegante sem parecer convite: fotografia grande e tipografia clássica, com contraste suficiente nos textos.",
    ],
    media: [
      screenshot("noivas", "desktop-inicio.png", DESKTOP, "Topo do Ateliê Véu com foto grande de noiva sendo maquiada e o título “O orçamento do seu grupo, sem vinte mensagens.”", "Abertura com fotografia grande (computador)."),
      screenshot("noivas", "desktop-grupo.png", DESKTOP, "Montador do grupo com noiva, mãe e madrinhas e o cálculo ao lado: horário de começar, tempo de produção e valor estimado.", "Montador do grupo com o cálculo."),
      screenshot("noivas", "mobile-grupo.png", MOBILE, "Montador do grupo no celular, com a quantidade de madrinhas e o serviço de cada tipo de pessoa.", "Grupo da noiva no celular."),
      screenshot("noivas", "desktop-datas.png", DESKTOP, "Calendário de disponibilidade com datas ocupadas riscadas e uma data escolhida.", "Disponibilidade por mês."),
    ],
    technologies: DEMO_STACK,
    seo: {
      title: "Ateliê Véu — case e demo de site para dia da noiva",
      description: "Case de site para salão de noivas com orçamento em grupo (tempo, horário de início e valor), calendário de datas e pedido de orçamento. Negócio fictício.",
    },
  },
  {
    slug: "unhas",
    name: "Esmalteria Meia-Lua",
    categoryId: "beleza",
    solutionIds: ["catalogo", "agendamento"],
    isConceptual: true,
    audience: "Esmalterias e nail designers de alongamento, banho em gel e manutenção",
    summary: "Catálogo e montador que dizem qual serviço é cada unha, quanto custa e quanto tempo leva, com plano de manutenção.",
    tryIt: "Escolha uma foto do catálogo, ajuste a cor e a decoração e entre num plano de manutenção com horário fixo.",
    problem:
      "A cliente chega com uma foto do Pinterest e não sabe que serviço é aquele, quanto custa nem quanto tempo leva. E o faturamento depende da manutenção, que é justamente o que as clientes esquecem de marcar.",
    solution:
      "Um catálogo visual filtrável em que cada foto já traz o serviço, o preço e a duração, e um montador de formato, comprimento, cor e decoração. No fim, a cliente escolhe marcar uma vez ou entrar num plano de manutenção com dia e horário fixos e desconto.",
    flow: [
      { title: "Inspirar", description: "Filtrar o catálogo por formato e estilo e escolher uma foto." },
      { title: "Montar", description: "Ajustar formato, comprimento, técnica, cor e decoração." },
      { title: "Ver o resultado", description: "Nome do serviço, preço, duração e manutenção recomendada." },
      { title: "Agendar ou entrar no plano", description: "Horário fixo a cada 15 ou 21 dias, com as próximas datas." },
    ],
    demoStatus: "available",
    featuredOrder: null,
    features: [
      implemented("Catálogo filtrável", "Fotos por formato e estilo, cada uma com serviço, preço e duração."),
      implemented("Montador da combinação", "Formato, comprimento, gel ou fibra, cor e decoração, com desenho das unhas."),
      implemented("Preço e duração na hora", "Soma de base, formato, cor e decoração, com avisos de combinação que não funciona."),
      implemented("Planos de manutenção", "A cada 15 ou 21 dias, com desconto, horário fixo e as próximas datas calculadas."),
      implemented("Cuidados e biossegurança", "Como fazer a unha durar e como o material é esterilizado."),
      implemented("Mensagem pronta", "Combinação, plano e horário no WhatsApp (nada é enviado)."),
    ],
    considerations: [
      "A foto que a cliente traz vira um serviço com nome: o catálogo traduz a inspiração em preço e tempo.",
      "A manutenção aparece desde o primeiro clique, porque é o que sustenta a agenda do negócio.",
      "O plano mostra as próximas datas já calculadas, sem cair em dia em que a esmalteria não abre.",
      "Filtros e escolhas são botões grandes e rolam na horizontal no celular, sem esconder nada.",
      "Biossegurança tem seção própria: é dúvida comum e motivo de confiança.",
    ],
    media: [
      screenshot("unhas", "desktop-inicio.png", DESKTOP, "Topo da Esmalteria Meia-Lua com o título “Achou uma unha no Pinterest? A gente diz o que é, quanto custa e quanto tempo leva.” e foto de mãos.", "Abertura com a promessa do catálogo (computador)."),
      screenshot("unhas", "desktop-catalogo.png", DESKTOP, "Catálogo de unhas com filtros por formato e estilo e cartões com serviço, preço e duração.", "Catálogo filtrável por formato e estilo."),
      screenshot("unhas", "mobile-montador.png", MOBILE, "Montador da combinação no celular, com o desenho das unhas, o preço e a duração do atendimento.", "Montador da combinação no celular."),
      screenshot("unhas", "desktop-plano.png", DESKTOP, "Agendamento com o plano de manutenção a cada 15 dias escolhido e as próximas datas no resumo.", "Plano de manutenção com horário fixo."),
    ],
    technologies: DEMO_STACK,
    seo: {
      title: "Esmalteria Meia-Lua — case e demo de site para esmalteria",
      description: "Case de site para esmalteria com catálogo filtrável, montador de combinação com preço e duração e plano de manutenção com horário fixo. Negócio fictício.",
    },
  },
  {
    slug: "capilar",
    name: "Instituto Fio Nobre",
    categoryId: "beleza",
    solutionIds: ["agendamento", "institucional"],
    isConceptual: true,
    audience: "Tricologistas, terapeutas capilares e salões de mega hair",
    summary: "Questionário de seis perguntas que orienta entre tratamento, mega hair ou os dois, com o porquê.",
    tryIt: "Responda as seis perguntas como alguém com queda recente e química no cabelo, e veja a orientação e os cuidados.",
    problem:
      "Quem está perdendo cabelo chega inseguro e com vergonha, e não sabe se o caso é tratamento ou mega hair. O preço do mega hair muda com comprimento e quantidade, o que trava a conversa logo no começo.",
    solution:
      "Um questionário curto sobre queda, química, rotina e objetivo que termina numa orientação inicial (tratamento, mega hair ou os dois) explicando o porquê de cada ponto, com a ressalva clara de que não é diagnóstico. A tabela de mega hair mostra o preço por comprimento e quantidade, e a avaliação presencial é marcada levando a orientação.",
    flow: [
      { title: "Responder", description: "Seis perguntas, uma por vez, com barra de progresso." },
      { title: "Entender", description: "Caminho indicado, o porquê de cada ponto e os cuidados." },
      { title: "Comparar preços", description: "Tabela de mega hair por comprimento, quantidade e técnica." },
      { title: "Agendar", description: "Avaliação presencial com a orientação na mensagem do WhatsApp." },
    ],
    demoStatus: "available",
    featuredOrder: null,
    features: [
      implemented("Questionário em passos", "Seis perguntas com voltar, progresso anunciado e respostas salvas no navegador."),
      implemented("Orientação com o porquê", "Tratamento, mega hair ou os dois, explicando cada motivo e quando procurar médico."),
      implemented("Aviso de não diagnóstico", "A orientação deixa claro que só a avaliação presencial define o tratamento."),
      implemented("Tabela de mega hair", "Preço por comprimento e quantidade e manutenção por técnica."),
      implemented("Antes e depois", "Comparador arrastável de queda e de mega hair (imagens ilustrativas)."),
      implemented("Agendamento da avaliação", "Dia e horário, com a orientação na mensagem pronta (nada é enviado)."),
    ],
    considerations: [
      "Tom sério e acolhedor para quem chega com vergonha: espaço reservado e respostas que não saem do aparelho.",
      "A página nunca diagnostica: orienta o caminho e explica que só a avaliação presencial define o tratamento.",
      "Quando a resposta indica mudança de saúde, a orientação recomenda médico junto, não no lugar.",
      "Mega hair em fio fragilizado espera: a página explica por que o tratamento vem primeiro.",
      "Preço do mega hair aberto em tabela, para destravar a conversa sem precisar perguntar.",
      "Prazos de resultado realistas, sem promessa de milagre.",
    ],
    media: [
      screenshot("capilar", "desktop-inicio.png", DESKTOP, "Topo do Instituto Fio Nobre com o título “Seu caso é tratamento ou mega hair? Comece por seis perguntas.” e foto de tricoscopia.", "Abertura com o convite ao questionário (computador)."),
      screenshot("capilar", "desktop-orientacao.png", DESKTOP, "Resultado do questionário: “Tratamento primeiro, mega hair na sequência”, com os motivos e o aviso de que não é diagnóstico.", "Orientação inicial com o porquê."),
      screenshot("capilar", "mobile-questionario.png", MOBILE, "Pergunta do questionário no celular, com barra de progresso e opções grandes.", "Questionário no celular."),
      screenshot("capilar", "desktop-mega.png", DESKTOP, "Tabela de mega hair com preço por comprimento e quantidade e a manutenção por técnica.", "Tabela de mega hair."),
    ],
    technologies: DEMO_STACK,
    seo: {
      title: "Instituto Fio Nobre — case e demo de site para terapia capilar e mega hair",
      description: "Case de site para instituto capilar com questionário de orientação (tratamento, mega hair ou os dois), tabela de mega hair e agendamento de avaliação. Negócio fictício.",
    },
  },
  {
    slug: "spa",
    name: "Casa Serena",
    categoryId: "beleza",
    solutionIds: ["pedidos", "agendamento"],
    isConceptual: true,
    audience: "Spas, espaços de massagem e negócios de beleza que vendem presentes em datas comemorativas",
    summary: "Montador de vale-presente com mensagem, entrega por e-mail ou cartão impresso e prévia do cartão pronto.",
    tryIt: "Monte um vale-presente com valor livre, escreva a mensagem e veja o cartão mudar enquanto você digita.",
    problem:
      "Boa parte do movimento de um spa vem de quem compra para presentear, e não para si. Hoje isso é resolvido à mão pelo WhatsApp, e o presente chega sem nenhuma apresentação.",
    solution:
      "Um montador de vale-presente em que a pessoa escolhe uma experiência ou um valor livre, escreve a mensagem, escolhe entrega por e-mail ou cartão impresso e vê a prévia do cartão pronto antes de finalizar. O módulo é separado do resto do site, para ser reaproveitado em outros negócios em datas como Dia das Mães e Natal.",
    flow: [
      { title: "Escolher o presente", description: "Uma experiência com duração ou um valor livre." },
      { title: "Escrever", description: "Para quem, de quem e a mensagem, com contador de caracteres." },
      { title: "Entregar", description: "Por e-mail ou cartão impresso, com a taxa somada ao total." },
      { title: "Ver o cartão e finalizar", description: "Prévia ao vivo, código do vale e validade de seis meses." },
    ],
    demoStatus: "available",
    featuredOrder: null,
    features: [
      implemented("Montador de vale-presente", "Experiência ou valor livre, mensagem, entrega e validação, com total ao lado."),
      implemented("Prévia do cartão", "O cartão muda enquanto a pessoa digita; no fim ganha código e validade."),
      implemented("Módulo reaproveitável", "Lógica, testes e componentes numa pasta própria, configurados por um objeto e por variáveis de cor."),
      implemented("Experiências com duração", "Para quem serve cada uma, quanto tempo leva e o valor."),
      implemented("Day spa para dois e visita", "O que inclui, o que levar, como chegar e política de reagendamento."),
      implemented("Reserva", "Experiência, dia e horário que cabem na duração, e campo para quem ganhou um vale."),
    ],
    considerations: [
      "Quem compra presente quer ver o que a outra pessoa vai receber: a prévia do cartão é o centro da página.",
      "O vale tem validade e código legível, sem letras que se confundem (0 e O, 1 e I).",
      "O módulo de vale-presente não depende do resto do site: muda a configuração e as cores, serve para outro negócio.",
      "Página silenciosa: tipografia leve, muito espaço e poucas cores, como o próprio spa.",
      "Pagamento e envio do e-mail ficam para o projeto real; a demonstração deixa isso claro.",
    ],
    media: [
      screenshot("spa", "desktop-inicio.png", DESKTOP, "Topo da Casa Serena com foto da sala de massagem e o título “Um presente que é silêncio.”", "Abertura calma (computador)."),
      screenshot("spa", "desktop-vale.png", DESKTOP, "Montador de vale-presente com o Ritual Serenidade escolhido e a prévia do cartão verde com a mensagem ao lado.", "Vale-presente com prévia do cartão."),
      screenshot("spa", "mobile-vale.png", MOBILE, "Prévia do cartão do vale-presente no celular, com a mensagem, para quem e de quem.", "Cartão do vale-presente no celular."),
      screenshot("spa", "desktop-experiencias.png", DESKTOP, "Experiências do spa com foto, duração, para quem serve e valor.", "Experiências com duração e valor."),
    ],
    technologies: DEMO_STACK,
    seo: {
      title: "Casa Serena — case e demo de site para spa com vale-presente",
      description: "Case de site para spa com montador de vale-presente (mensagem, entrega e prévia do cartão), experiências, day spa para dois e reserva. Negócio fictício.",
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
