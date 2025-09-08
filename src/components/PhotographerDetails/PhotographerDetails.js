import "./PhotographerDetails.less";
import { Image } from "antd";
import { Link } from "react-router-dom";

function PhotographerDetails({ person = {} }) {
	return (
		<div className="photographerDetails">
			<Image className="photographerDetailsImage" src={person.profileMediaUrl} fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN" />
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
