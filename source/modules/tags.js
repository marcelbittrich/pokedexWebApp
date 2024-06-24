import { getGameNames, pokeTypes } from "../data.js";

import jQuery from "jquery";
window.$ = window.jQuery = jQuery;

function createPokeTag(name, color) {
  let poketTypeTag = $("<div>")
    .addClass("tag")
    .css("background-color", `rgb(${color[0]},${color[1]},${color[2]})`)
    .text(`${name}`);
  return poketTypeTag;
}

function getAllTypeTagElements() {
  return pokeTypes.map((type) => {
    return createPokeTag(type.name, type.color);
  });
}

function createPokeTypeTagByName(name) {
  const color = pokeTypes.find((type) => type.name === name).color;
  return color ? createPokeTag(name, color) : null;
}

async function getAllGameTagElemets() {
  let gameNames = await getGameNames();
  let gameTagElemets = gameNames.map((name) => {
    return createPokeTag(name, [125, 125, 125]);
  });
  return gameTagElemets;
}

export {
  getAllTypeTagElements,
  createPokeTag as createPokeTypeTag,
  createPokeTypeTagByName,
  getAllGameTagElemets,
};
