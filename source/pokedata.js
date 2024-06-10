import { firstLetterToUpper } from "./utils.js";
import { createPokeTypeTagByName } from "./poketypes.js";
import { masterVolume } from "./source.js";

let pokemonObjects = [];
let maxPokeCount = 0;

const createPokemonCard = (id, name, imageUrl) => {
  let $cardWrapper = $("<div>").addClass("card-wrapper").attr("id", `pc-${id}`);
  let $shadowCard = $("<div>").addClass("shadow-card").appendTo($cardWrapper);
  let $pokemonCard = $("<div>").addClass("pokemon-card").appendTo($cardWrapper);

  let $picture = $("<figure>")
    .append(`<img src=${imageUrl}>`)
    .appendTo($pokemonCard);

  name = firstLetterToUpper(name);
  let $name = $("<p>").addClass("lucky-font").text(name).appendTo($pokemonCard);
  return $cardWrapper;
};

async function fetchData(numOfPokemon) {
  try {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${numOfPokemon}&offset=0`;
    let response = await window.fetch(url);
    let data = await response.json();

    // set maxPokeCount
    maxPokeCount = data.count;

    // data includes only names and urls of all pokemon
    // fetch each pokemon url to get more data
    let promiseArray = [];
    data.results.forEach((pokemon) => {
      promiseArray.push(window.fetch(pokemon.url));
    });

    const allPokemonData = await Promise.all(promiseArray);

    // parse the retruned json data into objects
    promiseArray = [];
    allPokemonData.forEach((element) => {
      promiseArray.push(element.json());
    });
    return await Promise.all(promiseArray);
  } catch (error) {
    console.log(error);
  }
}

function updateModalCard(pokemon) {
  const imageUrl = pokemon.sprites.front_default;
  $("#modal-card .content img").attr("src", imageUrl);

  $("#modal-name").text(firstLetterToUpper(pokemon.name));

  $("#modal-types").empty();
  const $typeElementArray = pokemon.types
    .map((typeSlot) => {
      return createPokeTypeTagByName(typeSlot.type.name);
    })
    .forEach((element) => {
      element.appendTo($("#modal-types"));
    });

  $("#modal-weight").text(pokemon.weight);
}

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
    changeVisiblity($("#modal"), true);

    setTimeout(() => {
      var battleCry = new Audio(pokemonObjects[pokemonIndex].cries.latest);
      battleCry.volume = masterVolume / 2;
      battleCry.play();
    }, 100);
  });
}

async function getNewPokemonDataAndUpdateCards(numOfPokemon) {
  $("#pokemon-collection").empty();

  $("<div>").addClass("loading").prependTo($("body main"));
  pokemonObjects = await fetchData(numOfPokemon);
  $("main .loading").remove();

  await updatePokemonCards(pokemonObjects);
}

// Modal
function changeVisiblity($element, bool) {
  const displayValue = bool ? "block" : "none";
  $element.css("display", displayValue);
}

$("#modal").on("click", function () {
  changeVisiblity($("#modal"), false);
});

export {
  getNewPokemonDataAndUpdateCards,
  updatePokemonCards,
  pokemonObjects,
  maxPokeCount,
};
