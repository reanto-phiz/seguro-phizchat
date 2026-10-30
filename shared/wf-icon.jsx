// Lucide icon helper — renders SVG icons from window.lucide
// Usage: <Icon name="message-circle" size={18} />
const Icon = ({ name, size = 18, className = "", color }) => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!ref.current || !window.lucide) return;
    ref.current.innerHTML = "";
    const el = document.createElement("i");
    el.setAttribute("data-lucide", name);
    ref.current.appendChild(el);
    try { window.lucide.createIcons({ attrs: { width: size, height: size, "stroke-width": 1.8 }}); } catch(e){}
  }, [name, size]);
  return <span ref={ref} className={className} style={{display:"inline-flex",alignItems:"center",justifyContent:"center",color,width:size,height:size}}/>;
};
window.Icon = Icon;
