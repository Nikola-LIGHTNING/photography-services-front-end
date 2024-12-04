import "./Review.less";
import Divider from "../Divider/Divider";
import { getLocalDateFromDateTimeString, getLocalTimeFromDateTimeString } from "../../utils/LocalDateTimeParser";
import { Rate } from "antd";

function Review({ review }) {
	const prettyfiedCreatedOn =
		getLocalTimeFromDateTimeString(review.createdOn) + " " + getLocalDateFromDateTimeString(review.createdOn);

	return (
		<div className="reviewContainer">
			<div className="reviewSummary">
				<div>
					{review.name} <span className="reviewCreatedOn">{prettyfiedCreatedOn}</span>
				</div>
				<Rate disabled allowHalf value={review.rating} />
			</div>
			<div className="reviewText">{review.comment}</div>
			<Divider />
		</div>
	);
}

export default Review;
