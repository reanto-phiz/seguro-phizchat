// sx-telas.jsx — Seguro PhizChat contra golpes: as telas dos dois fluxos.
//
// Um modo global diz em que fluxo a pessoa está:
//   "inativo" → Arthur ainda não verificou a identidade, o seguro não vale
//   "ativo"   → Arthur verificado, seguro ativo nas conversas entre verificados
// As rotas são as mesmas nos dois fluxos (a Configurações da base empurra
// "seguranca" fixo); cada tela lê o modo e mostra o estado certo.
//
// Figma — arquivo Insurance (branch nh1VxjNROYzsisQeSmI9ru)
//   Chat 1:99 · seção Seguro 339:35860
//     Lista 111:16688 · Lista + promo 2449:43444 / 2449:43818 (Proposta Mkt)
//     Dicas 120:15459 · 299:5668 · Seguro sem verificação 2449:43337
//     Chat sem seguro 9:3040 → 2327:28076 (Seguro Grátis) → 2327:28667
//     Chat segurado 9:1518 → 157:8978 → 339:42073
//     Folhas 2342:34060 (verifique sua conta) · 2342:34139 (assegurado)
//   Account security 48:11325
//     Sem verificação: Eu 57:13715 · Config 559:11585 · Segurança 48:12289
//     Com verificação: Eu 2432:41369 · Segurança 48:11344 · Seguro ativo 2357:37461…
//
// Regras da base: prefixo SX_/Sx nos nomes de topo, sx- nas classes.

const SX = window.SgBase;

// Tab bar: "Chats" vira "Conversas" só neste protótipo (o kit em shared/ fica como está).
window.PhizUI.PZ_TABS.find(t => t.id === "chats").lb = "Conversas";

const SX_V = "?v=" + (window.__V || 1);
const SX_IMG = {
  medalha: "img/medalha.png" + SX_V,
  prata: "img/medalha-prata.png" + SX_V,
  medalSm: "img/medal-sm.png" + SX_V,
  medalPill: "img/medal-pill.png" + SX_V,
  promo: "img/promo.png" + SX_V,
  // Mensagem "Verificou, ganhou." do PhizChat (120:15459)
  promoVerificou: "img/promo-verificou.jpg" + SX_V,
  kev: "img/kev.png" + SX_V,
  sophia: "img/sophia.png" + SX_V,
  arthur: "img/av-arthur.png" + SX_V,
  logo: (window.__SHARED || "../shared/") + "assets/logomark-green.svg",
  ic: (n) => "img/" + n + ".svg" + SX_V
};

/* ── Modo do fluxo ─────────────────────────────────────────────────────── */
const SX_MODO = {
  v: "inativo",
  subs: new Set(),
  set(v) { if (v === this.v) return; this.v = v; this.subs.forEach(f => f()); }
};
window.SX_MODO = SX_MODO;
// Modos: "inativo" (Arthur sem verificação, Sophia verificada) · "ativo" (os dois
// verificados) · "sophia-nao" (Arthur verificado, Sophia não) · "ambos-nao"
// (nenhum verificado). Pra Arthur, "sophia-nao" é igual ao ativo e "ambos-nao"
// igual ao inativo: só a conversa com a Sophia muda.
function useSxModo() {
  const [, tick] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => { SX_MODO.subs.add(tick); return () => SX_MODO.subs.delete(tick); }, []);
  return SX_MODO.v;
}
function useSxAtivo() {
  const m = useSxModo();
  return m === "ativo" || m === "sophia-nao";
}
const sxReduz = () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Ícone do Figma por máscara: a cor vem do `color` do pai. */
const SxIc = ({ n, size = 24 }) => (
  <span className="sx-ic" style={{ width: size, height: size, WebkitMaskImage: `url(${SX_IMG.ic(n)})`, maskImage: `url(${SX_IMG.ic(n)})` }} aria-hidden="true" />
);

/* Medalha pequena (componente Medal 2004:13250). */
const SxMedal = ({ size = 24 }) => <img className="sx-medal" src={SX_IMG.medalSm} alt="" style={{ width: size, height: size }} />;

/* Tab bar: Chats e Eu navegam. */
function SxNav({ active }) {
  const nav = window.PhizHiFi.useNav();
  const rota = { chats: "chats", eu: "me" };
  return <window.PhizUI.PzNavBar active={active} badges={{ chats: 1 }}
    onGo={(id) => rota[id] && nav.switchTab(rota[id])} />;
}

