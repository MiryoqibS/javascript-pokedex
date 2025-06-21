export class FetchPokemons {
    constructor() {
        this.api = "https://pokeapi.co/api/v2/";
    }

    async fetch(offset, limit) {
        const response = await fetch(`${this.api}/pokemon?offset=${offset}&limit=${limit}`);
        const data = await response.json();
        const results = data.results;

        const pokemons = await Promise.all(
            results.map(async ({ url }) => {
                const res = await fetch(url);
                return await res.json();
            })
        );

        return pokemons;
    }

    async fetchPokemonsNames() {
        const res = await fetch(`${this.api}pokemon?limit=1025&offset=0`);
        const data = await res.json();
        return data.results;
    }
}