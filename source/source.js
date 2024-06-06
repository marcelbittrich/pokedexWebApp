console.log("hello from the code");
import { updatePokemonCards } from "./pokedata.js";
import { pokeTypes, createPokeTypeTag } from "./poketypes.js";

// Globals
const initialPokeCount = 151;

// Initial site data
updatePokemonCards(initialPokeCount);

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
const requestSlider = document.getElementById("requestSlider");
const sliderValueDisplay = document.getElementById("sliderValueDisplay");
sliderValueDisplay.innerHTML = requestSlider.value;

requestSlider.oninput = function () {
  sliderValueDisplay.innerHTML = this.value;
};

// Setup requests
const requestButtonElement = document.getElementById("requestButton");
console.log(requestButtonElement);

let isAllowedToRequest = true;

async function requestUpdate(numberOfPokemon) {
  console.log("request tried, permission: " + isAllowedToRequest);
  if (!isAllowedToRequest) return;
  console.log("request send");
  isAllowedToRequest = false;
  await updatePokemonCards(numberOfPokemon);
  isAllowedToRequest = true;
  console.log("request returned");
}

requestButtonElement.onclick = function () {
  requestUpdate(requestSlider.value);
};

$("#pokeSearch").on("search", function () {
  if (this.value.length > 2) {
    console.log(this.value);
  }
});

// Create type tags in sidebar
function populateSidebarType(types) {
  types.forEach((type) => {
    const $typeTag = createPokeTypeTag(type.name, type.color);
    $("#tag-wrapper").append($typeTag);
  });
}

populateSidebarType(pokeTypes);
