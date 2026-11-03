// sx-sinistro.jsx — abertura de sinistro (Account security · I1 Pedir indenização
// 346:9620 → BottomSheet Escolher a conta 347:10612 → I3 Pedido preenchido 346:9664).
// Hoje o "Abrir sinistro" do seguro ativo abre a folha de suporte (SxsSuporte); ao
// enviar, a tela do seguro mostra a notificação e o snackbar. O formulário fica
// fora do fluxo, só por link direto (#…/sinistro-form).

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
  texto: "A Sophia me pediu R$ 180 por Pix para dividir o presente de aniversário de uma amiga em comum. Fiz o Pix e depois descobri que ela não era a Sophia de verdade.",
  email: "arthur.coimbra@gmail.com"
};

const SXS_CHEIO = { conta: "sophia", data: SXS_EXEMPLO.data, valor: SXS_EXEMPLO.valor, texto: SXS_EXEMPLO.texto, email: SXS_EXEMPLO.email, bo: true, comprovante: true, prints: 3 };
const SXS_VAZIO = { conta: null, data: "", valor: "", texto: "", email: "", bo: false, comprovante: false, prints: 0 };

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
  const pronto = conta && f.data && f.valor && f.texto && f.email && f.bo && f.comprovante && f.prints >= 3;

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

        <SX.SgSecao>Contato</SX.SgSecao>
        <div className="sg-pad"><SxsCampo label="Digite seu email" valor={f.email} onChange={set("email")} exemplo={SXS_EXEMPLO.email} /></div>

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

/* Folha de suporte (Feedback 2582:11494 · 11507 · 11520): é o que abre no
   "Abrir sinistro". Tocar num campo vazio preenche o exemplo; o "+" anexa até 9
   imagens. Enviar fecha a folha e a tela do seguro mostra o sinistro aberto. */
const SXS_SUPORTE = {
  email: "arthur.coimbra@gmail.com",
  telefone: "+55 (11) 98765-4321",
  nome: "Arthur Coimbra",
  texto: "Caí num golpe na conversa com a Sophia Turner: paguei R$ 180 por Pix e depois descobri que a conta era falsa."
};
const SXS_SUP_IMGS = [...SXS_IMG.prints, SXS_IMG.comprovante, SXS_IMG.bo];
const SXS_SUP_MAX = 150;

function SxsSuporte({ cheio, onFechar, onEnviar }) {
  const [f, setF] = React.useState(cheio
    ? { ...SXS_SUPORTE, imgs: 3 }
    : { email: "", telefone: "", nome: "", texto: "", imgs: 0 });
  const [enviando, setEnviando] = React.useState(false);
  const set = (k) => (v) => setF(x => ({ ...x, [k]: k === "texto" ? v.slice(0, SXS_SUP_MAX) : v }));
  const pronto = f.email && f.telefone && f.nome && f.texto;
  const campo = (k, label, area) => (
    <SxsCampo area={area} label={label} valor={f[k]} onChange={set(k)} exemplo={SXS_SUPORTE[k]} />
  );
  return (
    <SX.SgSheet onClose={onFechar} className="sxs-suporte">
      {(fecha) => (
        <React.Fragment>
          <h2>Envie seu feedback</h2>
          <div className="sxs-sup-corpo">
            <div className="sxs-sup-campos">
              {campo("email", "E-mail de contato")}
              {campo("telefone", "Número de telefone")}
              {campo("nome", "Nome")}
              <div>
                {campo("texto", "Descrição", true)}
                <p className="sxs-sup-conta">{f.texto.length}/{SXS_SUP_MAX}</p>
              </div>
            </div>
            <div className="sxs-sup-imgs-h"><h3>Imagens</h3><p>{f.imgs}/9</p></div>
            <div className="sxs-sup-imgs">
              {Array.from({ length: f.imgs }, (_, i) => (
                <div key={i} className="sxs-sup-img">
                  <img src={SXS_SUP_IMGS[i % SXS_SUP_IMGS.length]} alt="" />
                  <button className="sxs-sup-x" aria-label="Remover imagem"
                    onClick={() => setF(x => ({ ...x, imgs: x.imgs - 1 }))}><window.Icon name="x" size={14} /></button>
                </div>
              ))}
              {f.imgs < 9 && <SxsMais label="Adicionar imagem" onClick={() => setF(x => ({ ...x, imgs: x.imgs + 1 }))} />}
            </div>
          </div>
          <div className="sxs-sup-rodape">
            <SX.SgBtn disabled={!pronto} loading={enviando}
              onClick={() => { setEnviando(true); setTimeout(() => { onEnviar(); fecha(); }, 900); }}>Enviar</SX.SgBtn>
          </div>
        </React.Fragment>
      )}
    </SX.SgSheet>
  );
}

/* Notificação do sistema ao voltar pro seguro: desce, fica ~4s e sobe.
   Tocar nela só some e chama onToque (a tela mostra o snackbar "Abrir email"). */
function SxsNotificacao({ onToque }) {
  const [fase, setFase] = React.useState("entra");
  React.useEffect(() => {
    const a = setTimeout(() => setFase("sai"), 4200);
    const b = setTimeout(() => setFase("fim"), 4600);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []);
  if (fase === "fim") return null;
  return (
    <div className={"sxs-notif " + fase} role="button" aria-label="Abrir email"
      onClick={() => { setFase("fim"); if (onToque) onToque(); }}>
      <img className="ic" src={"img/ic-gmail.svg" + SX_V} alt="Gmail" />
      <span className="tx"><b>Seguro PhizChat</b><span>Seu Sinistro foi aberto e estamos trabalhando nele</span></span>
      <span className="h">9:41 AM</span>
    </div>
  );
}

window.SxSinistroTelas = { SxSinistro, SxsSuporte, SxsNotificacao, SXS_ENVIO };
