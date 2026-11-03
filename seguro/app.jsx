// app.jsx — a casca do protótipo: aparelho, pilha de navegação, sidebar de
// jornadas, troca de idioma e export de PNG.

const { useState: useStateApp, useEffect: useEffectApp, useRef: useRefApp } = React;
const { TweaksPanel, useTweaks } = window;
const { useNavStack, FrameStack, NavCtx } = window.PhizProtoNavStack;
const SXT = window.SxTelas;

// Linhas de Configurações que navegam neste protótipo.
window.__CONFIG_ROTAS = ["seguranca"];

// rota → { comp, params?, pais? }   `pais` = a pilha que fica atrás (pro "voltar" fazer sentido)
const ROTAS = {
  "promo":        { comp: SXT.SxChats, params: { promo: true } },
  "chats":        { comp: SXT.SxChats },
  "dicas":        { comp: SXT.SxDicas, pais: ["chats"] },
  "seguro":       { comp: SXT.SxSeguro, pais: ["chats", "dicas"] },
  "sophia":       { comp: SXT.SxSophia, pais: ["chats"] },
  "sophia-folha": { comp: SXT.SxSophia, params: { folha: true }, pais: ["chats"] },
  "contato":      { comp: SXT.SxContato, pais: ["chats", "sophia"] },
  "me":           { comp: SXT.SxMe },
  "config":       { comp: window.PhizConfig.ConfigScreen, params: { mira: "seguranca" }, pais: ["me"] },
  "seguranca":    { comp: SXT.SxSeguranca, pais: ["me", "config"] },
  // Verificação de identidade (sx-kyc.jsx) — pela sidebar entra a partir da Segurança da Conta
  "verificar":         { comp: window.SxKyc.SxKycIntro, pais: ["me", "config", "seguranca"] },
  "verificar-dados":   { comp: window.SxKyc.SxKycDados, pais: ["me", "config", "seguranca", "verificar"] },
  "verificar-rosto":   { comp: window.SxKyc.SxKycRosto, pais: ["me", "config", "seguranca", "verificar", "verificar-dados"] },
  "verificar-camera":  { comp: window.SxKyc.SxKycCamera, pais: ["me", "config", "seguranca", "verificar", "verificar-dados", "verificar-rosto"] },
  "verificar-analise": { comp: window.SxKyc.SxKycAnalise, pais: ["me", "config", "seguranca", "verificar", "verificar-dados"] },
  // Abertura de sinistro (sx-sinistro.jsx) — o "Abrir sinistro" do seguro ativo abre a folha de suporte
  "sinistro":             { comp: SXT.SxSeguro, params: { suporte: true }, pais: ["chats", "dicas"] },
  "sinistro-preenchido":  { comp: SXT.SxSeguro, params: { suporte: "cheio" }, pais: ["chats", "dicas"] },
  // Formulário de sinistro anterior (I1/I3): fora do fluxo, só por link direto
  "sinistro-form":            { comp: window.SxSinistroTelas.SxSinistro, pais: ["chats", "dicas", "seguro"] },
  "sinistro-form-conta":      { comp: window.SxSinistroTelas.SxSinistro, params: { conta: true }, pais: ["chats", "dicas", "seguro"] },
  "sinistro-form-preenchido": { comp: window.SxSinistroTelas.SxSinistro, params: { preenchido: true }, pais: ["chats", "dicas", "seguro"] },
  "sinistro-enviado":     { comp: SXT.SxSeguro, params: { sinistroAberto: true }, pais: ["chats", "dicas"] },
  // Verificado sem endereço (sx-endereco.jsx): cadastrar o endereço ativa o seguro
  "endereco-novo":        { comp: window.SxEndereco.SxEndNovo, pais: ["me", "config", "seguranca"] },
  "endereco-buscando":    { comp: window.SxEndereco.SxEndNovo, params: { buscando: true }, pais: ["me", "config", "seguranca"] },
  "endereco-preenchido":  { comp: window.SxEndereco.SxEndNovo, params: { cheio: true }, pais: ["me", "config", "seguranca"] },
  "enderecos":            { comp: window.SxEndereco.SxEnderecos, pais: ["me", "config", "seguranca"] },
  "enderecos-cadastrado": { comp: window.SxEndereco.SxEnderecos, params: { cadastrado: true }, pais: ["me", "config", "seguranca"] },
  // Kev Seguros (sx-kev.jsx): webview da apólice e mini app
  "apolice": { comp: window.SxKev.SxApolice, pais: ["chats", "dicas", "seguro"] },
  "kev":     { comp: window.SxKev.SxKevApp, pais: ["chats", "dicas", "seguro"] },
  // Depois do Concluído
  "verificado":     { comp: SXT.SxVerificado, pais: ["me", "config", "seguranca"] },
  // "Como funciona o seguro" abre o seguro já ativo; voltar leva à Segurança da Conta
  "seguro-verificado": { comp: SXT.SxSeguro, pais: ["me", "config", "seguranca"] },
  // Seguro com a verificação em análise: fora do fluxo, só por link direto
  "seguro-analise": { comp: SXT.SxSeguro, params: { analise: true }, pais: ["me", "config", "seguranca"] }
};

