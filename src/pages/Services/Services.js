import "./Services.less";
import { MoreOutlined, FilterOutlined, UserOutlined } from "@ant-design/icons";
import { Layout, Affix, FloatButton, Menu, Checkbox, Input, Select } from "antd";
import { useState, useEffect, useReducer } from "react";
import { useLocation } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import Navbar from "../../components/Navbar/Navbar";
import PhotographersList from "../../components/PhotographersList/PhotographersList";
import PhotographerDetails from "../../components/PhotographerDetails/PhotographerDetails";

const { Content, Sider } = Layout;
const { SubMenu } = Menu;
const { Search } = Input;
const { Option } = Select;

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
			return [...state]; // This is used to trigger rerendering since it returns a new object. Adding array values does not trigger rerender.
		case "delete":
			if (state.includes(action.item)) {
				state.splice(state.indexOf(action.item), 1);
			}
			return [...state];
		case "clean":
			return [];
		default:
			throw new Error();
	}
}

function objectIsEmpty(object) {
	if (Object.keys(object).length === 0) {
		return true;
	}

	return false;
}

function Services() {
	const location = useLocation()
	const [collapsed, setCollapsed] = useState(false);
	const [selectedPhotographer, setSelectedPhotographer] = useState({});
	const [selectedTab, setSelectedTab] = useState("services");
	const [selectedCategories, dispatch] = useReducer(selectedCategoriesReducer, []);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedProvince, setSelectedProvince] = useState("Всички Области");

	const searchPredicate = (photographer) => {
		if (searchTerm.trim().length === 0) return true;

		const firstNameLowerCase = photographer.firstName.toLowerCase();
		const lastNameLowerCase = photographer.lastName.toLowerCase();
		const searchTermLowerCase = searchTerm.toLowerCase();

		return (
			(firstNameLowerCase + " " + lastNameLowerCase).includes(searchTermLowerCase) ||
			firstNameLowerCase.includes(searchTermLowerCase) ||
			lastNameLowerCase.includes(searchTermLowerCase)
		);
	};

	const categoriesPredicate = (photographer) => {
		return selectedCategories.some((category) => photographer.categories.includes(category));
	};

	const provincePredicate = (photographer) => {
		return photographer.workArea.includes(selectedProvince) || selectedProvince === "Всички Области";
	};

	// Load from backend API callback. Use a ServiceClass to encapsulate the backend calls logic and use that ServiceClass here.
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
	const photographers = [
		{
			id: "fotograf.fotografov",
			firstName: "Фотограф",
			lastName: "Фотографов",
			phoneNumber: "0877555333",
			profileImgSrc: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
			gender: "Мъж",
			workArea: ["София", "Монтана", "Враца"],
			categories: ["Сватбена фотография"],
			// 4 Img sources for album covers of every category
			// This logic should be implemented where the albums for a photographer are fetched.
			// when a category is selected we show it as the first album cover for a photographer
			// we add it as the first element or remove it as if the category is deselected
			// we fill the rest of the list (2 items) with categories which are selected
		},
		{
			id: "fotografka.fotografova",
			firstName: "Фотографка",
			lastName: "Фотографова",
			phoneNumber: "0877555333",
			profileImgSrc: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
			gender: "Жена",
			workArea: ["София", "Монтана", "Хасково"],
			categories: ["Сватбена фотография"],
		},
		{
			id: "fotografka.zdr",
			firstName: "Никола",
			lastName: "Цветков",
			phoneNumber: "0877555333",
			profileImgSrc: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
			gender: "Мъж",
			workArea: ["София", "Монтана", "Хасково"],
			categories: ["Сватбена фотография"],
		},
		{
			id: "fotografka.kpr",
			firstName: "Галя",
			lastName: "Цветкова",
			phoneNumber: "0877555333",
			profileImgSrc: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
			gender: "Жена",
			workArea: ["София", "Монтана", "Хасково"],
			categories: ["Сватбена фотография"],
		},
		{
			id: "fotografka.dtb",
			firstName: "Цветомир",
			lastName: "Цветков",
			phoneNumber: "0877555333",
			profileImgSrc: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
			gender: "Мъж",
			workArea: ["София", "Монтана", "Хасково"],
			categories: ["Сватбена фотография", "Абитуриенти", "Фотокниги", "Кръщене"],
		},
		{
			id: "fotografka.v",
			firstName: "Владимир",
			lastName: "Вазов",
			phoneNumber: "0877555333",
			profileImgSrc: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
			gender: "Мъж",
			workArea: ["София", "Монтана", "Хасково"],
			categories: ["Сватбена фотография"],
		},
		{
			id: "fotografka.mhm",
			firstName: "Емилия",
			lastName: "Цветкова",
			phoneNumber: "0877555333",
			profileImgSrc: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
			gender: "Жена",
			workArea: ["София", "Монтана", "Хасково"],
			categories: ["Сватбена фотография"],
		},
		{
			id: "fotografka.uha",
			firstName: "Верка",
			lastName: "Златковска",
			phoneNumber: "0877555333",
			profileImgSrc: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
			gender: "Жена",
			workArea: ["София", "Монтана", "Хасково"],
			categories: ["Сватбена фотография", "Фотокниги"],
		},
		{
			id: "dlujnostno.lice",
			firstName: "Длъжностно",
			lastName: "Лице",
			phoneNumber: "0877555333",
			profileImgSrc: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
			gender: "Мъж",
			workArea: ["София", "Монтана", "Хасково", "Пловдив"],
			categories: ["Сватбена фотография", "Фотокниги"],
		},
		{
			id: "brave.redshirt",
			firstName: "Червеноризец",
			lastName: "Храбър",
			phoneNumber: "0877555333",
			profileImgSrc: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
			gender: "Мъж",
			workArea: ["София", "Монтана", "Хасково"],
			categories: ["Сватбена фотография", "Фотокниги"],
		},
		{
			id: "pii.kume.pii",
			firstName: "Пий",
			lastName: "Куме",
			phoneNumber: "0877555333",
			profileImgSrc: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
			gender: "Мъж",
			workArea: ["София", "Благоевград"],
			categories: ["Сватбена фотография", "Фотокниги"],
		},
	];
	const provinces = [
		"Всички Области",
		"Благоевград",
		"Бургас",
		"Варна",
		"Велико Търново",
		"Видин",
		"Враца",
		"Габрово",
		"Добрич",
		"Кърджали",
		"Кюстендил",
		"Ловеч",
		"Монтана",
		"Пазарджик",
		"Перник",
		"Плевен",
		"Пловдив",
		"Разград",
		"Русе",
		"Силистра",
		"Сливен",
		"Смолян",
		"София",
		"Стара Загора",
		"Търговище",
		"Хасково",
		"Шумен",
		"Ямбол",
	];

	// Runs only on changing props.location.state (when clicking on a different tab from the Navbar)
	useEffect(() => {
		let selectedTab;

		if (!location.state) {
			categories.events.forEach((event) => dispatch({ type: "add", item: event.value }));
			categories.other.forEach((other) => dispatch({ type: "add", item: other.value }));
			selectedTab = "photo_services";
		} else {
			dispatch({ type: "clean" });
			dispatch({ type: "add", item: location.state.selectedCategory });
			selectedTab = location.state.selectedTab;
		}

		setSelectedTab(selectedTab);
		scrollToTop();
	}, [location]);

	function collapseSider(collapsed) {
		setCollapsed(collapsed);
	}

	function onCheckboxChange(event) {
		if (event.target.checked) {
			dispatch({ type: "add", item: event.target.category });
		} else {
			dispatch({ type: "delete", item: event.target.category });
		}
	}

	function buildSidebarCategories(categoryList) {
		if (categoryList) {
			return categoryList.map(({ value, key }) => (
				<Menu.Item key={key}>
					<Checkbox
						category={value}
						onChange={onCheckboxChange}
						checked={selectedCategories.includes(value) ? true : false}
					>
						{value}
					</Checkbox>
				</Menu.Item>
			));
		}
	}

	function onSearch(value, event) {
		setSearchTerm(value);
	}

	function onSearchChange(event) {
		onSearch(event.target.value, event);
	}

	return (
		<Layout>
			<FloatButton.BackTop duration="800" />
			<Affix>
				<Navbar selectedTab={selectedTab} categories={categories} />
			</Affix>
			<Content>
				<Layout className="servicesPageLayout">
					<Sider
						className="servicesPageSider"
						collapsedWidth="50"
						width="266"
						collapsible="true"
						theme="light"
						collapsed={collapsed}
						onCollapse={collapseSider}
					>
						<Menu mode="inline" defaultOpenKeys={["photographerDetails", "events", "other"]}>
							{/* Display/Render the submenu item below only if there is a selectedPhotographer.*/}
							{!objectIsEmpty(selectedPhotographer) && (
								<SubMenu key="photographerDetails" icon={<UserOutlined />} title={selectedPhotographer.firstName}>
									{!collapsed && <PhotographerDetails photographer={selectedPhotographer} />}
								</SubMenu>
							)}

							{!collapsed && <Menu.ItemGroup key="filters" title="Филтри"></Menu.ItemGroup>}
							<SubMenu key="events" icon={<FilterOutlined />} title="Събития">
								{buildSidebarCategories(categories.events)}
							</SubMenu>

							<SubMenu key="other" icon={<MoreOutlined />} title="Други">
								{buildSidebarCategories(categories.other)}
							</SubMenu>
						</Menu>
					</Sider>
					<Content
						className="servicesPageContent"
						// style={{
						// 	marginLeft: collapsed ? "50px" : "266px", // Adjust for the sider position: fixed
						// }}
					>
						<div className="servicesPagePhotographerFilters">
							<div className="servicesPagePhotographerWorkAreaFilter">
								<span className="servicesPagePhotographerWorkArea">Oбласт за услугата:</span>
								<Select
									showSearch
									defaultValue="Всички Области"
									onChange={(province) => setSelectedProvince(province)}
									notFoundContent="Не е намерена въведената област"
									style={{ width: 165 }}
								>
									{provinces.map((province) => (
										<Option key={province} value={province}>
											{province}
										</Option>
									))}
								</Select>
							</div>
							<div className="servicesPageSearchContainer">
								<Search
									className="servicesPageSearch"
									placeholder="Търсене по име или две имена"
									onChange={onSearchChange}
									onSearch={onSearch}
									enterButton
									allowClear
								/>
							</div>
						</div>
						<PhotographersList
							photographers={photographers
								.filter(categoriesPredicate)
								.filter(provincePredicate)
								.filter(searchPredicate)}
							setSelectedPhotographer={setSelectedPhotographer}
						/>
					</Content>
				</Layout>
			</Content>
		</Layout>
	);
}

export default Services;
