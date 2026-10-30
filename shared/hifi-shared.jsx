// hifi-shared.jsx — Shared components for hi-fi prototype

const { useContext, useState, useEffect, useRef } = React;
const NavCtx = window.PhizProtoNav;
const Icon = window.Icon;

const useNav = () => useContext(NavCtx);

// ─── Photo URL helper (Unsplash with consistent seeded portraits) ───
const PHOTO = {
  // ─── "Eu" do usuário ─── (avatar único e brandado, NÃO é foto real)
  // SVG inline: gradient Verde Campos → Bosques, iniciais FB grandes em
  // branco e uma bubble do Phiz no canto pra deixar bem claro que é o
  // perfil do dono do app, não uma foto de contato.
  bayer:    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><defs><linearGradient id='b' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%2326D465'/><stop offset='.55' stop-color='%2319B852'/><stop offset='1' stop-color='%230FAE5F'/></linearGradient></defs><rect width='200' height='200' fill='url(%23b)'/><circle cx='34' cy='40' r='6' fill='rgba(255,255,255,.22)'/><circle cx='172' cy='58' r='4' fill='rgba(255,255,255,.18)'/><circle cx='158' cy='168' r='5' fill='rgba(255,255,255,.16)'/><circle cx='44' cy='160' r='3' fill='rgba(255,255,255,.20)'/><text x='100' y='133' text-anchor='middle' font-family='Helvetica,Arial,sans-serif' font-weight='800' font-size='90' fill='%23fff' letter-spacing='-3'>LA</text><g transform='translate(140,138)'><path fill='%23fff' d='M 7 0 L 13 0 C 17 0 20 3 20 7 L 20 12 C 20 16 17 19 13 19 L 10 19 C 7 19 5 21 3 23 C 2 24 1 25 0 25 C -1 25 -1 24 -1 23 L -1 7 C -1 3 2 0 7 0 Z'/><circle cx='7' cy='8' r='1.4' fill='%2319B852'/><circle cx='13' cy='7.5' r='1.3' fill='%2319B852'/></g></svg>",
  // ─── Canais que o usuário de exemplo administra ─── (avatares brandados, monogram)
  bayermemes: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><defs><linearGradient id='bm' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%23F59E0B'/><stop offset='.5' stop-color='%23EF4444'/><stop offset='1' stop-color='%23A855F7'/></linearGradient></defs><rect width='200' height='200' fill='url(%23bm)'/><circle cx='38' cy='42' r='5' fill='rgba(255,255,255,.22)'/><circle cx='168' cy='62' r='4' fill='rgba(255,255,255,.18)'/><circle cx='160' cy='162' r='6' fill='rgba(255,255,255,.16)'/><text x='100' y='132' text-anchor='middle' font-family='Helvetica,Arial,sans-serif' font-weight='800' font-size='86' fill='%23fff' letter-spacing='-3'>ML</text><text x='160' y='168' text-anchor='middle' font-size='28'>😂</text></svg>",
  bayertravel: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><defs><linearGradient id='bt' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%2306B6D4'/><stop offset='.5' stop-color='%231679E2'/><stop offset='1' stop-color='%231656C2'/></linearGradient></defs><rect width='200' height='200' fill='url(%23bt)'/><circle cx='38' cy='42' r='5' fill='rgba(255,255,255,.22)'/><circle cx='168' cy='62' r='4' fill='rgba(255,255,255,.18)'/><circle cx='160' cy='162' r='6' fill='rgba(255,255,255,.16)'/><text x='100' y='132' text-anchor='middle' font-family='Helvetica,Arial,sans-serif' font-weight='800' font-size='86' fill='%23fff' letter-spacing='-3'>VL</text><text x='160' y='168' text-anchor='middle' font-size='26'>🌎</text></svg>",
  // People
  vitor:    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces&q=70",
  maria:    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces&q=70",
  joao:     "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces&q=70",
  bruno:    "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=200&h=200&fit=crop&crop=faces&q=70",
  silvia:   "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=faces&q=70",
  lucas:    "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=200&fit=crop&crop=faces&q=70",
  ana:      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces&q=70",
  ana2:     "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=faces&q=70",
  carol:    "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&h=200&fit=crop&crop=faces&q=70",
  alice:    "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop&crop=faces&q=70",
  aline:    "https://images.unsplash.com/photo-1541823709867-1b206113eafd?w=200&h=200&fit=crop&crop=faces&q=70",
  alex:     "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=faces&q=70",
  brenda:   "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=faces&q=70",
  bryan:    "https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&h=200&fit=crop&crop=faces&q=70",
  camila:   "https://images.unsplash.com/photo-1502323777036-f29e3972d82f?w=200&h=200&fit=crop&crop=faces&q=70",
  carlos:   "https://images.unsplash.com/photo-1474176857210-7287d38d27c6?w=200&h=200&fit=crop&crop=faces&q=70",
  arthur:   "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=faces&q=70",
  // Group thumbnails
  futebol:  "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=200&h=200&fit=crop&q=70",
  amigos:   "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=200&fit=crop&q=70",
  copa:     "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=200&h=200&fit=crop&q=70",
  // Stadium / sport
  stadium:  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop&q=80",
  flamengo: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&h=400&fit=crop&q=80",
  futstad:  "https://images.unsplash.com/photo-1522778526097-ce0a22ceb253?w=600&h=400&fit=crop&q=80",
  game:     "https://images.unsplash.com/photo-1493514789931-586cb221d7a7?w=600&h=400&fit=crop&q=80",
  fans:     "https://images.unsplash.com/photo-1577471488278-16eec37ffcc2?w=600&h=400&fit=crop&q=80",
  // Channel logos
  cazetv:   "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=200&h=200&fit=crop&q=70",
  virginia: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=faces&q=75",
  virginiaPessoal: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=300&fit=crop&crop=faces&q=75",
  nobru: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop&crop=faces&q=75",
  // Esports / gaming photos for Nobru posts
  nobruSetup: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop&q=80",
  nobruEsports: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop&q=80",
  nobruClip: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&h=400&fit=crop&q=80",
  nobruFans: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=600&h=400&fit=crop&q=80",
  flamengoLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Flamengo_braz_logo.svg/240px-Flamengo_braz_logo.svg.png",
  // Prefeitura SP — avatar institucional (SVG inline "SP") + cover (gradient SVG)
  prefSPLogo:  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><defs><linearGradient id='a' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%231F2933'/><stop offset='1' stop-color='%23475569'/></linearGradient></defs><rect width='200' height='200' fill='url(%23a)'/><text x='100' y='126' text-anchor='middle' font-family='Helvetica,Arial,sans-serif' font-weight='900' font-size='86' fill='%23fff' letter-spacing='-2'>SP</text></svg>",
  prefSPCover: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'><defs><linearGradient id='c' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%231F2933'/><stop offset='1' stop-color='%23334155'/></linearGradient></defs><rect width='600' height='400' fill='url(%23c)'/><g fill='rgba(255,255,255,.04)'><rect x='40' y='240' width='40' height='130'/><rect x='90' y='200' width='30' height='170'/><rect x='130' y='220' width='42' height='150'/><rect x='180' y='160' width='36' height='210'/><rect x='226' y='200' width='28' height='170'/><rect x='264' y='180' width='44' height='190'/><rect x='318' y='150' width='32' height='220'/><rect x='360' y='210' width='38' height='160'/><rect x='408' y='180' width='34' height='190'/><rect x='452' y='230' width='40' height='140'/><rect x='502' y='200' width='30' height='170'/><rect x='542' y='220' width='32' height='150'/></g><text x='300' y='90' text-anchor='middle' font-family='Helvetica,Arial,sans-serif' font-weight='800' font-size='28' fill='rgba(255,255,255,.45)' letter-spacing='4'>SÃO PAULO</text></svg>",
  // Civic / utility (Unsplash institucionais)
  vaccine:  "https://images.unsplash.com/photo-1605289982774-9a6fef564df8?w=600&h=400&fit=crop&q=80",
  school:   "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=400&fit=crop&q=80",
  roadwork: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=600&h=400&fit=crop&q=80",
  bakery:   "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=600&h=400&fit=crop&q=80",

  // ─── Travel (canal de viagens) ───
  travelLisbon:   "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&h=400&fit=crop&q=80",  // Lisbon tram / tile rooftops
  travelSintra:   "https://images.unsplash.com/photo-1572382155512-7e3e3c1b9a26?w=600&h=400&fit=crop&q=80",  // Pena Palace, Sintra
  travelPorto:    "https://images.unsplash.com/photo-1555881400-69a9a47272e0?w=600&h=400&fit=crop&q=80",   // Porto Ribeira
  travelDouro:    "https://images.unsplash.com/photo-1583425423320-3c4cffb50723?w=600&h=400&fit=crop&q=80", // Douro vineyards
  travelCaboRoca: "https://images.unsplash.com/photo-1591030728669-3a0a4bff35f4?w=600&h=400&fit=crop&q=80", // Cliff overlook
  travelTokyo:    "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop&q=80", // Tokyo neon
  travelBelem:    "https://images.unsplash.com/photo-1518739745383-0ef26e6a4b56?w=600&h=400&fit=crop&q=80", // Belém Tower
  travelPlane:    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=400&fit=crop&q=80", // Airplane wing sunset
  travelMap:      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop&q=80", // Map with compass
  travelSunset:   "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&h=400&fit=crop&q=80", // Generic golden hour beach

  // ─── Design / workspace (canal de memes + design moments) ───
  workspaceDesk:  "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=600&h=400&fit=crop&q=80", // Designer at iMac
  workspaceCode:  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop&q=80", // Laptop code dark
  workspaceFigma: "https://images.unsplash.com/photo-1561070791-2526d30994b8?w=600&h=400&fit=crop&q=80",   // Macbook + design tool
  workspaceSticky:"https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&h=400&fit=crop&q=80", // Sticky notes on wall
  workspaceSketch:"https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&h=400&fit=crop&q=80", // Notebook sketches
  workspaceMess:  "https://images.unsplash.com/photo-1542435503-956c469947f6?w=600&h=400&fit=crop&q=80",   // Messy creative desk
  workspaceLate:  "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop&q=80",   // Designer late at night
  workspaceTeam:  "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop&q=80",   // Team meeting / standup

  // ─── Lifestyle / café / livros / café da manhã (variedade pra moments) ───
  cafeLatte:      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop&q=80",
  cafeWindow:     "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=600&h=400&fit=crop&q=80",
  booksReading:   "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop&q=80",
  morningRoutine: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=400&fit=crop&q=80",
  vinyl:          "https://images.unsplash.com/photo-1530143584546-02191bc84eb5?w=600&h=400&fit=crop&q=80"
};