/* ── Conversas da Sophia (texto do Figma) ──────────────────────────────── */
const SX_SOPHIA_INATIVO = [
  { them: true, texto: "Quero entrar na divisão do presente dela, tudo bem?", hora: "11:22" },
  { me: true, texto: "Bora! Fica R$ 180 pra cada", hora: "11:22", lida: true },
  { them: true, texto: "Legal, vou pagar minha parte do presente", hora: "11:22" },
  { them: true, texto: "Pode ser Pix?", hora: "11:22" },
  { me: true, texto: "Claro! A chave é meu celular", hora: "11:22", lida: true },
  { them: true, texto: "Combinado, te mando o comprovante 🙌", hora: "11:22" },
  { data: "Hoje" },
  { me: true, texto: "Oi Sophia! Viu que agora o PhizChat tem um seguro?", hora: "11:22", lida: true },
  { them: true, texto: "Oi!! Sério?!", hora: "11:22" },
  { them: true, texto: "É muito caro?", hora: "11:22" },
  { me: true, texto: "Nada! É de graça!", hora: "11:22", lida: true },
  { me: true, texto: "Só precisa verificar a identidade, vou te mandar um convite, olha só", hora: "11:22", lida: true },
  { them: true, texto: "Ah que ótimo! Pode mandar", hora: "11:22" }
];
const SX_SOPHIA_ATIVO = [
  { them: true, texto: "Oi Arthur! É a Sophia do trabalho da Bia", hora: "11:22" },
  { me: true, texto: "Oi Sophia! Salvei seu número aqui", hora: "11:22", lida: true },
  { them: true, texto: "É aniversário da Bia no sábado, você vai?", hora: "11:22" },
  { me: true, texto: "Vou sim! Levo o bolo", hora: "11:22", lida: true },
  { them: true, texto: "Perfeito 🎂", hora: "11:22" },
  { them: true, texto: "Quero entrar na divisão do presente dela, tudo bem?", hora: "11:22" },
  { me: true, texto: "Bora! Fica R$ 180 pra cada", hora: "11:22", lida: true },
  { them: true, texto: "Legal, vou pagar minha parte do presente", hora: "11:22" },
  { them: true, texto: "Pode ser Pix?", hora: "11:22" },
  { me: true, texto: "Claro! A chave é meu celular", hora: "11:22", lida: true },
  { them: true, texto: "Combinado, te mando o comprovante 🙌", hora: "11:22" }
];
const SX_E2E = "Phiz é um aplicativo seguro, criptografamos as mensagens para garantir uma plataforma segura e confiável. Nem mesmo o Phiz pode ler as mensagens.";
const SX_RODAPE = "Grátis • renova sozinho a cada 30 dias (válido somente no Brasil)";

/* Arte da promoção (medalha, anéis e brilhos) — promo e pós-verificação */
function SxPromoArte() {
  return (
    <div className="sx-promo-arte" aria-hidden="true">
      <img className="glow" src={SX_IMG.ic("mkt-glow")} alt="" />
      <img className="ring" src={"img/mkt-ring.png" + SX_V} alt="" />
      <img className="ring2" src={SX_IMG.ic("mkt-ring2")} alt="" />
      <img className="sp s1" src={SX_IMG.ic("sp1")} alt="" />
      <img className="sp s2" src={SX_IMG.ic("sp2")} alt="" />
      <img className="sp s3" src={SX_IMG.ic("sp3")} alt="" />
      <img className="sp s4" src={SX_IMG.ic("sp4")} alt="" />
      <img className="sp s5" src={SX_IMG.ic("sp5")} alt="" />
      <img className="medalha" src={SX_IMG.medalha} alt="" />
    </div>
  );
}

/* ── Promoção ao abrir o app (2449:43818 · Proposta Mkt) ──────────────────
   Sobe por cima da lista. Fecha no X ou no fundo; o CTA leva ao seguro. */
function SxPromo({ onFechar, onQuero }) {
  const [saindo, setSaindo] = React.useState(false);
  const fecha = (depois) => {
    if (sxReduz()) return depois();
    setSaindo(true);
    setTimeout(depois, 240);
  };
  return (
    <div className={"sx-promo-wrap" + (saindo ? " saindo" : "")}>
      <div className="sx-promo-scrim" onClick={() => fecha(onFechar)} />
      <div className="sx-promo" role="dialog" aria-modal="true" aria-label="Seguro PhizChat">
        <button className="sx-promo-x" aria-label="Fechar" onClick={() => fecha(onFechar)}><SxIc n="ic-x" /></button>
        <SxPromoArte />
        <div className="sx-promo-copy">
          <span className="chip">Seguro PhizChat</span>
          <h2>Verificou, ganhou.</h2>
          <p>Verifique sua identidade<br />e ative o seguro grátis contra<br />golpes de contas falsas.</p>
        </div>
        <div className="sx-promo-sheet">
          <div className="prova">
            <div className="avs">
              {["mkt-av1", "mkt-av2", "mkt-av3", "mkt-av1"].map((a, i) => <img key={i} src={"img/" + a + ".png" + SX_V} alt="" />)}
            </div>
            <div className="tx"><p><b>+2.270</b> pessoas</p><p>já ganharam o seguro grátis</p></div>
          </div>
          <SX.SgBtn onClick={() => fecha(onQuero)}>Quero meu seguro grátis</SX.SgBtn>
        </div>
      </div>
    </div>
  );
}

/* Pílula do seguro (2497:13836) — Eu e página de contato.
   Sem seguro: abre/fecha uma vez em 6s ("novo" só no Eu). Com seguro: só a medalha, parada.
   `claro` = fundo branco, pra ficar sobre a foto do contato. */
function SxPilula({ ativo, novo, claro, onClick, rotulo = "Seguro Grátis" }) {
  const medalha = <span className="sx-pill-medal"><img src={SX_IMG.medalPill} alt="" /></span>;
  if (ativo) return <button className={"sx-me-medal" + (claro ? " claro" : "")} aria-label="Seguro PhizChat" onClick={onClick}>{medalha}</button>;
  return (
    <button className={"sx-me-pill" + (claro ? " claro" : "")} aria-label={rotulo} onClick={onClick}>
      <span className="in">{medalha}<span className="tx"><span>{rotulo}</span></span></span>
      {novo && <span className="sx-me-novo" aria-hidden="true"><span className="lb">novo</span><span className="flare" /></span>}
    </button>
  );
}

/* ── Página de contato da Sophia (Contact Page 339:42491) ───────────────────
   Abre tocando no header da conversa. A pílula do seguro fica na barra da foto
   e abre a mesma folha do seguro da conversa. */
const SX_PILULA_VISTA = new Set();

