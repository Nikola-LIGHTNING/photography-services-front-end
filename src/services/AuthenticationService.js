import axios from 'axios';

const AUTHENTICATION_REST_API_URL = "http://localhost:8080/api/v1/auth";

export class AuthenticationService {
	async generateAuthenticationToken(authenticationRequest) {
		let responseObj = {};
		await axios
			.post(`${AUTHENTICATION_REST_API_URL}/authenticate`, authenticationRequest)
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

	async register(registrationRequest) {
		let responseObj = {};
		await axios
			.post(`${AUTHENTICATION_REST_API_URL}/register`, registrationRequest)
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
