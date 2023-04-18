import Divider from "../Divider/Divider";
import "./TextSection.less";

function TextSection({ title, text }) {
	return (
		<div className="textSectionContainer">
			<div className="textSectionTitle">{title}</div>
			<Divider />
			<div className="textSectionText">{text}</div>
		</div>
	);
}

export default TextSection;