function SxContato() {
  const nav = window.PhizHiFi.useNav();
  const ativo = useSxAtivo();
  const modo = useSxModo();
  const sophiaOk = modo === "ativo" || modo === "inativo";
  const cenario = sxCenario(ativo, sophiaOk);
  // Seguro não vale nesta conversa (cenários 1–3): na primeira visita a pílula
  // "Seguro Grátis" abre e fecha; nas próximas fica só a medalha (o fim da animação).
  const [animar] = React.useState(cenario !== 4 && !SX_PILULA_VISTA.has(cenario));
  React.useEffect(() => { SX_PILULA_VISTA.add(cenario); }, [cenario]);
  const [folha, setFolha] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  const [convite, setConvite] = React.useState(false);
  const { PzIcon } = window.PhizUI;
  const [trancada, setTrancada] = React.useState(false);
  const C = (n) => <PzIcon n={"contato/" + n} />;
  const grupos = [
    ["Design Wizards", "grp1"], ["UX Innovators", "grp2"], ["Prototype Pioneers", "grp3"], ["Creative Collaborators", "grp4"]
  ];
  return (
    <window.PhizHiFi.Screen statusDark>
      <div className="pz-ct-scroll sx-ct">
        <div className="pz-ct-top">
          <img className="bg sx-ct-foto" src={"img/ct-sophia.jpg" + SX_V} alt="" />
          <div className="bar">
            <button className="pz-glass" aria-label="Voltar" onClick={() => nav.pop()}>{C("arrow-left")}</button>
            <span className="sp" />
            <SxPilula ativo={!animar} claro rotulo="Seguro grátis" onClick={() => setFolha(true)} />
            <button className="pz-glass" aria-label="Editar contato">{C("edit")}</button>
          </div>
          <div className="txt">
            <div className="ap">Sophia Turner</div>
            {/* Verificada: nome real + selo (ContactPageHeader 339:42492) */}
            {sophiaOk && (
              <div className="sub">
                <span>Sophia T.</span><i className="div" />
                <span className="ver"><img className="sx-ct-selo" src={SX_IMG.ic("selo-verificado")} alt="" /> Verificado</span>
              </div>
            )}
          </div>
        </div>
        <div className="pz-ct-acts sx-ct-acts">
          {[["message", "Chat"], ["call", "Áudio"], ["video", "Vídeo"], ["search", "Buscar"]].map(([ic, lb]) => (
            <div key={ic} className="pz-ct-act" role="button" onClick={ic === "message" ? () => nav.pop() : undefined}>{C(ic)}<span>{lb}</span></div>
          ))}
        </div>
        <div className="sg-pad">
          <div className="sx-ct-recado">Carpe diem! ✨</div>
          <div className="sg-group sx-ct-grp">
            <SX.SgItem icone={C("image")} titulo="Mídia, links e documentos" onClick={() => {}} />
            <SX.SgItem icone={C("palette")} titulo="Tema da conversa" onClick={() => {}} />
            <SX.SgItem icone={C("clock")} titulo="Mensagens temporárias" onClick={() => {}} />
            <SX.SgItem icone={<window.Icon name="glasses" size={24} />} titulo="Conversa secreta" onClick={() => {}} />
            <SX.SgItem icone={C("lock-message")} titulo="Trancar conversa" switchOn={trancada} onSwitch={() => setTrancada(v => !v)} />
            <SX.SgItem icone={C("save")} titulo="Mensagens guardadas" onClick={() => {}} />
            <SX.SgItem icone={C("lock-closed")} titulo="Criptografia" onClick={() => {}} />
          </div>
        </div>
        <SX.SgSecao>6 grupos em comum</SX.SgSecao>
        <div className="sg-pad">
          <div className="sg-group sx-ct-grp">
            <SX.SgItem icone={<span className="sx-ct-add">{C("add")}</span>} titulo="Criar grupo com Sophia" onClick={() => {}} />
            {grupos.map(([n, f]) => <SX.SgItem key={n} avatar={"img/" + f + ".jpg" + SX_V} titulo={n} onClick={() => {}} />)}
          </div>
        </div>
        <SX.SgSecao>Gerenciar conversa</SX.SgSecao>
        <div className="sg-pad">
          <div className="sg-group sx-ct-grp">
            <SX.SgItem icone={C("heart")} titulo="Adicionar aos favoritos" chevron={false} onClick={() => {}} />
            <SX.SgItem icone={C("dismiss")} titulo="Limpar conversa" critico />
            <SX.SgItem icone={C("prohibited")} titulo="Bloquear contato" critico />
            <SX.SgItem icone={C("warning")} titulo="Denunciar contato" critico />
            <SX.SgItem icone={C("delete")} titulo="Excluir contato" critico />
          </div>
        </div>
        <div style={{ height: 40 }} />
      </div>
      {/* Mesma folha da conversa, no cenário do par Arthur × Sophia */}
      {folha && (
        <SxFolha cenario={cenario}
          onFechar={() => setFolha(false)}
          onCta={() => cenario === 1 ? setConvite(true) : nav.push("verificar")}
          onSobre={() => nav.push("seguro")} />
      )}
      {convite && (
        <SxFolhaConvite onFechar={() => setConvite(false)}
          onEnviar={() => { SX_CONVITE.enviado = true; setConvite(false); setFolha(false); nav.setStackTo(["chats", "sophia"]); }} />
      )}
      {toast && <SX.SgToast key={toast}>{toast.split("·")[0]}</SX.SgToast>}
    </window.PhizHiFi.Screen>
  );
}

/* ── Pós-verificação: "Verificou, ganhou." (2357:37771) ───────────────────
   Entra no lugar do fluxo de verificação ao tocar em Concluído.
   "Como funciona o seguro" → seguro já ativo · "Ver depois" → Segurança da
   Conta já verificada. Nos dois, voltar leva à Segurança da Conta (fluxo ativo). */