// ─── Avatar ───
function Avatar({ src, kind, letter, size, online, border, channel }) {
  const cls = ["avatar"];
  if (size) cls.push(size);
  if (kind && !src) cls.push(kind);
  const avatarEl = (
    <div className={cls.join(" ")} style={border ? {border:`2px solid ${border}`} : undefined}>
      {src ? <img src={src} alt="" loading="lazy"/> : (letter || "?")}
      {online && <div className="online"/>}
    </div>
  );
  // Channel indicator: 2 small gray circles stacked behind the avatar (left side)
  if (channel) {
    return (
      <div className={"avatar-stack" + (size ? " avatar-stack-" + size : "")}>
        <span className="avatar-echo avatar-echo-2"/>
        <span className="avatar-echo avatar-echo-1"/>
        {avatarEl}
      </div>
    );
  }
  return avatarEl;
}

// ─── Status bar ───
function StatusBar({ dark = false }) {
  const c = dark ? "#fff" : "#000";
  return (
    <div className={"statusbar" + (dark ? " dark" : "")}>
      <div>9:41</div>
      <div className="right">
        <svg width="18" height="11" viewBox="0 0 18 11" fill="none">
          <rect x="0" y="6.5" width="3" height="4.5" rx=".7" fill={c}/>
          <rect x="4.5" y="4.5" width="3" height="6.5" rx=".7" fill={c}/>
          <rect x="9" y="2.5" width="3" height="8.5" rx=".7" fill={c}/>
          <rect x="13.5" y="0" width="3" height="11" rx=".7" fill={c}/>
        </svg>
        <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
          <path d="M8 3.5C9.7 3.5 11.3 4.1 12.5 5.3L13.6 4.2C12.1 2.7 10.1 1.9 8 1.9C5.9 1.9 3.9 2.7 2.4 4.2L3.5 5.3C4.7 4.1 6.3 3.5 8 3.5Z" fill={c}/>
          <path d="M8 6C8.8 6 9.6 6.3 10.2 6.9L11.3 5.8C10.4 4.9 9.2 4.4 8 4.4C6.8 4.4 5.6 4.9 4.7 5.8L5.8 6.9C6.4 6.3 7.2 6 8 6Z" fill={c}/>
          <path d="M8 9.5C8.8 9.5 9.5 8.8 9.5 8C9.5 7.2 8.8 6.5 8 6.5C7.2 6.5 6.5 7.2 6.5 8C6.5 8.8 7.2 9.5 8 9.5Z" fill={c}/>
        </svg>
        <svg width="26" height="11" viewBox="0 0 26 11" fill="none">
          <rect x="0" y=".5" width="22" height="10" rx="3" stroke={c} strokeOpacity=".4"/>
          <rect x="2" y="2.5" width="18" height="6" rx="1.5" fill={c}/>
          <rect x="23" y="3.5" width="1.5" height="4" rx=".5" fill={c} fillOpacity=".4"/>
        </svg>
      </div>
    </div>
  );
}

