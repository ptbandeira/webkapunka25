document.addEventListener("DOMContentLoaded", async () => {
  async function getJSON(path) {
    try {
      const res = await fetch(path, { cache: "no-store" });
      if (!res.ok) throw new Error(path + " " + res.status);
      return await res.json();
    } catch (e) {
      console.warn("CMS data load failed:", path, e);
      return null;
    }
  }

  // About page block on the homepage
  const about = await getJSON("/content/about.json");
  if (about) {
    const at = document.getElementById("aboutTitle");
    const ab = document.getElementById("aboutBody");
    if (at && about.title) at.textContent = about.title;
    if (ab && about.body)  ab.textContent  = about.body;
    // If you add an <img id="aboutImage"> later, you can set its src here.
  }

  // (Optional) Hero — we’ll wire this after we confirm how <hero-section> renders.
  // const hero = await getJSON("/content/hero.json");
  // if (hero) { ... }
});
