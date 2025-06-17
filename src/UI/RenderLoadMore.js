export class RenderLoadMore {
    constructor(fetchPokemons) {
        this.fetchPokemons = fetchPokemons;
    }

    // Пагинация 
    async render() {
        const pagination = document.createElement("div");
        pagination.className = "pokedex-pagination";

        const loadMore = document.createElement("button");
        loadMore.className = "pokedex-pagination__button";
        loadMore.innerText = "Load More";

        loadMore.addEventListener("click", () => {
            this.fetchPokemons();
        });

        pagination.appendChild(loadMore);

        return pagination;
    }
}