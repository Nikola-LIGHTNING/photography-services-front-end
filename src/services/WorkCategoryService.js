import axios from 'axios';

const WORK_CATEGORY_REST_API_URL = "http://localhost:8080/api/v1/work-categories";

export class WorkCategoryService {
	async getProfessions() {
		let responseObj = {};
		await axios
			.get(`${WORK_CATEGORY_REST_API_URL}`)
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
				
				// Temporary until proper logging
				console.log(responseObj);
			});

		return responseObj;
	}
	
	async getWorkCategoriesByProfession(profession) {
		let responseObj = {};
		await axios
			.get(`${WORK_CATEGORY_REST_API_URL}/${profession}`)
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
								
				// Temporary until proper logging
				console.log(responseObj);
			});

		return responseObj;
	}
}
