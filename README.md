# Pokémon Relics Ultimate — RelicDex

The public companion guide for **Pokémon Relics Ultimate (PRU)**.

RelicDex includes the game's 450-Pokémon Pokédex, approved PRU battle-front artwork, evolution information, stats, moves, and an interactive trainer guide. The trainer guide includes source-backed GBA portraits, recorded encounters and teams, plus trainer-exclusive battle artwork (including the Ecruteak Kimono ritual and a special Eevee Twins appearance) without adding non-playable forms to the Pokédex.

**Public ROM status:** The game has not yet had an official public release. RelicDex intentionally displays **“Official PRU download coming soon”** instead of linking players to the development/test release archive. When an official version is approved, the About page should link directly to that single downloadable .gba release.

## Source and sprite policy

- 450 canonical Pokédex entries; trainer-exclusive visual variants never inflate that count.
- Current PRU special art: black-and-orange GMax-style Charaxis; user-approved Byoxys design for Deoxys; permanent black Primal Groudon and Kyogre; black Mega Rayquaza; Golden Relic Ho-Oh; special Kanto Articuno-P, Zapdos-P, and Moltres-P.
- Use the game's verified sprite sources and approved Library assets; no remote third-party art or stock Pokémon substitutions for these exceptions.
- Trainer portraits use local GBA sprite assets, with palette-index background cleanup at render time.
- The five Kimono Girls' special Pokémon appearances are enemy-only, visual overrides; ordinary Pokémon remain unchanged.

The site is built and published by `.github/workflows/pages.yml`. It combines the current 450-species HTML source, trainer party data and local sprite bundles into a self-contained GitHub Pages website.
