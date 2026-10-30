// flows.js — as jornadas do Seguro PhizChat contra golpes na sidebar.
// Fonte: arquivo Insurance, branch nh1VxjNROYzsisQeSmI9ru — páginas Chat (1:99)
// e Account security (48:11325).
// Cada passo aponta para "rota@modo": o modo diz se o seguro está inativo
// (Arthur sem verificação) ou ativo (Arthur verificado).
// status: "done" = está no Figma · "in-progress" = proposta deste protótipo

window.PHIZ_JOURNEYS = {
  product: "Seguro contra golpes",
  journeys: [
    {
      id: "inativo", n: 1,
      title: "Seguro inativo",
      titleEn: "Insurance inactive",
      sub: "Arthur ainda não verificou a identidade",
      subEn: "Arthur hasn't verified his identity yet",
      status: "in-progress", color: "#E5A100",
      steps: [
        { title: "Abrir o app · promoção", titleEn: "Open the app · promo", screen: "promo@inativo", status: "done" },
        { title: "Lista de conversas", titleEn: "Chat list", screen: "chats@inativo", status: "done" },
        { title: "PhizChat Dicas", titleEn: "PhizChat Dicas", screen: "dicas@inativo", status: "done" },
        { title: "Saiba mais · 3 pontos", titleEn: "Learn more · 3 points", screen: "seguro@inativo", status: "done" },
        { title: "Conversa · Seguro Grátis", titleEn: "Chat · Free insurance", screen: "sophia@inativo", status: "done" },
        { title: "Folha · verifique seu perfil", titleEn: "Sheet · verify your profile", screen: "sophia-folha@inativo", status: "done" },
        { title: "Contato · Seguro Grátis", titleEn: "Contact · free insurance", screen: "contato@inativo", status: "done" },
        { title: "Eu · sem verificação", titleEn: "Me · not verified", screen: "me@inativo", status: "done" },
        { title: "Configurações", titleEn: "Settings", screen: "config@inativo", status: "done" },
        { title: "Segurança da Conta", titleEn: "Account security", screen: "seguranca@inativo", status: "done" },
        { title: "Verificação · início", titleEn: "Verification · start", screen: "verificar@inativo", status: "done" },
        { title: "Verificação · dados", titleEn: "Verification · details", screen: "verificar-dados@inativo", status: "done" },
        { title: "Verificação · rosto (Jumio)", titleEn: "Verification · face (Jumio)", screen: "verificar-rosto@inativo", status: "done" },
        { title: "Verificação · câmera", titleEn: "Verification · camera", screen: "verificar-camera@inativo", status: "done" },
        { title: "Verificação em análise", titleEn: "Verification under review", screen: "verificar-analise@inativo", status: "done" },
        { title: "Verificou, ganhou", titleEn: "Verified, you won", screen: "verificado@inativo", status: "done" },
        { title: "Seguro · verificação em análise", titleEn: "Insurance · verification under review", screen: "seguro-analise@inativo", status: "done" }
      ]
    },
    {
      id: "ativo", n: 2,
      title: "Seguro ativo",
      titleEn: "Insurance active",
      sub: "Arthur verificado: conversas entre verificados protegidas",
      subEn: "Arthur verified: chats between verified profiles are covered",
      status: "in-progress", color: "#19B852",
      steps: [
        { title: "Lista de conversas", titleEn: "Chat list", screen: "chats@ativo", status: "done" },
        { title: "PhizChat Dicas · protegido", titleEn: "PhizChat Dicas · covered", screen: "dicas@ativo", status: "done" },
        { title: "Meu seguro", titleEn: "My insurance", screen: "seguro@ativo", status: "done" },
        { title: "Conversa · seguro ativo", titleEn: "Chat · insurance active", screen: "sophia@ativo", status: "done" },
        { title: "Folha · conversa protegida", titleEn: "Sheet · chat covered", screen: "sophia-folha@ativo", status: "done" },
        { title: "Contato · seguro ativo", titleEn: "Contact · insurance active", screen: "contato@ativo", status: "done" },
        { title: "Eu · verificado", titleEn: "Me · verified", screen: "me@ativo", status: "done" },
        { title: "Configurações", titleEn: "Settings", screen: "config@ativo", status: "done" },
        { title: "Segurança da Conta", titleEn: "Account security", screen: "seguranca@ativo", status: "done" }
      ]
    },
    {
      id: "sophia-nao", n: 3,
      title: "Arthur verificado, Sophia não",
      titleEn: "Arthur verified, Sophia not",
      sub: "O seguro do Arthur está ativo, mas não vale na conversa com a Sophia",
      subEn: "Arthur's insurance is active, but not in the chat with Sophia",
      status: "in-progress", color: "#7A7F87",
      steps: [
        { title: "Conversa · seguro inativo", titleEn: "Chat · insurance inactive", screen: "sophia@sophia-nao", status: "done" },
        { title: "Folha · Sophia não verificou", titleEn: "Sheet · Sophia not verified", screen: "sophia-folha@sophia-nao", status: "done" },
        { title: "Contato · só a medalha", titleEn: "Contact · medal only", screen: "contato@sophia-nao", status: "done" }
      ]
    },
    {
      id: "ambos-nao", n: 4,
      title: "Nenhum verificado",
      titleEn: "Neither verified",
      sub: "Arthur e Sophia sem verificação: o seguro não vale na conversa",
      subEn: "Arthur and Sophia not verified: no insurance in the chat",
      status: "in-progress", color: "#B59C1C",
      steps: [
        { title: "Conversa · Seguro Grátis", titleEn: "Chat · free insurance", screen: "sophia@ambos-nao", status: "done" },
        { title: "Folha · só perfis verificados", titleEn: "Sheet · verified profiles only", screen: "sophia-folha@ambos-nao", status: "done" },
        { title: "Contato · Seguro Grátis", titleEn: "Contact · free insurance", screen: "contato@ambos-nao", status: "done" }
      ]
    },
    {
      id: "sinistro", n: 5,
      title: "Abrir sinistro",
      titleEn: "File a claim",
      sub: "Arthur caiu num golpe e pede a indenização pelo seguro",
      subEn: "Arthur was scammed and files a claim with the insurance",
      status: "in-progress", color: "#D92D20",
      steps: [
        { title: "Meu seguro", titleEn: "My insurance", screen: "seguro@ativo", status: "done" },
        { title: "Abrir sinistro · vazio", titleEn: "File a claim · empty", screen: "sinistro@ativo", status: "done" },
        { title: "Folha · quem aplicou o golpe", titleEn: "Sheet · who scammed you", screen: "sinistro-conta@ativo", status: "done" },
        { title: "Pedido preenchido", titleEn: "Claim filled in", screen: "sinistro-preenchido@ativo", status: "done" },
        { title: "Sinistro aberto", titleEn: "Claim filed", screen: "sinistro-enviado@ativo", status: "done" },
        { title: "Conversa · Seguro PhizChat", titleEn: "Chat · Seguro PhizChat", screen: "seguro-chat@ativo", status: "done" }
      ]
    }
  ]
};
