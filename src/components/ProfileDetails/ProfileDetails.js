import "./ProfileDetails.less";
import { Image, Rate, Button } from "antd";
import React from "react";
import bulgariaFlag from '../../images/bulgariaflag.svg';
import { EditOutlined } from "@ant-design/icons";

function ProfileDetails({ person, reviews, isOwner, onEditClick }) {
	const reducer = (previousValue, currentValue) => previousValue + currentValue.rating;
	const rating = reviews.reduce(reducer, 0) / reviews.length;

	return (
		<div className="profileDetailsContainer">
			<div className="profileDetailsImgContainer">
				<Image 
					className="profileDetailsImage" 
					src={person.profileMediaUrl} 
					fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN" 
				/>
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
					<span>Професия: </span>
					{person.profession}
				</div>
				<div className="profileDetailsSummaryField">
					<span>Специализации: </span>
					{Array.isArray(person.workCategories) ? person.workCategories.join(", ") : ""}
				</div>
				<div className="profileDetailsSummaryField">
					<span>Работи в областите: </span>
					{Array.isArray(person.workProvinces) ? person.workProvinces.join(", ") : ""}
				</div>
				{isOwner && (
					<div className="profileDetailsSummaryField">
						<Button 
							type="primary" 
							icon={<EditOutlined />} 
							onClick={onEditClick}
							style={{ marginTop: 8 }}
						>
							Редактирай профил
						</Button>
					</div>
				)}

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
