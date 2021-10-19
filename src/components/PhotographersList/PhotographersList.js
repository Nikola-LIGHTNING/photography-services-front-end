import "./PhotographersList.less";
import PhotographerPortfolio from "../PhotographerPortfolio/PhotographerPortfolio";

function PhotographersList({ photographers, setSelectedPhotographer }) {
	function buildPhotographerPortfolios() {
		if (photographers) {
			return photographers.map((photographer) => (
				<PhotographerPortfolio
					key={photographer.id}
					photographer={photographer}
					setSelectedPhotographer={setSelectedPhotographer}
				/>
			));
		}
	}

	return <div className="photographersListContainer">{buildPhotographerPortfolios()}</div>;
}

export default PhotographersList;
