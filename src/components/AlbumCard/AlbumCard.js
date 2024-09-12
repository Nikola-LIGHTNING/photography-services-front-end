import "./AlbumCard.less";

function AlbumCard({ title, coverImageSrc, onClick }) {
	return (
		<div className="albumCardContainer ant-card-hoverable" onClick={onClick}>
			<div className="albumCardCoverContainer">
				<div className="albumCardImg">
					<img src={coverImageSrc} alt="" />
				</div>
				<div className="albumCardTitle">{title}</div>
			</div>
		</div>
	);
}

export default AlbumCard;
