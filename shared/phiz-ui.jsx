// shared/phiz-ui.jsx — componentes de UI do PhizChat, medidos do Figma.
// Par do phiz-ui.css. Carregue depois do hifi-shared.jsx (usa o StatusBar dele
// via Screen) e antes das telas do protótipo.
//
//   Redesign Chats   Njtv9YG3qdWWZ90uEn0ty4 · Chat Screen 14707:26235 · Home 6043:69784
//   Discover         Vb3ykZcc48DMYGRovpRcyn · tab bar nova 725:32773 (NavigationBar 1186:7114)
//
// Tudo sai por window.PhizUI. Nenhum componente decide navegação sozinho:
// quem usa passa onClick / onGo.

const A = (window.__SHARED || "../shared/") + "assets/";

/* Ícone do arquivo pintado por máscara: a cor vem do `color` do pai. */
const PzIcon = ({ n, size = 24, style }) => (
  <span className="pz-ic" aria-hidden="true"
    style={{ "--src": `url(${A}${n}.svg)`, width: size, height: size, ...style }} />
);

/* O tamanho do ícone vai por prop (o PzIcon põe width/height inline, que
   vence qualquer CSS). Normal: 20 dentro de 24. Pequeno: 14 dentro de 16. */
const PzSelo = ({ sm }) => (
  <span className={"pz-selo" + (sm ? " sm" : "")} aria-label="Verificado">
    <PzIcon n="chat/badge-verified" size={sm ? 14 : 20} />
  </span>
);

/* ── Tab bar nova ─────────────────────────────────────────────────────── */
const PZ_TABS = [
  { id: "chats",     lb: "Chats",     ic: "navbar/chats" },
  { id: "ligacoes",  lb: "Ligações",  ic: "navbar/ligacoes" },
  { id: "descobrir", lb: "Descobrir", ic: "navbar/descobrir" },
  { id: "contatos",  lb: "Contatos",  ic: "navbar/contatos" },
  { id: "eu",        lb: "Eu",        ic: "navbar/eu" }
];

function PzNavBar({ active = "chats", badges = {}, onGo }) {
  const i = Math.max(0, PZ_TABS.findIndex(t => t.id === active));
  return (
    <nav className="pz-nav" aria-label="Navegação principal">
      <div className="pz-nav-box">
        <span className="pz-nav-sel" style={{
          left: `calc(4px + (100% - 8px) * ${i} / 5)`, width: "calc((100% - 8px) / 5)"
        }} />
        {PZ_TABS.map(t => (
          <button key={t.id} className={"pz-nav-item" + (t.id === active ? " on" : "")}
            aria-current={t.id === active ? "page" : undefined}
            onClick={() => onGo && onGo(t.id)}>
            <PzIcon n={t.ic} />
            <span className="lb">{t.lb}</span>
            {badges[t.id] ? <span className="pz-nav-tag">{badges[t.id]}</span> : null}
          </button>
        ))}
      </div>
      <div className="pz-nav-home" />
    </nav>
  );
}

/* ── App bar + busca da lista de conversas ────────────────────────────── */
function PzChatsBar({ onNovo }) {
  return (
    <div className="pz-appbar">
      <div className="pz-appbar-row">
        <button className="pz-ibtn" aria-label="Mais opções"><PzIcon n="chat/more-horizontal" /></button>
        <span className="sp" />
        <button className="pz-ibtn" aria-label="Phiz IA"><PzIcon n="chat/phiz-ai" /></button>
        <button className="pz-ibtn brand" aria-label="Nova conversa" onClick={onNovo}><PzIcon n="chat/add" /></button>
      </div>
      <div className="pz-logo"><img src={A + "chat/logo-phizchat.svg"} alt="PhizChat" /></div>
      <div className="pz-search"><PzIcon n="chat/search" /> Buscar conversas, perfis, canais...</div>
    </div>
  );
}

