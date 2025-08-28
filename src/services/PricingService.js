import { request } from './security/AxiosSetup';

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
		const response = await request('get', `${PRICING_REST_API_URL}/${personId}`);
		console.log(`Calling API URL: GET ${PRICING_REST_API_URL}/${personId} and receiving the following response:`, response);
		return response;
	}

	async createPricing(pricing) {
		const response = await request('post', `${PRICING_REST_API_URL}`, pricing);
		console.log(`Calling API URL: POST ${PRICING_REST_API_URL} and receiving the following response:`, response);
		return response;
	}

	async updatePricing(pricingId, pricing) {
		const response = await request('patch', `${PRICING_REST_API_URL}/${pricingId}`, pricing);
		console.log(`Calling API URL: PATCH ${PRICING_REST_API_URL}/${pricingId} and receiving the following response:`, response);
		return response;
	}

	async deletePricing(pricingId) {
		const response = await request('delete', `${PRICING_REST_API_URL}/${pricingId}`);
		console.log(`Calling API URL: DELETE ${PRICING_REST_API_URL}/${pricingId} and receiving the following response:`, response);
		return response;
	}
}
