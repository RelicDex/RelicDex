/* Use PRU's approved BYOXYS and black/orange Mega-X-derived Charaxis display art. */
(() => {
  "use strict";
  const source = window.__PRU_VISUAL_POKEMON;
  if (!source || !source.pokemon) return;
  source.pokemon.Charaxis = "assets/pru-art/dex/charaxis_black_orange.png";
  source.pokemon.Deoxys = "assets/pru-art/dex/deoxys.png";
  if (source.sources) {
    source.sources.Charaxis = "graphics/pokemon/charizard/mega_x/front.png (PRU-derived black/orange recolour)";
    source.sources.Deoxys = "graphics/pokemon/deoxys/byoxys_anim_front_gba.png";
  }
})();