import "./AlbumCard.less";

function AlbumCard({ title, coverImageSrc }) {
	return (
		<div className="albumCardContainer ant-card-hoverable">
			<div className="albumCardCoverContainer">
				<img className="albumCardCoverImg" src={coverImageSrc.default} alt="" />
			</div>
			<div className="albumCardTitleContainer">
				<div className="albumCardTitle">{title}</div>
			</div>
		</div>
	);
}

export default AlbumCard;
