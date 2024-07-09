import jQuery from "jquery";
window.$ = window.jQuery = jQuery;

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

let maxPokeCount = 0;
// all cached data
const cachedPokeData = {};
// currently displayed data
let pokemonData = [];

export async function getDataByURL(url) {
  if (url in cachedPokeData) {
    console.log("used cache");
    return cachedPokeData[url];
  }
  console.log("fetched data");
  const response = await window.fetch(url);
  const data = await response.json();

  cachedPokeData[url] = data;
  return data;
}

async function fetchData(startId, endId) {
  try {
    const offset = startId - 1;
    const limit = endId - offset;
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    let response = await window.fetch(url);
    let data = await response.json();

    // set maxPokeCount to the database limit
    maxPokeCount = data.count;

    // data includes only names and urls of all pokemon
    // fetch each pokemon url to get more data
    let promiseArray = [];
    data.results.forEach((pokemon) => {
      promiseArray.push(getDataByURL(pokemon.url));
    });
    pokemonData = await Promise.allSettled(promiseArray);
    pokemonData = pokemonData.map((datum) => datum.value);
    return pokemonData;
  } catch (error) {
    console.log(error);
  }
}

export async function updatePokemonData(startId, endId) {
  return await fetchData(startId, endId);
}

export function getPokemonObjects() {
  return pokemonData;
}

export function getMaxPokeCount() {
  return maxPokeCount;
}
