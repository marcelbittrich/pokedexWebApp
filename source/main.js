console.log("hello from the code");

import jQuery from "jquery";
window.$ = window.jQuery = jQuery;

import { updatePokemonCollection } from "./modules/cards.js";
import {
  getMaxPokeCount,
  getPokemonObjects,
  updatePokemonData,
} from "./data.js";
import { createModal } from "./modules/modal.js";
import { PokeSearch } from "./modules/search.js";
import {
  getRequestEndId,
  getRequestStartId,
  getSelectedGameFilter,
  getSelectedTypeFilter,
  setRequestMax,
} from "./modules/sidebar.js";

// Globals
const INITIAL_POKE_COUNT = 151;

// Setup requests
let isAllowedToRequest = true;

async function requestUpdate(startId, endId) {
  console.log("request tried, permission: " + isAllowedToRequest);
  if (!isAllowedToRequest) return;
  console.log("request send");
  isAllowedToRequest = false;
  $("#pc-cards").empty();
  $("<div>").addClass("loading").prependTo($("body main"));
  await updatePokemonData(startId, endId);
  $("main .loading").remove();
  isAllowedToRequest = true;
  console.log("request returned");
  // after getting the information we can set the max
  setRequestMax(getMaxPokeCount());

  const currentSearchInput = $("#pokeSearch").val();

  const pokeSearch = new PokeSearch(
    getSelectedGameFilter(),
    getSelectedTypeFilter(),
    getPokemonObjects()
  );
  const filteredPokemons = pokeSearch.searchWithFilters(currentSearchInput);
  updatePokemonCollection(filteredPokemons, getPokemonObjects().length);
}

const requestButtonElement = document.getElementById("requestButton");
requestButtonElement.onclick = function () {
  requestUpdate(getRequestStartId(), getRequestEndId());
};

/// Search input field
let debounceTimer; // prevents too many search events
$("#pokeSearch").on("input", function () {
  // Only search with 3 characters or more,
  // show everything when search is cleared.

  clearTimeout(debounceTimer);
  const currentSearchInput = this.value;
  debounceTimer = setTimeout(() => {
    const pokeSearch = new PokeSearch(
      getSelectedGameFilter(),
      getSelectedTypeFilter(),
      getPokemonObjects()
    );
    let searchResult = [];
    if (currentSearchInput.length > 2) {
      searchResult = pokeSearch.searchWithFilters(currentSearchInput);
    } else if (currentSearchInput.length === 0) {
      searchResult = pokeSearch.searchWithFilters("");
    }
    updatePokemonCollection(searchResult, getPokemonObjects().length);
  }, 300);
});

// Initial site data
createModal();
async function initSide() {
  await requestUpdate(1, INITIAL_POKE_COUNT);
}
initSide();
