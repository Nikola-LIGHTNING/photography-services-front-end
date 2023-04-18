import "./Review.less";
import { getLocalDateFromDateTimeString, getLocalTimeFromDateTimeString } from "../../utils/LocalDateTimeParser";
import { Rate } from "antd";

function Review({ review }) {
	const prettyfiedCreatedOn =
		getLocalTimeFromDateTimeString(review.created_on) + " " + getLocalDateFromDateTimeString(review.created_on);

	return (
		<div className="reviewContainer">
			<div className="reviewSummary">
				<div>
					{review.posted_by} <span className="reviewCreatedOn">{prettyfiedCreatedOn}</span>
				</div>
				<Rate disabled allowHalf value={review.rating} />
			</div>
			<div className="reviewText">{review.text}</div>
		</div>
	);
}

export default Review;
