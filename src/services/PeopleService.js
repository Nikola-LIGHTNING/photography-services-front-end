import axios from 'axios';

const PEOPLE_REST_API_URL = "http://localhost:8080/api/v1/people";

// Mock data for DB population
const MOCK_PERSON_DATA = {
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
	
	async getPersonById(personId) {
		let responseObj = {};
		await axios
			.get(`${PEOPLE_REST_API_URL}/${personId}`)
			.then((response) => {
				responseObj = response;
				console.log(`Calling API URL: GET ${PEOPLE_REST_API_URL}/${personId} and receiving the following response:`, responseObj);
			})
			.catch((error) => {
				responseObj = error.response || {
					message: error.message || "Network or request error",
					config: error.config
				};
				console.log(`Calling API URL: GET ${PEOPLE_REST_API_URL}/${personId} and receiving the following response:`, responseObj);
			});

		return responseObj;
	}

	async getPersonMe() {
		let responseObj = {};
		await axios
			.get(`${PEOPLE_REST_API_URL}/me`)
			.then((response) => {
				responseObj = response;
				console.log(`Calling API URL: GET ${PEOPLE_REST_API_URL}/me and receiving the following response:`, responseObj);
			})
			.catch((error) => {
				responseObj = error.response || {
					message: error.message || "Network or request error",
					config: error.config
				};
				console.log(`Calling API URL: GET ${PEOPLE_REST_API_URL}/me and receiving the following response:`, responseObj);
			});

		return responseObj;
	}

	async addPerson(person) {
		let responseObj = {};
		await axios
			.post(`${PEOPLE_REST_API_URL}`, person)
			.then((response) => {
				responseObj = response;
				console.log(`Calling API URL: POST ${PEOPLE_REST_API_URL} and receiving the following response:`, responseObj);
			})
			.catch((error) => {
				responseObj = error.response || {
					message: error.message || "Network or request error",
					config: error.config
				};
				console.log(`Calling API URL: POST ${PEOPLE_REST_API_URL} and receiving the following response:`, responseObj);
			});

		return responseObj;
	}

	async removePerson(personId) {
		let responseObj = {};
		await axios
			.delete(`${PEOPLE_REST_API_URL}/${personId}`)
			.then((response) => {
				responseObj = response;
				console.log(`Calling API URL: DELETE ${PEOPLE_REST_API_URL}/${personId} and receiving the following response:`, responseObj);
			})
			.catch((error) => {
				responseObj = error.response || {
					message: error.message || "Network or request error",
					config: error.config
				};
				console.log(`Calling API URL: DELETE ${PEOPLE_REST_API_URL}/${personId} and receiving the following response:`, responseObj);
			});

		return responseObj;
	}
}
