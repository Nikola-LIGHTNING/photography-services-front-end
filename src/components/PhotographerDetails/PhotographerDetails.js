import "./PhotographerDetails.less";
import { Image } from "antd";
import { Link } from "react-router-dom";

function PhotographerDetails({ photographer }) {
	return (
		<div className="photographerDetails">
			<Image className="photographerDetailsImage" src={photographer.profileImgSrc} />
			<div className="photographerDetailsText">
				<h5>Имена: {photographer.firstName + " " + photographer.lastName}</h5>
				<h5>Телефон: {photographer.phoneNumber}</h5>
				<h5>Работи в областите: {photographer.workArea.reduce((prev, curr) => prev + ", " + curr)}</h5>
				<h5>
					<Link to={`/photographers/${photographer.id}/prices`}>Ценоразпис</Link>
				</h5>
				<h5>
					<Link to={`/photographers/${photographer.id}`}>Профил</Link>
				</h5>
			</div>
		</div>
	);
}

export default PhotographerDetails;
