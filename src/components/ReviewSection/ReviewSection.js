import "./ReviewSection.less";
import Divider from "../Divider/Divider";
import Review from "../Review/Review";
import { getDateObjectFromDateTimeString } from "../../utils/LocalDateTimeParser";
import { Form, Input, message, Button, Rate } from "antd";
import { hasValidResponseStatus } from "../../utils/ValidationUtils";
import { ReviewService } from "../../services/ReviewService";

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
	const reviewTime = getDateObjectFromDateTimeString(review.createdOn);
	const prevReviewTime = getDateObjectFromDateTimeString(prevReview.createdOn);
	if (reviewTime > prevReviewTime) {
		return -1;
	} else if (reviewTime < prevReviewTime) {
		return 1;
	} else {
		return 0;
	}
};

const reviewsService = new ReviewService();

function ReviewSection({ person, reviews, reviewDispatcher }) {
	const [form] = Form.useForm();

	function onSubmitFailed() {
		message.error("Неуспешно добавяне на коментар!");
	}

	function onSubmit(values) {
		try {
			const review = {				
				personId: person.id,
				rating: values.rating,
				comment: values.comment,
				name: values.name
			};

			reviewsService.addReview(review)
				.then((response) => {
					if (hasValidResponseStatus(response, [200, 201]) && response.status === 201) {
						reviewDispatcher({ type: "add", item: review }); // the item must be response.data instead of review
						form.resetFields();
						message.success("Добавихте коментар!");
					} else {
						onSubmitFailed();
					}
				});
		} catch (err) {
			// Log error using a logging service
			onSubmitFailed();
		}
	}	

	return (
		<div className="reviewSectionContainer">
			<div className="reviewSectionTitle">Отзиви</div>
			<Divider />
			<div className="reviewSectionFormContainer">
				<Form layout="horizontal" form={form} onFinish={onSubmit} onFinishFailed={onSubmitFailed} {...formItemLayout}>
					<Form.Item name="name" label="Имена" rules={namesRules}>
						<Input placeholder="Име Фамилия" />
					</Form.Item>
					<Form.Item name="rating" label="Оценка" rules={ratingRules}>
						<Rate />
					</Form.Item>
					<Form.Item name="comment" label="Отзив" rules={reviewRules}>
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
						<Review review={review} key={review.createdOn} />
					))
			}
		</div>
	);
}

export default ReviewSection;
