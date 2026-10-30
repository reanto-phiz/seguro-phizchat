// sx-sinistro.jsx — abertura de sinistro (Account security · I1 Pedir indenização
// 346:9620 → BottomSheet Escolher a conta 347:10612 → I3 Pedido preenchido 346:9664).
// Entra pelo "Abrir sinistro" da tela do seguro ativo. Ao enviar, volta pro seguro
// com a notificação e o toast de sinistro aberto; a notificação abre a conversa
// da conta oficial "Seguro PhizChat" com a confirmação.

const SXS_IMG = {
  bo: "img/sin-bo.jpg" + SX_V,
  comprovante: "img/sin-comprovante.jpg" + SX_V,
  prints: [1, 2, 3].map(n => "img/sin-print" + n + ".jpg" + SX_V)
};

// Contas verificadas com conversa — só elas aparecem na folha (cobertas pelo seguro)
const SXS_CONTAS = [
  { id: "sophia", nome: "Sophia Turner", foto: "img/sophia.png", quando: "Conversa de hoje" },
  { id: "vitor", nome: "Vitor da Silva Machado", foto: "img/av-vitor.jpg", quando: "Conversa de ontem" },
  { id: "ana", nome: "Ana Maria", foto: "img/av-ana.jpg", quando: "Conversa de 12/10" }
];

// Exemplos do Figma: tocar num campo vazio já preenche, pra demo andar rápido
const SXS_EXEMPLO = {
  data: "14/10/2026",
  valor: "R$ 180,00",
  texto: "A Sophia me pediu R$ 180 por Pix para dividir o presente de aniversário de uma amiga em comum. Fiz o Pix e depois descobri que ela não era a Sophia de verdade."
};

const SXS_CHEIO = { conta: "sophia", data: SXS_EXEMPLO.data, valor: SXS_EXEMPLO.valor, texto: SXS_EXEMPLO.texto, bo: true, comprovante: true, prints: 3 };
const SXS_VAZIO = { conta: null, data: "", valor: "", texto: "", bo: false, comprovante: false, prints: 0 };

// Pedido enviado: a tela do seguro mostra a notificação e o toast ao voltar
const SXS_ENVIO = { aberto: false };

/* Campo com rótulo que sobe quando tem valor (Text Field do DS) */
function SxsCampo({ label, valor, onChange, exemplo, icone, area }) {
  const Tag = area ? "textarea" : "input";
  return (
    <label className={"sxs-campo" + (valor ? " cheio" : "") + (area ? " area" : "")}>
      {valor && <span className="lb">{label}</span>}
      <Tag value={valor} placeholder={label} rows={area ? 5 : undefined}
        onFocus={() => { if (!valor && exemplo) onChange(exemplo); }}
        onChange={(e) => onChange(e.target.value)} />
      {icone && <window.Icon name={icone} size={22} />}
    </label>
  );
}

/* Anexo: miniatura 82×148 com o X de remover (Print anexado 346:10014) */
function SxsAnexo({ src, onRemover }) {
  return (
    <div className="sxs-anexo">
      <img src={src} alt="" />
      <button className="sxs-remover" aria-label="Remover" onClick={onRemover}><img src={SX_IMG.ic("ic-remover")} alt="" /></button>
    </div>
  );
}

const SxsMais = ({ onClick, label }) => (
  <button className="sxs-mais" aria-label={label} onClick={onClick}><window.Icon name="plus" size={24} /></button>
);

