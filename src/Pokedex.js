import { RenderSearchBar } from "./UI/RenderSearchBar.js";
import { RenderGrid } from "./UI/RenderGrid.js";
import { RenderSidebar } from "./UI/RenderSidebar.js";
import { FetchPokemons } from "./api/fetchPokemons.js";
import { RenderLoadMore } from "./UI/RenderLoadMore.js";

export class Pokedex {
    constructor(container) {
        this.container = container;
        this.pokemons = [];
        this.activePokemon = null;
        this.offset = 0;
        this.limit = 12;
        this.fetcherPokemons = new FetchPokemons();
        this.pokemonMaxCount = 1005;

        // Объекты для рендеринга компонентов
        this.renderSearchBar = new RenderSearchBar();
        this.renderGrid = new RenderGrid(this.selectActive.bind(this));
        this.renderSidebar = new RenderSidebar();
        this.renderLoadMore = new RenderLoadMore(this.#getPokemons.bind(this));
    }

    async render() {
        // Получаем покемонов
        await this.#getPokemons();
        this.selectActive(this.pokemons[0]);

        // Рендеринг компонентов
        const searchBar = this.renderSearchBar.render();
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
    }

    async #getPokemons() {
        const grid = document.querySelector(".pokedex-grid");

        const pokemons = await this.fetcherPokemons.fetch(this.offset, this.limit);
        this.pokemons.push(...pokemons);
        console.log(this.pokemons);

        this.offset += this.limit;

        if (grid) {
            this.renderGrid.renderPokemons(pokemons, grid);
        };

    }

    selectActive(pokemon) {
        this.activePokemon = pokemon;
        this.renderSidebar.update(this.activePokemon);
    }
}