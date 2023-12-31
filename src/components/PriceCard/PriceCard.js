import "./PriceCard.less";
import { Button } from 'antd';
import { CalendarFilled, CheckOutlined } from '@ant-design/icons';

function buildFeaturesList(featureList) {
	if (featureList) {
		return featureList.map((value) => (
			<p key={"feature_" + value}>
				<CheckOutlined style={{ color: "#26c281" }} />&nbsp;&nbsp;{value}
			</p>
		));
	}
}

function PriceCard({ price }) {
	return (
		<div className="priceCardContainer">
			<div className="priceCardUpperContainer">
				<div className="priceCardTitle">{price.title}</div>
				<div className="priceCardPrice">{price.price} {price.currency}</div>
				<div className="priceCardButton">
					<Button type="primary" block="true" size="large">
						Запази сега <CalendarFilled />
					</Button>
				</div>
				<div className="priceCardDescription">{price.description}</div>
			</div>
			<div className="priceCardLowerContainer">
				{buildFeaturesList(price.features)}
			</div>
		</div>
	);
}

export default PriceCard;
