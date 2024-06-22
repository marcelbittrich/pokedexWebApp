import { changeVisiblity, firstLetterToUpper } from "./utils";
import { updateModalCard } from "./modal";
import { masterVolume } from "./source";

const createPokemonCard = (id, name, imageUrl) => {
  let $cardWrapper = $("<div>").addClass("card-wrapper").attr("id", `pc-${id}`);
  let $shadowCard = $("<div>").addClass("shadow-card").appendTo($cardWrapper);
  let $pokemonCard = $("<div>").addClass("pokemon-card").appendTo($cardWrapper);

  let $picture = $("<figure>")
    .append(`<img src=${imageUrl} loading="lazy">`)
    .appendTo($pokemonCard);

  name = firstLetterToUpper(name);
  let $name = $("<p>").addClass("lucky-font").text(name).appendTo($pokemonCard);
  return $cardWrapper;
};

async function updatePokemonCards(pokemonObjects) {
  $("#pokemon-collection").empty();

  pokemonObjects.sort((a, b) => a.id - b.id);

  for (let i = 0; i < pokemonObjects.length; i++) {
    const pokemon = pokemonObjects[i];
    $("#pokemon-collection").append(
      createPokemonCard(i, pokemon.name, pokemon.sprites.front_default)
    );
  }

  $("div.card-wrapper").on("click", function () {
    const pokemonIndex = $(this).attr("id").split("-")[1];
    updateModalCard(pokemonObjects[pokemonIndex]);
    changeVisiblity($("#overlay"), true);

    setTimeout(() => {
      var battleCry = new Audio(pokemonObjects[pokemonIndex].cries.latest);
      battleCry.volume = masterVolume / 4;
      battleCry.play();
    }, 100);
  });
}

export { createPokemonCard, updatePokemonCards };