// "rota@modo" → aplica o modo e devolve a rota
const sxPasso = (passo) => {
  const [rota, modo] = String(passo || "").split("@");
  if (modo) SXT.SX_MODO.set(modo);
  return rota;
};

// Abrir o app = lista de conversas, no fluxo inativo (a promoção é o fluxo extra, no fim da sidebar).
// Link direto (#…/rota@modo) aplica o modo da tela do topo.
// Recarregar a página mantém o fluxo (o hash da pilha não guarda o modo).
const SX_INICIO = (function () {
  const h = window.location.hash.replace(/^#/, "").split("/").filter(Boolean);
  const topo = h[h.length - 1];
  if (topo && topo.indexOf("@") > 0) {
    const rota = sxPasso(topo);
    window.history.replaceState(null, "", "#" + [...(ROTAS[rota]?.pais || []), rota].join("/"));
    return rota;
  }
  let salvo = null;
  try { salvo = sessionStorage.getItem("sx-modo"); } catch (e) {}
  SXT.SX_MODO.set(h.length && salvo ? salvo : "inativo");
  return "chats";
})();
SXT.SX_MODO.subs.add(() => { try { sessionStorage.setItem("sx-modo", SXT.SX_MODO.v); } catch (e) {} });
try { sessionStorage.setItem("sx-modo", SXT.SX_MODO.v); } catch (e) {}

function SxApp() {
  const navRaw = useNavStack(SX_INICIO);
  const nav = { ...navRaw, reset: (s, p = {}) => navRaw.replace(s, p) };

  const [lang, setLang] = useStateApp(() => window.__phizLang || "pt");
  useEffectApp(() => {
    const h = () => setLang(window.__phizLang || "pt");
    window.addEventListener("phiz-lang-changed", h);
    return () => window.removeEventListener("phiz-lang-changed", h);
  }, []);

  // A sidebar de jornadas chama __journeyNav("rota@modo")
  useEffectApp(() => {
    window.__journeyNav = (passo) => {
      const screen = sxPasso(passo);
      const r = ROTAS[screen];
      if (r && r.pais) navRaw.setStackTo([...r.pais, screen]);
      else navRaw.switchTab(screen);
    };
    return () => { delete window.__journeyNav; };
  }, [navRaw.switchTab, navRaw.setStackTo]);

  // O passo ativo na sidebar é "rota@modo"
  const [modo, setModo] = useStateApp(SXT.SX_MODO.v);
  useEffectApp(() => {
    const f = () => setModo(SXT.SX_MODO.v);
    SXT.SX_MODO.subs.add(f);
    return () => SXT.SX_MODO.subs.delete(f);
  }, []);
  const [tweaks] = useTweaks({ darkMode: false });
  const topScreen = navRaw.stack[navRaw.stack.length - 1]?.screen;
  useEffectApp(() => {
    const atual = topScreen + "@" + modo;
    window.__journeyCurrentScreen = atual;
    if (typeof window.__journeySetCurrent === "function") window.__journeySetCurrent(atual);
  }, [topScreen, modo]);

  // O aparelho fica sempre em 393×852 (o frame do Figma) e é escalado inteiro pra
  // caber na janela: nada é espremido, tudo diminui na mesma proporção.
  useEffectApp(() => {
    const shell = document.querySelector(".shell");
    if (!shell) return;
    const ajusta = () => {
      const cs = getComputedStyle(shell);
      const nota = shell.querySelector(".phiz-proto-note");
      const w = shell.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - 24;
      const h = shell.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - 24
        - (nota ? nota.offsetHeight + parseFloat(cs.rowGap || 0) : 0);
      const esc = Math.max(0.4, Math.min(1, w / 393, h / 852));
      document.documentElement.style.setProperty("--sx-esc", esc.toFixed(3));
    };
    ajusta();
    const ro = new ResizeObserver(ajusta);
    ro.observe(shell);
    return () => ro.disconnect();
  }, []);

  // Arrastar da borda esquerda volta (como no iOS)
  const [swipe, setSwipe] = useStateApp(0);
  const drag = useRefApp({ active: false, startX: 0 });
  const start = (x, el) => {
    if (navRaw.stack.length <= 1) return;
    if (x - el.getBoundingClientRect().left < 24) drag.current = { active: true, startX: x };
  };
  const move = (x, el) => {
    if (!drag.current.active) return;
    setSwipe(Math.min(1, Math.max(0, x - drag.current.startX) / el.clientWidth));
  };
  const end = () => {
    if (!drag.current.active) return;
    const go = swipe > 0.4;
    setSwipe(0);
    drag.current.active = false;
    if (go) navRaw.pop();
  };

  const renderFrame = (frame) => {
    const def = ROTAS[frame.screen];
    if (!def) return <div style={{ padding: 24 }}>Tela “{frame.screen}” não encontrada</div>;
    const Comp = def.comp;
    return <Comp params={{ ...(def.params || {}), ...(frame.params || {}) }} />;
  };

  const exportPng = async () => {
    const target = document.querySelector(".device");
    if (!target || !window.htmlToImage) return;
    const hide = [".lang-switch-fixed", ".export-png-btn", ".journeys-sidebar"].map(q => document.querySelector(q));
    const prev = hide.map(el => el && el.style.visibility);
    hide.forEach(el => { if (el) el.style.visibility = "hidden"; });
    const prevShadow = target.style.boxShadow;
    target.style.boxShadow = "none";
    target.style.zoom = "1"; // exporta no tamanho real, não no escalado
    await new Promise(r => setTimeout(r, 180));
    try {
      const url = await window.htmlToImage.toPng(target, { backgroundColor: null, pixelRatio: 3 });
      const a = document.createElement("a");
      a.download = `seguro-golpes-${topScreen || "tela"}-${modo}.png`;
      a.href = url;
      a.click();
    } finally {
      target.style.boxShadow = prevShadow;
      target.style.zoom = "";
      hide.forEach((el, i) => { if (el) el.style.visibility = prev[i] || ""; });
    }
  };

  return (
    <NavCtx.Provider value={nav}>
      <div className="lang-switch lang-switch-fixed" role="group" aria-label="Idioma">
        <button className={"lang-btn" + (lang === "pt" ? " active" : "")} onClick={() => window.setPhizLang("pt")}>PT</button>
        <button className={"lang-btn" + (lang === "en" ? " active" : "")} onClick={() => window.setPhizLang("en")}>EN</button>
      </div>
      <button className="export-png-btn" onClick={exportPng} title="Exportar PNG da tela atual" aria-label="Exportar PNG">
        <window.Icon name="download" size={14} /> PNG
      </button>

      <div className="shell">
        <div className="device" data-theme={tweaks.darkMode ? "dark" : "light"}
          onTouchStart={(e) => start(e.touches[0].clientX, e.currentTarget)}
          onTouchMove={(e) => move(e.touches[0].clientX, e.currentTarget)}
          onTouchEnd={end}
          onMouseDown={(e) => start(e.clientX, e.currentTarget)}
          onMouseMove={(e) => move(e.clientX, e.currentTarget)}
          onMouseUp={end}
          onMouseLeave={end}>
          <FrameStack stack={navRaw.stack} anim={navRaw.anim} swipeProgress={swipe}>
            {(frame) => renderFrame(frame)}
          </FrameStack>
          <div className="home-bar"></div>
        </div>
        <p className="phiz-proto-note">{window.tStr("proto.note")}</p>
      </div>

      <TweaksPanel title="Protótipo" />
    </NavCtx.Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<SxApp />);
