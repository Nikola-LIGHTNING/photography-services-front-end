import "./PriceCard.less";
import { Button, Popconfirm } from 'antd';
import { CalendarFilled, CheckOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

function buildFeaturesList(featureList) {
	if (featureList) {
		return featureList.map((value) => (
			<p key={"feature_" + value}>
				<CheckOutlined style={{ color: "#26c281" }} />&nbsp;&nbsp;{value}
			</p>
		));
	}
}

function PriceCard({ price, isOwner = false, onEdit, onDelete }) {
		return (
		<div className="priceCardContainer">
			<div className="priceCardUpperContainer">
				<div className="priceCardTitle">
					{price.title}
					<div className="priceCardTitleUnderline"></div>
				</div>
				<div className="priceCardPrice">{price.startingPrice} {price.currency}</div>
				<div className="priceCardHours">{price.startingPriceHours} часа включени</div>
				<div className="priceCardDescription">{price.description}</div>
			</div>
			<div className="priceCardBottomContainer">
				<div className="priceCardButton">
					<Button type="primary" block="true" size="large">
						Запази сега <CalendarFilled />
					</Button>
				</div>
				{isOwner && (
					<div className="priceCardActions">
						<Button 
							type="text" 
							icon={<EditOutlined />}
							size="small"
							className="priceCardEditButton"
							onClick={() => onEdit(price)}
						>
							Редактирай
						</Button>
						<Popconfirm
							title="Изтриване на ценоразпис"
							description="Сигурни ли сте, че искате да изтриете този ценоразпис?"
							okText="Да"
							cancelText="Не"
							onConfirm={() => onDelete(price.pricingId)}
						>
							<Button 
								type="text" 
								danger
								icon={<DeleteOutlined />}
								size="small"
								className="priceCardDeleteButton"
							>
								Изтрий
							</Button>
						</Popconfirm>
					</div>
				)}
			</div>
		</div>
	);
}

export default PriceCard;
