/* Renders the whole page from data/profile.json. Edit the JSON, not this file, to change content. */
/* ---------- Rendering ---------- */
const $ = (s, r=document) => r.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
let P;
const sections = [["about","About"],["skills","Skills"],["experience","Experience"],["certs","Certifications"],["contact","Contact"]];

function chips(list){return `<div class="chips">${list.map(i=>`<span class="chip">${esc(i)}</span>`).join("")}</div>`}

function render(){
  $("#status span").textContent = P.status;
  $("#nav").innerHTML = sections.map(([id,t])=>`<button type="button" data-go="${id}">${t}</button>`).join("");
  const [first, ...rest] = P.headline.split("|");
  $("#app").innerHTML = `
    <div class="hero" id="about">
      <h1>${esc(P.name)}</h1>
      <div class="role">${esc(P.headline.replace(/\s*\|\s*/g," / "))}</div>
      <p class="sum">${esc(P.summary)}</p>
      <div class="stats">${P.stats.map(s=>`<div class="stat"><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join("")}</div>
    </div>
    <section><div class="label">Core competencies</div><div>${chips(P.competencies)}</div></section>
    <section id="skills"><div class="label">Technical skills</div><div>
      <div class="tabs" id="tabs"></div><div class="skill-rows" id="skillrows"></div></div></section>
    <section id="experience"><div class="label">Experience</div><div>
      ${P.experience.map(j=>`<article class="job">
        <h3>${esc(j.role)}</h3>
        <div class="meta"><span>${esc(j.company)}, ${esc(j.place)}</span><span class="${j.current?"now":""}">${esc(j.period)}</span></div>
        <ul>${j.points.map(([h,t])=>`<li>${h?`<strong>${esc(h)}</strong>`:""}${esc(t)}</li>`).join("")}</ul>
      </article>`).join("")}</div></section>
    <section id="certs"><div class="label">Certifications and education</div><div>
      <div class="certs">${P.certifications.map(c=>`<div class="cert">${esc(c.name)}<small class="mono">${esc(c.code)}</small></div>`).join("")}</div>
      <div style="height:1rem"></div>
      ${P.education.map(e=>`<div class="edu"><strong>${esc(e.degree)}</strong>, ${esc(e.school)}<br><span class="mono" style="font-size:.82rem;color:var(--muted)">${esc(e.period)}</span></div>`).join("")}
    </div></section>
    <section id="contact"><div class="label">Contact</div><div class="contact">
      ${P.contact.map((c,i)=>`<div class="crow"><span class="label">${esc(c.label)}</span>
        <span class="val">${c.href?`<a href="${esc(c.href)}" target="_blank" rel="noopener">${esc(c.value)}</a>`:esc(c.value)}</span>
        ${c.label==="Location"?"":`<button type="button" class="copy" data-copy="${i}">Copy</button>`}</div>`).join("")}
    </div></section>`;
  $("#foot").innerHTML = `<span>${esc(P.name)}</span><span>${esc(P.location)}</span>`;
  renderSkills("All");
}

function renderSkills(active){
  const groups = ["All", ...P.skills.map(s=>s.group)];
  $("#tabs").innerHTML = groups.map(g=>`<button type="button" data-tab="${esc(g)}" aria-pressed="${g===active}">${esc(g)}</button>`).join("");
  const shown = active==="All" ? P.skills : P.skills.filter(s=>s.group===active);
  $("#skillrows").innerHTML = shown.map(s=>`<div class="skill-row"><div class="label">${esc(s.group)}</div>${chips(s.items)}</div>`).join("");
}

document.addEventListener("click", e=>{
  const go = e.target.closest("[data-go]");
  if(go){ document.getElementById(go.dataset.go)?.scrollIntoView({behavior: matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"}); return; }
  const tab = e.target.closest("[data-tab]");
  if(tab){ renderSkills(tab.dataset.tab); return; }
  const cp = e.target.closest("[data-copy]");
  if(cp){
    const v = P.contact[+cp.dataset.copy].value;
    const done = ()=>{cp.textContent="Copied"; setTimeout(()=>cp.textContent="Copy",1500)};
    (navigator.clipboard?.writeText(v) ?? Promise.reject()).then(done).catch(()=>{
      const r=document.createRange(); r.selectNodeContents(cp.previousElementSibling);
      const s=getSelection(); s.removeAllRanges(); s.addRange(r); cp.textContent="Selected";
    });
  }
});
async function init(){
  try{
    const res = await fetch("data/profile.json", {cache:"no-cache"});
    if(!res.ok) throw new Error(res.status);
    P = await res.json();
    document.title = P.name;
    render();
  }catch(err){
    $("#app").innerHTML = '<p style="padding:3rem 0">Could not load data/profile.json. If you opened index.html from disk, run a local server instead: <code>python3 -m http.server 8080</code></p>';
  }
}
init();
