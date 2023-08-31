import axios from 'axios';

const PEOPLE_REST_API_URL = "http://localhost:8080/api/people";

// Mock data. Remove when backend API is ready.
const aboutMe = {
	id: "some UUID",
	text: `   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin posuere ex risus, a ornare felis aliquet sed. Quisque id leo eget arcu sodales rhoncus vel id augue. Aliquam ut tristique velit. Donec posuere, turpis non bibendum blandit, metus sem faucibus nisl, sed elementum tortor nibh a purus. Sed eget ipsum molestie, pharetra purus non, placerat tortor. Morbi ante tellus, sodales quis ligula in, tempus facilisis lorem. Sed semper nulla id orci ultrices interdum. Vivamus quis nunc erat. Pellentesque malesuada sapien massa. Nullam in commodo mauris. Sed interdum varius ultrices. Mauris nec maximus diam. Curabitur eu porta lacus, vitae commodo ante. Sed lobortis varius commodo. Nullam rhoncus aliquet ex in molestie. Quisque quis efficitur elit, ac suscipit lectus.
    Morbi a vulputate mauris. Nullam quis sapien ac neque bibendum tempor eget venenatis lectus. Phasellus ex sem, imperdiet at metus eu, vestibulum sollicitudin metus. Morbi eu erat non elit lacinia convallis tincidunt rutrum eros. Aliquam ac ullamcorper risus. Vestibulum ex dui, mattis a fermentum vel, ullamcorper id odio. Vivamus diam mi, efficitur nec velit sed, sodales suscipit turpis. Ut nec elementum erat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Cras auctor aliquam mauris at tempus. Sed facilisis quam arcu, eu faucibus ligula bibendum nec. Curabitur dapibus diam id lacinia bibendum. Maecenas scelerisque vel quam eu tincidunt. Nulla nec posuere dolor.
    Maecenas egestas tortor et justo vestibulum, non consectetur sapien sagittis. In a elit eget purus vestibulum bibendum quis quis ligula. Ut facilisis nunc risus, vel cursus lacus blandit eu. Nam eu facilisis massa, eget ultricies eros. Duis luctus fringilla turpis, nec imperdiet purus pharetra vitae. Nam ultrices nunc eu neque facilisis, at ultrices urna rutrum. In scelerisque nulla nec dolor finibus bibendum. Proin sagittis ultrices porttitor. Mauris a vestibulum felis. Suspendisse potenti. Aliquam erat volutpat. Duis fermentum magna ex, sed auctor justo aliquet ut. Aliquam condimentum aliquam congue. Nulla facilisi.
    Fusce fringilla tincidunt lacus, vitae suscipit erat. Suspendisse finibus ornare ante id convallis. Proin eget luctus nisi. Mauris leo elit, ornare vel elit eget, fringilla rutrum orci. Vivamus tristique libero vitae arcu pellentesque dictum. Suspendisse consectetur diam eu massa sollicitudin ornare. Sed arcu nisl, semper in rutrum a, eleifend ac turpis. Ut cursus egestas metus, sed finibus orci venenatis sit amet. Proin rutrum magna ut risus imperdiet, id gravida nisi consectetur. Ut viverra risus vitae dolor vulputate ultricies. Suspendisse bibendum erat sit amet pretium dapibus.`,
	person_id: "some UUID", // This person will always be a photographer for now
};

export class AboutMeService {
	async getAboutMeByPersonId(personId) {
		let responseObj = {};
		await axios
			.get(`${PEOPLE_REST_API_URL}/${personId}/about`)
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
				responseObj.data = aboutMe;
			});

		return responseObj;
	}

	addAboutMeByPersonId(personId, aboutMe) {
		let responseObj = {};
		axios
			.post(`${PEOPLE_REST_API_URL}/${personId}/about`, aboutMe)
			.then((response) => {
				responseObj = response;
			})
			.catch((error) => {
				responseObj = error.response;
				console.log("Log. Error response: " + error.response);
			});

		return responseObj;
	}

	removeAboutMeByPersonId(personId) {
		let responseObj = {};
		axios
			.delete(`${PEOPLE_REST_API_URL}/${personId}/about`)
			.then((response) => {
				responseObj = response;
			})
			.catch((error) => {
				responseObj = error.response;
				console.log("Log. Error response: " + error.response);
			});

		return responseObj;
	}
}
