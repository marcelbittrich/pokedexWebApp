import { getAllTypeTagElements } from "./tags";
import { getAllTypeNames, getPokemonObjects, getGameNames } from "../data";
import { updatePokemonCollection } from "./cards";
import { PokeSearch } from "./search";
import { clamp } from "../utils";

const SIDEBAR_WIDTH_OPEN = 300;

let selectedFilterTypes = getAllTypeNames();

// Adjust sidebar css on open and resize
function toggleSidebar() {
  const sidebarWidth = SIDEBAR_WIDTH_OPEN + "px";
  if ($("#sidebar").css("width") === "0px") {
    $("#sidebar").css("width", sidebarWidth);
    $("#pokemon-collection").css("margin-left", sidebarWidth);
  } else {
    $("#sidebar").css("width", "0px");
    $("#pokemon-collection").css("margin-left", "0px");
  }
}

function setSideBarCss() {
  let headerHeight = $("header").css("height").split("px")[0];
  headerHeight = parseFloat(headerHeight) + 20;
  headerHeight += "px";
  $("#sidebar")
    .css("padding-top", headerHeight)
    .css("height", `calc(100% - ${headerHeight}`);
}

$("#menu-button").on("click", function () {
  toggleSidebar();
  setSideBarCss();
});

$(window).on("resize", function () {
  setSideBarCss();
});

async function populateSidebar() {
  const typeTagElements = getAllTypeTagElements();
  typeTagElements.forEach((typeTag) => {
    $("#type-tag-wrapper").append(typeTag);
  });

  const gameSelectElement = $("<select>")
    .attr("name", "games")
    .attr("id", "game-select")
    .appendTo($("#game-tag-wrapper"));
  $("<option>").attr("value", "").text("All").appendTo(gameSelectElement);
  const gameNames = await getGameNames();
  gameNames.forEach((gameName) => {
    $("<option>")
      .attr("value", `${gameName}`)
      .text(`${gameName}`)
      .appendTo(gameSelectElement);
  });
}
populateSidebar();

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
  const list = sidebarElement.querySelectorAll(".tag");
  list.forEach((element) => {
    if (selectedFilterTypes.includes(element.innerText)) {
      element.classList.remove("inactive");
    } else {
      element.classList.add("inactive");
    }
  });
}

function onFilterChange() {
  updateTypeTagClasses();
  const pokeSearch = new PokeSearch(
    getSelectedGameFilter(),
    selectedFilterTypes,
    getPokemonObjects()
  );
  const currentNameSearch = $("#pokeSearch").val();
  const objectsToDisplay = pokeSearch.searchWithFilters(currentNameSearch);
  updatePokemonCollection(objectsToDisplay, getPokemonObjects().length);
}

export function getSelectedTypeFilter() {
  return selectedFilterTypes;
}

export function getSelectedGameFilter() {
  return $("#game-select").val();
}

$("#sidebar .tag").on("click", function () {
  updateSelectedFilterTypes(this.innerHTML);
  onFilterChange();
});

$("#allTypesButton").on("click", function () {
  selectedFilterTypes = getAllTypeNames();
  onFilterChange();
});
$("#noneTypesButton").on("click", function () {
  selectedFilterTypes = [];
  onFilterChange();
});

const gameSelect = document.getElementById("game-select");
gameSelect.onchange = (event) => {
  onFilterChange();
};

/// Set request slider
function controlFromInput(fromSlider, fromInput, toInput) {
  fromInput.value = clamp(fromInput.value, fromInput.min, fromInput.max);
  const [from, to] = getParsed(fromInput, toInput);
  if (from > to) {
    fromSlider.value = to;
    fromInput.value = to;
  } else {
    fromSlider.value = from;
    fromSlider.value = from;
  }
}

function controlToInput(toSlider, fromInput, toInput) {
  toInput.value = clamp(toInput.value, toInput.min, toInput.max);
  const [from, to] = getParsed(fromInput, toInput);
  if (from <= to) {
    toSlider.value = to;
    toInput.value = to;
  } else {
    toSlider.value = from;
    toInput.value = from;
  }
}

function controlFromSlider(fromSlider, toSlider, fromInput) {
  const [from, to] = getParsed(fromSlider, toSlider);
  if (from > to) {
    fromSlider.value = to;
    fromInput.value = to;
  } else {
    fromInput.value = from;
  }
}

function controlToSlider(fromSlider, toSlider, toInput) {
  const [from, to] = getParsed(fromSlider, toSlider);
  if (from <= to) {
    toSlider.value = to;
    toInput.value = to;
  } else {
    toInput.value = from;
    toSlider.value = from;
  }
}

function getParsed(currentFrom, currentTo) {
  const from = parseInt(currentFrom.value, 10);
  const to = parseInt(currentTo.value, 10);
  return [from, to];
}

function setToggleAccessible(fromSlider, toSlider) {
  const sliderBackground = "darkgray";
  const invisible = "rgba(0, 0, 0, 0)";

  if (Number(toSlider.value) <= 1) {
    toSlider.style.zIndex = 2;
    toSlider.style.background = invisible;
    fromSlider.style.background = sliderBackground;
  } else {
    toSlider.style.zIndex = 0;
    toSlider.style.background = sliderBackground;
    fromSlider.style.background = invisible;
  }
}

const fromRequestSlider = document.querySelector("#fromRequestSlider");
const toRequestSlider = document.querySelector("#toRequestSlider");
const fromRequestNumber = document.querySelector("#fromRequestNumber");
const toRequestNumber = document.querySelector("#toRequestNumber");

/// Set request default vaule
const INITIAL_POKE_COUNT = 151;
fromRequestSlider.value = 1;
fromRequestNumber.value = 1;
toRequestSlider.value = INITIAL_POKE_COUNT;
toRequestNumber.value = INITIAL_POKE_COUNT;

setToggleAccessible(fromRequestSlider, toRequestSlider);

fromRequestSlider.oninput = () => {
  controlFromSlider(fromRequestSlider, toRequestSlider, fromRequestNumber);
  setToggleAccessible(fromRequestSlider, toRequestSlider);
};
toRequestSlider.oninput = () => {
  controlToSlider(fromRequestSlider, toRequestSlider, toRequestNumber);
  setToggleAccessible(fromRequestSlider, toRequestSlider);
};
fromRequestNumber.onchange = () => {
  controlFromInput(fromRequestSlider, fromRequestNumber, toRequestNumber);
  setToggleAccessible(fromRequestSlider, toRequestSlider);
};
toRequestNumber.onchange = () => {
  controlToInput(toRequestSlider, fromRequestNumber, toRequestNumber);
  setToggleAccessible(fromRequestSlider, toRequestSlider);
};

export function getRequestStartId() {
  return fromRequestNumber.value;
}

export function getRequestEndId() {
  return toRequestNumber.value;
}

export function setRequestMax(count) {
  $(".requestMax").attr("max", count);
}
