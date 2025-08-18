import "./PhotographerPortfolio.less";
import { Card } from "antd";
import AlbumCard from "../AlbumCard/AlbumCard";
import { Link, useNavigate } from "react-router-dom";
import coverOne from '../../images/GN-821.jpg';
import coverTwo from '../../images/bal.jpg';
import coverThree from '../../images/kryshtene.jpg';
import coverFour from '../../images/ogosta_3.jpg';

function PhotographerPortfolio({ person, setSelectedPhotographer }) {
	const navigate = useNavigate();

	// Get use callback to backend and then use map to setCoverImageSrc to each album. Empty array if callback fails
	const albums = [
		{
			id: "1",
			title: "Сватбата на Галя и Никола",
			urlIdentifier: "svatba.nikola.galya",
			coverImageSrc: coverOne,
		},
		{
			id: "2",
			title: "Абитуриентски бал",
			urlIdentifier: "2019.bal.gpche.12a",
			coverImageSrc: coverTwo,
		},
		{
			id: "3",
			title: "Кръщeнето на Иванчо",
			urlIdentifier: "kryshtene.ivancho.21.03.2019",
			coverImageSrc: coverThree,
		},
		{
			id: "4",
			title: "Монтански пейзажи",
			urlIdentifier: "priroda.montana",
			coverImageSrc: coverFour,
		},
	];

	function buildShowMore() {
		const showMoreUrl = `/people/${person.id}/albums`;
		return (
			<Link className="portfolioShowMore" to={showMoreUrl}>
				Към албуми
			</Link>
		);
	}

	function onPortfolioClick(event) {
		console.log(event);
		setSelectedPhotographer(person);
	}

	function buildAlbums() {
		return albums.map((album) => (
			<AlbumCard
				key={album.urlIdentifier}
				title={album.title}
				coverImageSrc={album.coverImageSrc}
				onClick={() => navigate(`/people/${person.id}/albums/${album.urlIdentifier}`)}
			/>
		));
	}

	return (
		<div className="photographerPortfolioContainer" onClick={onPortfolioClick}>
			<Card hoverable title={person.firstName + " " + person.lastName} extra={buildShowMore()}>
				<div className="portfolioContent">{buildAlbums()}</div>
			</Card>
		</div>
	);
}

export default PhotographerPortfolio;
