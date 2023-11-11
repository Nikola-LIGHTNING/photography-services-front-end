import "./PhotographerDetails.less";
import { Image } from "antd";
import { Link } from "react-router-dom";

function PhotographerDetails({ photographer }) {
	return (
		<div className="photographerDetails">
			<Image className="photographerDetailsImage" src={photographer.profileImgSrc} />
			<div className="photographerDetailsText">
				<h5>
					<span>Имена: </span>
					{photographer.firstName + " " + photographer.lastName}
				</h5>
				<h5>
					<span>Телефон: </span>
					{photographer.phoneNumber}
				</h5>
				<h5>
					<span>Работи в областите: </span>
					{photographer.workArea.reduce((prev, curr) => prev + ", " + curr)}
				</h5>
				<h5>
					<Link to={{ pathname: `/photographers/${photographer.id}` }} state={{ selectedPage: "profile" }}>Профил</Link>
				</h5>
				<h5>
					<Link to={{ pathname: `/photographers/${photographer.id}/albums` }} state={{ selectedPage: "albums" }}>
						Албуми
					</Link>
				</h5>
				<h5>
					<Link to={{ pathname: `/photographers/${photographer.id}/pricing` }} state={{ selectedPage: "pricing" }}>
						Ценоразпис
					</Link>
				</h5>
			</div>
		</div>
	);
}

export default PhotographerDetails;
