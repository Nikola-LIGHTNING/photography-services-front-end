import "./PhotographersList.less";
import { Card } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import AlbumCard from "../AlbumCard/AlbumCard";

function PhotographersList() {
	return (
		<div className="photographersListContainer">
			{/* Make all photographerPortfolioContainers into a list and assign them a key */}
			<div className="photographerPortfolioContainer">
				<Card hoverable title="Фотограф Фотографов" className="photographerPortfolio">
					<div className="portfolioContent">
						<AlbumCard title="Сватбата на Галя и Никола" coverImageSrc={require("../../images/GN-821.jpg")} />
						<AlbumCard title="Абитуриентски бал" coverImageSrc={require("../../images/bal.jpg")} />
						<AlbumCard title="Кръщeнето на Иванчо" coverImageSrc={require("../../images/kryshtene.jpg")} />
						<div className="portfolioShowMore">
							<ArrowRightOutlined />
						</div>
					</div>
				</Card>
			</div>
			<div className="photographerPortfolioContainer">
				<Card hoverable title="Кольо Пирата" className="photographerPortfolio">
					<div className="portfolioContent">
						<AlbumCard title="Природа в Монтаска област" coverImageSrc={require("../../images/ogosta.jpg")} />
						<AlbumCard title="Семейство Цветкови 2019" coverImageSrc={require("../../images/family2.jpg")} />
						<AlbumCard title="Семейство Цветкови 2020" coverImageSrc={require("../../images/family3.jpg")} />
						<div className="portfolioShowMore">
							<ArrowRightOutlined />
						</div>
					</div>
				</Card>
			</div>
		</div>
	);
}

export default PhotographersList;
