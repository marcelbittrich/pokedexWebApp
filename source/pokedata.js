import jQuery from "jquery";
window.$ = window.jQuery = jQuery;

import { updatePokemonCards } from "./pokecards";

let pokemonObjects = [];
let maxPokeCount = 0;

async function fetchData(numOfPokemon) {
  try {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${numOfPokemon}&offset=0`;
    let response = await window.fetch(url);
    let data = await response.json();

    // set maxPokeCount to the database limit
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

async function getNewPokemonDataAndUpdateCards(numOfPokemon) {
  $("#pokemon-collection").empty();

  $("<div>").addClass("loading").prependTo($("body main"));
  pokemonObjects = await fetchData(numOfPokemon);
  $("main .loading").remove();

  await updatePokemonCards(pokemonObjects);
}

export { getNewPokemonDataAndUpdateCards, pokemonObjects, maxPokeCount };
