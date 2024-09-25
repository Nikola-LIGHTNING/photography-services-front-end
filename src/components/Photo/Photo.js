import "./Photo.less";
import { Image } from "antd";

function Photo({ title, coverImageSrc, onClick }) {
	return (
		<div className="photoContainer ant-card-hoverable" onClick={onClick}>
			<div className="photoCoverContainer">
				<Image className="photoImg" src={coverImageSrc} alt="" />
			</div>
		</div>
	);
}

export default Photo;
