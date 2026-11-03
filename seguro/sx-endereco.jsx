// sx-endereco.jsx — Arthur verificado, Sophia verificada, mas sem endereço
// (Account security · linha "Eu - Com verificação / sem endereço"):
// Eu 2399:38179 → Configurações 2399:38200 → Segurança da Conta 2399:38160 →
// Novo endereço 2399:39569 / Buscando CEP 2399:39592 / Preenchido 2399:39651 →
// Endereços 2399:39674 → Segurança da Conta ativa 48:11344 → Eu 2432:41369.
// O seguro só ativa com um endereço: salvar o primeiro passa o modo pra "ativo".

// Endereço salvo nesta sessão (recarregar zera)
const SXE_SALVO = { e: null };
const SXE_EXEMPLO = { nome: "Casa", cep: "01310-100", rua: "Avenida Paulista", num: "1235", comp: "", bairro: "Bela Vista", cidade: "São Paulo", uf: "SP" };
const SXE_VAZIO = { nome: "", cep: "", rua: "", num: "", comp: "", bairro: "", cidade: "", uf: "" };
const sxeLinha = (e) => `${e.rua}, ${e.num}${e.comp ? " · " + e.comp : ""} · ${e.bairro}, ${e.cidade} – ${e.uf} · ${e.cep}`;

// Toque num campo vazio preenche o exemplo, como no resto do protótipo
const SxeCampo = ({ f, set, k, label, ...rest }) => (
  <SX.SgField label={label} value={f[k]} onChange={set(k)}
    onClick={() => { if (!f[k] && SXE_EXEMPLO[k]) set(k)(SXE_EXEMPLO[k]); }} {...rest} />
);

/* ── Novo endereço (2399:39569 · 39592 · 39651) ──────────────────────────
   CEP completo → "Buscando seu endereço…" por 1,2s → logradouro, bairro,
   cidade e UF preenchidos. Salvar fica desligado até ter tudo. */
function SxEndNovo({ params = {} }) {
  const nav = window.PhizHiFi.useNav();
  const [f, setF] = React.useState(params.cheio ? SXE_EXEMPLO : params.buscando ? { ...SXE_VAZIO, nome: "Casa", cep: "01310-100" } : SXE_VAZIO);
  const [buscando, setBuscando] = React.useState(!!params.buscando);
  const [semNum, setSemNum] = React.useState(false);
  const [salvando, setSalvando] = React.useState(false);
  const set = (k) => (v) => setF(x => ({ ...x, [k]: v }));
  const achou = !!f.rua;

  // CEP com 8 dígitos dispara a busca (a menos que o endereço já esteja lá)
  React.useEffect(() => {
    if (f.cep.replace(/\D/g, "").length !== 8 || achou) return;
    setBuscando(true);
    const t = setTimeout(() => {
      setBuscando(false);
      setF(x => ({ ...x, rua: SXE_EXEMPLO.rua, bairro: SXE_EXEMPLO.bairro, cidade: SXE_EXEMPLO.cidade, uf: SXE_EXEMPLO.uf }));
    }, 1200);
    return () => clearTimeout(t);
  }, [f.cep]);

  const pronto = f.nome && achou && (f.num || semNum) && f.bairro && f.cidade && f.uf && !buscando;
  const salvar = () => {
    setSalvando(true);
    setTimeout(() => {
      SXE_SALVO.e = { ...f, num: semNum ? "s/n" : f.num };
      SX_MODO.set("ativo");
      nav.setStackTo(["me", "config", "seguranca", { screen: "enderecos", params: { cadastrado: true } }]);
    }, 700);
  };
  const off = buscando || !achou;

  return (
    <window.PhizHiFi.Screen>
      <div className="pg sg-pg sxe">
        <div className="pg-title sxe-titulo">Novo endereço</div>
        <div className="pg-body sxe-corpo">
          <SxeCampo f={f} set={set} k="nome" label="Nome do endereço" />
          <div>
            <SxeCampo f={f} set={set} k="cep" label="CEP" inputMode="numeric" maxLength={9}
              carregando={buscando} ajuda={buscando ? "Buscando seu endereço..." : undefined} />
            <button className="sxe-link" onClick={() => {}}>Não sei meu CEP</button>
          </div>
          <div className={off ? "sxe-off" : ""}><SxeCampo f={f} set={set} k="rua" label="Logradouro" /></div>
          <div className={"sxe-dupla" + (off ? " sxe-off" : "")}>
            <div className="num"><SxeCampo f={f} set={set} k="num" label="Número" inputMode="numeric" readOnly={semNum} /></div>
            <div><SxeCampo f={f} set={set} k="comp" label="Complemento" /></div>
          </div>
          <label className={"sxe-check" + (off ? " sxe-off" : "")}>
            <input type="checkbox" checked={semNum} onChange={(e) => setSemNum(e.target.checked)} />
            <span className="box"><window.Icon name="check" size={14} /></span>Sem número
          </label>
          <div className={off ? "sxe-off" : ""}><SxeCampo f={f} set={set} k="bairro" label="Bairro" /></div>
          <div className={"sxe-dupla" + (off ? " sxe-off" : "")}>
            <div><SxeCampo f={f} set={set} k="cidade" label="Cidade" /></div>
            <div className="uf"><SxeCampo f={f} set={set} k="uf" label="UF" maxLength={2} /></div>
          </div>
        </div>
        <div className="sg-rodape sxe-rodape">
          <SX.SgBtn disabled={!pronto} loading={salvando} onClick={salvar}>Salvar endereço</SX.SgBtn>
          <button className="sxe-cancelar" onClick={() => nav.pop()}>Cancelar</button>
        </div>
      </div>
    </window.PhizHiFi.Screen>
  );
}

