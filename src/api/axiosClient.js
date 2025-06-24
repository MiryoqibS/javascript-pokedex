import axios from "axios";

class AxiosClient {
    constructor() {
        this.client = axios.create({
            baseURL: "https://pokeapi.co/api/v2/",
            timeout: 51000,
        });
    }

    async get(url) {
        try {
            const response = await this.client.get(url);
            const data = response.data;
            return data;
        } catch (error) {
            console.error(`Axios loading error: ${error}`);
            return null;
        }
    }
}

// Экспорт экземпляра, чтобы переиспользовать
export const axiosClient = new AxiosClient();