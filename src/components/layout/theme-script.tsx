// Runs before first paint: applies the stored theme, otherwise the OS theme,
// and keeps following the OS until the visitor picks one with the toggle.
const script = `(()=>{try{var d=document.documentElement,m=matchMedia("(prefers-color-scheme: dark)"),a=function(){var t=localStorage.getItem("theme");d.dataset.theme=t==="dark"||t==="light"?t:m.matches?"dark":"light"};a();m.addEventListener("change",a)}catch(e){}})()`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
