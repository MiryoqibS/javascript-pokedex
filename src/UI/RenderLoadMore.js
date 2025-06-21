export class RenderLoadMore {
    constructor(grid, loadPokemons) {
        this.grid = grid;
        this.loadPokemons = loadPokemons;
    }

    // Пагинация 
    render() {
        const pagination = document.createElement("div");
        pagination.className = "pokedex-pagination";

        const loadMore = document.createElement("button");
        loadMore.className = "pokedex-pagination__button";
        loadMore.innerText = "Load More";

        loadMore.addEventListener("click", async () => {
            const container = document.querySelector(".pokedex-grid");
            const pokemons = await this.loadPokemons();
            this.grid.renderPokemons(pokemons, container);
        });

        pagination.appendChild(loadMore);

        return pagination;
    }
}