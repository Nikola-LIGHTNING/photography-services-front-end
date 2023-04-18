import "./ProfileDetails.less";
import { Image, Rate } from "antd";
import React from "react";

function ProfileDetails({ photographer, reviews }) {
	const reducer = (previousValue, currentValue) => previousValue + currentValue.rating;
	const rating = reviews.reduce(reducer, 0) / reviews.length;

	return (
		<div className="profileDetailsContainer">
			<div className="profileDetailsImgContainer">
				<Image className="profileDetailsImage" src={photographer.profileImgSrc} />
			</div>
			<div className="profileDetailsSummaryContainer">
				<div className="profileDetailsName">
					{photographer.firstName + " " + photographer.lastName}
					<img
						className="profileDetailsCountryImg"
						src={require("../../images/bulgariaflag.svg").default}
						alt="Failed to load"
					/>
				</div>
				<div className="profileDetailsSummaryField">
					<span>Телефон: </span>
					{photographer.phoneNumber}
				</div>
				<div className="profileDetailsSummaryField">
					<span>Пол: </span>
					{photographer.gender}
				</div>
				<div className="profileDetailsSummaryField">
					<span>Работи в областите: </span>
					{photographer.workArea && photographer.workArea.reduce((prev, curr) => prev + ", " + curr)}
				</div>
			</div>
			<div className="profileDetailsRatingContainer">
				<Rate className="profileDetailsRating" disabled allowHalf value={rating} />
				<span>
					({rating.toFixed(2)} от {reviews.length} отзива)
				</span>
			</div>
		</div>
	);
}

export default ProfileDetails;
