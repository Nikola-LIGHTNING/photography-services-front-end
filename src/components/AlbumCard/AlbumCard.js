import "./AlbumCard.less";

function AlbumCard({ title, coverImageSrc, onClick }) {
	return (
		<div className="albumCardContainer ant-card-hoverable" onClick={onClick}>
			<div className="albumCardCoverContainer">
				<img className="albumCardCoverImg" src={coverImageSrc} alt="" />
			</div>
			<div className="albumCardTitleContainer">
				<div className="albumCardTitle">{title}</div>
			</div>
		</div>
	);
}

export default AlbumCard;
