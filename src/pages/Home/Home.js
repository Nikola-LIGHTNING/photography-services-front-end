import { Layout, Affix, FloatButton } from "antd";
import Navbar from "../../components/Navbar/Navbar";
import HomeContent from "../../components/HomeContent/HomeContent";
import Footer from "../../components/Footer/Footer";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";

function scrollToTop() {
	scroll.scrollToTop({
		duration: 500,
		delay: 0,
		smooth: "easeInOutQuint",
	});
}

function Home() {
	const history = useHistory();

	// On page load scroll to top
	useEffect(() => {
		scrollToTop();
	}, []);

	function handleHomeContentBtnClick(category, categoryKey) {
		history.push({ pathname: "/services", state: { selectedCategory: category, selectedTab: categoryKey } });
	}

	// Load from backend API callback
	const categories = {
		events: [
			{
				key: "wedding",
				value: "Сватбена фотография",
			},
			{
				key: "baptism",
				value: "Кръщене",
			},
			{
				key: "prom",
				value: "Абитуриенти",
			},
			{
				key: "family",
				value: "Семейна фотосесия",
			},
			{
				key: "party",
				value: "Празненство",
			},
			{
				key: "birthday",
				value: "Рожден ден",
			},
		],
		other: [
			{
				key: "photoBook",
				value: "Фотокниги",
			},
			{
				key: "photoEdit",
				value: "Обработка на снимки",
			},
		],
	};

	return (
		<div>
			<Layout>
				<FloatButton.BackTop duration="800" />
				<Affix>
					<Navbar selectedTab="home" categories={categories} />
				</Affix>

				<HomeContent
					homeContentId="homeWeddingContent"
					imgSrc={require("../../images/GN-821.jpg")}
					btnText="Сватбена фотография"
					onClick={() => handleHomeContentBtnClick("Сватбена фотография", "services_wedding")}
				/>
				<HomeContent
					homeContentId="homePromContent"
					imgSrc={require("../../images/bal.jpg")}
					btnText="Абитуриенти"
					onClick={() => handleHomeContentBtnClick("Абитуриенти", "services_prom")}
				/>
				<HomeContent
					homeContentId="homeBaptismContent"
					imgSrc={require("../../images/kryshtene.jpg")}
					btnText="Кръщене"
					onClick={() => handleHomeContentBtnClick("Кръщене", "services_baptism")}
				/>
				<HomeContent
					homeContentId="homeFamilyContent"
					imgSrc={require("../../images/family3.jpg")}
					btnText="Семейна фотосесия"
					onClick={() => handleHomeContentBtnClick("Семейна фотосесия", "services_family")}
				/>
				<Footer />
			</Layout>
		</div>
	);
}

export default Home;
