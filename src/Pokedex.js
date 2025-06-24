import { RenderSearchBar } from "./UI/RenderSearchBar.js";
import { RenderGrid } from "./UI/RenderGrid.js";
import { RenderSidebar } from "./UI/RenderSidebar.js";
import { PokemonService } from "./api/PokemonService.js";
import { RenderLoadMore } from "./UI/RenderLoadMore.js";

export class Pokedex {
    constructor(container) {
        this.container = container;
        this.pokemons = [];
        this.pokemonForLoad = [];
        this.activePokemon = null;
        this.offset = 0;
        this.limit = 12;
        this.pokemonApi = new PokemonService();
        this.pokemonMaxCount = 1025;
        this.pokemonsNames = null;

        // Объекты для рендеринга компонентов
        this.renderGrid = new RenderGrid(this.selectActive.bind(this));
        this.renderSidebar = new RenderSidebar();
        this.renderSearchBar = new RenderSearchBar(this.#getPokemonsNames.bind(this), this.renderSidebar.update.bind(this.renderSidebar));
        this.renderLoadMore = new RenderLoadMore(this.renderGrid, this.#loadPokemons.bind(this));
    }

    async render() {
        // Получаем покемонов
        await this.#loadPokemons();
        this.selectActive(this.pokemons[0]);

        // Рендеринг компонентов
        const searchBar = await this.renderSearchBar.render();
        console.log(this.pokemons);
        
        const grid = this.renderGrid.render(this.pokemons);
        const sidebar = await this.renderSidebar.render(this.activePokemon);
        const pagination = await this.renderLoadMore.render();

        // Контейнер покедекс
        const pokedex = document.createElement("main");
        pokedex.className = "pokedex container";
        pokedex.appendChild(searchBar);
        pokedex.appendChild(grid);
        pokedex.appendChild(sidebar);
        pokedex.appendChild(pagination);

        // Добавляем покедекс в основной контейнер
        this.container.appendChild(pokedex)

        if (!this.pokemonsNames) {
            this.pokemonsNames = await this.pokemonApi.fetchPokemonsNames();
            console.log(this.pokemonsNames);
            
        }
    }

    async #loadPokemons() {
        const pokemons = await this.pokemonApi.fetchPokemons(this.offset, this.limit);
        this.pokemons.push(...pokemons);
        this.offset += this.limit;
        return pokemons;
    }

    #getPokemonsNames() {
        return this.pokemonsNames;
    }

    selectActive(pokemon) {
        this.activePokemon = pokemon;
        this.renderSidebar.update(this.activePokemon);
    }
}