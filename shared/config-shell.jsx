// shared/config-shell.jsx — o Me, a página de Configurações e a Account
// Security do app, do jeito que estão no Figma.
//
// Toda jornada de conta entra por aqui. Em vez de cada protótipo desenhar a
// sua própria versão dessas três telas (e elas irem divergindo), elas moram
// neste arquivo e cada protótipo só liga a linha que é dele.
//
// Do arquivo do Figma (branch "Me", fileKey 4AFkI2rGhbUEYwwfZpqQW0):
//   Me                17009:2958
//   Settings          17009:3014  — Account · Notifications · Chats and Media · App
//   Account Security  17110:9248  — Account Info · Sign-in and Security · Devices
//
// Como um protótipo se liga: declara no seu app.jsx quais rotas ele tem,
//
//   window.__CONFIG_ROTAS = ["telefone"];
//
// e as linhas dessas telas que apontam pra uma rota registrada viram
// clicáveis. As outras ficam como estão no app — presentes, inertes, do
// jeito que a pessoa veria. Só o que o protótipo quer contar navega.
//
// Uma linha que NÃO existe no Figma pode ser declarada como novidade:
//
//   window.__CONFIG_NOVAS = { chats: [{ id:"backup", ... }] };
//
// Ela entra na seção certa marcada como proposta — é assim que o protótipo
// de backup mostra onde a feature entraria.

const { PHOTO, Screen, useNav } = window.PhizHiFi;
const Icon = window.Icon;
const { useState, useEffect } = React;

const EU = {
  nome: "Arthur Coimbra",
  id: "Phiz ID: 116342",
  foto: PHOTO.arthur,
  email: "arthur@exemplo.com.br",
  telefone: "(11) 91234-0000",
  telefoneCheio: "+55 11 91234-0000",
  telefoneMascarado: "+55 11 *****-0000"
};

/* Só navega pra rota que o protótipo declarou ter. */
const temRota = (r) => (window.__CONFIG_ROTAS || []).indexOf(r) >= 0;
const abrir = (nav, rota, params) => { if (temRota(rota)) nav.push(rota, params || {}); };

/* ── Primitivos do arquivo (seção, cartão, linha de lista) ───────────────── */

const Sec = ({ title, children }) => (
  <div className="sec">
    {title && <div className="sec-title">{title}</div>}
    {children}
  </div>
);

const Card = ({ children }) => <div className="card">{children}</div>;

const Row = ({ icon, label, sub, val, valGo, chev = true, danger, selo,
               onClick, mira, novo }) => (
  <div className={"row" + (sub ? " two" : "") + (mira ? " mira" : "")}
    onClick={onClick} role={onClick ? "button" : undefined} tabIndex={onClick ? 0 : undefined}
    style={onClick ? undefined : { cursor: "default" }}>
    {icon && <span className={"ic" + (danger ? " danger" : "")}><Icon name={icon} size={22} /></span>}
    <span className={"lb" + (danger ? " danger" : "")}>
      {label}
      {novo && <span className="tag-novo">novo</span>}
      {sub && <span className="sub">{sub}</span>}
    </span>
    {selo && <span className="selo-ic"><Icon name="badge-check" size={18} /></span>}
    {val && <span className={"val" + (valGo ? " go" : "")}>{val}</span>}
    {chev && !danger && <span className="chev"><Icon name="chevron-right" size={20} /></span>}
  </div>
);

const Toast = ({ children }) => (
  <div className="toast"><Icon name="check-circle-2" size={18} /> {children}</div>
);

/* Selo do arquivo (Badge Verified Filled) quando o phiz-ui está carregado. */
const Selo = ({ size = 17 }) => (window.PhizUI
  ? <window.PhizUI.PzSelo sm />
  : <span className="selo-ic"><Icon name="badge-check" size={size} /></span>
);

/* Barra das telas internas: back redondo, título grande, subtítulo. */
const Topo = ({ titulo, sub, onVoltar, fechar, acao }) => (
  <React.Fragment>
    <div style={{ display: "flex", alignItems: "center" }}>
      <button className="pg-back" onClick={onVoltar} aria-label={fechar ? "Fechar" : "Voltar"}>
        <Icon name={fechar ? "x" : "arrow-left"} size={20} />
      </button>
      {acao}
    </div>
    {titulo && <div className="pg-title">{titulo}</div>}
    {sub && <div className="pg-sub">{sub}</div>}
  </React.Fragment>
);

/* ═══════════════════════════════════════════════════════════════════════
   Me — 17009:2958
   ═══════════════════════════════════════════════════════════════════════ */

