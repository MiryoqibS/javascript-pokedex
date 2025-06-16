import { RenderCard } from "./renderCard";

export class RenderGrid {
    constructor(pokemons, selectActive) {
        this.pokemons = pokemons;
        this.selectActive = selectActive;
    }

    render() {
        let isFirstPokemon = true;

        // Контейнер сетки для показа покемонов
        const grid = document.createElement("div");
        grid.className = "pokedex-grid";

        this.pokemons.forEach(pokemon => {
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
                };
            });
            if (isFirstPokemon) {
                card.classList.add("active");      
                isFirstPokemon = false;
            };

            grid.appendChild(card);
        });

        return grid;
    }
}