function SxVerificado() {
  const nav = window.PhizHiFi.useNav();
  const vai = (...telas) => {
    SX_MODO.set("ativo");
    nav.setStackTo(["me", "config", "seguranca", ...telas]);
  };
  const depois = () => vai();
  return (
    <window.PhizHiFi.Screen statusDark>
      <div className="pg sx-pos">
        <div className="sx-promo sx-promo-full">
          <SxPromoArte />
          <div className="sx-promo-copy">
            <span className="chip">Seguro PhizChat</span>
            <h2>Parabéns!<br />Verificou, ganhou.</h2>
            <p>PhizChat é o único app com seguro contra golpes. Se uma conta falsa te enganar, você não fica sozinho nessa.</p>
          </div>
          <div className="sx-promo-sheet">
            <div className="sx-pos-btns">
              <SX.SgBtn onClick={() => vai("seguro-verificado")}>Como funciona o seguro</SX.SgBtn>
              <SX.SgBtn kind="secondary" onClick={depois}>Ver depois</SX.SgBtn>
            </div>
          </div>
        </div>
      </div>
    </window.PhizHiFi.Screen>
  );
}

/* ── Lista de conversas (111:16688) ───────────────────────────────────── */
function SxChats({ params = {} }) {
  const nav = window.PhizHiFi.useNav();
  const ativo = useSxAtivo();
  const { PzChatsBar, PzChatRow } = window.PhizUI;
  const P = window.PhizHiFi.PHOTO;
  // A promoção sobe 2s depois de abrir o app, com a lista já à vista.
  const [promo, setPromo] = React.useState(false);
  React.useEffect(() => {
    if (!params.promo) return;
    const t = setTimeout(() => setPromo(true), 2000);
    return () => clearTimeout(t);
  }, []);
  return (
    <window.PhizHiFi.Screen>
      <div className="pg sg-chats">
        <PzChatsBar />
        <div className="pg-body sg-lista">
          <PzChatRow letra={<img src={SX_IMG.logo} alt="" style={{ width: 34, height: 34 }} />} cor="#19B852"
            nome="PhizChat" selo hora="10:50" nova naoLidas={1} silencio
            prev={{ midia: "camera", texto: ativo ? "Você já está protegido. Seu Seguro PhizChat já vale desde hoje." : "Suas conversas protegidas, de graça Com o Seguro PhizChat, se uma conta…" }}
            onClick={() => nav.push("dicas")} />
          <PzChatRow foto={SX_IMG.sophia} nome="Sophia Turner" hora="10:48"
            prev={{ texto: "Combinado, te mando o comprovante 🙌" }}
            onClick={() => nav.push("sophia")} />
          <PzChatRow foto={P.ana2} nome="Amigos para sempre" hora="10:28" nova naoLidas={1} silencio
            prev={{ quem: "Ricardo", texto: "Booa, vamos no Starbucks então, perto do escritório!" }} />
          <PzChatRow letra="S" cor="#E0245E" nome="Silvia (Gerente do banco)" hora="8:49"
            prev={{ texto: "✨ De nada, Kaio! Se você quiser também pode consultar seus limites" }} />
          <PzChatRow foto={P.vitor} nome="Vitor da Silva Machado" hora="Ontem"
            prev={{ status: "lida", midia: "mic", texto: "1:17" }} />
          <PzChatRow foto={P.ana} nome="Ana Maria" hora="Sábado" nova naoLidas={1} silencio
            prev={{ status: "lida", midia: "camera", texto: "Foto" }} />
          <PzChatRow foto={P.carol} nome="Ana Julia Mariano" hora="17/04/25"
            prev={{ midia: "camera", texto: "Foto" }} />
        </div>
        <SxNav active="chats" />
      </div>
      {promo && <SxPromo onFechar={() => (params.promo ? nav.replace("chats") : setPromo(false))}
        onQuero={() => {
          // a promoção não fica na pilha: voltar do seguro cai na lista
          if (params.promo) { nav.replace("chats"); setTimeout(() => nav.push("seguro"), 0); }
          else { setPromo(false); nav.push("seguro"); }
        }} />}
    </window.PhizHiFi.Screen>
  );
}

/* ── PhizChat (120:15459 · 299:5668) ───────────────────────────── */
const SxDicasAv = ({ size = 40 }) => (
  <span className="sg-dicas-av" style={{ width: size, height: size }}>
    <img src={SX_IMG.logo} alt="" style={{ width: size * 0.62, height: size * 0.62 }} />
  </span>
);

