const pokeTypes = [
  { name: "normal", color: [168, 168, 118] },
  { name: "fire", color: [245, 63, 5] },
  { name: "water", color: [69, 156, 230] },
  { name: "electric", color: [251, 219, 0] },
  { name: "grass", color: [109, 188, 85] },
  { name: "ice", color: [128, 207, 192] },
  { name: "fighting", color: [180, 84, 65] },
  { name: "poison", color: [146, 84, 208] },
  { name: "ground", color: [162, 115, 52] },
  { name: "flying", color: [157, 202, 255] },
  { name: "psychic", color: [246, 98, 127] },
  { name: "bug", color: [150, 193, 16] },
  { name: "rock", color: [185, 170, 98] },
  { name: "ghost", color: [107, 67, 113] },
  { name: "dragon", color: [91, 113, 192] },
  { name: "dark", color: [77, 69, 69] },
  { name: "steel", color: [170, 170, 188] },
  { name: "fairy", color: [230, 143, 232] },
];

function createPokeTypeTag(name, color) {
  let poketTypeTag = $("<div>")
    .addClass("type-tag")
    .css("background-color", `rgb(${color[0]},${color[1]},${color[2]})`)
    .text(`${name}`);

  return poketTypeTag;
}

function createPokeTypeTagByName(name) {
  const color = pokeTypes.find((type) => type.name === name).color;
  return color ? createPokeTypeTag(name, color) : null;
}

export { pokeTypes, createPokeTypeTag, createPokeTypeTagByName };
