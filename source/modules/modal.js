import { changeVisiblity, firstLetterToUpper } from "../utils";
import { createPokeTypeTagByName } from "./tags";
import { masterVolume } from "./sidebar";
//import { masterVolume } from "../main";

import jQuery from "jquery";
import { getDataByURL } from "../data";
window.$ = window.jQuery = jQuery;

const MAIN_INFO = ["name", "types", "weight"];
const SIDE_INFO = ["hp", "attack", "defense", "spatk", "spdef", "speed"];

function setOnClickHandlers() {
  $("#close-modal-wrapper").on("click", function () {
    changeVisiblity($("#overlay"), false);
  });

  $("#overlay").on("click", function () {
    changeVisiblity($("#overlay"), false);
  });

  $("#modal").on("click", function (e) {
    e.stopPropagation();
  });

  $("#sound-wrapper").on("click", function () {
    $("#battle-cry-player").get(0).volume = masterVolume;
    $("#battle-cry-player").get(0).play();
  });
}

function createModal() {
  const modalCardElement = $("<section>").attr("id", "modal");

  // ID and Close Element
  const idElement = $("<div>")
    .attr("id", "pokeId-wrapper")
    .text("#0001")
    .appendTo(modalCardElement);

  const closeElement = $("<div>")
    .attr("id", "close-modal-wrapper")
    .text("X")
    .appendTo(modalCardElement);

  const soundElement = $("<div>")
    .attr("id", "sound-wrapper")
    .appendTo(modalCardElement);
  const soundIcon = $("<img>")
    .attr("src", "../../img/Speaker_Icon.svg")
    .appendTo(soundElement);
  const audioElement = $("<audio>")
    .attr("id", "battle-cry-player")
    .appendTo(soundElement);

  // Content and Image Element
  const contentElement = $("<div>")
    .addClass("content")
    .appendTo(modalCardElement);

  const placeholderImage =
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png";
  const figureElement = $("<figure>")
    .append($("<img>").attr("src", placeholderImage).attr("id", "main-image"))
    .appendTo(contentElement);

  const evolutionChainElement = $("<div>")
    .attr("id", "evo-chain-wrapper")
    .appendTo(figureElement);

  const lineElement = $("<div>")
    .attr("id", "evo-chain-line")
    .appendTo(evolutionChainElement);

  // Main Info
  const mainInfoElement = $("<div>")
    .addClass("main-info")
    .appendTo(contentElement);

  MAIN_INFO.forEach((infoName) => {
    const infoElement = $("<div>")
      .addClass("main-info-line")
      .attr("id", `modal-${infoName}`)
      .appendTo(mainInfoElement);

    const infoKeyElement = $("<div>")
      .addClass("main-info-entry")
      .attr("id", `modal-${infoName}-key`)
      .text(`${firstLetterToUpper(infoName)}`)
      .appendTo(infoElement);
    const infoValueElement = $("<div>")
      .addClass("main-info-entry")
      .attr("id", `modal-${infoName}-value`)
      .appendTo(infoElement);
  });

  // Side Info
  const sideInfoElement = $("<div>")
    .addClass("side-info")
    .appendTo(contentElement);

  const sideInfoBlock1 = SIDE_INFO.slice(0, 3);
  const sideInfoBlock2 = SIDE_INFO.slice(3);
  const sideInfoArray = [sideInfoBlock1, sideInfoBlock2];

  const sideInfoNameText = SIDE_INFO.map((element) => {
    if (element.includes("sp") && !element.includes("speed")) {
      return (
        firstLetterToUpper(element.slice(0, 2)) +
        "." +
        firstLetterToUpper(element.slice(2))
      );
    } else if (element.includes("HP")) {
      return element.toUpperCase();
    } else {
      return firstLetterToUpper(element);
    }
  });
  let nameIter = 0;

  sideInfoArray.forEach((infoBlock) => {
    const infoBlockElement = $("<div>")
      .addClass("stat-block")
      .appendTo(sideInfoElement);

    infoBlock.forEach((infoName) => {
      const infoLineElement = $("<div>")
        .attr("id", `${infoName}-stat`)
        .addClass("stat-line")
        .appendTo(infoBlockElement);
      const name = $("<div>")
        .attr("id", `${infoName}-stat-name`)
        .addClass("stat-name")
        .text(sideInfoNameText[nameIter])
        .appendTo(infoLineElement);
      const number = $("<div>")
        .attr("id", `${infoName}-stat-number`)
        .addClass("stat-number")
        .appendTo(infoLineElement);
      const bar = $("<div>")
        .attr("id", `${infoName}-stat-bar`)
        .addClass("stat-bar")
        .appendTo(infoLineElement);
      const barForeground = $("<div>")
        .attr("id", `${infoName}-stat-bar-foreground`)
        .addClass("stat-bar-foreground")
        .appendTo(bar);
      nameIter++;
    });
  });

  $("#overlay").append(modalCardElement);
  setOnClickHandlers();
}