function SxDicas() {
  const nav = window.PhizHiFi.useNav();
  const ativo = useSxAtivo();
  const { PzChatHeader, PzChat, PzThread, PzBiz } = window.PhizUI;
  const midia = (
    <div className="sg-promo">
      <img src={ativo ? SX_IMG.promo : SX_IMG.promoVerificou} alt="" />
      <span className="sg-promo-tag">Seguro feito pela <img src={SX_IMG.kev} alt="Kev" /></span>
    </div>
  );
  const itens = ativo
    ? [
        { sys: SX_E2E, warn: true },
        { data: "Hoje" },
        { node: <PzBiz media={midia} hora="11:22"
            titulo="Você já está protegido"
            texto="Seu Seguro PhizChat já vale desde hoje. A apólice individual fica pronta em até 7 dias e a gente te avisa aqui. Enquanto isso, o bilhete do seguro já está disponível."
            rodape={SX_RODAPE}
            ctas={[{ label: "Ver meu seguro", onClick: () => nav.push("seguro") }]} /> }
      ]
    : [
        { sys: SX_E2E, warn: true },
        { data: "Hoje" },
        { node: <PzBiz media={midia} hora="11:22"
            titulo="Seguro PhizChat contra golpes. Verificou, ganhou."
            texto="PhizChat é o único app com seguro contra golpes. Se uma conta falsa te enganar, você não fica sozinho nessa."
            rodape={SX_RODAPE}
            ctas={[{ label: "Saiba mais", onClick: () => nav.push("seguro") }]} /> }
      ];
  return (
    <window.PhizHiFi.Screen>
      <PzChatHeader nome="PhizChat" selo status="Conta oficial"
        avatar={<SxDicasAv />} onVoltar={() => nav.pop()} acoes={null} />
      <PzChat seguir={ativo ? "a" : "i"}>
        <PzThread itens={itens} />
      </PzChat>
      <div className="sg-so-admin">Apenas <em>PhizChat</em> pode enviar mensagens</div>
    </window.PhizHiFi.Screen>
  );
}

/* ── Seguro PhizChat (2449:43337 · inativo / 2357:37461 · ativo) ─────────
   Os 3 pontos do seguro. Inativo: CTA de verificação. Ativo: apólice. */
const SX_PONTOS = [
  { ic: "ic-check", t: "Até R$ 1.000 de cobertura", s: <React.Fragment>Caiu no golpe de uma conta falsa?<br />O Seguro PhizChat cobre o prejuízo.</React.Fragment> },
  { ic: "ic-face", t: "Verifique sua identidade", s: "Seu seguro é ativado assim que sua identidade é confirmada." },
  { ic: "ic-lock", t: "Vale entre contas verificadas", s: "O seguro funciona quando você e a pessoa com quem está conversando têm o selo de verificado." }
];

function SxSeguro({ params = {} }) {
  const nav = window.PhizHiFi.useNav();
  const ativo = useSxAtivo();
  const analise = !!params.analise;
  const [toast, setToast] = React.useState(null);
  const avisa = (t) => setToast(t + "·" + Date.now());
  // Voltando de um sinistro enviado: notificação do sistema + toast (uma vez)
  // "Abrir sinistro" abre a folha de suporte (params.suporte: true = vazia, "cheio" = preenchida)
  const [suporte, setSuporte] = React.useState(params.suporte || false);
  const [sinistro, setSinistro] = React.useState(() => {
    const envio = window.SxSinistroTelas && window.SxSinistroTelas.SXS_ENVIO;
    const v = !!params.sinistroAberto || !!(envio && envio.aberto);
    if (envio) envio.aberto = false;
    return v ? 1 : 0;
  });
  React.useEffect(() => { if (sinistro) avisa("Enviado com sucesso"); }, []);
  const enviouSuporte = () => { setSinistro(n => n + 1); avisa("Enviado com sucesso"); };
  return (
    <window.PhizHiFi.Screen>
      <div className="pg sx-seguro">
        {/* Em análise (vindo do "Verificou, ganhou."): voltar leva à Segurança da Conta */}
        <button className="sx-glass-back" aria-label="Voltar"
          onClick={() => (analise ? nav.setStackTo(["me", "config", "seguranca"]) : nav.pop())}><SxIc n="ic-back" /></button>
        <div className="pg-body sx-seguro-body">
          <div className="sx-seguro-topo">
            <img className="sx-medalha-xl" src={SX_IMG.medalha} alt="" />
            <h1>Seu primeiro seguro contra golpes</h1>
          </div>
          <div className="sx-pontos">
            {SX_PONTOS.map((p, i) => (
              <div key={p.ic} className="sx-ponto" style={{ animationDelay: (80 + i * 60) + "ms" }}>
                <span className="ic"><SxIc n={p.ic} /></span>
                <span className="tx"><span className="t">{p.t}</span><span className="s">{p.s}</span></span>
              </div>
            ))}
          </div>
          {analise && (
            <div className="sx-analise">
              <span className="ic"><window.Icon name="triangle-alert" size={20} /></span>
              <span className="tx"><span className="t">Verificação em análise</span><span className="s">Seu seguro contra golpes passa a valer assim que sua identidade for verificada.</span></span>
            </div>
          )}
          {/* Botões no fim da rolagem, não fixos */}
          <div className="sx-rodape sx-seguro-btns">
          {analise
            ? <SX.SgBtn onClick={() => avisa("Abre o cadastro de endereço")}>Cadastrar endereço</SX.SgBtn>
            : ativo
              ? <SX.SgBtn onClick={() => avisa("Abre a apólice do seguro")}>Ver apólice</SX.SgBtn>
              : <SX.SgBtn onClick={() => nav.push("verificar")}>Verificar identidade</SX.SgBtn>}
          <SX.SgBtn kind="secondary" icon="external-link" onClick={() => avisa("Abre a página do Seguro PhizChat")}>Mais sobre o seguro</SX.SgBtn>
          {ativo && !analise && <button className="sx-sinistro" onClick={() => setSuporte(true)}>Abrir sinistro</button>}
          </div>
        </div>
      </div>
      {suporte && <window.SxSinistroTelas.SxsSuporte cheio={suporte === "cheio"}
        onFechar={() => setSuporte(false)} onEnviar={enviouSuporte} />}
      {sinistro > 0 && <window.SxSinistroTelas.SxsNotificacao key={sinistro} onToque={() => avisa("Abrir email")} />}
      {toast && <SX.SgToast key={toast}>{toast.split("·")[0]}</SX.SgToast>}
    </window.PhizHiFi.Screen>
  );
}

