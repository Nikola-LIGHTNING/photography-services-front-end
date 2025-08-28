import { request } from './security/AxiosSetup';

const WORK_CATEGORY_REST_API_URL = "http://localhost:8080/api/v1/work-categories";

export class WorkCategoryService {
	async getProfessions() {
		const response = await request('get', `${WORK_CATEGORY_REST_API_URL}`);
		console.log(`Calling API URL: GET ${WORK_CATEGORY_REST_API_URL} and receiving the following response:`, response);
		return response;
	}
	
	async getWorkCategoriesByProfession(profession) {
		const response = await request('get', `${WORK_CATEGORY_REST_API_URL}/${profession}`);
		console.log(`Calling API URL: GET ${WORK_CATEGORY_REST_API_URL}/${profession} and receiving the following response:`, response);
		return response;
	}
}
