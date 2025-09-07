/* Safe builder: does nothing unless takeover=true and sections exist */
document.addEventListener("DOMContentLoaded", () => {
  (async () => {
    try {
      const res = await fetch("/content/pages/home.json", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();

      const takeover = !!(data && data.takeover === true);
      const sections = Array.isArray(data && data.sections) ? data.sections : [];
      if (!takeover || sections.length === 0) return;   // keep static page

      const mount = document.getElementById("sectionsMount");
      const staticMain = document.getElementById("staticMain");
      if (!mount) return;

      if (staticMain) staticMain.style.display = "none";

      // minimal renderer so the page never crashes
      const el = (t, attrs={}, html="") => {
        const n=document.createElement(t);
        Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));
        n.innerHTML = html;
        return n;
      };
      const container = el("div", { class: "container py-5" });
      sections.forEach(sec => {
        if (sec.type === "text") {
          const wrap = el("div", { class: (sec.align==="center"?"text-center":sec.align==="right"?"text-end":"") });
          if (sec.heading) wrap.appendChild(el("h3", { class: "py-3" }, sec.heading));
          if (sec.body) wrap.appendChild(el("p", {}, sec.body));
          container.appendChild(wrap);
        }
        if (sec.type === "hero") {
          const wrap = el("div", { class: "padding-xlarge" });
          if (sec.title) wrap.appendChild(el("h1", { class: (sec.align==="center"?"text-center":sec.align==="right"?"text-end":"") }, sec.title));
          if (sec.subtitle) wrap.appendChild(el("p", {}, sec.subtitle));
          mount.appendChild(wrap);
        }
      });
      mount.appendChild(container);
    } catch (e) {
      console.warn("sections.js failed safely:", e);
    }
  })();
});
