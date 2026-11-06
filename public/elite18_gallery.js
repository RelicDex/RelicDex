/* Elite 18: show PRU-approved trainer-only battle art without adding Dex species. */
(() => {
  "use strict";
  const source = {
    "Blue Mega Arcanine": "assets/pru-art/exclusive/blue_arcanine_mega.png",
    "Elm Amplified Raikou": "assets/pru-art/exclusive/elm_raikou_amp.png",
    "Elm Amplified Entei": "assets/pru-art/exclusive/elm_entei_amp.png",
    "Elm Amplified Suicune": "assets/pru-art/exclusive/elm_suicune_amp.png"
  };
  const enemyArt = window.__PRU_ENEMY_ONLY_ART || (window.__PRU_ENEMY_ONLY_ART = {});
  Object.assign(enemyArt, source);
  const green = trainers.find(t => t.name === "Green");
  for (const party of green?.parties || []) {
    if (party.id !== "TRAINER_BLUE_HNS") continue;
    for (const pokemon of party.pokemon) {
      if (pokemon.name === "Arcanine") pokemon.visualKey = "Blue Mega Arcanine";
    }
  }
  const gallery = {
    "Green": [{
      label: "Mega Arcanine",
      file: source["Blue Mega Arcanine"]
    }],
    "Professor Oak & Professor Elm": [{
      label: "Elm's Amplified Raikou",
      file: source["Elm Amplified Raikou"]
    }, {
      label: "Elm's Amplified Entei",
      file: source["Elm Amplified Entei"]
    }, {
      label: "Elm's Amplified Suicune",
      file: source["Elm Amplified Suicune"]
    }]
  };
  const priorOpen = openTrainer;
  openTrainer = function(t) {
    priorOpen(t);
    const forms = gallery[t.name];
    if (!forms) return;
    const target = document.getElementById("detailContent");
    if (!target) return;
    const cards = forms.map(f =>
      '<div class="trainer-pokemon">' +
        '<div class="art"><img class="sprite" loading="lazy" alt="' + f.label +
        ' battle sprite" src="' + f.file + '"></div>' +
        '<div><span class="name">' + f.label +
        '</span><small>Trainer-only PRU art</small></div>' +
      '</div>'
    ).join("");
    target.insertAdjacentHTML("beforeend",
      '<section class="elite18-specials">' +
      '<h3>Exclusive trainer battle artwork</h3>' +
      '<p class="notes">These special battle appearances are not additional ' +
      'Pokédex species. Elm’s exact encounter team remains under verification.</p>' +
      '<div class="trainer-team-grid">' + cards + '</div></section>'
    );
  };
  render();
})();