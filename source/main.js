console.log("hello from the code");

import jQuery from "jquery";
window.$ = window.jQuery = jQuery;

import { updatePokemonCollection } from "./modules/cards.js";
import {
  getPokemonObjects,
  getMaxPokeCount,
  updatePokemonData,
} from "./data.js";
import { createModal } from "./modules/modal.js";
import { PokeSearch } from "./modules/search.js";
import {
  getSelectedGameFilter,
  getSelectedTypeFilter,
} from "./modules/sidebar.js";

// Globals
const INITIAL_POKE_COUNT = 151;

// Setup slider and display
/// Set sound default value
let masterVolume = 0.25;
const soundSlider = document.getElementById("soundSlider");
soundSlider.value = masterVolume * 100;
soundSlider.oninput = function () {
  masterVolume = this.value / 100;
};

export { masterVolume };

/// Set request slider
const requestSlider = document.getElementById("requestSlider");
const sliderValueDisplay = document.getElementById("sliderValueDisplay");
sliderValueDisplay.innerHTML = requestSlider.value;

/// Set request default vaule
requestSlider.value = INITIAL_POKE_COUNT;
sliderValueDisplay.innerHTML = INITIAL_POKE_COUNT;

requestSlider.oninput = function () {
  sliderValueDisplay.innerHTML = this.value;
};

function setRequestSliderMax() {
  requestSlider.max = getMaxPokeCount();
}

// Setup requests
const requestButtonElement = document.getElementById("requestButton");

let isAllowedToRequest = true;

async function requestUpdate(numberOfPokemon) {
  console.log("request tried, permission: " + isAllowedToRequest);
  if (!isAllowedToRequest) return;
  console.log("request send");
  isAllowedToRequest = false;
  $("#pc-cards").empty();
  $("<div>").addClass("loading").prependTo($("body main"));
  await updatePokemonData(numberOfPokemon);
  $("main .loading").remove();
  isAllowedToRequest = true;
  console.log("request returned");
  // after getting the information we can set the max
  setRequestSliderMax();

  const currentSearchInput = $("#pokeSearch").val();

  const pokeSearch = new PokeSearch(
    getSelectedGameFilter(),
    getSelectedTypeFilter(),
    getPokemonObjects()
  );
  const filteredPokemons = pokeSearch.searchWithFilters(currentSearchInput);
  updatePokemonCollection(filteredPokemons, getPokemonObjects().length);
}

requestButtonElement.onclick = function () {
  requestUpdate(requestSlider.value);
};

/// Search input field
let debounceTimer; // prevents too many search events
$("#pokeSearch").on("input", function () {
  // Only search with 3 characters or more,
  // show everything when search is cleared.

  clearTimeout(debounceTimer);
  const currentSearchInput = this.value;
  console.log(currentSearchInput);
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
  await requestUpdate(INITIAL_POKE_COUNT);
  setRequestSliderMax();
}
initSide();
