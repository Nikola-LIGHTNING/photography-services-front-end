import "./PhotographerPortfolio.less";
import { Card } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import AlbumCard from "../AlbumCard/AlbumCard";

function PhotographerPortfolio({ photographer, setSelectedPhotographer }) {
	// Get use callback to backend and then use map to setCoverImageSrc to each album
	const albums = [
		{
			id: "1",
			title: "Сватбата на Галя и Никола",
			coverImageSrc: require("../../images/GN-821.jpg"),
		},
		{
			id: "2",
			title: "Абитуриентски бал",
			coverImageSrc: require("../../images/bal.jpg"),
		},
		{
			id: "3",
			title: "Кръщeнето на Иванчо",
			coverImageSrc: require("../../images/kryshtene.jpg"),
		},
	];

	function onPortfolioClick(event) {
		console.log(event);
		setSelectedPhotographer(photographer);
	}

	function onAlbumCardClick(event) {
		console.log("Clicked on album card. Event: ");
		console.log(event);

		event.stopPropagation(); // Stops from additional onClick events in the Card component iteslf
	}

	return (
		<div className="photographerPortfolioContainer" test={photographer} onClick={onPortfolioClick}>
			<Card hoverable title={photographer.firstName + " " + photographer.lastName} className="photographerPortfolio">
				<div className="portfolioContent">
					<AlbumCard title={albums[0].title} coverImageSrc={albums[0].coverImageSrc} onClick={onAlbumCardClick} />
					<AlbumCard title={albums[1].title} coverImageSrc={albums[1].coverImageSrc} onClick={onAlbumCardClick} />
					<AlbumCard title={albums[2].title} coverImageSrc={albums[2].coverImageSrc} onClick={onAlbumCardClick} />
					<div className="portfolioShowMore">
						<ArrowRightOutlined />
					</div>
				</div>
			</Card>
		</div>
	);
}

export default PhotographerPortfolio;
