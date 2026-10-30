// i18n-mini.js — stub enxuto do i18n.js do phiz-app.
// Este protótipo é PT-BR; o stub existe só pra manter os componentes
// compartilhados (hifi-shared.jsx, journeys-sidebar.jsx) funcionando.

(function () {
  const I18N = {
    pt: {
      "tab.chats": "Chat",
      "tab.calls": "Ligações",
      "tab.discover": "Descobrir",
      "tab.contacts": "Contatos",
      "tab.me": "Eu",
      "proto.note": "Protótipo · toque nos elementos verdes"
    },
    en: {
      "tab.chats": "Chats",
      "tab.calls": "Calls",
      "tab.discover": "Discover",
      "tab.contacts": "Contacts",
      "tab.me": "Me",
      "proto.note": "Prototype · tap the green elements"
    }
  };

  window.__phizLang = localStorage.getItem("phiz.lang") || "pt";

  // Cada protótipo declara a própria nota de rodapé em window.__PROTO_NOTE.
  const lookup = (key, lang) => {
    if (key === "proto.note" && window.__PROTO_NOTE) {
      return window.__PROTO_NOTE[lang] || window.__PROTO_NOTE.pt || I18N.pt[key];
    }
    return (I18N[lang] && I18N[lang][key]) || I18N.pt[key] || key;
  };

  window.tStr = (key) => lookup(key, window.__phizLang || "pt");

  window.setPhizLang = function (lang) {
    if (lang !== "pt" && lang !== "en") return;
    window.__phizLang = lang;
    localStorage.setItem("phiz.lang", lang);
    window.dispatchEvent(new CustomEvent("phiz-lang-changed", { detail: lang }));
  };

  window.useT = function () {
    const { useState, useEffect } = React;
    const [lang, setLang] = useState(window.__phizLang || "pt");
    useEffect(() => {
      const h = () => setLang(window.__phizLang || "pt");
      window.addEventListener("phiz-lang-changed", h);
      return () => window.removeEventListener("phiz-lang-changed", h);
    }, []);
    return (key) => lookup(key, lang);
  };
})();