/* ── Folha do seguro na conversa (2342:34060 · 2342:34139) ─────────────── */
function SxPessoa({ foto, nome, ok }) {
  return (
    <div className="sx-pessoa">
      <img src={foto} alt="" />
      <span className="n">{nome}</span>
      <span className={"v" + (ok ? " ok" : "")}>
        <img src={SX_IMG.ic(ok ? "badge-ok" : "badge-nao")} alt="" />{ok ? "Verificado" : "Não verificado"}
      </span>
    </div>
  );
}

// Os 4 cenários da folha (2342:34060 · 2342:34139 e variações), pelo par Arthur × Sophia.
// 1 Arthur ok, Sophia não · 2 Arthur não, Sophia ok · 3 nenhum · 4 os dois
const SX_CENARIOS = {
  1: { titulo: <React.Fragment>Esta pessoa não verificou<br />a identidade.</React.Fragment>,
       texto: "O Seguro PhizChat contra golpes não está ativo para esta conversa. Convide esta pessoa para verificar a conta para ativar o seguro.",
       cta: "Convidar para verificar" },
  2: { titulo: <React.Fragment>Verifique sua conta<br />e ganhe um seguro contra golpes para esta conversa.</React.Fragment>,
       texto: <React.Fragment>Verifique sua identidade<br />e ative o Seguro PhizChat contra<br />golpes de contas falsas.</React.Fragment>,
       cta: "Verificar sua identidade" },
  3: { titulo: <React.Fragment>Verifique sua conta<br />e ganhe um seguro contra golpes para esta conversa.</React.Fragment>,
       texto: "O Seguro PhizChat contra golpes vale exclusivamente para conversas entre contas verificadas.",
       cta: "Verificar sua identidade" },
  4: { titulo: "Seguro contra golpes está ativo para esta conversa.",
       texto: "Se esta pessoa não for quem diz ser e te aplicar um golpe, seu Seguro PhizChat tem cobertura." }
};
const sxCenario = (arthurOk, sophiaOk) => arthurOk ? (sophiaOk ? 4 : 1) : (sophiaOk ? 2 : 3);

function SxFolha({ cenario, onFechar, onCta, onSobre }) {
  const c = SX_CENARIOS[cenario];
  const ativo = cenario === 4;
  const arthurOk = cenario === 1 || cenario === 4;
  const sophiaOk = cenario === 2 || cenario === 4;
  return (
    <SX.SgSheet alta onClose={onFechar} className="sx-folha">
      {(fecha) => (
        <React.Fragment>
          <div className="sx-folha-topo">
            <img className={"sx-medalha-folha" + (ativo ? "" : " prata")} src={ativo ? SX_IMG.medalha : SX_IMG.prata} alt="" />
            <h2>{c.titulo}</h2>
          </div>
          <div className={"sx-par" + (ativo ? " ok" : "")}>
            <SxPessoa foto={SX_IMG.arthur} nome={arthurOk ? "Arthur C." : "Arthuzinho"} ok={arthurOk} />
            <span className="meio">{ativo ? <SxMedal size={30} /> : <SxIc n="ic-shield-warn" />}</span>
            <SxPessoa foto={SX_IMG.sophia} nome={sophiaOk ? "Sophia T." : "Sophia - Trabalho"} ok={sophiaOk} />
          </div>
          {ativo && <p className="sx-apolice">Apólice coletiva nº 0987.65.432100 • KEV Seguros<br />*válido somente no Brasil</p>}
          <p className="sx-folha-p">{c.texto}</p>
          <div className="sx-folha-btns">
            {c.cta && <SX.SgBtn onClick={onCta}>{c.cta}</SX.SgBtn>}
            <SX.SgBtn kind="secondary" onClick={onSobre}>Ver cobertura</SX.SgBtn>
          </div>
        </React.Fragment>
      )}
    </SX.SgSheet>
  );
}

/* Convite pra Sophia verificar (cenário 1): folha de confirmação (abre por cima da
   folha do seguro; "Agora não" volta pra ela) e a mensagem
   automática que entra na conversa. Enviar vale pra sessão (recarregar zera). */
const SX_CONVITE = { enviado: false };

function SxFolhaConvite({ onFechar, onEnviar }) {
  return (
    <SX.SgSheet onClose={onFechar} fechar={false} className="sx-convite-folha">
      {(fecha) => (
        <React.Fragment>
          <h2>Convidar para verificação</h2>
          <p>Enviaremos uma mensagem automática convidando seu contato para verificar a identidade</p>
          <div className="sx-folha-btns">
            <SX.SgBtn onClick={onEnviar}>Enviar mensagem</SX.SgBtn>
            <SX.SgBtn kind="secondary" onClick={fecha}>Agora não</SX.SgBtn>
          </div>
        </React.Fragment>
      )}
    </SX.SgSheet>
  );
}

function SxMsgConvite() {
  const A = (window.__SHARED || "../shared/") + "assets/";
  return (
    <div className="pz-brow me sx-msg-convite">
      <div className="pz-biz">
        <img className="rabo" src={A + "chat/tail-sent.svg"} alt="" />
        <div className="pz-biz-text">
          <div className="h">Seguro PhizChat</div>
          <div className="b">Verificando sua identidade você garante o Seguro PhizChat. Com isso conseguimos te indenizar em até R$ 1.000 caso sofra algum golpe por aqui.</div>
          <div className="f" />
          <span className="pz-biz-time"><window.PhizUI.PzStatus hora="11:22" lida /></span>
        </div>
        <div className="pz-biz-ctas"><button className="pz-biz-cta">Verificar identidade</button></div>
      </div>
    </div>
  );
}