// ─── Phiz AI logo (the /\ icon) ───
const PhizAI = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M5 19L12 5L19 19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.5 12H15.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
  </svg>
);

// ─── Verified badge (small green circle w/ check) ───
const Verified = ({ size = 14 }) => (
  <span className="verified-badge" style={{width:size,height:size}}>
    <Icon name="check" size={size-5} color="#fff"/>
  </span>
);

// ─── Pro badge (selo escuro circular pra canais/empresas/criadores) ───
// Text padrão "Pro"; pode customizar via prop (ex: <ProBadge label="BDM"/>).
const ProBadge = ({ size = 16, label = "Pro" }) => (
  <span className="pro-badge" style={{width:size,height:size}} title="Conta Pro">
    <span className="pb-text" style={{fontSize: Math.round(size * 0.4)}}>{label}</span>
  </span>
);

// ─── Read receipt ticks (double check) ───
const Tick = ({ read }) => (
  <span className={"tick" + (read ? " read" : "")}>
    <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
      <path d="M1 5.5L4 8.5L9 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 5.5L8 8.5L13 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </span>
);

// ─── App bars ───
function AppBarLarge({ title, leftAction, rightActions = [] }) {
  return (
    <div className="appbar appbar-large">
      <div className="row">
        <div>{leftAction}</div>
        <div style={{display:"flex",gap:6}}>
          {rightActions.map((a, i) => <React.Fragment key={i}>{a}</React.Fragment>)}
        </div>
      </div>
      <h1>{title}</h1>
    </div>
  );
}

