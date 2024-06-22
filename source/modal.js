import { changeVisiblity, firstLetterToUpper } from "./utils";
import { createPokeTypeTagByName } from "./poketypes";

import jQuery from "jquery";
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

  // Content and Image Element
  const contentElement = $("<div>")
    .addClass("content")
    .appendTo(modalCardElement);

  const placeholderImage =
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png";
  const figureElement = $("<figure>")
    .append($("<img>").attr("src", placeholderImage))
    .appendTo(contentElement);

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

function updateModalCard(pokemon) {
  // ID and Picture
  const idText = "#" + pokemon.id.toString().padStart(4, "0");
  $("#pokeId-wrapper").text(idText);

  const imageUrl = pokemon.sprites.front_default;
  $("#modal .content img").attr("src", imageUrl);

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
}

export { createModal, updateModalCard };
