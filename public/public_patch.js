/* PRU RelicDex public edition — trainer & About enhancements */
(() => {
"use strict";
const roster = window.__PRU_PUBLIC_TRAINERS;
if (!Array.isArray(roster) || roster.length < 30 || !Array.isArray(mons) || mons.length !== 450) {
  console.error("PRU trainer guide: source dataset missing, preserving original RelicDex.");
  return;
}
const old = new Map(trainers.map(t => [t.name.toLowerCase(), t]));
const sourcePortrait = (name) => old.get(name.toLowerCase())?.image || "";
roster.forEach(t => {
  if (!t.image) {
    const previous = t.name === "Steevee & Neevee" ? "Steeve & Neevee" :
      t.name === "Professor Oak & Professor Elm" ? "Oak" : t.name;
    t.image = sourcePortrait(previous);
  }
});
trainers.splice(0, trainers.length, ...roster);
const byName = new Map(mons.map(m => [m.name.toLowerCase(), m]));
const originalRender = render;
const css = String.raw`
/* Public Trainer Guide */
.trainer-card{min-height:208px}.trainer-card .sprite-frame{margin:8px 0 5px}
.trainer-card .tiny{text-align:center}.trainer-meta{font-size:11px;color:#dbcbed;margin-top:5px;text-align:center}
.trainer-topbar{display:flex;flex-wrap:wrap;align-items:center;gap:9px;margin:8px 0 13px}
.trainer-search{flex:1;min-width:165px;border:1px solid #46506b;border-radius:10px;background:#202b45;color:#fff;padding:11px 12px}
.trainer-groups{display:flex;gap:5px;flex-wrap:wrap}.trainer-filter{border:1px solid #5b6382;border-radius:18px;background:#26324d;color:#e2e7f8;font-size:11px;padding:6px 9px}.trainer-filter.selected{background:#7763ce;color:#fff}
.trainer-team-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin:10px 0 14px}
.trainer-pokemon{min-width:0;display:flex;align-items:center;gap:8px;background:#202e49;border:1px solid #3b4b68;border-radius:12px;padding:7px}
.trainer-pokemon .art{width:64px;height:66px;flex-shrink:0;display:flex;align-items:center;justify-content:center}
.trainer-pokemon .art .sprite{width:63px;height:64px;max-width:63px;max-height:64px}
.trainer-pokemon .name{font-size:12px;font-weight:800;overflow-wrap:anywhere}
.trainer-pokemon small{display:block;color:#bbc8df;font-size:10px;overflow-wrap:anywhere}
.trainer-badges{display:flex;flex-wrap:wrap;gap:7px;margin:9px 0}
.trainer-badge{border:1px solid #7776a6;border-radius:14px;padding:4px 10px;color:#dfd5ff;font-size:11px}
.trainer-selector{width:100%;max-width:100%;padding:12px;margin:8px 0 10px;border-radius:10px}
.trainer-unique{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}
.trainer-unique .trainer-pokemon{display:flex;flex-direction:column;gap:3px;text-align:center}
.trainer-unique .trainer-pokemon .art{height:55px}
.trainer-unique .trainer-pokemon .art .sprite{height:53px;max-height:53px}
.game-hero{border:1px solid #5c5270;background:linear-gradient(125deg,#31304f,#222f49);padding:19px 17px;border-radius:16px;margin:6px 0 15px}
.game-hero h2{margin:0 0 7px;font-size:23px}.game-hero p{margin:0}
.game-feature{background:#1e2b45;border:1px solid #3a4b69;border-radius:13px;padding:12px 14px;margin:10px 0}
.game-feature h3{margin:0 0 7px;font-size:15px}.game-feature p{margin:0;color:#cbd4e8}
.game-link{display:inline-block;background:#6d60bd;color:white;font-weight:700;border-radius:10px;padding:11px 15px;margin:10px 0;text-decoration:none}
@media(min-width:620px){.trainer-team-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.trainer-unique{grid-template-columns:repeat(5,minmax(0,1fr))}}
`;
const style = document.createElement("style");
style.textContent = css;
document.head.append(style);
document.title = "Pokémon Relics Ultimate — RelicDex | 450 Pokémon & Trainer Teams";
let trainerQuery = "", trainerGroup = "All";
const sectionOrder = ["All", "Johto", "Kanto", "League", "Rivals", "Duos", "Bosses"];
function pokemonCard(p, compact=false) {
  const mon = byName.get(String(p.name || "").toLowerCase());
  const art = mon ? img(mon, p.name) : '<div class="missing">No matched sprite</div>';
  return `<div class="trainer-pokemon"><div class="art">${art}</div><div><span class="name">${esc(p.name)}</span>${p.level ? `<small>Lv ${p.level}</small>` : ""}${!compact && p.ability ? `<small>${esc(p.ability)}</small>` : ""}${!compact && p.item ? `<small>Held: ${esc(p.item)}</small>` : ""}</div></div>`;
}
function renderTrainerList() {
 const list = trainers.filter(t => (trainerGroup === "All" || t.category === trainerGroup) &&
   (!trainerQuery || t.name.toLowerCase().includes(trainerQuery) || t.role.toLowerCase().includes(trainerQuery)));
 summary.innerHTML = `<div><b>${trainers.length} important trainers</b> · tap a trainer for every recorded battle party and PRU's custom Pokémon sprites.</div>
 <div class="trainer-topbar"><input id="trainerSearch" class="trainer-search" type="search" aria-label="Search trainers" placeholder="Search trainers..." value="${esc(trainerQuery)}">
 <div class="trainer-groups">${sectionOrder.map(g=>`<button type="button" class="trainer-filter ${trainerGroup===g?"selected":""}" data-category="${esc(g)}">${esc(g)}</button>`).join("")}</div></div>`;
 grid.className = "grid trainergrid";
 grid.innerHTML = list.map(t => `<button type="button" class="pokemon trainer-card" data-trainer="${trainers.indexOf(t)}" aria-label="Open ${esc(t.name)} team details">
 <div class="sprite-frame">${img(t,t.name)}</div><div class="monname">${esc(t.name)}</div><div class="tiny">${esc(t.role)}</div>
 <div class="trainer-meta">${t.parties.length ? t.parties.length + (t.parties.length===1?" battle party":" battle parties") : "Team verification pending"}</div></button>`).join("") || '<p class="empty">No trainers match your search.</p>';
 const search = document.getElementById("trainerSearch");
 search.addEventListener("input", e => {trainerQuery = e.target.value.toLowerCase().trim();renderTrainerList();const n=document.getElementById("trainerSearch");n.focus();n.setSelectionRange(n.value.length,n.value.length);});
 summary.querySelectorAll("[data-category]").forEach(b => b.addEventListener("click", () => {trainerGroup = b.dataset.category;renderTrainerList();}));
}
function renderGameAbout() {
 summary.textContent="The official companion guide for Pokémon Relics Ultimate";
 grid.className="about";
 const originalLogo=grid.querySelector(".pru-logo-img")?.outerHTML || "";
 grid.innerHTML = originalLogo +
 '<section class="game-hero"><h2>Pokémon Relics Ultimate</h2><p>Explore Johto and Kanto in an expanded Game Boy Advance adventure. Ancient Relics awaken powerful new evolutions, legendary encounters and battles with some very familiar faces.</p></section>'+
 '<div class="game-feature"><h3>Discover all 450 Pokémon</h3><p>Find your favourites alongside brand-new Relic evolutions, special forms and legendary Pokémon. Browse their game artwork, types, base stats, abilities, evolution methods and level-up moves here in RelicDex.</p></div>'+
 '<div class="game-feature"><h3>Hunt down the Relics</h3><p>Journey through classic towns, caves and landmarks in a new postgame hunt. Uncover hidden encounters and legendary challenges as the adventure grows across both regions.</p></div>'+
 '<div class="game-feature"><h3>Meet the challengers</h3><p>Face rivals, Gym Leaders, the Elite Four and unforgettable doubles such as Jessie & James and Steevee & Neevee. The Trainers tab lets you inspect their recorded battle teams and custom Pokémon sprites.</p></div>'+
 '<div class="game-feature"><h3>Less busywork, more adventure</h3><p>Convenient move relearning, training support, flexible HM use, new battle moves and other quality-of-life improvements keep the focus on building your team.</p></div>'+
 '<div class="game-feature"><h3>A fan-made adventure</h3><p>Pokémon Relics Ultimate is a fan-created ROM hack, developed with AI assistance, open-source game-development tools and help from the sprite-art community. Thanks to the pokeemerald-expansion project and the creators behind the resources that helped bring PRU to life.</p></div>'+
 '<div class="game-feature"><h3>Explore RelicDex</h3><p>Open Pokémon for the complete Pokédex or Trainers to compare their teams at different points in the story. Some teams and locations may change as new builds are released.</p></div>'+
 '<a class="game-link" target="_blank" rel="noopener noreferrer" href="https://github.com/jamesthoward2112-tech/Pokemon-Relics-Ultimate/releases">View PRU game releases</a>'+
 '<p class="notes">Pokémon and related trademarks belong to their respective owners. PRU is an independent, unofficial fan project, not endorsed by Nintendo, Game Freak or Creatures.</p>';
}
render = function() {
 originalRender();
 if(tab==="trainers")renderTrainerList();
 if(tab==="about")renderGameAbout();
};
function setBattle(t, index) {
 const party=t.parties[index], node=document.getElementById("trainerTeam");
 if(!node)return;
 node.innerHTML = party ? `<div class="trainer-badges"><span class="trainer-badge">${party.double?"Double battle":"Single battle"}</span><span class="trainer-badge">${party.pokemon.length} Pokémon</span></div>
 <div class="trainer-team-grid">${party.pokemon.map(p=>pokemonCard(p)).join("")}</div>`:
 '<p class="notes">Battle party not yet verified.</p>';
}
openTrainer = function(t) {
 const unique=new Map();
 t.parties.forEach(p=>p.pokemon.forEach(m=>{if(!unique.has(m.name))unique.set(m.name,m);}));
 const opts=t.parties.map((p,i)=>`<option value="${i}">${esc(p.label)} — ${p.pokemon.length} Pokémon</option>`).join("");
 document.getElementById("detailContent").innerHTML =
 `<div class="detailheader"><div class="detailhero">${img(t,t.name)}</div><div class="details-title"><small>${esc(t.category)} · ${esc(t.role)}</small><h2>${esc(t.name)}</h2><span class="tiny">${t.parties.length} recorded battle parties</span></div></div>
 <h3>Trainer's Pokémon</h3>${t.parties.length > 1 ? `<label class="tiny" for="trainerBattle">Choose an encounter</label><select id="trainerBattle" class="trainer-selector">${opts}</select>` : ""}
 ${t.parties.length ? '<div id="trainerTeam"></div>' : '<p class="notes">The exact battle party has not yet been confirmed from the accessible PRU trainer data.</p>'}
 ${unique.size ? `<h3>Every Pokémon used across recorded battles (${unique.size})</h3><div class="trainer-unique">${[...unique.values()].map(p=>pokemonCard({name:p.name},true)).join("")}</div>`:''}
 ${t.note ? `<p class="notes">${esc(t.note)}</p>` : ""}`;
 if(t.parties.length){
  setBattle(t,0);
  const select=document.getElementById("trainerBattle");
  if(select)select.addEventListener("change",()=>setBattle(t,Number(select.value)));
 }
 showDialog();
};
render();
})();