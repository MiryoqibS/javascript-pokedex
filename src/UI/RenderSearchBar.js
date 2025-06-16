export class RenderSearchBar {
    render() {
        const searchBar = document.createElement("header");
        searchBar.className = "pokedex-header";

        const searchInput = document.createElement("input");
        searchInput.addEventListener("input", () => {
            console.log(searchInput.value);
        });
        searchInput.className = "pokedex-header__search";
        searchInput.placeholder = "Search your pokemon";

        searchBar.appendChild(searchInput)

        return searchBar;
    }
}