/* ── Conversa com a Sophia ────────────────────────────────────────────────
   Inativo (9:3040 → 2327:28076 → 2327:28667): ao abrir, o aviso "Seguro
   Grátis · Saiba mais" desce do topo, fica um tempo e sobe.
   Ativo (9:1518 → 157:8978 → 339:42073): mesmo aviso, "Seguro contra golpes
   ativo"; o nome verificado da Sophia aparece no status. */
const SX_AVISO_VISTO = new Set();

function SxSophia({ params = {} }) {
  const nav = window.PhizHiFi.useNav();
  const modo = useSxModo();
  const cenario = params.cenario || sxCenario(modo === "ativo" || modo === "sophia-nao", modo === "ativo" || modo === "inativo");
  const ativo = cenario === 4;
  const [toast, setToast] = React.useState(null);
  const [convite, setConvite] = React.useState(false);
  const [enviado, setEnviado] = React.useState(SX_CONVITE.enviado);
  const { PzChatHeader, PzChat, PzThread, PzComposer, PzSelo } = window.PhizUI;
  // O aviso do topo aparece só na primeira vez que a conversa abre em cada cenário
  // (recarregar a página zera). Depois disso a conversa abre sem ele.
  const [aviso, setAviso] = React.useState(params.folha || SX_AVISO_VISTO.has(cenario) ? "fechado" : "espera");
  React.useEffect(() => { SX_AVISO_VISTO.add(cenario); }, [cenario]);
  const [folha, setFolha] = React.useState(!!params.folha);

  React.useEffect(() => {
    if (aviso === "espera") { const t = setTimeout(() => setAviso("aberto"), 700); return () => clearTimeout(t); }
    if (aviso === "aberto") { const t = setTimeout(() => setAviso("fechado"), 6000); return () => clearTimeout(t); }
  }, [aviso]);

  const status = ativo
    ? <span className="sx-st-ver">Sophia T. <PzSelo sm /></span>
    : <span>online</span>;
  // Cenários 1–3 usam a conversa do convite; o 4, a de quem já está verificado
  const itens = [{ data: "Sábado" }, ...(cenario === 4 ? SX_SOPHIA_ATIVO : SX_SOPHIA_INATIVO),
    ...(cenario === 1 && enviado ? [{ node: <SxMsgConvite /> }] : [])];
  const abreFolha = () => { setAviso("fechado"); setFolha(true); };

  return (
    <window.PhizHiFi.Screen>
      <PzChatHeader nome="Sophia Turner" foto={SX_IMG.sophia} status={status} onVoltar={() => nav.pop()} onQuem={() => nav.push("contato")} />
      <div className={"sx-aviso " + aviso}>
        <button className="sx-aviso-in" onClick={abreFolha}>
          <span className="sx-pill-medal p16"><img src={SX_IMG.medalPill} alt="" /></span>
          <span className="t">{ativo ? "Seguro contra golpes ativo" : cenario === 1 ? "Seguro inativo nesta conversa" : "Seguro grátis"}</span>
          <span className="l">Saiba mais</span>
        </button>
      </div>
      <PzChat seguir={(cenario === 4 ? "a" : "i") + (enviado ? "c" : "")}>
        <PzThread itens={itens} />
      </PzChat>
      <PzComposer />
      {folha && (
        <SxFolha cenario={cenario}
          onFechar={() => (params.folha ? nav.pop() : setFolha(false))}
          onCta={() => cenario === 1 ? setConvite(true) : nav.push("verificar")}
          onSobre={() => nav.push("seguro")} />
      )}
      {convite && (
        <SxFolhaConvite onFechar={() => setConvite(false)}
          onEnviar={() => { SX_CONVITE.enviado = true; setEnviado(true); setConvite(false); setFolha(false); }} />
      )}
      {toast && <SX.SgToast key={toast}>{toast.split("·")[0]}</SX.SgToast>}
    </window.PhizHiFi.Screen>
  );
}

/* ── Eu (57:13715 · inativo / 2432:41369 · ativo) ──────────────────────── */
function SxMe() {
  const nav = window.PhizHiFi.useNav();
  const ativo = useSxAtivo();
  const nivel = ativo ? 5 : 4;
  const R = ({ ic, lb, onClick, danger }) => (
    <div className={"sg-me-row" + (danger ? " danger" : "") + (onClick ? " tap" : "")} onClick={onClick}>
      <window.Icon name={ic} size={22} /><span className="lb">{lb}</span>{!danger && <window.Icon name="chevron-right" size={18} className="sg-chev" />}
    </div>
  );
  return (
    <window.PhizHiFi.Screen>
      <div className="pg sg-me">
        <div className="sg-me-bar">
          <h1>Eu</h1>
          <SxPilula ativo={ativo} novo onClick={() => nav.push("seguro")} />
          <button className="pg-iconbtn sm" aria-label="Editar perfil"><window.Icon name="pencil" size={20} /></button>
          <button className="pg-iconbtn sm" aria-label="Meu QR Code"><window.Icon name="qr-code" size={20} /></button>
        </div>
        <div className="pg-body sg-me-body">
          <div className="sg-me-id">
            <img src={SX_IMG.arthur} alt="" />
            <div className="n">Arthur Coimbra</div>
            {ativo && <div className="sx-me-ver">Arthur C. <window.PhizUI.PzSelo sm /></div>}
            <div className="h">Phiz ID: 116342</div>
          </div>
          <div className={"sg-me-card" + (ativo ? " sx-so-nivel" : "")}>
            <div className="sg-nivel" onClick={() => nav.push("seguranca")} role="button">
              <span className={"sg-nivel-ic" + (ativo ? " on" : "")}>{nivel}</span>
              <span className="t">Proteção da conta: Nível {nivel}</span>
              <window.Icon name="chevron-right" size={16} />
            </div>
            <div className={"sg-barras" + (ativo ? " verde" : "")}>{[0, 1, 2, 3, 4].map(i => <i key={i} className={i < nivel ? "on" : ""} />)}</div>
            {!ativo && (
              <div className="sg-me-verif" onClick={() => nav.push("verificar")}>
                <span className="t">Verifique sua identidade <window.PhizUI.PzSelo sm /></span>
                <span className="s">Aumente a credibilidade e a segurança da sua conta através da verificação</span>
              </div>
            )}
          </div>
          <div className="sg-me-grp"><R ic="at-sign" lb="Ative seu perfil" /></div>
          <div className="sg-me-grp">
            <R ic="share-2" lb="Convidar amigos" />
            <R ic="settings" lb="Configurações" onClick={() => nav.push("config")} />
          </div>
          <div className="sg-me-grp"><R ic="wallet" lb="Carteira" /></div>
          <div className="sg-me-grp"><R ic="heart" lb="Favoritos" /><R ic="clock" lb="Lembretes" /></div>
          <div className="sg-me-grp"><R ic="circle-help" lb="Central de ajuda" /></div>
          <div className="sg-me-grp"><R ic="log-out" lb="Sair" danger /></div>
          <div style={{ height: 120 }} />
        </div>
        <SxNav active="eu" />
      </div>
    </window.PhizHiFi.Screen>
  );
}

