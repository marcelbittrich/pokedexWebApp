console.log("hello from the code");

const createPokemonCard = (name, imageUrl) => {
  let $pokemonCard = $("<div>").addClass("pokemon-card");

  let $picture = $("<figure>")
    .append(`<img src=${imageUrl}>`)
    .appendTo($pokemonCard);

  name = name[0].toUpperCase() + name.slice(1);
  let $name = $("<p>").text(name).appendTo($pokemonCard);
  return $pokemonCard;
};

async function getAllPokemon(num) {
  try {
    url = `https://pokeapi.co/api/v2/pokemon?limit=${num}&offset=0`;
    let response = await window.fetch(url);
    let data = await response.json();

    // data includes name and url of pokemon
    let pokemonArray = [];
    data.results.forEach((element) => {
      pokemonArray.push(element);
    });

    // fetch pokemon url to get more data
    let promiseArray = [];
    pokemonArray.forEach((element) => {
      promiseArray.push(window.fetch(element.url));
    });

    let allPokemonData = await Promise.all(promiseArray);

    promiseArray = [];
    allPokemonData.forEach((element) => {
      promiseArray.push(element.json());
    });

    return await Promise.all(promiseArray);
  } catch (error) {
    console.log(error);
  }
}

const countLimit = 100;
getAllPokemon(countLimit).then((pokemonObjects) => {
  console.log(pokemonObjects);
  pokemonObjects.forEach((pokemon) => {
    $("#pokemon-collection").append(
      createPokemonCard(pokemon.name, pokemon.sprites.front_default)
    );
  });
});