function updateEvolutionChain(evolutionObjects) {
  const evolutionChainElement = $("#evo-chain-wrapper");
  evolutionObjects.forEach((object) => {
    const imageUrl = object.sprites.front_default;
    const evoElement = $("<div>")
      .addClass("evo-element")
      .appendTo(evolutionChainElement);
    const figure = $("<img>").attr("src", imageUrl).appendTo(evoElement);

    evoElement.on("click", function () {
      updateModalCard(object);
    });
  });
}

function getEvoChain(evolvesToEntry, chainArray) {
  if (evolvesToEntry.length === 0) {
    return chainArray;
  }
  chainArray.push(evolvesToEntry[0].species);
  return getEvoChain(evolvesToEntry[0].evolves_to, chainArray);
}

async function getEvoData(pokemon) {
  const speciesData = await getDataByURL(pokemon.species.url);
  const evoChainData = await getDataByURL(speciesData.evolution_chain.url);
  const basePokeInfo = evoChainData.chain.species;
  let chainArray = [basePokeInfo];
  const allEvoChainPokemon = getEvoChain(
    evoChainData.chain.evolves_to,
    chainArray
  );

  // if no evolutions return empty
  if (allEvoChainPokemon.length <= 1) {
    return [];
  }

  let evoChainPromiseArray = [];
  allEvoChainPokemon.forEach((pokemon) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`;
    const pokemonData = getDataByURL(url);
    evoChainPromiseArray.push(pokemonData);
  });

  return Promise.all(evoChainPromiseArray);
}

async function updateModalCard(pokemon) {
  // clear prev evolution chain
  $("#evo-chain-wrapper .evo-element").remove();

  // ID and Picture
  const idText = "#" + pokemon.id.toString().padStart(4, "0");
  $("#pokeId-wrapper").text(idText);

  const imageUrl = pokemon.sprites.front_default;
  $("#modal .content figure img").attr("src", imageUrl);

  // Main Info
  $(`#modal-${MAIN_INFO[0]}-value`).text(firstLetterToUpper(pokemon.name));
  $(`#modal-${MAIN_INFO[1]}-value`).empty();
  const $typeElementArray = pokemon.types
    .map((typeSlot) => {
      return createPokeTypeTagByName(typeSlot.type.name);
    })
    .forEach((element) => {
      element.appendTo($(`#modal-${MAIN_INFO[1]}-value`));
    });
  $(`#modal-${MAIN_INFO[2]}-value`).text(pokemon.weight);

  // Side Info
  let statArray = pokemon.stats;
  statArray = statArray.map((element) => {
    return element.base_stat;
  });

  for (let i = 0; i < SIDE_INFO.length; i++) {
    const numberDivId = `#${SIDE_INFO[i]}-stat-number`;
    $(numberDivId).text(statArray[i].toString());

    const barDivId = `#${SIDE_INFO[i]}-stat-bar-foreground`;
    $(barDivId).css("width", "0%");

    setTimeout(() => {
      const percentage =
        Math.min((statArray[i] / 200) * 100, 100).toString() + "%";
      $(barDivId).css("width", percentage);
    }, 100);
  }
  $("#battle-cry-player").attr("src", pokemon.cries.latest);

  // create new evo chain
  const allEvolutionData = await getEvoData(pokemon);
  updateEvolutionChain(allEvolutionData);
}

export { createModal, updateModalCard };
