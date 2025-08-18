import "./ProfileDetails.less";
import { Image, Rate } from "antd";
import React from "react";
import bulgariaFlag from '../../images/bulgariaflag.svg';

function ProfileDetails({ person, reviews }) {
	const reducer = (previousValue, currentValue) => previousValue + currentValue.rating;
	const rating = reviews.reduce(reducer, 0) / reviews.length;

	return (
		<div className="profileDetailsContainer">
			<div className="profileDetailsImgContainer">
				<Image className="profileDetailsImage" src={person.profileImgSrc} />
			</div>
			<div className="profileDetailsSummaryContainer">
				<div className="profileDetailsName">
					{person.firstName + " " + person.lastName}
					<img
						className="profileDetailsCountryImg"
						src={bulgariaFlag}
						alt="Failed to load"
					/>
				</div>
				<div className="profileDetailsSummaryField">
					<span>Телефон: </span>
					{person.phoneNumber}
				</div>
				<div className="profileDetailsSummaryField">
					<span>Пол: </span>
					{person.gender}
				</div>
				<div className="profileDetailsSummaryField">
					<span>Работи в областите: </span>
					{person.workProvinces && person.workProvinces.reduce((prev, curr) => prev + ", " + curr)}
				</div>
			</div>
			{reviews.length > 0 && (
				<div className="profileDetailsRatingContainer">
					<Rate className="profileDetailsRating" disabled allowHalf value={rating} />
					<span>
						({rating.toFixed(2)} от {reviews.length} отзива)
					</span>
				</div>
			)}
		</div>
	);
}

export default ProfileDetails;
