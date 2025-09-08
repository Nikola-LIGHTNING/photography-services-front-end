import "./PhotographersList.less";
import PhotographerPortfolio from "../PhotographerPortfolio/PhotographerPortfolio";

function PhotographersList({ photographers, setSelectedPhotographer }) {
	function buildPhotographerPortfolios() {
		if (!Array.isArray(photographers)) return null;
		return photographers.map((person) => (
			<PhotographerPortfolio
				key={person.id}
				person={person}
				setSelectedPhotographer={setSelectedPhotographer}
			/>
		));
	}

	return <div className="photographersListContainer">{buildPhotographerPortfolios()}</div>;
}

export default PhotographersList;
