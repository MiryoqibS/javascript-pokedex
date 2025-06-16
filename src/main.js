import "./main.scss";
import { Pokedex } from "./Pokedex";

const app = document.getElementById("app");
const pokedex = new Pokedex(app);
pokedex.render();