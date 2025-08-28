import "./AlbumCard.less";
import placeholder from "../../images/film.png";
import { Skeleton } from 'antd';
import { useState, useEffect } from 'react';

function AlbumCard({ title, coverImageSrc, onClick }) {
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		setLoaded(false);
	}, [coverImageSrc]);

	return (
		<div className="albumCardContainer ant-card-hoverable" onClick={onClick}>
			<div className="albumCardCoverContainer">
				<div className="albumCardImg">
					{!loaded && (
						<Skeleton.Image active style={{ width: 500, height: 300 }} />
					)}
					<img
						src={coverImageSrc || placeholder}
						alt=""
						style={{ display: loaded ? 'block' : 'none' }}
						onLoad={() => setLoaded(true)}
					/>
				</div>
				<div className="albumCardTitle">{title}</div>
			</div>
		</div>
	);
}

export default AlbumCard;
