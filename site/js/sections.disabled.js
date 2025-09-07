document.addEventListener("DOMContentLoaded", async () => {
  const mount = document.getElementById("sectionsMount");
  if (!mount) return;

  async function getJSON(path){ try{const r=await fetch(path,{cache:"no-store"}); if(!r.ok) throw new Error(path); return await r.json(); }catch(e){ console.warn("load fail",path,e); return null; } }
  const data = await getJSON("/content/pages/home.json");
  if (!data || !Array.isArray(data.sections)) return;

  const staticMain = document.getElementById("staticMain");
  if (staticMain) staticMain.style.display = "none";

  const el = (tag, attrs={}, html="") => { const n=document.createElement(tag); Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v)); n.innerHTML=html; return n; };
  const wrap = (inner, cls="padding-xlarge") => { const s=document.createElement("section-wrapper"); s.className=cls; s.appendChild(inner); return s; };
  const align = a => a==="center"?"text-center":a==="right"?"text-end":"";

  for (const sec of data.sections) {
    if (sec.type === "text") {
      const box = el("div",{class:`container ${align(sec.align||"left")}`},
        `${sec.heading?`<h3 class="py-3">${sec.heading}</h3>`:""}${sec.body?`<p>${sec.body}</p>`:""}`
      );
      mount.appendChild(wrap(box));
    }
    // (we can add hero / products / faqs renderers next)
  }
});
