# phiz-ui — a base de UI do PhizChat (medida do Figma)

Use em **todo protótipo novo**. Carregar depois do `hifi-styles.css` (e do
`config-shell.css`, se tiver Me/Configurações):

```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="shared/hifi-styles.css"/>
<link rel="stylesheet" href="shared/phiz-ui.css"/>
<!-- babel: ... hifi-shared.jsx → phiz-ui.jsx → telas -->
```

Componentes (`window.PhizUI`): `PzNavBar` (tab bar nova), `PzChatsBar` + `PzChatRow`
(lista), `PzChatHeader`, `PzChat` + `PzThread` + `PzBubble` (conversa), `PzComposer`,
`PzIcon` (ícones do arquivo por máscara), `PzSelo`.

> **Atualização 30/09/2026:** o texto das bolhas passou a ser **SF Pro** (fonte do sistema), não mais Google Sans Flex. Onde abaixo estiver "GSF", leia SF Pro com tracking -0,5. Poppins só em títulos e no nome do cabeçalho.

## Fontes da verdade
- Redesign Chats `Njtv9YG3qdWWZ90uEn0ty4` — Chat Screen `14707:26235`, Home `6043:69784`
- Discover · Mobile App `Vb3ykZcc48DMYGRovpRcyn` — tab bar nova `725:32773` (NavigationBar `1186:7114`)

## Medidas que importam
- **Status bar** 62 (pt21 pb19), SF Pro Semibold 17/22. Home indicator 144×5 #141414.
- **Tab bar**: Chats · Ligações · Descobrir · Contatos · Eu, ícones *Filled*. pt20 px12,
  pílula 72 (padding 4) branca com blur 6, borda 1 branca, sombra 0 4 12 #0000001F +
  inner 12 #0000000A. Selecionado = pílula rgba(0,0,0,.08) do tamanho do item, rótulo
  e ícone #169343. Rótulo SF 590 11/16. Tag verde 20, top 4, centro+14.
- **Lista**: app bar (⋯ | IA + botão verde +), logo PhizChat 24 de altura, busca 40 #F5F5F5.
  Linha 80, avatar 56, nome SF 590 17/24, hora/prévia SF 15/20 #666, hora não lida #19B852,
  divisória left 88 right 20 rgba(204,205,190,.4).
- **Conversa**: fundo #F6F1EA + doodle `assets/chat/chat-bg-1.svg` (tile 360×640, #E9E0D1).
  Cabeçalho branco, borda + sombra 0 4 12 #00000014, back 40, avatar 40, nome Poppins 600
  17/20 (-1) + selo, status SF 13/16. **Bolha**: Google Sans Flex 17/20, padding 4 + texto
  pl8, raio 16, sombra 0 0 .5 #00000029, enviada #D9FDD4, recebida #FFF, **rabinho de 16 só no
  último da sequência** (−10 do lado). Hora GSF 13/16 #666 + check duplo 20 (azul = lida).
  4 entre bolhas do mesmo lado, 12 entre grupos. **Sistema**: GSF 13/16, raio 8, padding 8,
  máx 312 (criptografia em #FBF2C2). **Data**: pílula branca 20 com borda.
- **Composer**: branco 48% + blur 24, borda no topo; + · campo branco borda #D0D1C4 raio 24
  (SF 17/24 "Mensagem", figurinha, câmera) · mic verde 36.
- **Conteúdo rico na bolha** (File Bubble): prévia com raio 12 no topo + bloco
  rgba(0,0,0,.04) com raio 12 embaixo, padding 12, título GSF 600 15/20, descrição 13/16.

## Regras de conversa (time de Design, 25/09/2026)
- **Nome grande do cabeçalho = apelido da agenda** ("Mari 💛"). O **nome verificado** só aparece
  dentro da conversa, na linha de status, **alternando** com "online" (`PzTicker`). Quem não é
  verificado mostra "Identidade não verificada" no mesmo lugar.
- **Tocar na foto/nome abre o Contact info** (já existe no app). Não usar esse toque pra outra coisa;
  recurso novo entra DENTRO do Contact info (`PzContato`, Contact Page `w44NoQanqFObk9AKfh3dP3` 539:89666).
- **Conversa antiga não tem começo visível.** Aviso que importa não pode morar só no topo:
  letreiro no status + marco no histórico (bolha de sistema no dia em que aconteceu) + pílula que
  flutua no topo enquanto se rola (`PzChat pilula=…`).

## Contact Page (medidas)
Foto 393×393 com canto inferior direito 32, gradientes pretos 80% em cima e embaixo, botões de vidro
40 (branco 48% + blur). Apelido Poppins 600 32/40 branco; embaixo nome SF 17/24 branco | divisor 12 |
"Verificada" SF 15 #9AC9FB com selo 14. Ações: 4 cards brancos raio 24, borda, padding 12, ícone 24
verde, rótulo SF 590 13/16. Cartão de destaque: borda azul #1679E2 + brilho 0 0 16. Listas: cartão
branco raio 24, linha 56 px20 gap16 ícone 24, divisória só no conteúdo, valor SF 15 #666 + chevron 16.
Seção: Poppins 600 17/20, pt32 pb12. Fundo da página #F5F5F5.
