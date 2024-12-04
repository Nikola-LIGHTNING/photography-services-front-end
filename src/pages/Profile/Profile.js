import "./Profile.less";
import Navbar from "../../components/Navbar/Navbar";
import ProfileSider from "../../components/ProfileSider/ProfileSider";
import ProfileDetails from "../../components/ProfileDetails/ProfileDetails";
import TextSection from "../../components/TextSection/TextSection";
import ReviewSection from "../../components/ReviewSection/ReviewSection";
import { Layout, Affix, FloatButton } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useReducer, useEffect } from "react";
import { ReviewService } from "../../services/ReviewService";
import { PeopleService } from "../../services/PeopleService";
import { WorkCategoryService } from "../../services/WorkCategoryService";
import { AboutMeService } from "../../services/AboutMeService";
import { hasValidResponseStatus } from "../../utils/ValidationUtils";

const PHOTOGRAPHER_CATEGORY = "photographer";

const { Content } = Layout;

const reviewService = new ReviewService();
const peopleService = new PeopleService();
const workCategoryService = new WorkCategoryService();
const aboutMeService = new AboutMeService();

function Profile() {
	const location = useLocation();
	const navigate = useNavigate();
	const [photographer, setPhotographer] = useState({});
	const [categories, setCategories] = useState({});
	const [aboutMe, setAboutMe] = useState({});
	const [collapsed, setCollapsed] = useState(false);
	const [reviews, dispatch] = useReducer(reviewsReducer, []);

	// Run only when component mounts to fetch required data
	useEffect(() => {
		const photographerUrlId = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);

		Promise.all([
			peopleService.getPersonByUrlId(photographerUrlId),
			workCategoryService.getWorkCategoriesByProfession(PHOTOGRAPHER_CATEGORY),
		]).then((responses) => {
			responses.forEach((response) => validateResponseStatus(response, [200]));
			setPhotographer(responses[0].data);
			setCategories(responses[1].data);
		});

		Promise.all([
			aboutMeService.getAboutMeByPersonId(photographer.id),
			reviewService.getReviewsOfPerson(photographer.id),
		]).then((responses) => {
			responses.forEach((response) => validateResponseStatus(response, [200]));
			setAboutMe(responses[0].data);
			dispatch({ type: "initialise", item: responses[1].data });
		});
	}, []);

	function reviewsReducer(state, action) {
		switch (action.type) {
			case "initialise":
				return [...action.item];
			case "add":
				return [...state, action.item];
			case "delete":
				return [...state.filter((review) => review.reviewId !== action.item.id)];
			case "clean":
				return [];
			default:
				throw new Error();
		}
	}

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
				<Layout className="profilePageLayout">
					<ProfileSider
						collapsed={collapsed}
						onCollapse={collapseSider}
						selectedPage="profile"
						photographer={photographer}
					/>
					<Content
						className="profilePageContent"
					// style={{
					// 	marginLeft: collapsed ? "50px" : "266px", // Adjust for the sider position: fixed
					// }}
					>
						<ProfileDetails photographer={photographer} reviews={reviews} />
						<TextSection title="За мен" text={aboutMe.text} />
						<ReviewSection person={photographer} reviews={reviews} reviewDispatcher={dispatch} />
						<div className="profilePageContentFooter" />
					</Content>
				</Layout>
			</Content>
		</Layout>
	);
}

export default Profile;