/* Uma linha da lista. prev pode ter { quem, status: "lida", midia: "camera"|"mic", texto } */
function PzChatRow({ foto, letra, cor, nome, selo, hora, nova, prev = {}, silencio, fixada, naoLidas, onClick, extraNome }) {
  return (
    <div className={"pz-row" + (onClick ? "" : " inerte")} onClick={onClick} role={onClick ? "button" : undefined}>
      {foto
        ? <img className="pz-av" src={foto} alt="" />
        : <span className="pz-av letra" style={{ background: cor || "#538FA6" }}>{letra}</span>}
      <div className="pz-row-tx">
        <div className="pz-row-top">
          <div className="pz-row-name"><span>{nome}</span>{selo && <PzSelo />}{extraNome}</div>
          <span className={"pz-row-time" + (nova ? " nova" : "")}>{hora}</span>
        </div>
        <div className="pz-row-bot">
          <div className="pz-row-prev">
            {prev.status === "lida" && <span style={{ color: "var(--pz-blue)", display: "flex" }}><PzIcon n="chat/status-read" size={20} /></span>}
            {prev.midia && <PzIcon n={"chat/media-" + prev.midia} size={16} />}
            {prev.quem && <b>{prev.quem}:</b>}
            <span className="t">{prev.texto}</span>
          </div>
          {(silencio || fixada || naoLidas) ? (
            <div className="pz-row-meta">
              {fixada && <PzIcon n="chat/pin" size={16} />}
              {silencio && <PzIcon n="chat/silent" size={16} />}
              {naoLidas ? <span className="pz-tag">{naoLidas}</span> : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* ── Conversa ─────────────────────────────────────────────────────────── */
function PzChatHeader({ nome, foto, avatar, selo, status, onVoltar, onQuem, acoes }) {
  return (
    <div className="pz-chead">
      <button className="pz-ibtn" aria-label="Voltar" onClick={onVoltar}><PzIcon n="chat/arrow-left" /></button>
      <div className="pz-chead-who" onClick={onQuem}>
        {avatar || <img className="av" src={foto} alt="" />}
        <div className="tx">
          <div className="pz-chead-name"><span>{nome}</span>{selo && <PzSelo />}</div>
          {status && <div className="pz-chead-st">{status}</div>}
        </div>
      </div>
      <div className="pz-chead-acts">
        {acoes !== undefined ? acoes : (
          <React.Fragment>
            <button className="pz-ibtn" aria-label="Videochamada"><PzIcon n="chat/video" /></button>
            <button className="pz-ibtn" aria-label="Ligar"><PzIcon n="chat/call" /></button>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

/* Hora + status de entrega, igual ao "Chat Message Status" do arquivo. */
const PzStatus = ({ hora, lida, entregue }) => (
  <span className="pz-bst">
    <span className="h">{hora}</span>
    {(lida || entregue) && (
      <span className={"ck " + (lida ? "lida" : "entregue")}><PzIcon n="chat/status-read" size={20} /></span>
    )}
  </span>
);

/* Uma bolha. `rabo` no último da sequência; `rico` troca o texto por conteúdo livre. */
function PzBubble({ me, rabo = true, hora, lida, entregue, children, rico, className = "" }) {
  return (
    <div className={"pz-brow " + (me ? "me" : "them")}>
      <div className={"pz-b " + className}>
        {rabo && <img className="rabo" src={A + (me ? "chat/tail-sent.svg" : "chat/tail-received.svg")} alt="" />}
        {rico ? (
          <React.Fragment>
            {children}
            <div className="pz-bfoot"><PzStatus hora={hora} lida={lida} entregue={entregue} /></div>
          </React.Fragment>
        ) : (
          <div className="pz-btx">
            <p>{children}</p>
            <PzStatus hora={hora} lida={me && lida} entregue={me && !lida} />
          </div>
        )}
      </div>
    </div>
  );
}

/* A conversa inteira a partir de uma lista — calcula os espaços (4 dentro do
   grupo, 12 entre grupos) e põe o rabinho só no último de cada sequência.
   Itens: { sys, warn } · { data } · { me|them, texto, hora, lida } · { node } */
function PzThread({ itens }) {
  const lado = (x) => x.me ? "me" : x.them ? "them" : null;
  const out = [];
  itens.forEach((x, i) => {
    const prev = itens[i - 1], next = itens[i + 1];
    if (i > 0) {
      const mesmo = lado(x) && lado(prev) === lado(x);
      out.push(<div key={"g" + i} className={mesmo ? "pz-g4" : "pz-g"} />);
    }
    if (x.sys) out.push(<div key={i} className={"pz-sys" + (x.warn ? " warn" : "")}>{x.sys}</div>);
    else if (x.data) out.push(<div key={i} className="pz-date">{x.data}</div>);
    else if (x.node) out.push(<React.Fragment key={i}>{x.node}</React.Fragment>);
    else {
      const ultimo = !next || lado(next) !== lado(x);
      out.push(
        <PzBubble key={i} me={!!x.me} rabo={ultimo} hora={x.hora} lida={x.lida}>{x.texto}</PzBubble>
      );
    }
  });
  return <div className="pz-chat-in">{out}</div>;
}

/* Área rolável que abre no fim, como o app.
   `pilula`: um aviso que flutua no topo enquanto a pessoa rola a conversa pra
   cima (como a data do WhatsApp) e some ~2s depois que ela para. Serve pra
   lembrar de algo que ficou lá no começo da conversa. */
function PzChat({ children, topo, pilula, onPilula, seguir, onEl }) {
  const ref = React.useRef(null);
  const [ver, setVer] = React.useState(false);
  const timer = React.useRef(null);
  React.useEffect(() => {
    if (topo) return;
    const baixo = () => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; };
    baixo();
    const t1 = setTimeout(baixo, 120), t2 = setTimeout(baixo, 420);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [seguir]);
  const rolou = () => {
    if (!pilula || !ref.current) return;
    const el = ref.current;
    const longe = el.scrollHeight - el.clientHeight - el.scrollTop > 80;
    setVer(longe);
    clearTimeout(timer.current);
    if (longe) timer.current = setTimeout(() => setVer(false), 2200);
  };
  return (
    <div className="pz-chat-wrap">
      <div className="pz-chat" ref={(el) => { ref.current = el; if (onEl) onEl(el); }} onScroll={rolou}>{children}</div>
      {pilula && (
        <button className={"pz-pill" + (ver ? " on" : "")} onClick={onPilula} tabIndex={ver ? 0 : -1}>
          {pilula}
        </button>
      )}
    </div>
  );
}

/* Linha de status do cabeçalho que alterna sozinha (online → nome verificado
   → conversa segurada…), subindo como um letreiro. Cada item: { node, ms }. */
function PzTicker({ itens }) {
  const [i, setI] = React.useState(0);
  const [anim, setAnim] = React.useState(true);
  const n = itens.length;
  React.useEffect(() => {
    if (n < 2) return;
    const t = setTimeout(() => { setAnim(true); setI(x => x + 1); }, (itens[i % n].ms || 2800));
    return () => clearTimeout(t);
  }, [i, n]);
  React.useEffect(() => {
    if (i === n) { const t = setTimeout(() => { setAnim(false); setI(0); }, 520); return () => clearTimeout(t); }
  }, [i, n]);
  const lista = n > 1 ? [...itens, itens[0]] : itens;
  return (
    <span className="pz-tick" aria-live="polite">
      <span className="pz-tick-in" style={{ transform: `translateY(${-18 * i}px)`, transition: anim ? undefined : "none" }}>
        {lista.map((x, k) => <span key={k} className={"pz-tick-i" + (k === i ? " on" : "")}>{x.node}</span>)}
      </span>
    </span>
  );
}

/* `onMais`: toque no "+". `mais`: painel de compartilhar aberto — o "+" vira
   teclado e o painel (Share Options, Redesign Chats 9079:12873) ocupa o lugar
   do teclado, logo abaixo do composer. `painel`: os itens (PzShare). */
function PzComposer({ placeholder = "Mensagem", onMais, mais, painel }) {
  return (
    <div className={"pz-comp-wrap" + (mais ? " aberto" : "")}>
    <div className="pz-comp">
      <button className="pz-ibtn pz-comp-add" aria-label={mais ? "Teclado" : "Anexar"} onClick={onMais}>
        <PzIcon n={mais ? "chat/keyboard" : "chat/add"} />
      </button>
      <div className="pz-comp-field">
        <span className="ph">{placeholder}</span>
        <PzIcon n="chat/sticker" />
        <PzIcon n="chat/camera" />
      </div>
      <button className="pz-comp-mic" aria-label="Gravar áudio"><PzIcon n="chat/mic" /></button>
    </div>
    {mais && painel}
    </div>
  );
}

/* Mensagem de empresa (Business API — "Mensagem CTA com URL" / "Mensagem com
   botões" do arquivo de Mensagens interativas). Bolha branca de 320, mídia com
   raio 8, título 17/20 590, texto 17/20, rodapé 13/16 cinza com a hora, e os
   botões embaixo separados por linha #D0D1C4, verdes, sem ícone.
   ctas: [{ label, onClick, disabled }] */
function PzBiz({ media, titulo, texto, rodape, hora, ctas = [], rabo = true, className = "" }) {
  return (
    <div className="pz-brow them">
      <div className={"pz-biz " + className}>
        {rabo && <img className="rabo" src={A + "chat/tail-received.svg"} alt="" />}
        {media && <div className="pz-biz-media">{media}</div>}
        <div className="pz-biz-text">
          {titulo && <div className="h">{titulo}</div>}
          {texto && <div className="b">{texto}</div>}
          <div className="f">{rodape || ""}</div>
          <span className="pz-biz-time">{hora}</span>
        </div>
        {ctas.length > 0 && (
          <div className="pz-biz-ctas">
            {ctas.map((c, i) => (
              <button key={i} className="pz-biz-cta" disabled={c.disabled} onClick={c.onClick}>{c.label}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* Share Options: círculo 48 rgba(0,0,0,.04) com ícone preenchido 32 e rótulo
   SF 11/16, 4 por linha. Item: { ic, label, novo, onClick }. */
const PZ_SHARE = [
  { ic: "share-gallery", label: "Galeria" }, { ic: "share-camera", label: "Câmera" },
  { ic: "share-location", label: "Localização" }, { ic: "share-contact", label: "Contato" },
  { ic: "share-documents", label: "Documentos" }, { ic: "share-rooms", label: "Salas" },
  { ic: "share-favorites", label: "Favoritos" }, { ic: "share-color", label: "Mudar cor" },
  { ic: "share-payments", label: "Pagamentos" }
];
function PzShare({ itens = PZ_SHARE }) {
  const linhas = [];
  for (let i = 0; i < itens.length; i += 4) linhas.push(itens.slice(i, i + 4));
  return (
    <div className="pz-share">
      {linhas.map((l, k) => (
        <div key={k} className="pz-share-row">
          {l.map(x => (
            <button key={x.label} className={"pz-share-it" + (x.novo ? " novo" : "")} onClick={x.onClick}>
              <span className="c"><PzIcon n={"chat/" + x.ic} size={32} />{x.novo && <em>Novo</em>}</span>
              <span className="l">{x.label}</span>
            </button>
          ))}
          {Array.from({ length: 4 - l.length }).map((_, j) => <span key={"v" + j} className="pz-share-it vazio" />)}
        </div>
      ))}
    </div>
  );
}


/* ── Página de contato (Contact Page, Fluxos Bull w44NoQanqFObk9AKfh3dP3 539:89666) ──
   Foto 393x393 com canto inferior direito 32, apelido da agenda em Poppins 32,
   embaixo o nome que a pessoa deu a si mesma + "Verificada" em azul claro. */
function PzContato({ foto, apelido, nome, verificado, onVoltar, children }) {
  const C = (n) => "contato/" + n;
  return (
    <div className="pz-ct">
      <div className="pz-ct-top">
        <img className="bg" src={foto} alt="" />
        <div className="bar">
          <button className="pz-glass" aria-label="Voltar" onClick={onVoltar}><PzIcon n={C("arrow-left")} /></button>
          <span className="sp" />
          <button className="pz-glass" aria-label="Editar contato"><PzIcon n={C("edit")} /></button>
        </div>
        <div className="txt">
          <div className="ap">{apelido}</div>
          <div className="sub">
            <span>{nome}</span>
            {verificado && <React.Fragment><i className="div" /><span className="ver"><PzIcon n={C("verified")} size={14} /> Verificada</span></React.Fragment>}
          </div>
        </div>
      </div>
      {/* Contato não verificado (Fluxos Bull 9174:62185): alerta amarelo antes das ações. */}
      {verificado === false && (
        <div className="pz-ct-alerta">
          <span className="ic"><PzIcon n={C("warning")} /></span>
          <span className="tx">
            <b>Identidade não verificada</b>
            <span>Esta pessoa não concluiu a verificação de identidade. Confirme quem é e fique atento a atividades suspeitas.</span>
          </span>
        </div>
      )}
      <div className="pz-ct-acts">
        {[["message", "Conversa"], ["call", "Ligar"], ["video", "Vídeo"], ["search", "Buscar"]].map(([ic, lb]) => (
          <div key={ic} className="pz-ct-act"><PzIcon n={C(ic)} /><span>{lb}</span></div>
        ))}
      </div>
      {children}
    </div>
  );
}

/* Cartão de lista do contato (List items, raio 24) + linha (56, px20, gap16). */
const PzCard = ({ children }) => <div className="pz-lcard">{children}</div>;
const PzLRow = ({ ic, label, val, danger, chev = true, onClick, extra }) => (
  <div className={"pz-lrow" + (danger ? " danger" : "") + (onClick ? " tap" : "")} onClick={onClick}>
    {ic && <PzIcon n={"contato/" + ic} />}
    <span className="c">
      <span className="lb">{label}</span>
      {extra}
      {val && <span className="val">{val}</span>}
      {chev && !danger && <PzIcon n="contato/chevron-sm" size={16} />}
    </span>
  </div>
);
const PzSecHead = ({ children }) => <div className="pz-sechead">{children}</div>;

window.PhizUI = {
  PzIcon, PzSelo, PzNavBar, PZ_TABS, PzChatsBar, PzChatRow,
  PzChatHeader, PzStatus, PzBubble, PzThread, PzChat, PzComposer, PzShare, PZ_SHARE, PzBiz, PzTicker,
  PzContato, PzCard, PzLRow, PzSecHead
};
