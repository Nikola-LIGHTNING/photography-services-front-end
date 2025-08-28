import { request } from './security/AxiosSetup';

const REVIEW_REST_API_URL = "http://localhost:8080/api/v1/reviews";

export class ReviewService {
	async getReviewsOfPerson(personId) {
		const response = await request('get', `${REVIEW_REST_API_URL}/${personId}`);
		console.log(`Calling API URL: GET ${REVIEW_REST_API_URL}/${personId} and receiving the following response:`, response);
		return response;
	}

	async addReview(review) {
		const response = await request('post', `${REVIEW_REST_API_URL}`, review);
		console.log(`Calling API URL: POST ${REVIEW_REST_API_URL} and receiving the following response:`, response);
		return response;
	}

	async removeReview(reviewId) {
		const response = await request('delete', `${REVIEW_REST_API_URL}/${reviewId}`);
		console.log(`Calling API URL: DELETE ${REVIEW_REST_API_URL}/${reviewId} and receiving the following response:`, response);
		return response;
	}
}
