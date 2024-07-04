import Fuse from "fuse.js";
import { getAllTypeNames } from "../data";

let baseSearchOptions = {
  // isCaseSensitive: false,
  includeScore: false,
  // shouldSort: true,
  // includeMatches: false,
  // findAllMatches: false,
  minMatchCharLength: 2,
  // location: 0,
  threshold: 0.19,
  // distance: 100,
  // useExtendedSearch: false,
  // ignoreLocation: false,
  // ignoreFieldNorm: false,
  // fieldNormWeight: 1,
};

const inputSearchOptions = {
  ...baseSearchOptions,
  keys: ["name", "id"],
};

const gameSearchOptions = {
  ...baseSearchOptions,
  threshold: 0.01,
  keys: ["game_indices.version.name"],
};

export class PokeSearch {
  constructor(gameFilter, typesFilter, objectsToSearch) {
    this._gameFilter = gameFilter;
    this._typesFilter = typesFilter;
    this._objectsToSearch = objectsToSearch;
  }

  set gameFilter(gameName) {
    this._gameFilter = gameName;
  }

  set typesFilter(typeArray) {
    this._typesFilter = typeArray;
  }

  set objectsToSearch(objects) {
    this._objectsToSearch = objects;
  }

  searchWithFilters(searchInput) {
    let objects = [];

    // first filter with types
    // skip filter when all types are selecte
    if (this._typesFilter.length !== getAllTypeNames().length) {
      this._typesFilter.forEach((filterType) => {
        this._objectsToSearch.forEach((pokemon) => {
          const typeNameArray = pokemon.types.map((type) => type.type.name);
          if (
            typeNameArray.includes(filterType) &&
            !objects.includes(pokemon)
          ) {
            objects.push(pokemon);
          }
        });
      });
    } else {
      objects = this._objectsToSearch;
    }

    // then filter by input search
    if (searchInput) {
      const fuse = new Fuse(objects, inputSearchOptions);
      let inputSearchResult = fuse.search(searchInput);
      objects = inputSearchResult.map((element) => element.item);
    }

    // then filter by game
    if (this._gameFilter) {
      const fuse = new Fuse(objects, gameSearchOptions);
      let gameSearchResult = fuse.search(this._gameFilter);
      objects = gameSearchResult.map((element) => element.item);
    }

    return objects;
  }
}
