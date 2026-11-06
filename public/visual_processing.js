/* RelicDex public visual pass — source-locked PRU art; 450 species remain unchanged. */
(() => {
"use strict";
const assets = window.__PRU_VISUAL_POKEMON;
const portraits = window.__PRU_PORTRAIT_ART;
const ritual = window.__PRU_RITUAL_ART;
if (!assets || !portraits || !ritual || !Array.isArray(mons) || mons.length !== 450) {
  console.error("PRU graphics patch: a required verified sprite bundle is missing.");
  return;
}
const tasks = [];
const cache = new Map();
function convert(uri, options = {}) {
  const cacheKey = uri + JSON.stringify(options);
  if (cache.has(cacheKey)) return cache.get(cacheKey);
  const promise = new Promise(resolve => {
    const im = new Image();
    im.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 64; canvas.height = 64;
        const ctx = canvas.getContext("2d", {willReadFrequently:true});
        ctx.imageSmoothingEnabled = false;
        // Animated fronts are stacked 64x64 frames; select frame zero, not both frames.
        ctx.drawImage(im, 0, 0, Math.min(64, im.width), Math.min(64, im.height), 0, 0, 64, 64);
        const pixels = ctx.getImageData(0, 0, 64, 64);
        const d = pixels.data;
        const bg = [d[0], d[1], d[2], d[3]];
        const pal = options.palette;
        const tint = options.tint;
        for (let k = 0; k < d.length; k += 4) {
          if (d[k+3] === 0) continue;
          // Transparency index 0 in original GBA art is usually a solid border
          // colour. Remove only an exact match, never fuzzy-delete sprite edges.
          if (bg[3] && d[k] === bg[0] && d[k+1] === bg[1] && d[k+2] === bg[2]) {
            d[k+3] = 0; continue;
          }
          if (pal && Array.isArray(pal[0]) && Array.isArray(pal[1])) {
            let nearest = -1, distance = Infinity;
            for (let i = 1; i < Math.min(pal[0].length, pal[1].length); i++) {
              const c = pal[0][i];
              const v = (d[k]-c[0])**2 + (d[k+1]-c[1])**2 + (d[k+2]-c[2])**2;
              if (v < distance) {distance=v; nearest=i;}
            }
            // Indexed PRU PNGs use exact 16-colour source palettes.
            if (nearest >= 0 && distance <= 48) {
              const c = pal[1][nearest];
              d[k]=c[0]; d[k+1]=c[1]; d[k+2]=c[2];
            }
          }
          if (tint) {
            // Game's BlendPalette uses 5/16 target colour on shiny sprites.
            d[k]   = Math.round((11*d[k]   + 5*tint[0]) / 16);
            d[k+1] = Math.round((11*d[k+1] + 5*tint[1]) / 16);
            d[k+2] = Math.round((11*d[k+2] + 5*tint[2]) / 16);
          }
        }
        ctx.putImageData(pixels, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } catch (e) {console.warn("PRU sprite conversion failed; original source retained", e); resolve(uri);}
    };
    im.onerror = () => resolve(uri);
    im.src = uri;
  });
  cache.set(cacheKey, promise);
  return promise;
}
const byName = new Map(mons.map(m => [m.name, m]));
const special = new Set(["Charaxis","Rayquaza","Groudon","Kyogre"]);
const corrected = [];
for (const [name, uri] of Object.entries(assets.pokemon)) {
  const mon = byName.get(name);
  if (!mon) {console.warn("Missing expected PRU Dex species",name);continue;}
  mon.image = uri; mon.battleSprite = uri;
  const sourcePath = assets.sources[name];
  const githubSource = sourcePath.startsWith("graphics/");
  mon.spriteSource = (githubSource ? "Verified PRU game source: " : "User-approved custom artwork: ") + sourcePath;
  mon.frontSpriteSourcePNG = sourcePath;
  if (githubSource) mon.frontSpriteGitHub = "https://github.com/jamesthoward2112-tech/Pokemon-Relics-Ultimate/blob/main/" + sourcePath;
  else delete mon.frontSpriteGitHub;
  mon.frontVersion = "RelicDex correction — game source art / 6 Nov 2026";
  delete mon.frontSpriteSha256; // Old Job 15 hash was for the superseded incorrect PNG.
  corrected.push(name);
  const opts = special.has(name) ? {palette:assets.palettes[name]} : {};
  tasks.push(convert(uri,opts).then(png => {mon.image = png; mon.battleSprite = png;}));
}
// Steevee and Neevee have one approved battle-only GMax-style Eevee visual.
// Show it on the first Eevee at Route 3 only; keep the other Eevee ordinary.
const twins = trainers.find(t => t.name === "Steevee & Neevee");
const route3 = twins && twins.parties.find(p => p.id === "TRAINER_STEEVE_NEEVEE_ROUTE3_HNS");
const specialEevee = route3 && route3.pokemon.find(p => p.name === "Eevee");
if (specialEevee) {specialEevee.visualKey = "Eevee Gmax duo";specialEevee.visualNote = "Trainer-only Gigantamax-style visual; standard Eevee species and mechanics";}
let portraitCount=0;
for (const t of trainers) {
  const match = portraits[t.name];
  if (!match) continue;
  t.image = match.png; t.portraitSource=match.source;
  portraitCount++;
  tasks.push(convert(match.png).then(png => {t.image=png;}));
}
const kimono = [
  ["Zuki","Gengar","Gengar Mega ritual",["Eerie Fog","Shadow Ball","Sludge Bomb","Hypnosis"]],
  ["Naoko","Misdreavus","Misdreavus ritual",["Eerie Fog","Shadow Ball","Psychic","Pain Split"]],
  ["Miki","Banette","Banette Mega ritual",["Eerie Fog","Shadow Claw","Will O Wisp","Knock Off"]],
  ["Sayo","Sableye","Sableye Mega ritual",["Eerie Fog","Shadow Ball","Recover","Confuse Ray"]],
  ["Kuni","Dusclops","Dusclops ritual",["Eerie Fog","Night Shade","Will O Wisp","Pain Split"]]
];
const ritualSpeciesMap = { "Misdreavus ritual":"misdreavus","Dusclops ritual":"dusclops" };
const ritualTint = { "misdreavus":[160,56,216], "dusclops":[48,128,208] };
for (const [name, species, art, moves] of kimono) {
  if (trainers.some(t=>t.name===name)) continue;
  const record = {
    name, role:"Kimono Girl · Ecruteak Dance Theatre", category:"Johto",
    image:portraits[name]?.png || "",
    parties:[{
      id:"TRAINER_"+name.toUpperCase()+"_HNS",
      label:"Ecruteak ritual challenge",
      double:false,
      pokemon:[{name:species,level:48,moves,ability:null,item:null,visualKey:art,visualNote:"Trainer-only ritual battle appearance"}]
    }],
    note:"This special enemy-only appearance is an artwork override. It does not grant the Pokémon a separate obtainable form or Pokédex number."
  };
  trainers.push(record);
  const port=portraits[name];
  if(port)tasks.push(convert(port.png).then(png=>{record.image=png;}));
}
const enemyArt = {};
window.__PRU_ENEMY_ONLY_ART = enemyArt;
for (const [key, uri] of Object.entries(assets.forms)) {
  enemyArt[key] = uri;
  tasks.push(convert(uri).then(png => {enemyArt[key]=png;}));
}
for (const [key, slug] of Object.entries(ritualSpeciesMap)) {
  const base = ritual[slug];
  enemyArt[key] = base.image;
  const tint = ritualTint[slug];
  // Convert exact GBA RGB555 tint to 8-bit values.
  tasks.push(convert(base.image,{palette:[base.normal,base.shiny],tint}).then(png => {enemyArt[key]=png;}));
}
render();
Promise.all(tasks).then(() => {
  render();
  console.info("RelicDex visuals: corrected "+corrected.length+" PRU species, "+portraitCount+" source-backed trainer portraits and 5 Kimono-exclusive teams.");
});
})();
