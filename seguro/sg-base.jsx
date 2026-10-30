// sg-base.jsx — estado e peças compartilhadas do protótipo do Seguro PhizChat.
//
// Regras da base (não esquecer):
//  · Babel standalone NÃO isola arquivos: todo nome de topo vira global.
//    Tudo aqui tem prefixo SG_ / Sg. Classes CSS com prefixo sg-.
//  · Valores do arquivo Insurance (9YhviOWLjttXQ5ZGg4Zf33) e da Foundation:
//    verde #19B852 · texto verde #169343 · selo #1679E2 · crítico #CF293F ·
//    neutro #F5F5F5 · texto #141414 / #666 · títulos Poppins, resto SF Pro.

const SG_V = "?v=" + (window.__V || 1);
const SG_IMG = {
  sophia: "img/sophia.png" + SG_V,
  sophiaSm: "img/sophia.png" + SG_V,
  arthur: "img/arthur.png" + SG_V,
  promo: "img/promo.png" + SG_V,
  kev: "img/kev.png" + SG_V,
  prints: ["img/print-1.png", "img/print-2.png", "img/print-3.png"].map(x => x + SG_V),
  logo: (window.__SHARED || "../shared/") + "assets/logomark-green.svg"
};

/* ── Estado do protótipo ──────────────────────────────────────────────────
   Pequeno o bastante pra caber num objeto. Cada passo da sidebar aplica um
   "preset" (app.jsx), então pular de um passo pro outro sempre mostra o
   cenário certo, e as ações dentro das telas mudam o estado de verdade
   (salvar endereço, trocar o principal, excluir…). */

const SG_ENDERECOS = {
  casa: { id: "casa", nome: "Casa", cep: "04571-000", rua: "Av. Engenheiro Luís Carlos Berrini", num: "1396", comp: "", bairro: "Itaim Bibi", cidade: "São Paulo", uf: "SP" },
  trab: { id: "trab", nome: "Trabalho", cep: "04551-060", rua: "Rua Funchal", num: "418", comp: "15º andar", bairro: "Vila Olímpia", cidade: "São Paulo", uf: "SP" }
};

const SG_STORE = {
  s: {
    verificado: true,            // a minha identidade
    enderecos: [SG_ENDERECOS.casa, SG_ENDERECOS.trab],
    principal: "casa",
    apolice: "emitida"           // "nenhuma" | "emissao" | "emitida"
  },
  subs: new Set(),
  set(p) { this.s = { ...this.s, ...p }; this.subs.forEach(f => f()); },
  reset(p) { if (p) this.set(JSON.parse(JSON.stringify(p))); }
};
window.SG_STORE = SG_STORE;

function useSg() {
  const [, tick] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => { SG_STORE.subs.add(tick); return () => SG_STORE.subs.delete(tick); }, []);
  return SG_STORE.s;
}

const sgPrincipal = (s) => s.enderecos.find(e => e.id === s.principal) || s.enderecos[0];
const sgLinha = (e) => e ? `${e.rua}, ${e.num}${e.comp ? " · " + e.comp : ""} · ${e.bairro}, ${e.cidade} – ${e.uf} · ${e.cep}` : "";
const sgLinhaCurta = (e) => e ? `${e.rua}, ${e.num}` : "";
const sgReduz = () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ── Escudo do seguro ─────────────────────────────────────────────────────
   No Figma é o componente "Seguro — escudo com campo de força" (189:7776):
   arcos verdes em volta do escudo, trocando de variante por tempo. Aqui os
   arcos giram 1 volta e meia e assentam (nada gira pra sempre). */
const SG_ARCOS = "M31.6572 35.2939C32.0994 34.9634 32.7259 35.054 33.0566 35.4961C33.3874 35.9382 33.2973 36.5646 32.8555 36.8955C29.5301 39.3832 25.3998 40.8574 20.9287 40.8574C16.4576 40.8574 12.3274 39.3832 9.00195 36.8955C8.55996 36.5646 8.47002 35.9382 8.80078 35.4961C9.1316 35.0541 9.75803 34.9633 10.2002 35.2939C13.1917 37.5318 16.9041 38.8574 20.9287 38.8574C24.9533 38.8574 28.6658 37.5318 31.6572 35.2939ZM1 20.9287C1 16.4576 2.47329 12.3274 4.96094 9.00195C5.29176 8.55972 5.91909 8.46996 6.36133 8.80078C6.80326 9.13168 6.89324 9.75808 6.5625 10.2002C4.32471 13.1917 3 16.9042 3 20.9287C3.00003 24.9533 4.32466 28.6658 6.5625 31.6572C6.89325 32.0994 6.80337 32.7258 6.36133 33.0566C5.91913 33.3874 5.29179 33.2976 4.96094 32.8555C2.47328 29.5301 1.00003 25.3998 1 20.9287ZM38.8574 20.9287C38.8574 16.9041 37.5318 13.1917 35.2939 10.2002C34.9633 9.75803 35.0541 9.1316 35.4961 8.80078C35.9382 8.47002 36.5646 8.55996 36.8955 9.00195C39.3832 12.3274 40.8574 16.4576 40.8574 20.9287C40.8574 25.3998 39.3832 29.5301 36.8955 32.8555C36.5646 33.2973 35.9382 33.3874 35.4961 33.0566C35.054 32.7259 34.9634 32.0994 35.2939 31.6572C37.5318 28.6658 38.8574 24.9533 38.8574 20.9287ZM20.9287 1C25.3998 1.00003 29.5301 2.47329 32.8555 4.96094C33.2976 5.29179 33.3874 5.91913 33.0566 6.36133C32.7258 6.80337 32.0994 6.89325 31.6572 6.5625C28.6658 4.32467 24.9533 3.00003 20.9287 3C16.9042 3 13.1917 4.32471 10.2002 6.5625C9.75808 6.89324 9.13168 6.80326 8.80078 6.36133C8.46996 5.91909 8.55972 5.29176 9.00195 4.96094C12.3274 2.47329 16.4576 1 20.9287 1Z";

