import { Helper } from "../utils/Helpers";

export class RenderSidebar {
    constructor() {
        this.helper = new Helper();
    }

    async render(pokemonInfo) {
        const sidebar = document.createElement("aside");
        sidebar.className = "pokedex-sidebar";

        const image = this.pokemonImage(pokemonInfo);
        const id = this.pokemonId(pokemonInfo);
        const name = this.pokemonName(pokemonInfo);
        const types = this.pokemonTypes(pokemonInfo);
        const abilities = this.pokemonAbilities(pokemonInfo);
        const pokedexEntry = await this.pokedexEntry(pokemonInfo);
        const information = await this.pokemonInformation(pokemonInfo);

        // Добавляем дочерние элементы в sidebar 
        sidebar.appendChild(image);
        sidebar.appendChild(id);
        sidebar.appendChild(name);
        sidebar.appendChild(types);
        sidebar.appendChild(pokedexEntry);
        sidebar.appendChild(abilities);
        sidebar.appendChild(information);

        return sidebar;
    }

    async update(pokemonInfo) {
        // Изображения покемона
        const oldImage = document.querySelector(".pokedex-sidebar__image");
        const oldId = document.querySelector(".pokedex-sidebar__id");
        const oldName = document.querySelector(".pokedex-sidebar__name");
        const oldTypes = document.querySelector(".pokedex-sidebar__types");
        const oldPokedexEntry = document.querySelector(".pokedex-sidebar__description");
        const oldAbilities = document.querySelector(".pokedex-sidebar__abilities");
        const oldInformation = document.querySelector(".pokedex-sidebar__information");

        if (oldImage) {
            const newImage = this.pokemonImage(pokemonInfo);
            const newId = this.pokemonId(pokemonInfo);
            const newName = this.pokemonName(pokemonInfo);
            const newTypes = this.pokemonTypes(pokemonInfo);
            const newPokedexEntry = await this.pokedexEntry(pokemonInfo);
            const newAbilities = this.pokemonAbilities(pokemonInfo);
            const newInformation = await this.pokemonInformation(pokemonInfo);

            oldImage.replaceWith(newImage);
            oldId.replaceWith(newId);
            oldName.replaceWith(newName);
            oldTypes.replaceWith(newTypes);
            oldPokedexEntry.replaceWith(newPokedexEntry);
            oldAbilities.replaceWith(newAbilities);
            oldInformation.replaceWith(newInformation);
        };
    }

    // Изображение покемона
    pokemonImage(pokemonInfo) {
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
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonInfo.id}`);
        const data = await response.json();
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
            const response = await fetch(type.type.url);
            const data = await response.json();
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