import { RenderCard } from "./renderCard";

export class RenderGrid {
    constructor(selectActive) {
        this.selectActive = selectActive;
        this.isFirstPokemon = true;
    }

    render(pokemons) {
        // Контейнер сетки для показа покемонов
        const grid = document.createElement("div");
        grid.className = "pokedex-grid";

        // Рендер 12 покемонов 
        this.renderPokemons(pokemons, grid);

        return grid;
    }

    renderPokemons(pokemons, container) {
        pokemons.forEach(pokemon => {
            const pokemonName = pokemon.name;
            const pokemonId = pokemon.id;
            const pokemonSprites = pokemon.sprites.other["official-artwork"];
            const pokemonImageDefault = pokemonSprites.front_default;
            const pokemonImageShiny = pokemonSprites.front_shiny;
            const pokemonTypes = pokemon.types.map(({ type }) => {
                return type.name;
            });
            const pokemonHeight = pokemon.height;

            // Объект рендеринга карточки покемона
            const renderCard = new RenderCard(pokemonName, pokemonId, pokemonImageDefault, pokemonTypes, pokemonHeight);
            const card = renderCard.render();
            card.addEventListener("click", () => {
                if (!card.classList.contains("active")) {
                    const prevActiveCard = document.querySelector(".pokedex-card.active");
                    prevActiveCard.classList.remove("active");
                    card.classList.add("active");
                    this.selectActive(pokemon);

                    const sidebar = document.querySelector(".pokedex-sidebar");
                    sidebar.classList.add("active");
                };
            });

            if (this.isFirstPokemon) {
                card.classList.add("active");
                this.isFirstPokemon = false;
            };

            container.appendChild(card);
        });
    }
}