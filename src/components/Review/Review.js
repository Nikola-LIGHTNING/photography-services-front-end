import "./Review.less";
import Divider from "../Divider/Divider";
import { getLocalDateFromDateTimeString } from "../../utils/LocalDateTimeParser";
import { Rate, Button, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

function Review({ review, isOwner, onDelete }) {
	const prettyfiedCreatedOn = getLocalDateFromDateTimeString(review.createdOn);

	return (
		<div className="reviewContainer">
			<div className="reviewSummary">
				<div className="reviewInfo">
					<div>
						{review.name} <span className="reviewCreatedOn">{prettyfiedCreatedOn}</span>
					</div>
					<Rate disabled allowHalf value={review.rating} />
				</div>
				{isOwner && (
					<Popconfirm
						title="Изтриване на отзив"
						description="Сигурни ли сте, че искате да изтриете този отзив?"
						okText="Да"
						cancelText="Не"
						onConfirm={() => onDelete(review.reviewId)}
					>
						<Button 
							type="text" 
							danger 
							size="small"
							icon={<DeleteOutlined />}
							className="reviewDeleteButton"
						/>
					</Popconfirm>
				)}
			</div>
			<div className="reviewText">{review.comment}</div>
			<Divider />
		</div>
	);
}

export default Review;
