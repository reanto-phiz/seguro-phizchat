// sx-kyc.jsx — verificação de identidade, resumida como no Figma
// (Account security · Verify 2165:24176 → Identity verification 2165:24193 →
//  Jumio 2165:24203 / 24206 / 24209 → Under review 2165:24212).
// Toda ação "verificar identidade" do protótipo empurra "verificar".
// "Concluído" tira as telas da verificação da pilha e abre o "Verificou, ganhou."

const SXK_IMG = {
  id: "img/kyc-id.png" + SX_V,
  analise: "img/kyc-analise.png" + SX_V,
  rosto: "img/kyc-rosto.png" + SX_V,
  camera: "img/kyc-camera.png" + SX_V,
  ok: "img/kyc-ok.png" + SX_V
};

// Concluído: Arthur passa a verificado, as telas da verificação saem da pilha
// e entra o "Verificou, ganhou."
const sxkSair = (nav) => {
  if (SX_MODO.v === "inativo") SX_MODO.set("ativo");
  if (SX_MODO.v === "ambos-nao") SX_MODO.set("sophia-nao");
  const resto = nav.stack.filter(f => !String(f.screen).startsWith("verificar"));
  nav.setStackTo([...resto.map(f => ({ screen: f.screen, params: f.params })), "verificado"]);
};

/* 1 · Verifique sua identidade (2165:24176) */
function SxKycIntro() {
  const nav = window.PhizHiFi.useNav();
  const itens = [
    { ic: "ic-kyc-selo", t: "Obtenha um selo de verificação para confiança e segurança" },
    { ic: "ic-kyc-pessoa", t: "Adicione amigos e envie mensagens imediatamente" },
    { ic: "ic-kyc-carteira", t: "Use a carteira e faça pagamentos seguros" }
  ];
  return (
    <window.PhizHiFi.Screen>
      <div className="pg sxk">
        <button className="sx-glass-back sxk-back" aria-label="Voltar" onClick={() => nav.pop()}><SxIc n="ic-back" /></button>
        <div className="pg-body sxk-body">
          <img className="sxk-ilustra" src={SXK_IMG.id} alt="" />
          <h1 className="sxk-h">Verifique sua identidade</h1>
          <p className="sxk-p">A verificação da identidade ajuda a manter a comunidade saudável ao confirmar que você é uma pessoa real.</p>
          <div className="sxk-info">
            {itens.map(i => (
              <div key={i.ic} className="sxk-info-item">
                <span className="ic"><img src={SX_IMG.ic(i.ic)} alt="" /></span>
                <span className="t">{i.t}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="sx-rodape sxk-rodape">
          <p className="sxk-apoio">Ao tocar em Avançar, você concorda com a Política de Privacidade e o Contrato de Usuário.</p>
          <SX.SgBtn onClick={() => nav.push("verificar-dados")}>Avançar</SX.SgBtn>
        </div>
      </div>
    </window.PhizHiFi.Screen>
  );
}

/* 2 · Verificação de identidade: nacionalidade, nome e CPF (2165:24193) */
function SxKycCampo({ label, valor }) {
  return (
    <label className="sxk-campo">
      <span className="lb">{label}</span>
      <input defaultValue={valor} />
    </label>
  );
}

function SxKycDados() {
  const nav = window.PhizHiFi.useNav();
  return (
    <SX.SgTela titulo="Verificação de identidade" onVoltar={() => nav.pop()}
      rodape={<SX.SgBtn onClick={() => nav.push("verificar-rosto")}>Avançar</SX.SgBtn>}>
      <div className="sg-pad sxk-form">
        <div className="sxk-nac" role="button">
          <span className="flag" aria-hidden="true">🇧🇷</span>
          <span className="tx"><span className="t">Nacionalidade</span><span className="s">Brasileiro</span></span>
          <window.Icon name="chevron-right" size={16} />
        </div>
        <SxKycCampo label="Nome" valor="Arthur Coimbra" />
        <SxKycCampo label="Número do CPF" valor="123.456.789-00" />
      </div>
    </SX.SgTela>
  );
}

/* 3 · SDK de prova de vida (Jumio): instruções → câmera → upload ok.
   As telas do SDK são imagens; só os toques ficam por cima. */
function SxKycRosto() {
  const nav = window.PhizHiFi.useNav();
  return (
    <div className="pg sxk-sdk">
      <img src={SXK_IMG.rosto} alt="Verificação facial: centralize o rosto, com boa luz, na altura dos olhos" />
      <button className="sxk-hot volta" aria-label="Voltar" onClick={() => nav.pop()} />
      <button className="sxk-hot start" aria-label="Começar" onClick={() => nav.push("verificar-camera")} />
    </div>
  );
}

// Câmera por 2,2s → "Upload successful" por 1,4s → em análise
function SxKycCamera() {
  const nav = window.PhizHiFi.useNav();
  const [ok, setOk] = React.useState(false);
  React.useEffect(() => {
    const a = setTimeout(() => setOk(true), 2200);
    const b = setTimeout(() => nav.replace("verificar-analise"), 3600);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []);
  return (
    <div className="pg sxk-sdk">
      <img className="foto" src={SXK_IMG.camera} alt="Câmera com o rosto no enquadramento" />
      <img className={"sxk-ok" + (ok ? " on" : "")} src={SXK_IMG.ok} alt={ok ? "Envio concluído" : ""} />
      <button className="sxk-hot volta" aria-label="Fechar" onClick={() => nav.pop()} />
    </div>
  );
}

/* 4 · Verificação em análise (2165:24212) */
function SxKycAnalise() {
  const nav = window.PhizHiFi.useNav();
  return (
    <window.PhizHiFi.Screen>
      <div className="pg sxk">
        <div className="pg-body sxk-body">
          <img className="sxk-ilustra" src={SXK_IMG.analise} alt="" />
          <h1 className="sxk-h">Verificação em análise</h1>
          <p className="sxk-p">Estamos analisando suas informações. Se precisar, vamos te mandar uma mensagem com os próximos passos.</p>
          <div className="sg-pad">
            <div className="sg-group sxk-dados">
              <SX.SgItem titulo="Nome" chevron={false} direita={<span className="sg-val">Arthur Coimbra</span>} />
              <SX.SgItem titulo="Número do documento" chevron={false} direita={<span className="sg-val">123.456.789-00</span>} />
            </div>
          </div>
        </div>
        <div className="sx-rodape sxk-rodape">
          <p className="sxk-apoio escuro">Informação incorreta? Contate o Suporte.</p>
          <SX.SgBtn onClick={() => sxkSair(nav)}>Concluído</SX.SgBtn>
        </div>
      </div>
    </window.PhizHiFi.Screen>
  );
}

window.SxKyc = { SxKycIntro, SxKycDados, SxKycRosto, SxKycCamera, SxKycAnalise };
