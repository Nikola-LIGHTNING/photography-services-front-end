import "./Pricing.less";
import Navbar from "../../components/Navbar/Navbar";
import ProfileSider from "../../components/ProfileSider/ProfileSider";
import { Layout, Affix, FloatButton } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { PeopleService } from "../../services/PeopleService";
import { CategoriesService } from "../../services/CategoriesService";
import { hasValidResponseStatus } from "../../utils/ValidationUtils";
import PriceCard from "../../components/PriceCard/PriceCard";

const PHOTOGRAPHER_CATEGORY = "photographer";

const { Content } = Layout;

const peopleService = new PeopleService();
const categoriesService = new CategoriesService();

function Pricing() {
	const location = useLocation();
	const navigate = useNavigate();
	const [photographer, setPhotographer] = useState({});
	const [categories, setCategories] = useState({});
	const [collapsed, setCollapsed] = useState(false);

	const price = {
		title: "Фотография и видео",
		price: "1000",
		currency: "лв.",
		description: "Качествено заснемане от един фотограф",
		features: [
			"1000 снимки",
			"10 часа",
			"По 200 лева за всеки допълнителен час преди полунощ",
			"По 300 лева за всеки допълнителен час след полунощ",
		]
	}

	// Run only when component mounts to fetch required data
	useEffect(() => {
		const photographerUrlId = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);

		Promise.all([
			peopleService.getPersonByUrlId(photographerUrlId),
			categoriesService.getCategoriesByProfession(PHOTOGRAPHER_CATEGORY),
		]).then((responses) => {
			responses.forEach((response) => validateResponseStatus(response, [200]));
			setPhotographer(responses[0].data);
			setCategories(responses[1].data);
		});

	}, []);

	function validateResponseStatus(response, validStatusesList) {
		if (!hasValidResponseStatus(response, validStatusesList)) {
			navigate("/info/unknownerror");
		}
	}

	function collapseSider(collapsed) {
		setCollapsed(collapsed);
	}

	return (
		<Layout>
			<FloatButton.BackTop duration="800" />
			<Affix>
				<Navbar selectedTab={"photographers"} categories={categories} />
			</Affix>
			<Content>
				<Layout className="pricingPageLayout">
					<ProfileSider
						collapsed={collapsed}
						onCollapse={collapseSider}
						selectedPage="pricing"
						photographer={photographer}
					/>
					<Content className="pricingPageContent">
						<div className="pricingListContainer">
							<PriceCard price={price}/>
							<PriceCard price={price}/>
							<PriceCard price={price}/>
							<PriceCard price={price}/>
							<PriceCard price={price}/>
						</div>
						<div className="pricingPageContentFooter" />
					</Content>
				</Layout>
			</Content>
		</Layout>
	);
}

export default Pricing;