function AppBarCompact({ title, presence, avatarSrc, onTitleClick, leftAction, rightActions = [], bordered = true }) {
  const nav = useNav();
  const goBack = () => nav.stack.length > 1 ? nav.pop() : nav.switchTab("chats-list");
  return (
    <div className={"appbar appbar-compact" + (bordered ? " bordered" : "")}>
      <div className="left">
        {leftAction || (
          <button className="back-arrow" onClick={goBack}>
            <Icon name="arrow-left" size={20}/>
          </button>
        )}
      </div>
      <div className="center" onClick={onTitleClick}>
        {avatarSrc && <Avatar src={avatarSrc} size="sm"/>}
        <div style={{minWidth:0}}>
          <div className="ttl">
            <span className="name">{title}</span>
          </div>
          {presence && <div className="pres">{presence}</div>}
        </div>
      </div>
      <div className="right">
        {rightActions.map((a, i) => <React.Fragment key={i}>{a}</React.Fragment>)}
      </div>
    </div>
  );
}

// ─── Search ───
function SearchBar({ placeholder = "Buscar", value, onChange }) {
  const controlled = typeof onChange === "function";
  const inputProps = controlled
    ? { value: value || "", onChange: (e) => onChange(e.target.value) }
    : {};
  return (
    <div className="search">
      <Icon name="search" size={18} color="var(--note)"/>
      <input type="text" placeholder={placeholder} {...inputProps}/>
      {controlled && value && (
        <button
          type="button"
          className="iconbtn"
          style={{width:24, height:24}}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onChange("")}
          aria-label="Limpar busca"
        >
          <Icon name="x" size={16}/>
        </button>
      )}
    </div>
  );
}

// ─── Chip row ───
function Chips({ items, active, onChange }) {
  return (
    <div className="chips">
      {items.map((label) => (
        <button
          key={label}
          className={"chip" + (active === label ? " active" : "")}
          onClick={() => onChange && onChange(label)}
        >{label}</button>
      ))}
    </div>
  );
}

// ─── Tab bar ───
const TABS_ROUTES = {
  "chats-list":     { icon: "message-circle-more", labelKey: "tab.chats",    screen: "chats-list" },
  "calls-list":     { icon: "phone",               labelKey: "tab.calls",    screen: "calls-list" },
  "discover-home":  { icon: "compass",             labelKey: "tab.discover", screen: "discover-home" },
  "contacts-list":  { icon: "users-round",         labelKey: "tab.contacts", screen: "contacts-list" },
  "profile-me":     { icon: "user-round",          labelKey: "tab.me",       screen: "profile-me" }
};

