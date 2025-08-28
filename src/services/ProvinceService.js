import { request } from './security/AxiosSetup';

const PROVINCE_REST_API_URL = "http://localhost:8080/api/v1/provinces";

export class ProvinceService {
	async getProvinces() {
		const response = await request('get', `${PROVINCE_REST_API_URL}`);
		return response;
	}

}