function SxSinistro({ params = {} }) {
  const nav = window.PhizHiFi.useNav();
  const [f, setF] = React.useState(params.preenchido ? SXS_CHEIO : SXS_VAZIO);
  const [folha, setFolha] = React.useState(!!params.conta);
  const [enviando, setEnviando] = React.useState(false);
  const set = (k) => (v) => setF(x => ({ ...x, [k]: v }));
  const conta = SXS_CONTAS.find(c => c.id === f.conta);
  const pronto = conta && f.data && f.valor && f.texto && f.bo && f.comprovante && f.prints >= 3;

  const enviar = () => {
    setEnviando(true);
    setTimeout(() => {
      SXS_ENVIO.aberto = true;
      const resto = nav.stack.filter(x => !String(x.screen).startsWith("sinistro"));
      nav.setStackTo(resto.length ? resto.map(x => ({ screen: x.screen, params: x.params })) : ["chats", "dicas", "seguro"]);
    }, 900);
  };

  const ajudaPrints = f.prints >= 3
    ? f.prints + " prints adicionados. Pode enviar mais, se ajudar. No máximo 40 MB"
    : f.prints > 0
      ? (f.prints === 1 ? "1 print adicionado" : f.prints + " prints adicionados") + ". Adicione pelo menos 3. No máximo 40 MB."
      : "Adicione pelo menos 3 prints da conversa com a conta. No máximo 40 MB.";

  return (
    <SX.SgTela titulo="Abrir Sinistro" onVoltar={() => nav.pop()}
      rodape={<SX.SgBtn disabled={!pronto} loading={enviando} onClick={enviar}>Enviar pedido</SX.SgBtn>}
      extra={folha && (
        <SX.SgSheet onClose={() => setFolha(false)} className="sxs-folha">
          {(fecha) => (
            <React.Fragment>
              <h2>Quem aplicou o golpe?</h2>
              <p>Aparecem só conversas com contas de identidade verificada, que são as cobertas pelo Seguro PhizChat.</p>
              <div className="sg-group">
                {SXS_CONTAS.map(c => (
                  <SX.SgItem key={c.id} avatar={c.foto + SX_V} titulo={c.nome} sub={c.quando} chevron={false}
                    onClick={() => { set("conta")(c.id); fecha(); }} />
                ))}
              </div>
            </React.Fragment>
          )}
        </SX.SgSheet>
      )}>
      <div className="sxs">
        <SX.SgSecao>Quem aplicou o golpe</SX.SgSecao>
        <div className="sg-pad">
          <div className="sg-group">
            {conta
              ? <SX.SgItem avatar={conta.foto + SX_V} titulo={conta.nome} sub="Identidade verificada" onClick={() => setFolha(true)} />
              : <SX.SgItem titulo="Escolher conta" sub="Só contas com identidade verificada" onClick={() => setFolha(true)} />}
          </div>
        </div>

        <SX.SgSecao>Quando aconteceu</SX.SgSecao>
        <div className="sg-pad"><SxsCampo label="Data do golpe" valor={f.data} onChange={set("data")} exemplo={SXS_EXEMPLO.data} icone="calendar" /></div>

        <SX.SgSecao>Quantia</SX.SgSecao>
        <div className="sg-pad"><SxsCampo label="Valor" valor={f.valor} onChange={set("valor")} exemplo={SXS_EXEMPLO.valor} /></div>

        <SX.SgSecao>O que aconteceu</SX.SgSecao>
        <div className="sg-pad"><SxsCampo area label="Descreva o que aconteceu" valor={f.texto} onChange={set("texto")} exemplo={SXS_EXEMPLO.texto} /></div>

        <SX.SgSecao>Boletim de Ocorrência</SX.SgSecao>
        <div className="sg-pad sxs-anexos">
          <div className="fila">{f.bo
            ? <SxsAnexo src={SXS_IMG.bo} onRemover={() => set("bo")(false)} />
            : <SxsMais label="Adicionar boletim de ocorrência" onClick={() => set("bo")(true)} />}</div>
          <p className="ajuda">No máximo 40 MB</p>
        </div>

        <SX.SgSecao>Comprovante de pagamento do banco</SX.SgSecao>
        <div className="sg-pad sxs-anexos">
          <div className="fila">{f.comprovante
            ? <SxsAnexo src={SXS_IMG.comprovante} onRemover={() => set("comprovante")(false)} />
            : <SxsMais label="Adicionar comprovante" onClick={() => set("comprovante")(true)} />}</div>
          <p className="ajuda">No máximo 40 MB</p>
        </div>

        <SX.SgSecao>Prints da conversa</SX.SgSecao>
        <div className="sg-pad sxs-anexos">
          <div className="fila">
            {f.prints === 0
              ? <SxsMais label="Adicionar print" onClick={() => set("prints")(1)} />
              : <React.Fragment>
                  {Array.from({ length: f.prints }, (_, i) => (
                    <SxsAnexo key={i} src={SXS_IMG.prints[i % 3]} onRemover={() => set("prints")(f.prints - 1)} />
                  ))}
                  <button className="sxs-add" onClick={() => set("prints")(f.prints + 1)}>
                    <img src={SX_IMG.ic("ic-add-square")} alt="" /><span>Adicionar</span>
                  </button>
                </React.Fragment>}
          </div>
          <p className="ajuda">{ajudaPrints}</p>
        </div>
        <div style={{ height: 16 }} />
      </div>
    </SX.SgTela>
  );
}

