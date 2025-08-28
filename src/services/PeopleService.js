import { request } from './security/AxiosSetup';

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
		const response = await request('get', `${PEOPLE_REST_API_URL}/${personId}`);
		console.log(`Calling API URL: GET ${PEOPLE_REST_API_URL}/${personId} and receiving the following response:`, response);
		return response;
	}

	async getPersonMe() {
		const response = await request('get', `${PEOPLE_REST_API_URL}/me`);
		console.log(`Calling API URL: GET ${PEOPLE_REST_API_URL}/me and receiving the following response:`, response);
		return response;
	}

	async addPerson(person) {
		const response = await request('post', `${PEOPLE_REST_API_URL}`, person);
		console.log(`Calling API URL: POST ${PEOPLE_REST_API_URL} and receiving the following response:`, response);
		return response;
	}

	async updatePerson(personId, payload) {
		const response = await request('patch', `${PEOPLE_REST_API_URL}/${personId}`, payload);
		console.log(`Calling API URL: PATCH ${PEOPLE_REST_API_URL}/${personId} and receiving the following response:`, response);
		return response;
	}

	async removePerson(personId) {
		const response = await request('delete', `${PEOPLE_REST_API_URL}/${personId}`);
		console.log(`Calling API URL: DELETE ${PEOPLE_REST_API_URL}/${personId} and receiving the following response:`, response);
		return response;
	}
}