/* ── Segurança da Conta (48:12289 · inativo / 48:11344 · ativo) ────────── */
function SxSeguranca() {
  const nav = window.PhizHiFi.useNav();
  const ativo = useSxAtivo();
  const nivel = ativo ? 5 : 4;
  const Ok = () => <span className="sg-ok"><window.Icon name="check" size={14} /></span>;
  return (
    <SX.SgTela titulo="Segurança da Conta" onVoltar={() => nav.pop()}>
      <div className="sg-pad">
        {/* Nível + métodos num bloco só (Security Level · 48:12289) */}
        <div className="sx-nivel-bloco">
          <div className="sx-nivel-card">
            <span className={"sg-nivel-ic" + (ativo ? " on" : "")}>{nivel}</span>
            <div className="tx">
              <span className="t">Nível {nivel}</span>
              <div className={"sg-barras" + (ativo ? " verde" : "")}>{[0, 1, 2, 3, 4].map(i => <i key={i} className={i < nivel ? "on" : ""} />)}</div>
            </div>
          </div>
          <p className="sx-nivel-help">Deixe sua conta ainda mais protegida adicionando novos métodos de segurança.</p>
          <div className="sg-group sx-nivel-lista">
            {ativo
              ? <SX.SgItem titulo="Verifique sua identidade" sub="Verificado!" chevron={false} direita={<Ok />} />
              : <SX.SgItem titulo="Verifique sua identidade" sub="Ative e receba um selo de verificado"
                  direita={<span className="sx-sugerido">Sugerido</span>} onClick={() => nav.push("verificar")} />}
            <SX.SgItem titulo="E-mail de recuperação" sub="arth*******@****l.com" chevron={false} direita={<Ok />} />
            <SX.SgItem titulo="Senha" chevron={false} direita={<Ok />} />
            <SX.SgItem titulo="Verificação de dois fatores" chevron={false} direita={<Ok />} />
          </div>
        </div>
        {ativo
          ? <div className="sx-seg-ativo" role="button" onClick={() => nav.push("seguro")}>
              <SxMedal size={28} />
              <span className="tx"><span className="t">Seguro PhizChat</span><span className="s">Ativo</span></span>
              <Ok />
            </div>
          : <button className="sx-seg-card" onClick={() => nav.push("seguro")}>
              <span className="sx-seg-card-ic"><span className="sx-pill-medal"><img src={SX_IMG.medalPill} alt="" /></span></span>
              <span className="tx"><span className="t">Seguro grátis contra golpes</span><span className="s">Verificou, ganhou.</span></span>
              <window.Icon name="chevron-right" size={24} />
            </button>}
      </div>
      <SX.SgSecao>{ativo ? "Informações da Conta" : "Informações Pessoais"}</SX.SgSecao>
      <div className="sg-pad">
        <SX.SgGroup>
          <SX.SgItem titulo="Número de telefone" sub="+55 (11) 98765-4321" onClick={() => {}} />
          <SX.SgItem titulo="Endereços" sub={ativo ? "Casa · Av Engenheiro Luís Carlos Berrini, 1396 e mais 1 endereço" : undefined} onClick={() => {}} />
          <SX.SgItem titulo="PhizID" chevron={false} direita={<span className="sg-val">116342</span>} />
        </SX.SgGroup>
      </div>
      <SX.SgSecao>Dispositivos</SX.SgSecao>
      <div className="sg-pad">
        <SX.SgGroup>
          <SX.SgItem icone={<SxIc n="ic-phone-sync" />} titulo="Gerenciar dispositivos" sub="Veja onde você está conectado" onClick={() => {}} />
        </SX.SgGroup>
        <div style={{ height: 16 }} />
        <SX.SgGroup><SX.SgItem titulo="Excluir conta" critico /></SX.SgGroup>
      </div>
      <div style={{ height: 24 }} />
    </SX.SgTela>
  );
}

window.SxTelas = { SxContato, SxVerificado, SxChats, SxDicas, SxSeguro, SxSophia, SxMe, SxSeguranca, SX_MODO };
