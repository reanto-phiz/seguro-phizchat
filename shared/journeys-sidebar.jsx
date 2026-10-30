// journeys-sidebar.jsx — Painel lateral V2 das jornadas.
// Mais simples que o Launch Plan da V1: lista das 9 jornadas com passos
// expansíveis. Click num passo → navega no device.

const { useState, useEffect } = React;
const Icon = window.Icon;

const STATUS_LABEL = {
  pt: { "done": "Pronto", "in-progress": "Em andamento", "todo": "Planejado" },
  en: { "done": "Done",   "in-progress": "In progress",  "todo": "Planned" }
};

function useLang() {
  const [lang, setLang] = useState(window.__phizLang || "pt");
  useEffect(() => {
    const h = () => setLang(window.__phizLang || "pt");
    window.addEventListener("phiz-lang-changed", h);
    return () => window.removeEventListener("phiz-lang-changed", h);
  }, []);
  return lang;
}

const pickLang = (obj, key, lang) =>
  (lang === "en" && obj[key + "En"]) ? obj[key + "En"] : (obj[key] || "");

function StatusDot({ status }) {
  return <span className={"jp-dot jp-dot-" + status}/>;
}

function Journey({ j, expanded, onToggle, onOpen, currentScreen, lang }) {
  const done = j.steps.filter(s => s.status === "done").length;
  const total = j.steps.length;
  const firstNavigable = j.steps.find(s => s.status !== "todo" && s.screen);

  const jumpToFirst = () => {
    if (firstNavigable && typeof window.__journeyNav === "function") {
      window.__journeyNav(firstNavigable.screen);
    }
    onOpen(j.id);
  };

  return (
    <div className="jp-journey">
      <button className="jp-head" onClick={jumpToFirst} style={{"--accent": j.color}}>
        <span className="jp-n">{String(j.n).padStart(2, "0")}</span>
        <span className="jp-meta">
          <span className="jp-title">{pickLang(j, "title", lang)}</span>
          <span className="jp-sub">{pickLang(j, "sub", lang)}</span>
        </span>
        <span
          className="jp-right"
          role="button"
          aria-label={expanded ? "Colapsar" : "Expandir"}
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
        >
          <StatusDot status={j.status}/>
          {total > 0 && <span className="jp-count">{done}/{total}</span>}
          <Icon name={expanded ? "chevron-down" : "chevron-right"} size={14}/>
        </span>
      </button>
      {expanded && j.steps.length > 0 && (
        <ul className="jp-steps">
          {j.steps.map((s, i) => {
            const navigable = s.status !== "todo" && s.screen;
            const active = navigable && s.screen === currentScreen;
            return (
              <li
                key={i}
                className={"jp-step jp-step-" + s.status + (navigable ? " navigable" : "") + (active ? " active" : "")}
                onClick={() => {
                  if (!navigable) return;
                  if (typeof window.__journeyNav === "function") {
                    window.__journeyNav(s.screen);
                  }
                }}
                title={navigable ? s.screen : ""}
              >
                <StatusDot status={s.status}/>
                <span className="jp-step-title">{pickLang(s, "title", lang)}</span>
              </li>
            );
          })}
        </ul>
      )}
      {expanded && j.steps.length === 0 && (
        <div className="jp-empty">{lang === "en" ? "No screens yet" : "Sem telas ainda"}</div>
      )}
    </div>
  );
}

function CollapsedRail({ plan, onExpand, lang }) {
  return (
    <aside className="journeys-sidebar collapsed">
      <button className="jp-toggle" onClick={onExpand} title="Expandir">
        <Icon name="panel-left-open" size={18}/>
      </button>
      <div className="jp-rail">
        {plan.journeys.map(j => (
          <span
            key={j.id}
            className={"jp-rail-mark jp-status-" + j.status}
            style={{ background: j.color }}
            title={pickLang(j, "title", lang)}
          />
        ))}
      </div>
    </aside>
  );
}

function JourneysSidebar() {
  const plan = window.PHIZ_JOURNEYS || { journeys: [] };
  const lang = useLang();

  const [collapsed, setCollapsed] = useState(() => localStorage.getItem("phiz.jp.collapsed") === "1");
  const [open, setOpen] = useState(() => {
    const init = {};
    plan.journeys.forEach(j => { if (j.status === "in-progress") init[j.id] = true; });
    return init;
  });
  const [currentScreen, setCurrentScreen] = useState(window.__journeyCurrentScreen || "chats-list");

  useEffect(() => {
    document.body.classList.toggle("jp-open", !collapsed);
    document.body.classList.toggle("jp-collapsed", collapsed);
    localStorage.setItem("phiz.jp.collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  useEffect(() => {
    window.__journeySetCurrent = setCurrentScreen;
    return () => { if (window.__journeySetCurrent === setCurrentScreen) delete window.__journeySetCurrent; };
  }, []);

  if (collapsed) {
    return <CollapsedRail plan={plan} onExpand={() => setCollapsed(false)} lang={lang}/>;
  }

  const toggle = (id) => setOpen(o => ({ ...o, [id]: !o[id] }));
  const openOnly = (id) => setOpen(o => ({ ...o, [id]: true })); // força expandir (não alterna)

  return (
    <aside className="journeys-sidebar">
      <div className="jp-header">
        <div className="jp-brand">
          <img src={(window.__SHARED || "") + "assets/logomark-green.svg"} alt="" className="jp-logo"/>
          <div>
            <div className="jp-prod">{(window.PHIZ_JOURNEYS && window.PHIZ_JOURNEYS.product) || "PhizChat"}</div>
            {/* Volta pro hub (ex.: Garantido) — só aparece se o protótipo declarar window.__HUB */}
            {window.__HUB && <a className="jp-hub" href={window.__HUB}>← {window.__HUB_NOME || "Garantido"}</a>}
          </div>
        </div>
        <button className="jp-toggle" onClick={() => setCollapsed(true)} title="Retrair">
          <Icon name="panel-left-close" size={16}/>
        </button>
      </div>

      <div className="jp-list">
        {plan.journeys.filter(j => !j.pinBottom).map(j => (
          <Journey
            key={j.id}
            j={j}
            expanded={!!open[j.id]}
            onToggle={() => toggle(j.id)}
            onOpen={openOnly}
            currentScreen={currentScreen}
            lang={lang}
          />
        ))}
      </div>
      {plan.journeys.some(j => j.pinBottom) && (
        <div className="jp-footer">
          {plan.journeys.filter(j => j.pinBottom).map(j => (
            <Journey
              key={j.id}
              j={j}
              expanded={!!open[j.id]}
              onToggle={() => toggle(j.id)}
              onOpen={openOnly}
              currentScreen={currentScreen}
              lang={lang}
            />
          ))}
        </div>
      )}
    </aside>
  );
}

window.JourneysSidebar = JourneysSidebar;

const __jpMount = document.getElementById("journeys-sidebar");
if (__jpMount) {
  ReactDOM.createRoot(__jpMount).render(<JourneysSidebar />);
}