function MeScreen({ params = {} }) {
  const nav = useNav();
  return (
    <Screen>
      <div className="pg">
        <div className="pg-bar">
          <h1>Me</h1>
          <button className="pg-iconbtn" aria-label="Meu QR Code">
            <Icon name="qr-code" size={22} />
          </button>
        </div>

        <div className="pg-body">
          <div className="me2-id">
            <div className="me2-avatar">
              <img src={EU.foto} alt="" />
              <span className="edit"><Icon name="pencil" size={16} /></span>
              {!params.semSelo && <span className="selo-onphoto"><Icon name="check" size={19} color="#fff" /></span>}
            </div>
            <div className="me2-name">{EU.nome} {!params.semSelo && <Selo />}</div>
            <div className="me2-handle">{EU.id}</div>
          </div>

          {/* Espaço para um cartão de destaque (ex.: o seguro no protótipo de Seguro). */}
          {params.destaque}

          <Sec title="Social network">
            <Card><Row icon="at-sign" label="Ativar seu perfil" /></Card>
          </Sec>

          <Sec title="Payment">
            <Card>
              <Row icon="wallet" label="Carteira" />
              <Row icon="landmark" label="PhizPay Business" />
            </Card>
          </Sec>

          <Sec title="My content">
            <Card>
              <Row icon="heart" label="Favoritos" />
              <Row icon="clock" label="Lembretes" />
            </Card>
          </Sec>

          <Sec title="Help and more">
            <Card>
              <Row icon="share-2" label="Convidar amigos" />
              <Row icon="circle-help" label="Central de ajuda" />
              <Row icon="message-square" label="Fale com a gente" />
            </Card>
          </Sec>

          <Sec>
            <Card>
              <Row icon="settings" label="Configurações" mira={params.mira === "config"}
                onClick={() => abrir(nav, "config")} />
            </Card>
          </Sec>

          <div style={{ height: 16 }} />
        </div>
      </div>
      {params.toast && <Toast>{params.toast}</Toast>}
    </Screen>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Configurações — 17009:3014

   As quatro seções do arquivo, na ordem: Account, Notifications,
   Chats and Media, App. Só a linha que o protótipo declarou é que navega.
   ═══════════════════════════════════════════════════════════════════════ */

function ConfigScreen({ params = {} }) {
  const nav = useNav();
  const novas = window.__CONFIG_NOVAS || {};
  const mira = params.mira;

  const Novas = ({ onde }) => (novas[onde] || []).map(n => (
    <Row key={n.id} icon={n.icon} label={n.label} val={n.val} sub={n.sub} novo
      mira={mira === n.id} onClick={() => abrir(nav, n.rota)} />
  ));

  return (
    <Screen>
      <div className="pg">
        <Topo titulo="Configurações" onVoltar={() => nav.pop()} />

        <div className="pg-body">
          <Sec title="Conta">
            <Card>
              <Row icon="shield-check" label="Segurança da conta" mira={mira === "seguranca"}
                onClick={() => abrir(nav, "seguranca")} />
              <Row icon="lock" label="Privacidade" />
              <Novas onde="conta" />
            </Card>
          </Sec>

          <Sec title="Notificações">
            <Card><Row icon="bell" label="Notificações de mensagem" /></Card>
          </Sec>

          <Sec title="Conversas e mídia">
            <Card>
              <Row icon="message-circle" label="Conversas" />
              <Novas onde="chats" />
              <Row icon="database" label="Armazenamento" />
              <Row icon="wifi" label="Mídia e rede" />
            </Card>
          </Sec>

          <Sec title="App">
            <Card>
              <Row icon="globe" label="Idioma" val="Português" />
              <Row icon="sun" label="Tema" val="Claro" />
              <Row icon="info" label="Sobre" />
            </Card>
          </Sec>

          <div style={{ height: 16 }} />
        </div>
      </div>
      {params.toast && <Toast>{params.toast}</Toast>}
    </Screen>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Segurança da conta — 17110:9248

   No Figma a linha "Phone Number" mostra o número e PARA AÍ: não tem
   chevron, não abre nada. É exatamente o buraco que o protótipo de troca de
   número preenche — quando essa rota está declarada, a linha abre.
   ═══════════════════════════════════════════════════════════════════════ */

function SegurancaScreen({ params = {} }) {
  const nav = useNav();
  const mira = params.mira;
  const podeTrocar = temRota("telefone");

  return (
    <Screen>
      <div className="pg">
        <Topo titulo="Segurança da conta" onVoltar={() => nav.pop()} />

        <div className="pg-body">
          <Sec title="Dados da conta">
            <Card>
              <Row label="Número do celular" val={EU.telefone} chev={podeTrocar}
                mira={mira === "telefone"} onClick={() => abrir(nav, "telefone")} />
            </Card>
          </Sec>

          <Sec title="Acesso e segurança">
            <Card>
              <Row label="Senha" val="Não definida" />
              <Row label="Verificação em duas etapas"
                sub="Adiciona uma camada a mais quando você entra." val="Ligada" />
              <Row label="E-mail de recuperação" val="Definido" />
              <Row label="Bloqueio do app" sub="Use a digital ou o rosto pra abrir o PhizChat"
                val="Ligado" chev={false} />
            </Card>
          </Sec>

          <Sec title="Aparelhos">
            <Card>
              <Row icon="smartphone" label="Gerenciar aparelhos"
                sub="Veja onde a sua conta está conectada." />
            </Card>
          </Sec>

          <Sec>
            <Card><Row label="Apagar a conta" danger chev={false} /></Card>
          </Sec>

          <div style={{ height: 16 }} />
        </div>
      </div>
      {params.toast && <Toast>{params.toast}</Toast>}
    </Screen>
  );
}

/* As três telas de entrada, já com a mira acesa na linha que abre a jornada. */
const MeParaConfig    = () => <MeScreen params={{ mira: "config" }} />;

window.PhizConfig = {
  EU, Sec, Card, Row, Toast, Selo, Topo, abrir, temRota,
  MeScreen, MeParaConfig, ConfigScreen, SegurancaScreen
};
