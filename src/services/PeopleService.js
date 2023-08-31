import axios from 'axios';

const PEOPLE_REST_API_URL = "http://localhost:8080/api/people";

// Mock data. Remove when backend API is ready.
const person = {
	id: "fotografka.dtb",
	firstName: "Цветомир",
	lastName: "Цветков",
	phoneNumber: "0877555333",
	profileImgSrc: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
	gender: "Мъж",
	profession: "photographer",
	workArea: ["София", "Монтана", "Хасково"],
	categories: ["Сватбена фотография", "Абитуриенти", "Фотокниги", "Кръщене"],
};

export class PeopleService {
	async getPersonByUrlId(personUrlId) {
		let responseObj = {};
		await axios
			.get(`${PEOPLE_REST_API_URL}/${personUrlId}`)
			// .get(`https://httpbin.org/get`)
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
				responseObj.data = person;
			});

		return responseObj;
	}

	addPerson(person) {
		let responseObj = {};
		axios
			.post(`${PEOPLE_REST_API_URL}`, person)
			.then((response) => {
				responseObj = { ...response };
			})
			.catch((error) => {
				responseObj = { ...error.response };
				console.log("Log. Error response: " + error.response);
			});

		return responseObj;
	}

	removePerson(personId) {
		let responseObj = {};
		axios
			.delete(`${PEOPLE_REST_API_URL}/${personId}`)
			.then((response) => {
				responseObj = { ...response };
			})
			.catch((error) => {
				responseObj = { ...error.response };
				console.log("Log. Error response: " + error.response);
			});

		return responseObj;
	}
}
