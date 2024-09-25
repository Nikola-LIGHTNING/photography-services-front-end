import "./ReviewSection.less";
import Divider from "../Divider/Divider";
import Review from "../Review/Review";
import { getDateObjectFromDateTimeString } from "../../utils/LocalDateTimeParser";
import { Form, Input, message, Button, Rate } from "antd";
import { hasValidResponseStatus } from "../../utils/ValidationUtils";
import { ReviewsService } from "../../services/ReviewsService";

const namesRules = [
	{
		required: true,
		message: "Моля, въведете вашите имена!",
	},
	{
		type: "string",
		min: 5,
		message: "Полето трябва да съдържа поне 5 символа!",
	},
];

const ratingRules = [
	{
		required: true,
		message: "Моля, изберете оценка!",
	},
];

const reviewRules = [
	{
		required: true,
		message: "Моля, напишете вашия отзив!",
	},
	{
		type: "string",
		min: 15,
		max: 500,
		message: "Отзивът може да бъде с дължина между 15 и 500 символа!",
	},
];

const formItemLayout = {
	labelCol: { span: 2 },
};

const descReviewSort = (review, prevReview) => {
	const reviewTime = getDateObjectFromDateTimeString(review.created_on);
	const prevReviewTime = getDateObjectFromDateTimeString(prevReview.created_on);
	if (reviewTime > prevReviewTime) {
		return -1;
	} else if (reviewTime < prevReviewTime) {
		return 1;
	} else {
		return 0;
	}
};

const reviewsService = new ReviewsService();

function ReviewSection({ person, reviews, reviewDispatcher }) {
	const [form] = Form.useForm();

	function onSubmit(values) {
		try {
			const review = {
				id: "UUID", // This will be done in the backend
				person_id: person.id,
				rating: values.rating,
				text: values.review,
				posted_by: values.postedBy,
				created_on: "2021-09-27T10:25:00", // This will be done in the backend
			};

			reviewsService.addReview(review).then((response) => {
				if (hasValidResponseStatus(response, [200, 201]) && response.status === 201) {
					reviewDispatcher({ type: "add", item: review }); // the item must be response.data instead of review
					form.resetFields();
					message.success("Добавихте коментар!");
				}
			});
		} catch (err) {
			// Log error using a logging service
			message.error("Неуспешно добавяне на коментар!");
		}
	}

	function onSubmitFailed() {
		message.error("Неуспешно добавяне на коментар!");
	}

	return (
		<div className="reviewSectionContainer">
			<div className="reviewSectionTitle">Отзиви</div>
			<Divider />
			<div className="reviewSectionFormContainer">
				<Form layout="horizontal" form={form} onFinish={onSubmit} onFinishFailed={onSubmitFailed} {...formItemLayout}>
					<Form.Item name="postedBy" label="Имена" rules={namesRules}>
						<Input placeholder="Име Фамилия" />
					</Form.Item>
					<Form.Item name="rating" label="Оценка" rules={ratingRules}>
						<Rate />
					</Form.Item>
					<Form.Item name="review" label="Отзив" rules={reviewRules}>
						<Input.TextArea />
					</Form.Item>
					<Form.Item>
						<Button className="reviewSectionSubmitButton" type="primary" htmlType="submit">
							Добави отзив
						</Button>
					</Form.Item>
				</Form>
			</div>

			{
				reviews
					.sort(descReviewSort)
					.map((review) => (
						<Review review={review} key={review.created_on} />
					))
			}
		</div>
	);
}

export default ReviewSection;
