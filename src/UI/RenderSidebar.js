import { axiosClient } from "../api/axiosClient.js";
import { Helper } from "../utils/Helpers";

export class RenderSidebar {
    constructor() {
        this.helper = new Helper();
    }

    async render(pokemonInfo) {
        const sidebar = document.createElement("aside");
        sidebar.className = "pokedex-sidebar";

        const closeButton = this.sidebarCloseButton();
        const header = await this.sidebarHeader(pokemonInfo);
        const abilities = this.pokemonAbilities(pokemonInfo);
        const information = await this.pokemonInformation(pokemonInfo);

        // Добавляем дочерние элементы в sidebar 
        sidebar.appendChild(closeButton);
        sidebar.appendChild(header);
        sidebar.appendChild(abilities);
        sidebar.appendChild(information);

        return sidebar;
    }

    async update(pokemonInfo) {
        // Изображения покемона
        const oldHeader = document.querySelector(".pokedex-sidebar__header");
        const oldAbilities = document.querySelector(".pokedex-sidebar__abilities");
        const oldInformation = document.querySelector(".pokedex-sidebar__information");

        if (oldHeader) {
            const newHeader = await this.sidebarHeader(pokemonInfo);
            const newAbilities = this.pokemonAbilities(pokemonInfo);
            const newInformation = await this.pokemonInformation(pokemonInfo);

            oldHeader.replaceWith(newHeader);
            oldAbilities.replaceWith(newAbilities);
            oldInformation.replaceWith(newInformation);
        };
    }

    // Заголовок 
    async sidebarHeader(pokemonInfo) {
        const header = document.createElement("header");
        header.className = "pokedex-sidebar__header";

        const image = this.pokemonImage(pokemonInfo);

        const list = document.createElement("div");
        list.className = "pokedex-sidebar__list";

        const id = this.pokemonId(pokemonInfo);
        const name = this.pokemonName(pokemonInfo);
        const types = this.pokemonTypes(pokemonInfo);
        const pokedexEntry = await this.pokedexEntry(pokemonInfo);

        list.appendChild(id);
        list.appendChild(name);
        list.appendChild(types);
        list.appendChild(pokedexEntry);

        header.appendChild(image);
        header.appendChild(list);

        return header;
    }

    // Кнопка для закрытия боковой панели
    sidebarCloseButton() {
        const button = document.createElement("button");
        button.className = "pokedex-sidebar__close";

        const span = document.createElement("span");

        button.appendChild(span);
        button.appendChild(span.cloneNode());

        button.addEventListener("click", () => {
            const sidebar = document.querySelector(".pokedex-sidebar");

            if (sidebar) {
                sidebar.classList.remove("active");
            };
        })

        return button;
    }

    // Изображение покемона
    pokemonImage(pokemonInfo) {
        console.log(pokemonInfo);
        
        const image = document.createElement("img");
        image.className = "pokedex-sidebar__image";
        const pokemonSprites = pokemonInfo.sprites.other["official-artwork"];
        const pokemonImageDefault = pokemonSprites.front_default;
        image.src = pokemonImageDefault;

        return image;
    }

    // Id покемона
    pokemonId(pokemonInfo) {
        const id = document.createElement("p");
        id.className = "pokedex-sidebar__id";
        id.innerText = `#${String(pokemonInfo.id).padStart(3, "0")}`;

        return id;
    }

    // Имя покемона
    pokemonName(pokemonInfo) {
        const name = document.createElement("h3");
        name.className = "pokedex-sidebar__name";
        name.innerText = this.helper.capitalize(pokemonInfo.name);

        return name;
    }

    // Типы покемона
    pokemonTypes(pokemonInfo) {
        const types = document.createElement("div");
        types.className = "pokedex-sidebar__types";

        pokemonInfo.types.forEach(typeInfo => {
            const type = document.createElement("span");
            type.className = `pokedex-card__type ${typeInfo.type.name}`;
            type.innerText = this.helper.capitalize(typeInfo.type.name);
            types.appendChild(type);
        });

        return types;
    }

    // Описание в покедексe
    async pokedexEntry(pokemonInfo) {
        const data = await axiosClient.get(`pokemon-species/${pokemonInfo.id}`);
        const englishEntry = data.flavor_text_entries.find(entry => entry.language.name === "en")

        const pokedexEntry = document.createElement("div");
        pokedexEntry.className = "pokedex-sidebar__description";

        const title = document.createElement("h3");
        title.innerText = "pokedex entry";

        const description = document.createElement("p");
        description.innerText = englishEntry.flavor_text;

        pokedexEntry.appendChild(title);
        pokedexEntry.appendChild(description);

        return pokedexEntry;
    }

    // Способности покемона
    pokemonAbilities(pokemonInfo) {
        const abilities = document.createElement("div");
        abilities.className = "pokedex-sidebar__abilities";

        const title = document.createElement("h3");
        title.innerText = "Abilities";

        abilities.appendChild(title);

        pokemonInfo.abilities.forEach(abilityInfo => {
            const ability = document.createElement("div");
            ability.className = "pokedex-sidebar__ability";
            ability.innerText = abilityInfo.ability.name;

            if (abilityInfo.is_hidden) {
                ability.classList.add("hidden");

                const hiddenIcon = this.helper.createIcon("icon-hidden", 18, 18);
                ability.appendChild(hiddenIcon);
            }

            abilities.appendChild(ability);
        });

        return abilities;
    }

    // Информация о покемоне
    async pokemonInformation(pokemonInfo) {
        const information = document.createElement("div");
        information.className = "pokedex-sidebar__information";

        const height = this.#createInformation(pokemonInfo.height, "m", "height");
        const weight = this.#createInformation(pokemonInfo.weight, "kg", "weight");
        const baseExp = this.#createInformation(pokemonInfo.base_experience, "", "base exp");

        const weakness = document.createElement("div");
        weakness.className = "pokedex-sidebar__stat";
        const weaknessTitle = document.createElement("h3");
        weaknessTitle.innerText = "weakness";
        weakness.appendChild(weaknessTitle);
        const weaknessTypes = document.createElement("span");
        weaknessTypes.id = "pokemonWeaknessFrom";

        pokemonInfo.types.forEach(async (type) => {
            const data = await axiosClient.get(type.type.url.replace("https://pokeapi.co/api/v2/", ""));

            const weaknessFrom = data.damage_relations.double_damage_from;
            weaknessFrom.forEach(type => {
                const image = document.createElement("img");
                image.src = `/types/${this.helper.capitalize(type.name)}.ico`;
                weaknessTypes.appendChild(image);
            });
        });

        weakness.appendChild(weaknessTypes);

        information.appendChild(height);
        information.appendChild(weight);
        information.appendChild(baseExp);
        information.appendChild(weakness);

        return information;
    }

    // Скрытый метод для создания 1 информации
    #createInformation(stat, measure, title) {
        const information = document.createElement("div");
        information.className = "pokedex-sidebar__stat";
        const informationTitle = document.createElement("h3");
        informationTitle.innerText = this.helper.capitalize(title);
        const informationStat = document.createElement("span");
        informationStat.id = `pokemon${this.helper.capitalize(title)}`.trim();
        if (["kg", "m"].includes(measure)) {
            informationStat.innerText = `${(stat / 10).toFixed(1)} ${measure}`;
        } else {
            informationStat.innerText = `${stat} ${measure}`;
        };

        information.appendChild(informationTitle);
        information.appendChild(informationStat);

        return information;
    };
}