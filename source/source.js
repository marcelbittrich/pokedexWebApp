console.log("hello from the code");

import {
  getNewPokemonDataAndUpdateCards,
  updatePokemonCards,
  pokemonObjects,
  maxPokeCount,
} from "./pokedata.js";
import { pokeTypes, createPokeTypeTag } from "./poketypes.js";

// Globals
const INITIAL_POKE_COUNT = 151;

// Initial site data
async function initSide() {
  await getNewPokemonDataAndUpdateCards(INITIAL_POKE_COUNT);
  setRequestSliderMax();
}
initSide();

// Adjust sidebar padding-top on open
$("#menu-button").on("click", function () {
  const sidebarWidth = 250 + "px";
  if ($("#sidebar").css("width") === "0px") {
    let headerHeight = $("header").css("height").split("px")[0];
    headerHeight = parseFloat(headerHeight) + 20;
    headerHeight += "px";
    $("#sidebar").css("width", sidebarWidth).css("padding-top", headerHeight);
    $("#pokemon-collection").css("margin-left", sidebarWidth);
  } else {
    $("#sidebar").css("width", "0px");
    $("#pokemon-collection").css("margin-left", "0px");
  }
});

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
  requestSlider.max = maxPokeCount;
}

// Setup requests
const requestButtonElement = document.getElementById("requestButton");

let isAllowedToRequest = true;

async function requestUpdate(numberOfPokemon) {
  console.log("request tried, permission: " + isAllowedToRequest);
  if (!isAllowedToRequest) return;
  console.log("request send");
  isAllowedToRequest = false;
  await getNewPokemonDataAndUpdateCards(numberOfPokemon);
  isAllowedToRequest = true;
  console.log("request returned");
  // after getting the information we can set the max
  setRequestSliderMax();
  setAllFilterTypes(true);
}

requestButtonElement.onclick = function () {
  requestUpdate(requestSlider.value);
};

// Create type tags in sidebar
function populateSidebarType(types) {
  types.forEach((type) => {
    const $typeTag = createPokeTypeTag(type.name, type.color);
    $("#tag-wrapper").append($typeTag);
  });
}

populateSidebarType(pokeTypes);

// Search and Filters
const fuseOptions = {
  // isCaseSensitive: false,
  includeScore: false,
  // shouldSort: true,
  // includeMatches: false,
  // findAllMatches: false,
  minMatchCharLength: 2,
  // location: 0,
  threshold: 0.19,
  // distance: 100,
  // useExtendedSearch: false,
  // ignoreLocation: false,
  // ignoreFieldNorm: false,
  // fieldNormWeight: 1,
  keys: ["name", "types.type.name"],
};

let currentSearchInput = "";
let selectedFilterTypes = [];

/// init selected types to all tyes
function setSlectedTypesToAll() {
  const sidebarElement = document.getElementById("sidebar");
  const list = sidebarElement.querySelectorAll(".type-tag");
  list.forEach((element) => {
    selectedFilterTypes.push(element.innerText);
  });
}
setSlectedTypesToAll();

// search function
function searchWithFilters(searchInput, filterTypes, objectsToSearch) {
  let objects = [];

  filterTypes.forEach((type) => {
    const fuse = new Fuse(objectsToSearch, fuseOptions);
    let typeSearchResult = fuse.search(type);
    typeSearchResult
      .map((element) => element.item)
      .forEach((pokemon) => {
        if (!objects.includes(pokemon)) {
          objects.push(pokemon);
        }
      });
  });

  if (searchInput) {
    const fuse = new Fuse(objects, fuseOptions);
    let inputSearchResult = fuse.search(searchInput);
    objects = [];
    inputSearchResult
      .map((element) => element.item)
      .forEach((element) => {
        objects.push(element);
      });
  }

  return objects;
}
//

function updateSelectedFilterTypes(clickedTagName) {
  if (selectedFilterTypes.includes(clickedTagName)) {
    const index = selectedFilterTypes.findIndex((element) => {
      return element === clickedTagName;
    });
    selectedFilterTypes.splice(index, 1);
  } else {
    selectedFilterTypes.push(clickedTagName);
  }
}

function updateTypeTagClasses() {
  const sidebarElement = document.getElementById("sidebar");
  const list = sidebarElement.querySelectorAll(".type-tag");
  list.forEach((element) => {
    if (selectedFilterTypes.includes(element.innerText)) {
      element.classList.remove("inactive");
    } else {
      element.classList.add("inactive");
    }
  });
}

function onTypeFilterChange() {
  updateTypeTagClasses();
  const objects = searchWithFilters(
    currentSearchInput,
    selectedFilterTypes,
    pokemonObjects
  );
  updatePokemonCards(objects);
}

$("#sidebar .type-tag").on("click", function () {
  updateSelectedFilterTypes(this.innerHTML);
  onTypeFilterChange();
});

function setAllFilterTypes(condition) {
  if (condition) {
    setSlectedTypesToAll();
  } else {
    selectedFilterTypes = [];
  }
  onTypeFilterChange();
}

$("#allTypesButton").on("click", function () {
  setAllFilterTypes(true);
});
$("#noneTypesButton").on("click", function () {
  setAllFilterTypes(false);
});

/// Search input field
$("#pokeSearch").on("search", function () {
  // Only search with 3 characters or more,
  // show everything when search is cleared.

  currentSearchInput = this.value;

  if (currentSearchInput.length > 2) {
    currentSearchInput = this.value;
    const objects = searchWithFilters(
      currentSearchInput,
      selectedFilterTypes,
      pokemonObjects
    );
    updatePokemonCards(objects);
  } else if (currentSearchInput.length === 0) {
    const objects = searchWithFilters(
      currentSearchInput,
      selectedFilterTypes,
      pokemonObjects
    );
    updatePokemonCards(objects);
  }
});
