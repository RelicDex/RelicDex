/* Fallback only: preserve the latest user-approved GMax Charaxis and Library BYOXYS. */
(() => {
  "use strict";
  const assets = window.__PRU_VISUAL_POKEMON;
  if (!assets || !assets.pokemon) return;
  if (!assets.pokemon.Charaxis) {
    assets.pokemon.Charaxis = "assets/pru-art/dex/charaxis_black_orange.png";
    if (assets.sources) assets.sources.Charaxis = "Derived black/orange PRU Mega-X artwork (fallback)";
  }
  if (!assets.pokemon.Deoxys) {
    assets.pokemon.Deoxys = "assets/pru-art/dex/deoxys.png";
    if (assets.sources) assets.sources.Deoxys = "graphics/pokemon/deoxys/byoxys_anim_front_gba.png";
  }
})();