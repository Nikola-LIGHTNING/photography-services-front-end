import axios from 'axios';

const REVIEW_REST_API_URL = "http://localhost:8080/api/v1/reviews";

// Mock data. Remove when backend API is ready.
const reviews = [
	{
		reviewId: "UUID",
		person_id: "the UUID of the reviewed person",
		rating: 5,
		comment: "С ММ сме много доволни от професинализима и подхода на Фотограф Фотографов. Изключително търпелив към нас и находчив за красиви снимки.",
		name: "От жена на мъж",
		createdOn: "2021-06-27T10:25:00",
	},
	{
		reviewId: "UUID",
		person_id: "the UUID of the reviewed person",
		rating: 4,
		comment: "Добре",
		name: "Косара Българова",
		createdOn: "2021-06-27T10:23:00",
	},
	{
		reviewId: "UUID",
		person_id: "the UUID of the reviewed person",
		rating: 4,
		comment: `   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin posuere ex risus, a ornare felis aliquet sed. Quisque id leo eget arcu sodales rhoncus vel id augue. Aliquam ut tristique velit. Donec posuere, turpis non bibendum blandit, metus sem faucibus nisl, sed elementum tortor nibh a purus. Sed eget ipsum molestie, pharetra purus non, placerat tortor. Morbi ante tellus, sodales quis ligula in, tempus facilisis lorem. Sed semper nulla id orci ultrices interdum. Vivamus quis nunc erat. Pellentesque malesuada sapien massa. Nullam in commodo mauris. Sed interdum varius ultrices. Mauris nec maximus diam. Curabitur eu porta lacus, vitae commodo ante. Sed lobortis varius commodo. Nullam rhoncus aliquet ex in molestie. Quisque quis efficitur elit, ac suscipit lectus.`,
		name: "Гай Юлий Цезар",
		createdOn: "2021-06-26T18:25:00",
	},
	{
		reviewId: "UUID",
		person_id: "the UUID of the reviewed person",
		rating: 5,
		comment: "Силно препоръчвам!!!",
		name: "Кольо",
		createdOn: "2021-06-26T13:25:00",
	},
];

export class ReviewService {
	async getReviewsOfPerson(personId) {
		let responseObj = {};
		await axios
			.get(`${REVIEW_REST_API_URL}/${personId}/reviews`)
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
				console.log(responseObj);

				// Temporary mock
				responseObj.status = 200;
				responseObj.data = reviews;
			});

		return responseObj;
	}

	async addReview(review) {
		let responseObj = {};
		await axios
			.post(`${REVIEW_REST_API_URL}`, review)
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
				// Temporary mock
				responseObj.status = 200;
				if (!reviews.includes(review)) {
					reviews.push(review);
					responseObj.status = 201;
				}
			});

		return responseObj;
	}

	async removeReview(review) {
		let responseObj = {};
		await axios
			.delete(`${REVIEW_REST_API_URL}/${review.personId}/reviews/${review.reviewId}`)
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
			});

		return responseObj;
	}
}