/* ── Endereços (2399:39674) ──────────────────────────────────────────────
   O endereço salvo como principal. Ao chegar do "Salvar", toast de cadastrado
   e a notificação do PhizChat avisando que o seguro está valendo. */
function SxEnderecos({ params = {} }) {
  const nav = window.PhizHiFi.useNav();
  // Pulando direto pra cá pela sidebar, o exemplo vira o endereço salvo
  if (params.cadastrado && !SXE_SALVO.e) SXE_SALVO.e = SXE_EXEMPLO;
  const e = SXE_SALVO.e || SXE_EXEMPLO;
  const [toast, setToast] = React.useState(params.cadastrado ? "Endereço cadastrado·" + Date.now() : null);
  return (
    <SX.SgTela onVoltar={() => nav.pop()} titulo="Endereços"
      acao={<button className="sxe-mais" aria-label="Adicionar endereço" onClick={() => setToast("Abre um novo endereço·" + Date.now())}>
        <window.Icon name="plus" size={22} />
      </button>}
      extra={<React.Fragment>
        {params.cadastrado && <window.SxSinistroTelas.SxsNotificacao icone={SX_IMG.logo} titulo="PhizChat"
          texto="Você já está protegido. Seu Seguro PhizChat já vale desde hoje." rotulo="Abrir conversa do PhizChat"
          onToque={() => nav.setStackTo(["chats", "dicas"])} />}
        {toast && <SX.SgToast key={toast}>{toast.split("·")[0]}</SX.SgToast>}
      </React.Fragment>}>
      <div className="sg-pad sxe-lista">
        {/* Endereço · Casa (ListItem: título, endereço em até 2 linhas, tag e chevron) */}
        <div className="sxe-card" role="button">
          <span className="tx"><span className="t">{e.nome}</span><span className="s">{sxeLinha(e)}</span></span>
          <span className="sxe-principal">Principal</span>
          <window.Icon name="chevron-right" size={16} />
        </div>
        <p className="sxe-nota">O endereço principal é o que vai na apólice do Seguro PhizChat.</p>
      </div>
    </SX.SgTela>
  );
}

window.SxEndereco = { SxEndNovo, SxEnderecos, SXE_SALVO, sxeLinha };
