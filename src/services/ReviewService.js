import axios from 'axios';

const REVIEW_REST_API_URL = "http://localhost:8080/api/v1/reviews";

// Mock data for DB population (matches ReviewsResponse structure)
const MOCK_REVIEWS_DATA = {
	reviews: [
		{
			reviewId: 123,
			rating: 5,
			comment: "С ММ сме много доволни от професинализима и подхода на Фотограф Фотографов. Изключително търпелив към нас и находчив за красиви снимки.",
			name: "От жена на мъж",
			createdOn: "2021-06-27T10:25:00",
		},
		{
			reviewId: 124,
			rating: 4,
			comment: "Добре",
			name: "Косара Българова",
			createdOn: "2021-06-27T10:23:00",
		},
		{
			reviewId: 125,
			rating: 4,
			comment: `   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin posuere ex risus, a ornare felis aliquet sed. Quisque id leo eget arcu sodales rhoncus vel id augue. Aliquam ut tristique velit. Donec posuere, turpis non bibendum blandit, metus sem faucibus nisl, sed elementum tortor nibh a purus. Sed eget ipsum molestie, pharetra purus non, placerat tortor. Morbi ante tellus, sodales quis ligula in, tempus facilisis lorem. Sed semper nulla id orci ultrices interdum. Vivamus quis nunc erat. Pellentesque malesuada sapien massa. Nullam in commodo mauris. Sed interdum varius ultrices. Mauris nec maximus diam. Curabitur eu porta lacus, vitae commodo ante. Sed lobortis varius commodo. Nullam rhoncus aliquet ex in molestie. Quisque quis efficitur elit, ac suscipit lectus.`,
			name: "Гай Юлий Цезар",
			createdOn: "2021-06-26T18:25:00",
		},
		{
			reviewId: 126,
			rating: 5,
			comment: "Силно препоръчвам!!!",
			name: "Кольо",
			createdOn: "2021-06-26T13:25:00",
		},
	]
};

export class ReviewService {
	async getReviewsOfPerson(personId) {
		let responseObj = {};
		await axios
			.get(`${REVIEW_REST_API_URL}/${personId}`)
			.then((response) => {
				responseObj = response;
				console.log(`Calling API URL: GET ${REVIEW_REST_API_URL}/${personId} and receiving the following response:`, responseObj);
			})
			.catch((error) => {
				responseObj = error.response || {
					message: error.message || "Network or request error",
					config: error.config
				};
				console.log(`Calling API URL: GET ${REVIEW_REST_API_URL}/${personId} and receiving the following response:`, responseObj);
			});

		return responseObj;
	}

	async addReview(review) {
		let responseObj = {};
		await axios
			.post(`${REVIEW_REST_API_URL}`, review)
			.then((response) => {
				responseObj = response;
				console.log(`Calling API URL: POST ${REVIEW_REST_API_URL} and receiving the following response:`, responseObj);
			})
			.catch((error) => {
				responseObj = error.response || {
					message: error.message || "Network or request error",
					config: error.config
				};
				console.log(`Calling API URL: POST ${REVIEW_REST_API_URL} and receiving the following response:`, responseObj);
			});

		return responseObj;
	}

	async removeReview(reviewId) {
		let responseObj = {};
		await axios
			.delete(`${REVIEW_REST_API_URL}/${reviewId}`)
			.then((response) => {
				responseObj = response;
				console.log(`Calling API URL: DELETE ${REVIEW_REST_API_URL}/${reviewId} and receiving the following response:`, responseObj);
			})
			.catch((error) => {
				responseObj = error.response || {
					message: error.message || "Network or request error",
					config: error.config
				};
				console.log(`Calling API URL: DELETE ${REVIEW_REST_API_URL}/${reviewId} and receiving the following response:`, responseObj);
			});

		return responseObj;
	}
}