function TabBar({ active, onTabChange, badges = {} }) {
  const t = window.useT();
  return (
    <div className="tabbar">
      {Object.entries(TABS_ROUTES).map(([key, tab]) => (
        <button
          key={key}
          className={"tab" + (active === key ? " active" : "")}
          onClick={() => onTabChange(key)}
        >
          <span className="ic"><Icon name={tab.icon} size={22}/></span>
          {t(tab.labelKey)}
          {badges[key] && <span className="badge">{badges[key]}</span>}
        </button>
      ))}
    </div>
  );
}

// ─── Screen wrappers ───
function Screen({ children, statusDark = false, theme }) {
  // Sets status bar style; theme="dark" makes the entire frame dark
  return (
    <React.Fragment>
      <div data-status-dark={String(statusDark)} style={{display:"contents"}} data-theme={theme}>
        <StatusBar dark={statusDark}/>
        {children}
      </div>
    </React.Fragment>
  );
}

function ScreenWithTabs({ children, active, onTabChange, badges, statusDark = false }) {
  return (
    <React.Fragment>
      <StatusBar dark={statusDark}/>
      {children}
      <TabBar active={active} onTabChange={onTabChange} badges={badges}/>
    </React.Fragment>
  );
}

// ─── Bubble row helpers ───
function BubbleGroup({ them, who, color, avatar, forwarded, text, time, read, reactions, last = true }) {
  return (
    <div className={"bubble-row " + (them ? "them" : "me")}>
      {them && (avatar
        ? <div className="bub-avatar">{avatar}</div>
        : <div className="bub-spacer"/>)}
      <div className={"bubble " + (them ? "them" : "me") + (color ? " "+color : "")}>
        {forwarded && <div className="forwarded"><Icon name="corner-up-right" size={11}/> Encaminhado</div>}
        {who && <div className="who">{who}</div>}
        <div>{text}</div>
        <div className="meta">
          {time}
          {!them && <Tick read={read}/>}
        </div>
        {reactions && (
          <div className="reactions">
            {reactions.emoji}<span className="count">{reactions.count}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Contas do usuário (pessoal + canais que ele administra) ───
// Estado global da conta ativa fica em window.__activeAccountId.
const MY_ACCOUNTS = [
  { id: "bayer",        name: "Lucas Andrade", handle: "lucas",      avatar: PHOTO.bayer,       type: "personal", sub: "Conta pessoal" },
  { id: "bayermemes",   name: "Memes do Lucas", handle: "memesdolucas",  avatar: PHOTO.bayermemes,  type: "channel",  sub: "Canal · você é admin", verified: true },
  { id: "bayertravel",  name: "Viagens do Lucas", handle: "viagensdolucas", avatar: PHOTO.bayertravel, type: "channel",  sub: "Canal · você é admin", verified: true }
];
window.MY_ACCOUNTS = MY_ACCOUNTS;
if (typeof window.__activeAccountId === "undefined") window.__activeAccountId = "bayer";

// Helper compartilhado: abre a sheet nativa-like de share (registrada como rota).
window.__openShareSheet = function (payload) {
  const nav = window.__phizCurrentNav;
  if (nav && typeof nav.push === "function") nav.push("ios-share", payload || {});
};

// ─── Prefs do perfil público do usuário (estado global) ───
// Compartilha entre profile-me (configura) e personal-profile (toggle inline).
window.__phizProfilePrefs = window.__phizProfilePrefs || { profileActive: false, publicCard: true };
const PHIZ_PROFILE_PREFS_EVT = "phiz-profile-prefs-changed";

function usePhizProfilePrefs() {
  const [, force] = React.useState(0);
  React.useEffect(() => {
    const h = () => force(x => x + 1);
    window.addEventListener(PHIZ_PROFILE_PREFS_EVT, h);
    return () => window.removeEventListener(PHIZ_PROFILE_PREFS_EVT, h);
  }, []);
  const prefs = window.__phizProfilePrefs;
  const set = (next) => {
    window.__phizProfilePrefs = { ...prefs, ...next };
    window.dispatchEvent(new CustomEvent(PHIZ_PROFILE_PREFS_EVT));
  };
  return [prefs, set];
}

window.PhizHiFi = {
  PHOTO, Avatar, StatusBar, PhizAI, Verified, ProBadge, Tick,
  AppBarLarge, AppBarCompact, SearchBar, Chips, TabBar,
  Screen, ScreenWithTabs, BubbleGroup, useNav, TABS_ROUTES,
  MY_ACCOUNTS, usePhizProfilePrefs
};
