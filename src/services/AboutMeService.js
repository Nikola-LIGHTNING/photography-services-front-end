import { request } from './security/AxiosSetup';

const ABOUT_REST_API_URL = "http://localhost:8080/api/v1/about";

export class AboutMeService {
	async getAboutMeByPersonId(personId) {
		const response = await request('get', `${ABOUT_REST_API_URL}/${personId}`);
		console.log(`Calling API URL: GET ${ABOUT_REST_API_URL}/${personId} and receiving the following response:`, response);
		return response;
	}

	async addAboutMeByPersonId(aboutMeRequest) {
		const response = await request('put', `${ABOUT_REST_API_URL}`, aboutMeRequest);
		console.log(`Calling API URL: PUT ${ABOUT_REST_API_URL} and receiving the following response:`, response);
		return response;
	}

	async removeAboutMeByAboutId(aboutId) {
		const response = await request('delete', `${ABOUT_REST_API_URL}/${aboutId}`);
		console.log(`Calling API URL: DELETE ${ABOUT_REST_API_URL}/${aboutId} and receiving the following response:`, response);
		return response;
	}
}
