import jQuery from "jquery";
window.$ = window.jQuery = jQuery;

let maxPokeCount = 0;
let cachedPokeData = [];

export const pokeTypes = [
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

export function getAllTypeNames() {
  return pokeTypes.map((type) => type.name);
}

async function fetchGameNames() {
  const versionURL = "https://pokeapi.co/api/v2/version/?offset=0&limit=100";
  let response = await window.fetch(versionURL);
  let data = await response.json();
  return data.results.map((element) => element.name);
}

export async function getGameNames() {
  return await fetchGameNames();
}

async function fetchData(numOfPokemon) {
  try {
    // const offset = start - 1;
    // const limit = end - offset;

    const url = `https://pokeapi.co/api/v2/pokemon?limit=${numOfPokemon}&offset=0`;
    let response = await window.fetch(url);
    let data = await response.json();

    // set maxPokeCount to the database limit
    maxPokeCount = data.count;

    // data includes only names and urls of all pokemon
    // fetch each pokemon url to get more data
    let promiseArray = [];
    data.results.forEach((pokemon) => {
      promiseArray.push(window.fetch(pokemon.url));
    });

    const allPokemonData = await Promise.all(promiseArray);

    // parse the retruned json data into objects
    promiseArray = [];
    allPokemonData.forEach((element) => {
      promiseArray.push(element.json());
    });

    cachedPokeData = await Promise.all(promiseArray);
    return cachedPokeData;
  } catch (error) {
    console.log(error);
  }
}

export async function updatePokemonData(numOfPokemon) {
  return await fetchData(numOfPokemon);
}

export function getPokemonObjects() {
  return cachedPokeData;
}

export function getMaxPokeCount() {
  return maxPokeCount;
}
