import "./PhotographerDetails.less";
import { Image } from "antd";
import { Link } from "react-router-dom";

function PhotographerDetails({ person }) {
	return (
		<div className="photographerDetails">
			<Image className="photographerDetailsImage" src={person.profileImgSrc} />
			<div className="photographerDetailsText">
				<h5>
					<span>Имена: </span>
					{person.firstName + " " + person.lastName}
				</h5>
				<h5>
					<span>Телефон: </span>
					{person.phoneNumber}
				</h5>
				<h5>
					<span>Работи в областите: </span>
					{person.workArea.reduce((prev, curr) => prev + ", " + curr)}
				</h5>
				<h5>
					<Link to={{ pathname: `/people/${person.id}` }} state={{ selectedPage: "profile" }}>Профил</Link>
				</h5>
				<h5>
					<Link to={{ pathname: `/people/${person.id}/albums` }} state={{ selectedPage: "albums" }}>
						Албуми
					</Link>
				</h5>
				<h5>
					<Link to={{ pathname: `/people/${person.id}/pricing` }} state={{ selectedPage: "pricing" }}>
						Ценоразпис
					</Link>
				</h5>
			</div>
		</div>
	);
}

export default PhotographerDetails;
