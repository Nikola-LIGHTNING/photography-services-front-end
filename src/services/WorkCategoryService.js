import axios from 'axios';

const WORK_CATEGORY_REST_API_URL = "http://localhost:8080/api/v1/work-categories";

export class WorkCategoryService {
	async getProfessions() {
		let responseObj = {};
		await axios
			.get(`${WORK_CATEGORY_REST_API_URL}`)
			.then((response) => {
				responseObj = response;
				console.log(`Calling API URL: GET ${WORK_CATEGORY_REST_API_URL} and receiving the following response:`, responseObj);
			})
			.catch((error) => {
				responseObj = error.response || {
					message: error.message || "Network or request error",
					config: error.config
				};
				console.log(`Calling API URL: GET ${WORK_CATEGORY_REST_API_URL} and receiving the following response:`, responseObj);
			});

		return responseObj;
	}
	
	async getWorkCategoriesByProfession(profession) {
		let responseObj = {};
		await axios
			.get(`${WORK_CATEGORY_REST_API_URL}/${profession}`)
			.then((response) => {
				responseObj = response;
				console.log(`Calling API URL: GET ${WORK_CATEGORY_REST_API_URL}/${profession} and receiving the following response:`, responseObj);
			})
			.catch((error) => {
				responseObj = error.response || {
					message: error.message || "Network or request error",
					config: error.config
				};
				console.log(`Calling API URL: GET ${WORK_CATEGORY_REST_API_URL}/${profession} and receiving the following response:`, responseObj);
			});

		return responseObj;
	}
}
