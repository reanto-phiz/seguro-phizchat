// proto-nav.jsx — Navigation stack with iOS push/pop animations + swipe back

const { useState, useEffect, useRef, useCallback, createContext, useContext } = React;

// Navigation context (passed to every screen)
const NavCtx = createContext({});
window.PhizProtoNav = NavCtx;

// ─── Stack state ───
// Each frame: { id, screen, params, dir }
function useNavStack(initial = "chats-list") {
  const parseHash = () => {
    const h = window.location.hash.replace(/^#/, "");
    if (!h) return [initial];
    return h.split("/").filter(Boolean);
  };
  const [stack, setStack] = useState(() => parseHash().map(s => ({ id: Math.random(), screen: s, params: {} })));
  const animRef = useRef(null);
  const [anim, setAnim] = useState(null); // {dir, fromIdx, toIdx} during transition

  // sync to hash whenever stack changes
  useEffect(() => {
    const path = stack.map(f => f.screen).join("/");
    window.history.replaceState(null, "", "#" + path);
  }, [stack]);

  const push = useCallback((screen, params = {}) => {
    if (anim) return;
    setAnim({ dir: "push" });
    setStack(s => [...s, { id: Math.random(), screen, params }]);
    setTimeout(() => setAnim(null), 340);
  }, [anim]);

  const replace = useCallback((screen, params = {}) => {
    setStack(s => {
      const next = [...s];
      next[next.length - 1] = { id: Math.random(), screen, params };
      return next;
    });
  }, []);

  const pop = useCallback(() => {
    if (anim) return;
    if (stack.length <= 1) return;
    setAnim({ dir: "pop" });
    setTimeout(() => {
      setStack(s => s.slice(0, -1));
      setAnim(null);
    }, 320);
  }, [anim, stack.length]);

  // Switch root tab — replaces entire stack
  const switchTab = useCallback((screen) => {
    setStack([{ id: Math.random(), screen, params: {} }]);
  }, []);

  // Set a deep-link stack directly (string or {screen, params})
  // Útil pra entradas por menu de jornadas com "pai" lógico antes da tela alvo,
  // pra que o botão Voltar funcione naturalmente.
  const setStackTo = useCallback((frames) => {
    setStack(frames.map(f => ({
      id: Math.random(),
      screen: typeof f === "string" ? f : f.screen,
      params: typeof f === "string" ? {} : (f.params || {})
    })));
  }, []);

  return { stack, push, pop, replace, switchTab, setStackTo, anim };
}

// ─── Frame renderer with animation ───
function FrameStack({ stack, anim, children, swipeProgress }) {
  // We render at most current + previous (for transition)
  const top = stack[stack.length - 1];
  const prev = stack[stack.length - 2];

  return (
    <div className="stack">
      {/* PREV frame (visible only during animation or swipe) */}
      {prev && (anim || swipeProgress > 0) && (
        <div
          key={prev.id}
          className="frame"
          style={{
            transform:
              anim?.dir === "pop"
                ? undefined // pop-enter handled by class
                : swipeProgress > 0
                ? `translateX(${-30 + swipeProgress * 30}%)`
                : `translateX(-30%)`,
            opacity: swipeProgress > 0 ? 0.6 + 0.4 * swipeProgress : (anim?.dir === "pop" ? undefined : 0.6),
            transition: swipeProgress > 0 ? "none" : "transform .32s cubic-bezier(.32,.72,.35,1), opacity .32s",
            zIndex: 1,
          }}
        >
          {children(prev, "prev")}
        </div>
      )}

      {/* TOP frame */}
      <div
        key={top.id}
        className="frame"
        style={{
          transform:
            swipeProgress > 0
              ? `translateX(${swipeProgress * 100}%)`
              : anim?.dir === "push"
              ? undefined // animated by CSS
              : anim?.dir === "pop"
              ? `translateX(100%)`
              : `translateX(0)`,
          transition: swipeProgress > 0
            ? "none"
            : anim?.dir === "push"
            ? "transform .32s cubic-bezier(.32,.72,.35,1)"
            : anim?.dir === "pop"
            ? "transform .32s cubic-bezier(.32,.72,.35,1)"
            : undefined,
          // initial position when entering on push
          ...(anim?.dir === "push" && stack.length > 1
            ? {
                animation: "slideInRight .32s cubic-bezier(.32,.72,.35,1) forwards",
              }
            : {}),
          zIndex: 2,
          boxShadow: (swipeProgress > 0 || anim) ? "-4px 0 16px rgba(0,0,0,.15)" : "none",
        }}
      >
        {children(top, "top")}
      </div>
    </div>
  );
}

// Use a CSS keyframe for the push slide-in
const styleEl = document.createElement("style");
styleEl.textContent = `
@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
`;
document.head.appendChild(styleEl);

window.PhizProtoNavStack = { useNavStack, FrameStack, NavCtx };
