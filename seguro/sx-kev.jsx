// sx-kev.jsx — as duas telas da Kev Seguros abertas a partir do seguro.
// Não estão no Figma: são propostas deste protótipo, só para visualização.
//  · "Ver apólice"         → webview com o bilhete do seguro (documento de exemplo)
//  · "Mais sobre o seguro" → mini app da Kev com uma home sobre a Kev e o Seguro PhizChat

const SXW_KEV = "img/kev.png" + SX_V;

/* ── Webview da apólice ──────────────────────────────────────────────────
   Barra de navegador do app (fechar, título + domínio com cadeado, compartilhar)
   e o bilhete como uma folha de papel. Nada é editável. */
const SXW_APOLICE = [
  { titulo: "Segurado", linhas: [
    ["Nome", "Arthur Coimbra"],
    ["CPF", "***.456.789-**"],
    ["Endereço", "Av Engenheiro Luís Carlos Berrini, 1396 · Itaim Bibi, São Paulo – SP · 04571-000"]
  ] },
  { titulo: "Seguro", linhas: [
    ["Produto", "Seguro PhizChat contra golpes"],
    ["Apólice coletiva", "0987.65.432100"],
    ["Certificado individual", "2026.1016.0042"],
    ["Estipulante", "PhizChat"],
    ["Seguradora", "KEV Seguros"]
  ] },
  { titulo: "Vigência", linhas: [
    ["Início", "16/10/2026"],
    ["Fim", "15/11/2026"],
    ["Renovação", "Automática, a cada 30 dias"]
  ] }
];

function SxApolice() {
  const nav = window.PhizHiFi.useNav();
  const [toast, setToast] = React.useState(null);
  return (
    <window.PhizHiFi.Screen>
      <div className="pg sxw">
        <div className="sxw-barra">
          <button className="sxw-bt" aria-label="Fechar" onClick={() => nav.pop()}><window.Icon name="x" size={22} /></button>
          <div className="sxw-url">
            <span className="t">Apólice</span>
            <span className="d"><window.Icon name="lock" size={11} />seguros.kev.com.br</span>
          </div>
          <button className="sxw-bt" aria-label="Compartilhar" onClick={() => setToast("Abre o compartilhar·" + Date.now())}><window.Icon name="share" size={20} /></button>
        </div>
        <div className="pg-body sxw-corpo">
          <article className="sxw-doc">
            <header className="sxw-doc-topo">
              <img className="logo" src={SXW_KEV} alt="Kev" />
              <span className="tag">Bilhete de seguro</span>
            </header>
            <h1>Seguro PhizChat contra golpes</h1>
            <p className="sxw-doc-sub">Emitido em 16/10/2026</p>

            {SXW_APOLICE.map(s => (
              <section key={s.titulo} className="sxw-sec">
                <h2>{s.titulo}</h2>
                <dl>
                  {s.linhas.map(([k, v]) => (
                    <div key={k} className="sxw-linha"><dt>{k}</dt><dd>{v}</dd></div>
                  ))}
                </dl>
              </section>
            ))}

            <section className="sxw-sec">
              <h2>Cobertura</h2>
              <table className="sxw-tab">
                <thead><tr><th>Cobertura</th><th>Limite</th></tr></thead>
                <tbody>
                  <tr><td>Golpe aplicado por conta verificada com identidade falsa</td><td>R$ 1.000,00</td></tr>
                </tbody>
              </table>
              <dl>
                <div className="sxw-linha"><dt>Franquia</dt><dd>Não há</dd></div>
                <div className="sxw-linha"><dt>Custo para você</dt><dd>Grátis, pago pelo PhizChat</dd></div>
              </dl>
            </section>

            <section className="sxw-sec">
              <h2>Condições principais</h2>
              <ul className="sxw-lista">
                <li>Vale para conversas no PhizChat em que você e a outra pessoa têm identidade verificada.</li>
                <li>O pedido de indenização é feito pelo app, em Segurança da Conta › Seguro PhizChat › Abrir sinistro.</li>
                <li>Válido somente no Brasil.</li>
              </ul>
            </section>

            <section className="sxw-sec">
              <h2>Não está coberto</h2>
              <ul className="sxw-lista">
                <li>Conversas com contas sem identidade verificada.</li>
                <li>Pagamentos feitos fora do contexto de uma conversa no PhizChat.</li>
                <li>Golpes comunicados depois de 30 dias do ocorrido.</li>
              </ul>
            </section>

            <p className="sxw-rodape">Documento de exemplo do protótipo. Sem valor contratual.</p>
          </article>
        </div>
      </div>
      {toast && <SX.SgToast key={toast}>{toast.split("·")[0]}</SX.SgToast>}
    </window.PhizHiFi.Screen>
  );
}

