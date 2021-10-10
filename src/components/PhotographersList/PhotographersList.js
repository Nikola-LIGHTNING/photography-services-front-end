import "./PhotographersList.less";
import PhotographerPortfolio from "../PhotographerPortfolio/PhotographerPortfolio";

function PhotographersList({ photographers, setSelectedPhotographer }) {
	function buildPhotographerPortfolios() {
		if (photographers) {
			return photographers.map((photographer) => (
				<PhotographerPortfolio photographer={photographer} setSelectedPhotographer={setSelectedPhotographer} />
			));
		}
	}

	return (
		<div className="photographersListContainer">
			{/* Make all photographerPortfolioContainers into a list and assign them a key */}
			{buildPhotographerPortfolios()}

			{/* <div className="photographerPortfolioContainer">
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
			</div> */}
		</div>
	);
}

export default PhotographersList;
