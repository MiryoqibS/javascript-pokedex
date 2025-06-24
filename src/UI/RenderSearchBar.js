import { axiosClient } from "../api/axiosClient.js";
import { Helper } from "../utils/Helpers";

export class RenderSearchBar {
    constructor(getPokemons, updateSidebar) {
        this.getPokemons = getPokemons;
        this.updateSidebar = updateSidebar;
        this.debounceTimer = null;
        this.helper = new Helper();
    }

    async render() {
        const searchBar = document.createElement("header");
        searchBar.className = "pokedex-header";

        const searchResult = document.createElement("div");
        searchResult.className = "pokedex-header__result hide";

        const searchInput = document.createElement("input");
        searchInput.addEventListener("input", () => {
            clearTimeout(this.debounceTimer);
            const value = searchInput.value.trim().toLocaleLowerCase();

            this.debounceTimer = setTimeout(async () => {

                if (value.length === 0) {
                    searchResult.innerHTML = "";
                    searchResult.classList.add("hide");
                    return;
                };

                if (!isNaN(value) && Number(value) > 0) {
                    searchResult.innerHTML = "";

                    // Поиск по id
                    try {
                        const data = await axiosClient.get(`pokemon/${Number(value)}`);
                        console.log(data);

                        if (!data) throw new Error('Not found...');

                        const searchVariant = document.createElement("p");
                        searchVariant.className = "pokedex-header__variant";
                        searchVariant.innerText = `#${data.id} ${this.helper.capitalize(data.name)}`;
                        searchVariant.addEventListener("click", async () => {
                            this.#updateSidebar(data.id);

                            searchInput.value = "";
                            searchResult.innerHTML = "";
                            searchResult.classList.add("hide");
                        });

                        searchResult.appendChild(searchVariant);
                        searchResult.classList.remove("hide");

                    } catch (error) {
                        searchResult.classList.add("hide");
                    }
                } else {
                    // Поиск по имени
                    const pokemons = this.getPokemons();
                    const matched = pokemons.filter(pokemon => {
                        return pokemon.name.toLowerCase().startsWith(value);
                    });

                    if (matched.length > 0) {
                        this.#renderVariations(matched, searchResult, searchInput, Number(value));
                    } else {
                        searchResult.classList.add("hide");
                    };
                };

            }, 500);
        });
        searchInput.className = "pokedex-header__search";
        searchInput.placeholder = "Search your pokemon";

        searchBar.appendChild(searchInput)
        searchBar.appendChild(searchResult)

        return searchBar;
    }

    #renderVariations(variations, searchResult, searchInput) {
        searchResult.innerHTML = "";

        variations.forEach(async (pokemon) => {
            const searchVariant = document.createElement("p");
            searchVariant.className = "pokedex-header__variant";
            searchVariant.innerText = this.helper.capitalize(pokemon.name);
            searchVariant.addEventListener("click", async () => {
                this.#updateSidebar(pokemon.name);

                searchInput.value = "";
                searchResult.innerHTML = "";
                searchResult.classList.add("hide");
            });

            searchResult.appendChild(searchVariant);
            searchResult.classList.remove("hide");
        });
    }

    async #updateSidebar(value) {
        const data = await axiosClient.get(`pokemon/${value}`);
        const pokemonInfo = data;
        const activePokemon = document.querySelector(".pokedex-card.active");
        if (activePokemon) {
            activePokemon.classList.remove("active");
        };
        this.updateSidebar(pokemonInfo);
    }
}