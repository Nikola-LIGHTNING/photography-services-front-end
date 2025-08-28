import "./PhotographerDetails.less";
import { Image } from "antd";
import { Link } from "react-router-dom";

function PhotographerDetails({ person = {} }) {
	return (
		<div className="photographerDetails">
			<Image className="photographerDetailsImage" src={person.profileImgSrc} />
			<div className="photographerDetailsText">
				{person.firstName && person.lastName && (
					<h5>
						<span>Имена: </span>
						{`${person.firstName} ${person.lastName}`}
					</h5>
				)}
				{person.phoneNumber && (
					<h5>
						<span>Телефон: </span>
						{person.phoneNumber}
					</h5>
				)}
				{person.workProvinces && person.workProvinces.length > 0 && (
					<h5>
						<span>Работи в областите: </span>
						{Array.from(person.workProvinces).join(", ")}
					</h5>
				)}
				{person.id && (
					<>
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
					</>
				)}
			</div>
		</div>
	);
}

export default PhotographerDetails;
