import axios from 'axios';

const PRICING_REST_API_URL = "http://localhost:8080/api/v1/pricing";

// Mock data for DB population (matches PricingResponse structure)
const MOCK_PRICING_DATA = {
	pricingList: [
		{
			pricingId: 1,
			categoryId: 1,
			title: "Фотография и видео", 
			description: "Качествено заснемане от един фотограф",
			currency: "BGN",
			startingPrice: 1000.0,
			startingPriceHours: 10,
			personId: "c6a8669e-ee95-4c42-9ef6-4a9b61380164",
			createdOn: "2021-06-27T10:25:00"
		},
		{
			pricingId: 2,
			categoryId: 2,
			title: "Само фотография",
			description: "Само фотографско заснемане без видео",
			currency: "BGN", 
			startingPrice: 600.0,
			startingPriceHours: 8,
			personId: "c6a8669e-ee95-4c42-9ef6-4a9b61380164",
			createdOn: "2021-06-27T10:23:00"
		}
	]
};

export class PricingService {
	
	async getPricingByPerson(personId) {
		let responseObj = {};
		await axios
			.get(`${PRICING_REST_API_URL}/${personId}`)
			.then((response) => {
				responseObj = response;
				console.log(`Calling API URL: GET ${PRICING_REST_API_URL}/${personId} and receiving the following response:`, responseObj);
			})
			.catch((error) => {
				responseObj = error.response || {
					message: error.message || "Network or request error",
					config: error.config
				};
				console.log(`Calling API URL: GET ${PRICING_REST_API_URL}/${personId} and receiving the following response:`, responseObj);
			});

		return responseObj;
	}

	async createPricing(pricing) {
		let responseObj = {};
		await axios
			.post(`${PRICING_REST_API_URL}`, pricing)
			.then((response) => {
				responseObj = response;
				console.log(`Calling API URL: POST ${PRICING_REST_API_URL} and receiving the following response:`, responseObj);
			})
			.catch((error) => {
				responseObj = error.response || {
					message: error.message || "Network or request error",
					config: error.config
				};
				console.log(`Calling API URL: POST ${PRICING_REST_API_URL} and receiving the following response:`, responseObj);
			});

		return responseObj;
	}

	async updatePricing(pricingId, pricing) {
		let responseObj = {};
		await axios
			.patch(`${PRICING_REST_API_URL}/${pricingId}`, pricing)
			.then((response) => {
				responseObj = response;
				console.log(`Calling API URL: PATCH ${PRICING_REST_API_URL}/${pricingId} and receiving the following response:`, responseObj);
			})
			.catch((error) => {
				responseObj = error.response || {
					message: error.message || "Network or request error",
					config: error.config
				};
				console.log(`Calling API URL: PATCH ${PRICING_REST_API_URL}/${pricingId} and receiving the following response:`, responseObj);
			});

		return responseObj;
	}

	async deletePricing(pricingId) {
		let responseObj = {};
		await axios
			.delete(`${PRICING_REST_API_URL}/${pricingId}`)
			.then((response) => {
				responseObj = response;
				console.log(`Calling API URL: DELETE ${PRICING_REST_API_URL}/${pricingId} and receiving the following response:`, responseObj);
			})
			.catch((error) => {
				responseObj = error.response || {
					message: error.message || "Network or request error",
					config: error.config
				};
				console.log(`Calling API URL: DELETE ${PRICING_REST_API_URL}/${pricingId} and receiving the following response:`, responseObj);
			});

		return responseObj;
	}
}
