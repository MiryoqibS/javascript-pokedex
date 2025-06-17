import { Helper } from "../utils/Helpers";

export class RenderCard {
    constructor(name, id, imageUrl, types, height, weight) {
        this.name = name;
        this.id = id;
        this.imageUrl = imageUrl;
        this.helper = new Helper();
        this.types = types;
        this.height = height; 
        this.weight = weight;
    }

    render() {
        const card = document.createElement("article");
        card.className = "pokedex-card";

        const image = document.createElement("img");
        image.src = this.imageUrl;
        image.className = "pokedex-card__image";

        const id = document.createElement("p");
        id.className = "pokedex-card__id";
        id.innerText = `№${String(this.id).padStart(3, "0")}`;

        const name = document.createElement("h3");
        name.className = "pokedex-card__name";
        name.innerText = this.helper.capitalize(this.name);

        const types = document.createElement("div");
        types.className = "pokedex-card__types";
        this.types.forEach(typeInfo => {
            const type = document.createElement("span");
            type.className = `pokedex-card__type ${typeInfo}`;
            type.innerText = this.helper.capitalize(typeInfo);
            types.appendChild(type);
        });

        card.appendChild(image);
        card.appendChild(id);
        card.appendChild(name);
        card.appendChild(types);

        return card;
    }
}