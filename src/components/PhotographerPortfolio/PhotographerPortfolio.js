import "./PhotographerPortfolio.less";
import { Card } from "antd";
import AlbumCard from "../AlbumCard/AlbumCard";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AlbumService } from "../../services/AlbumService";

function PhotographerPortfolio({ person, setSelectedPhotographer }) {
	const navigate = useNavigate();
	const albumService = new AlbumService();
	const [albums, setAlbums] = useState([]);

	useEffect(() => {
		if (!person || !person.id) {
			setAlbums([]);
			return;
		}

		(async () => {
			const resp = await albumService.getAlbumsByPerson(person.id);
			const mapped = resp.data.albums.map(a => ({
				id: a.albumId?.toString(),
				title: a.title,
				urlIdentifier: a.albumId?.toString(),
				coverImageSrc: a.coverDownloadUrl || null,
				coverMediaId: a.coverMediaId
			}));
			setAlbums(mapped);
		})();
	}, [person?.id]);

	// albums state is populated from backend

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
		if (!albums || albums.length === 0) 
			return null;

		return albums.map((album) => (
			<AlbumCard
				key={album.id}
				title={album.title}
				coverImageSrc={album.coverImageSrc}
				onClick={() => navigate(`/people/${person.id}/albums/${album.id}`)}
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
