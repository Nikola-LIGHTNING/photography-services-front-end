import "./HomeContent.less";
import React, { useState } from "react";
import { Layout, Button } from "antd";
import { RightCircleFilled, ArrowRightOutlined } from "@ant-design/icons";

const { Content } = Layout;

function HomeContent({ homeContentId, imgSrc, btnText }) {
	const [buttonHover, setButtonHover] = useState(false);

	const onBtnHover = () => {
		setButtonHover(!buttonHover);
	};

	return (
		<Content id={homeContentId} className="homeContent">
			<div className="homeBackgroundContainer">
				<img className="homeBackgroundImage" src={imgSrc.default} alt="" />
			</div>
			<div className="homeContentButtonContainer">
				<Button
					id="homeContentButton"
					size="large"
					type={buttonHover ? "primary" : "default"}
					shape="round"
					ghost={buttonHover ? false : true}
					onMouseEnter={onBtnHover}
					onMouseLeave={onBtnHover}
				>
					{btnText} {buttonHover ? <RightCircleFilled /> : <ArrowRightOutlined />}
				</Button>
			</div>
		</Content>
	);
}

export default HomeContent;
