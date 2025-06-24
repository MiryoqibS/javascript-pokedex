import { axiosClient } from "./axiosClient";

export class PokemonService {
    async fetchPokemons(offset, limit) {
        const data = await axiosClient.get(`pokemon?offset=${offset}&limit=${limit}`);
        const results = data.results;

        const pokemons = await Promise.all(
            results.map(async ({ url }) => {
                const pokemonData = await axiosClient.get(url.replace("https://pokeapi.co/api/v2/", ""));
                console.log(pokemonData);
                
                return pokemonData;
            })
        );

        return pokemons;
    }

    async fetchPokemonsNames() {
        const data = await axiosClient.get(`pokemon?limit=1025&offset=0`);
        return data.results;
    }
}