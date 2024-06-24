import { getAllTypeTagElements, getAllGameTagElemets } from "./tags";
import { getAllTypeNames, getPokemonObjects, getGameNames } from "../data";
import { updatePokemonCollection } from "./cards";
import { PokeSearch } from "./search";

const SIDEBAR_WIDTH_OPEN = 230;

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