/* Conversa da conta oficial "Seguro PhizChat": confirma o sinistro aberto.
   Abre tocando na notificação (ou pela sidebar). Só a conta envia mensagens. */
const SxsSeguroAv = ({ size = 40 }) => (
  <span className="sxs-seguro-av" style={{ width: size, height: size }}>
    <span className="sx-pill-medal"><img src={SX_IMG.medalPill} alt="" /></span>
  </span>
);

function SxSeguroChat() {
  const nav = window.PhizHiFi.useNav();
  const { PzChatHeader, PzChat, PzThread, PzBiz } = window.PhizUI;
  const [toast, setToast] = React.useState(null);
  const itens = [
    { sys: SX_E2E, warn: true },
    { data: "Hoje" },
    { node: <PzBiz hora="9:41"
        titulo="Seu sinistro foi aberto"
        texto="Recebemos seu pedido de indenização pelo golpe na conversa com Sophia Turner, de R$ 180,00 em 14/10/2026. Ele está em análise e a gente te responde por aqui em até 10 dias úteis."
        rodape="Protocolo nº 2026.1030.4817"
        ctas={[{ label: "Acompanhar pedido", onClick: () => setToast("Abre o acompanhamento do sinistro·" + Date.now()) }]} /> }
  ];
  return (
    <window.PhizHiFi.Screen>
      <PzChatHeader nome="Seguro PhizChat" selo status="Conta oficial"
        avatar={<SxsSeguroAv />} onVoltar={() => nav.pop()} acoes={null} />
      <PzChat seguir="s">
        <PzThread itens={itens} />
      </PzChat>
      <div className="sg-so-admin">Apenas <em>Seguro PhizChat</em> pode enviar mensagens</div>
      {toast && <SX.SgToast key={toast}>{toast.split("·")[0]}</SX.SgToast>}
    </window.PhizHiFi.Screen>
  );
}

/* Notificação do sistema ao voltar pro seguro: desce, fica ~4s e sobe.
   Tocar nela abre a conversa do Seguro PhizChat. */
function SxsNotificacao() {
  const nav = window.PhizHiFi.useNav();
  const [fase, setFase] = React.useState("entra");
  React.useEffect(() => {
    const a = setTimeout(() => setFase("sai"), 4200);
    const b = setTimeout(() => setFase("fim"), 4600);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []);
  if (fase === "fim") return null;
  return (
    <div className={"sxs-notif " + fase} role="button" aria-label="Abrir conversa do Seguro PhizChat"
      onClick={() => { setFase("fim"); nav.push("seguro-chat"); }}>
      <img className="ic" src={(window.__SHARED || "../shared/") + "assets/logomark-green.svg"} alt="" />
      <span className="tx"><b>Seguro PhizChat</b><span>Seu Sinistro foi aberto e está em análise</span></span>
      <span className="h">9:41 AM</span>
    </div>
  );
}

window.SxSinistroTelas = { SxSinistro, SxSeguroChat, SxsNotificacao, SXS_ENVIO };