function SgShieldGlyph({ size = 24, cor = "#169343", check = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.2 4.6 5c-.4.2-.6.5-.6.9v5.6c0 4.6 3.1 8.6 7.7 10.2.2.1.4.1.6 0 4.6-1.6 7.7-5.6 7.7-10.2V5.9c0-.4-.2-.7-.6-.9L12 2.2Z" fill={cor} />
      <path d="m8.4 12.2 2.4 2.4 4.8-4.8" fill="none" stroke={check} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SgShield({ size = 104, anima = true }) {
  return (
    <span className={"sg-shield" + (anima && !sgReduz() ? " anima" : "")} style={{ width: size, height: size }} aria-hidden="true">
      <svg className="arcos" viewBox="0 0 42 42" width={size} height={size}>
        <path d={SG_ARCOS} fill="#19B852" opacity=".9" />
      </svg>
      <span className="miolo"><SgShieldGlyph size={size * 0.5} /></span>
    </span>
  );
}

/* Botão de vidro com o escudo, igual ao do Contact info (164:12856). */
const SgShieldGlass = ({ onClick, pulsa }) => (
  <button className={"pz-glass sg-glass-seg" + (pulsa ? " pulsa" : "")} aria-label="Seguro PhizChat" onClick={onClick}>
    <SgShieldGlyph size={22} cor="#19B852" />
  </button>
);

/* ── Kev Seguros (Transmission Chat Card do arquivo) ─────────────────────── */
function SgKev({ link = true, onLink }) {
  return (
    <div className="sg-kev">
      <img src={SG_IMG.kev} alt="Kev Seguros" />
      <div className="tx">
        <span>Seguro feito pela <em>Kev Seguros</em>, autorizada pela SUSEP.</span>
        {link && <button className="sg-link" onClick={onLink}>Entenda sobre o seguro</button>}
      </div>
    </div>
  );
}

/* Eu × outra pessoa, com o estado de verificação de cada um. */
function SgPar({ eu, outro, meio }) {
  const P = ({ p }) => (
    <div className="sg-par-p">
      <img src={p.foto} alt="" />
      <span className="n">{p.nome}</span>
      <span className={"v" + (p.ok ? " ok" : "")}>
        {p.ok ? <window.PhizUI.PzIcon n="chat/badge-verified" size={14} /> : <window.Icon name="circle-alert" size={13} />}
        {p.ok ? "Verificado" : "Não verificado"}
      </span>
    </div>
  );
  return (
    <div className="sg-par">
      <P p={eu} />
      <span className={"sg-par-meio " + (meio === "ok" ? "ok" : "warn")}>
        <SgShieldGlyph size={22} cor={meio === "ok" ? "#19B852" : "#E5A100"} check={meio === "ok" ? "#fff" : "#fff"} />
      </span>
      <P p={outro} />
    </div>
  );
}

/* ── Botões (Button do DS: primary / secondary / tertiary / critical) ──── */
function SgBtn({ kind = "primary", icon, loading, ok, onClick, children, disabled, small }) {
  return (
    <button className={"sg-btn " + kind + (small ? " small" : "") + (loading ? " loading" : "") + (ok ? " ok" : "")}
      onClick={loading || disabled ? undefined : onClick} disabled={disabled} aria-busy={loading || undefined}>
      {loading ? <span className="sg-spin" aria-label="Carregando" />
        : ok ? <window.Icon name="check" size={20} />
        : <React.Fragment>{icon && <window.Icon name={icon} size={18} />}<span>{children}</span></React.Fragment>}
    </button>
  );
}

/* ── Folha (BottomSheet do DS) ──────────────────────────────────────────── */
function SgSheet({ onClose, children, fechar = true, alta, className = "" }) {
  const [saindo, setSaindo] = React.useState(false);
  const fecha = () => {
    if (!onClose) return;
    if (sgReduz()) return onClose();
    setSaindo(true);
    setTimeout(onClose, 220);
  };
  return (
    <div className={"sg-sheet-wrap" + (saindo ? " saindo" : "")}>
      <div className="sg-scrim" onClick={fecha} />
      <div className={"sg-sheet " + (alta ? "alta " : "") + className} role="dialog" aria-modal="true">
        {fechar && (
          <button className="sg-sheet-x" aria-label="Fechar" onClick={fecha}><window.Icon name="x" size={20} /></button>
        )}
        {typeof children === "function" ? children(fecha) : children}
      </div>
    </div>
  );
}

/* ── Snackbar do DS (pílula escura) ─────────────────────────────────────── */
function SgToast({ children, ms = 2600 }) {
  const [vis, setVis] = React.useState(true);
  React.useEffect(() => { const t = setTimeout(() => setVis(false), ms); return () => clearTimeout(t); }, []);
  if (!children) return null;
  return <div className={"sg-toast" + (vis ? "" : " sai")} role="status">{children}</div>;
}

/* ── Campo de texto (TextField do DS: rótulo que sobe pra borda) ────────── */
function SgField({ label, value, onChange, erro, ajuda, icone, multi, carregando, inputMode, maxLength, onBlur, autoFocus, type = "text", sacode, readOnly, onClick }) {
  const [foco, setFoco] = React.useState(false);
  const cheio = value !== undefined && value !== null && String(value).length > 0;
  const Tag = multi ? "textarea" : "input";
  return (
    <div className={"sg-field" + (foco ? " foco" : "") + (cheio ? " cheio" : "") + (erro ? " erro" : "") + (multi ? " multi" : "") + (sacode ? " sacode" : "")} onClick={onClick}>
      <label>
        <span className="lb">{label}</span>
        <Tag value={value || ""} type={multi ? undefined : type} inputMode={inputMode} maxLength={maxLength} readOnly={readOnly}
          autoFocus={autoFocus} rows={multi ? 4 : undefined}
          onChange={(e) => onChange && onChange(e.target.value)}
          onFocus={() => setFoco(true)} onBlur={() => { setFoco(false); onBlur && onBlur(); }} />
        {carregando ? <span className="sg-spin verde" aria-label="Buscando" /> : icone ? <span className="ic"><window.Icon name={icone} size={20} /></span> : null}
      </label>
      {((erro && erro.trim()) || ajuda) && (
        <div className={"sg-help" + (erro && erro.trim() ? " erro" : "")}>
          {erro && erro.trim() && <window.Icon name="circle-alert" size={14} />}
          <span>{(erro && erro.trim()) || ajuda}</span>
        </div>
      )}
    </div>
  );
}

/* ── Lista agrupada (GroupList/Item + ListItem do DS) ───────────────────── */
const SgGroup = ({ children }) => <div className="sg-group">{children}</div>;
function SgItem({ titulo, sub, sub2, tag, direita, chevron = true, critico, onClick, avatar, icone, desabilitado, switchOn, onSwitch, novo }) {
  return (
    <div className={"sg-item" + (onClick && !desabilitado ? " tap" : "") + (critico ? " critico" : "") + (desabilitado ? " off" : "")}
      onClick={desabilitado ? undefined : onClick} role={onClick ? "button" : undefined}>
      {avatar && <img className="av" src={avatar} alt="" />}
      {icone && <span className="ic">{icone}</span>}
      <span className="tx">
        <span className="t">{titulo}{novo && <span className="tag-novo">novo</span>}</span>
        {sub && <span className="s">{sub}</span>}
        {sub2 && <span className="s2">{sub2}</span>}
      </span>
      {tag && <span className="sg-tag">{tag}</span>}
      {direita}
      {onSwitch !== undefined && onSwitch !== null && (
        <button className={"sg-switch" + (switchOn ? " on" : "")} role="switch" aria-checked={!!switchOn}
          onClick={(e) => { e.stopPropagation(); onSwitch && onSwitch(); }} disabled={desabilitado} aria-label={titulo} />
      )}
      {chevron && !critico && onSwitch === undefined && <window.Icon name="chevron-right" size={18} className="sg-chev" />}
    </div>
  );
}

const SgSecao = ({ children }) => <div className="sg-secao">{children}</div>;

/* Tela interna padrão do arquivo: voltar 40 + título Poppins 32 (AppBar medium). */
function SgTela({ titulo, onVoltar, children, rodape, extra, fundo }) {
  return (
    <window.PhizHiFi.Screen>
      <div className={"pg sg-pg" + (fundo ? " " + fundo : "")}>
        <window.PhizConfig.Topo titulo={titulo} onVoltar={onVoltar} />
        <div className="pg-body sg-body">{children}</div>
        {rodape && <div className="sg-rodape">{rodape}</div>}
      </div>
      {extra}
    </window.PhizHiFi.Screen>
  );
}

window.SgBase = {
  SG_IMG, SG_ENDERECOS, SG_STORE, useSg, sgPrincipal, sgLinha, sgLinhaCurta, sgReduz,
  SgShield, SgShieldGlyph, SgShieldGlass, SgKev, SgPar, SgBtn, SgSheet, SgToast, SgField,
  SgGroup, SgItem, SgSecao, SgTela
};
