# Seguro PhizChat contra golpes — protótipo navegável

Protótipo em HTML do Seguro PhizChat, feito a partir do arquivo Insurance do Figma
(páginas Chat e Account Security). Estático, sem build.

## Como abrir

Sirva a pasta raiz e abra `/seguro/`:

```bash
python3 -m http.server 8742
```

Depois acesse http://localhost:8742/seguro/

## Publicado

Na Vercel, a raiz do site redireciona para `/seguro/` (`vercel.json`).

## Estrutura

- `seguro/` — o protótipo: telas (`sx-telas.jsx`, `sx-kyc.jsx`), rotas (`app.jsx`),
  jornadas da sidebar (`flows.js`), estilos e imagens.
- `shared/` — kit base do time (lista, conversa, Eu/Configurações, sidebar). Não editar por protótipo.

## Jornadas

1. Seguro inativo — Arthur sem verificação, Sophia verificada (inclui a verificação de identidade)
2. Seguro ativo — os dois verificados
3. Arthur verificado, Sophia não
4. Nenhum verificado
5. Abrir sinistro — folha de suporte a partir do seguro ativo
6. Extra · promoção — o modal sobre o seguro ao abrir o app
