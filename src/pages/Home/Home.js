import { Layout, Affix, FloatButton } from "antd";
import Navbar from "../../components/Navbar/Navbar";
import HomeContent from "../../components/HomeContent/HomeContent";
import Footer from "../../components/Footer/Footer";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import coverOne from '../../images/GN-821.jpg';
import coverTwo from '../../images/bal.jpg';
import coverThree from '../../images/kryshtene.jpg';
import coverFour from '../../images/ogosta_3.jpg';

function scrollToTop() {
	scroll.scrollToTop({
		duration: 500,
		delay: 0,
		smooth: "easeInOutQuint",
	});
}

function Home() {
	const navigate = useNavigate();

	// On page load scroll to top
	useEffect(() => {
		scrollToTop();
	}, []);

	function handleHomeContentBtnClick(category, categoryKey) {
		navigate("/services", { state: { selectedCategory: category, selectedTab: categoryKey } });
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
					imgSrc={coverOne}
					btnText="Сватбена фотография"
					onClick={() => handleHomeContentBtnClick("Сватбена фотография", "services_wedding")}
				/>
				<HomeContent
					homeContentId="homePromContent"
					imgSrc={coverTwo}
					btnText="Абитуриенти"
					onClick={() => handleHomeContentBtnClick("Абитуриенти", "services_prom")}
				/>
				<HomeContent
					homeContentId="homeBaptismContent"
					imgSrc={coverThree}
					btnText="Кръщене"
					onClick={() => handleHomeContentBtnClick("Кръщене", "services_baptism")}
				/>
				<HomeContent
					homeContentId="homeFamilyContent"
					imgSrc={coverFour}
					btnText="Семейна фотосесия"
					onClick={() => handleHomeContentBtnClick("Семейна фотосесия", "services_family")}
				/>
				<Footer />
			</Layout>
		</div>
	);
}

export default Home;
