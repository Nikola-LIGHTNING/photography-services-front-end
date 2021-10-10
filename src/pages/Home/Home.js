import { Layout, Affix, BackTop } from "antd";
import Navbar from "../../components/Navbar/Navbar";
import HomeContent from "../../components/HomeContent/HomeContent";
import Footer from "../../components/Footer/Footer";
import React, { useState, useReducer } from "react";
import Photographers from "../Photographers/Photographers";
import { animateScroll as scroll } from "react-scroll";

function scrollToTop() {
	scroll.scrollToTop({
		duration: 500,
		delay: 0,
		smooth: "easeInOutQuint",
	});
}

function selectedCategoriesReducer(state, action) {
	switch (action.type) {
		case "add":
			if (!state.includes(action.item)) {
				state.push(action.item);
			}
			return state;
		case "delete":
			if (state.includes(action.item)) {
				state.splice(state.indexOf(action.item), 1);
			}
			return state;
		case "clean":
			return [];
		default:
			throw new Error();
	}
}

function Home() {
	const [selectedTab, setSelectedTab] = useState("home");
	const [selectedCategories, dispatch] = useReducer(selectedCategoriesReducer, []);

	function handleNavbarItemClick(event) {
		scrollToTop();
		if (event.key.startsWith("photographers_")) {
			dispatch({ type: "clean" });
			dispatch({ type: "add", item: event.domEvent.target.innerText });
		} else if (event.key === "photographers") {
			categories.events.forEach((event) => dispatch({ type: "add", item: event.value }));
			categories.other.forEach((other) => dispatch({ type: "add", item: other.value }));
		}

		setSelectedTab(event.key);
	}

	function handleHomeContentBtnClick(category, categoryKey) {
		scrollToTop();
		dispatch({ type: "clean" });
		dispatch({ type: "add", item: category });

		setSelectedTab(categoryKey);
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

	function renderMainContent() {
		if (selectedTab.startsWith("photographers")) {
			return (
				<Photographers
					categories={categories}
					selectedCategories={selectedCategories}
					addSelectedCategory={(value) => dispatch({ type: "add", item: value })}
					removeSelectedCategory={(value) => dispatch({ type: "delete", item: value })}
				/>
			);
		} else {
			return (
				<>
					<HomeContent
						homeContentId="homeWeddingContent"
						imgSrc={require("../../images/GN-821.jpg")}
						btnText="Сватбена фотография"
						onClick={() => handleHomeContentBtnClick("Сватбена фотография", "photographers_wedding")}
					/>
					<HomeContent
						homeContentId="homePromContent"
						imgSrc={require("../../images/bal.jpg")}
						btnText="Абитуриенти"
						onClick={() => handleHomeContentBtnClick("Абитуриенти", "photographers_prom")}
					/>
					<HomeContent
						homeContentId="homeBaptismContent"
						imgSrc={require("../../images/kryshtene.jpg")}
						btnText="Кръщене"
						onClick={() => handleHomeContentBtnClick("Кръщене", "photographers_baptism")}
					/>
					<HomeContent
						homeContentId="homeFamilyContent"
						imgSrc={require("../../images/family3.jpg")}
						btnText="Семейна фотосесия"
						onClick={() => handleHomeContentBtnClick("Семейна фотосесия", "photographers_family")}
					/>
					<Footer />
				</>
			);
		}
	}

	return (
		<div>
			<Layout>
				<BackTop duration="800" />
				<Affix>
					<Navbar selectedTab={selectedTab} handleClick={handleNavbarItemClick} categories={categories} />
				</Affix>
				{renderMainContent()}
			</Layout>
		</div>
	);
}

export default Home;
