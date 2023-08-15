import axios from 'axios';

const CATEGORIES_REST_API_URL = "http://localhost:8080/api/categories";

// Mock data. Remove when backend API is ready.
const photographerCategories = {
	events: [
		{
			key: "wedding",
			value: "Сватбена фотография",
		},
		{
			key: "baptism",
			value: "Кръщене",
		},
		{
			key: "prom",
			value: "Абитуриенти",
		},
		{
			key: "family",
			value: "Семейна фотосесия",
		},
		{
			key: "party",
			value: "Празненство",
		},
		{
			key: "birthday",
			value: "Рожден ден",
		},
	],
	other: [
		{
			key: "photoBook",
			value: "Фотокниги",
		},
		{
			key: "photoEdit",
			value: "Обработка на снимки",
		},
	],
};

export class CategoriesService {
	async getCategoriesByProfession(profession) {
		let responseObj = {};
		await axios
			.get(`${CATEGORIES_REST_API_URL}/${profession}`)
			.then((response) => {
				responseObj = response;
			})
			.catch((error) => {
				if (error.response) {
					responseObj = error.response;
				} else if (error.request) {
					responseObj.message = "The request was made but no response was received";
				} else {
					responseObj.message = "Something happened in setting up the request that triggered an Error";
				}
				responseObj.config = error.config;
				// Temporary mock
				responseObj.status = 200;
				responseObj.data = photographerCategories;
			});

		return responseObj;
	}
}