/* ── Mini app da Kev Seguros ─────────────────────────────────────────────
   Barra de mini app com a cápsula (··· | ×). Home: o que é a Kev, o Seguro
   PhizChat, como funciona, o que cobre e perguntas frequentes. O CTA do fim
   depende do estado: apólice (seguro ativo) ou verificação (inativo). */
const SXA_PASSOS = [
  { t: "Verifique sua identidade", s: "Leva poucos minutos, direto no PhizChat. O seguro é ativado assim que ela é confirmada." },
  { t: "Converse com contas verificadas", s: "A proteção vale quando você e a outra pessoa têm o selo de verificado." },
  { t: "Caiu num golpe? Abra o sinistro", s: "Pelo próprio app, com os prints da conversa e o comprovante do pagamento." }
];

const SXA_FAQ = [
  { q: "Quanto custa?", r: "Nada. O PhizChat paga o seguro para quem tem a identidade verificada." },
  { q: "Até quanto eu recebo?", r: "Até R$ 1.000 por golpe aplicado por uma conta verificada que usou uma identidade falsa." },
  { q: "Por quanto tempo vale?", r: "30 dias, e renova sozinho enquanto sua identidade continuar verificada." },
  { q: "Onde o seguro vale?", r: "Somente no Brasil." }
];

function SxKevApp() {
  const nav = window.PhizHiFi.useNav();
  const ativo = useSxAtivo();
  const [aberta, setAberta] = React.useState(0);
  const [toast, setToast] = React.useState(null);
  return (
    <window.PhizHiFi.Screen>
      <div className="pg sxa-app">
        <div className="sxa-app-barra">
          <span className="marca"><img src={SXW_KEV} alt="Kev Seguros" /></span>
          <div className="sxa-capsula">
            <button aria-label="Mais opções" onClick={() => setToast("Abre as opções do mini app·" + Date.now())}><window.Icon name="ellipsis" size={18} /></button>
            <i />
            <button aria-label="Fechar mini app" onClick={() => nav.pop()}><window.Icon name="x" size={18} /></button>
          </div>
        </div>
        <div className="pg-body sxa-app-corpo">
          <section className="sxa-hero">
            <span className="sxa-chip">Kev Seguros</span>
            <h1>Seguro simples, dentro dos apps que você já usa.</h1>
            <p>A Kev cria seguros digitais que você ativa em poucos toques, sem papelada e sem corretor.</p>
          </section>

          <section className="sxa-card-seguro">
            <img className="med" src={SX_IMG.medalha} alt="" />
            <div className="tx">
              <span className="sobre">Em parceria com o PhizChat</span>
              <h2>Seguro PhizChat contra golpes</h2>
              <p>Se uma conta verificada te aplicar um golpe e a identidade dela for falsa, você recebe até <b>R$ 1.000</b>.</p>
            </div>
            <div className="sxa-chips">
              <span>Grátis</span><span>Renova a cada 30 dias</span><span>Só no Brasil</span>
            </div>
          </section>

          <h3 className="sxa-h3">Como funciona</h3>
          <ol className="sxa-passos">
            {SXA_PASSOS.map((p, i) => (
              <li key={p.t}><span className="n">{i + 1}</span><span className="tx"><b>{p.t}</b><span>{p.s}</span></span></li>
            ))}
          </ol>

          <h3 className="sxa-h3">O que cobre</h3>
          <div className="sxa-cobre">
            <div className="sim">
              <span className="h"><window.Icon name="check" size={16} />Cobre</span>
              <p>Prejuízo de golpe numa conversa entre contas verificadas, quando a identidade da outra pessoa é falsa.</p>
            </div>
            <div className="nao">
              <span className="h"><window.Icon name="x" size={16} />Não cobre</span>
              <p>Conversas com contas sem verificação e pagamentos fora de uma conversa no PhizChat.</p>
            </div>
          </div>

          <h3 className="sxa-h3">Perguntas frequentes</h3>
          <div className="sxa-faq">
            {SXA_FAQ.map((f, i) => (
              <div key={f.q} className={"item" + (aberta === i ? " on" : "")}>
                <button onClick={() => setAberta(aberta === i ? -1 : i)} aria-expanded={aberta === i}>
                  <span>{f.q}</span><window.Icon name="chevron-down" size={18} />
                </button>
                {aberta === i && <p>{f.r}</p>}
              </div>
            ))}
          </div>

          <div className="sxa-app-cta">
            {ativo
              ? <SX.SgBtn onClick={() => nav.push("apolice")}>Ver minha apólice</SX.SgBtn>
              : <SX.SgBtn onClick={() => nav.push("verificar")}>Verificar identidade</SX.SgBtn>}
          </div>
          <p className="sxa-app-rodape">Seguro oferecido pela KEV Seguros em parceria com o PhizChat.</p>
        </div>
      </div>
      {toast && <SX.SgToast key={toast}>{toast.split("·")[0]}</SX.SgToast>}
    </window.PhizHiFi.Screen>
  );
}

window.SxKev = { SxApolice, SxKevApp };
