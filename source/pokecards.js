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

async function updatePokemonCollection(filteredObjects, numOfTotalObj) {
  $("#pc-info").text(
    `Filtered: ${filteredObjects.length} / Total: ${numOfTotalObj}`
  );
  $("#pc-cards").empty();
  filteredObjects.sort((a, b) => a.id - b.id);

  for (let i = 0; i < filteredObjects.length; i++) {
    const pokemon = filteredObjects[i];
    $("#pc-cards").append(
      createPokemonCard(i, pokemon.name, pokemon.sprites.front_default)
    );
  }

  $("div.card-wrapper").on("click", function () {
    const pokemonIndex = $(this).attr("id").split("-")[1];
    updateModalCard(filteredObjects[pokemonIndex]);
    changeVisiblity($("#overlay"), true);

    setTimeout(() => {
      var battleCry = new Audio(filteredObjects[pokemonIndex].cries.latest);
      battleCry.volume = masterVolume / 4;
      battleCry.play();
    }, 100);
  });
}

export { createPokemonCard, updatePokemonCollection };
