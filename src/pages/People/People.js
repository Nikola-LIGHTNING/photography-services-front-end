import "./People.less";
import { MoreOutlined, FilterOutlined, UserOutlined } from "@ant-design/icons";
import { Layout, Affix, FloatButton, Menu, Checkbox, Input, Select, Spin } from "antd";
import { useState, useEffect, useReducer } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import Navbar from "../../components/Navbar/Navbar";
import PhotographersList from "../../components/PhotographersList/PhotographersList";
import PhotographerDetails from "../../components/PhotographerDetails/PhotographerDetails";
import { PeopleService } from "../../services/PeopleService";

const { Content, Sider } = Layout;
const { SubMenu } = Menu;
const { Search } = Input;
const { Option } = Select;

const peopleService = new PeopleService();

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

function People() {
	const location = useLocation();
	const navigate = useNavigate();
	const [collapsed, setCollapsed] = useState(false);
	const [selectedPhotographer, setSelectedPhotographer] = useState({});
	const [selectedTab, setSelectedTab] = useState("photographers");
	const [selectedCategories, dispatch] = useReducer(selectedCategoriesReducer, []);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedProvince, setSelectedProvince] = useState("Всички Области");
	const [photographers, setPhotographers] = useState([]);
	const [loading, setLoading] = useState(true);

	const searchPredicate = (person) => {
		if (searchTerm.trim().length === 0) return true;

		const firstNameLowerCase = (person.firstName || "").toLowerCase();
		const lastNameLowerCase = (person.lastName || "").toLowerCase();
		const searchTermLowerCase = searchTerm.toLowerCase();

		return (
			(firstNameLowerCase + " " + lastNameLowerCase).includes(searchTermLowerCase) ||
			firstNameLowerCase.includes(searchTermLowerCase) ||
			lastNameLowerCase.includes(searchTermLowerCase)
		);
	};

	const categoriesPredicate = (person) => {
		// Current API field
		const personCategories = Array.isArray(person.workCategories) ? person.workCategories : [];

		// When all categories are selected, do not filter out anyone
		const allSelectableCategories = [...categories.events, ...categories.other].map(c => c.value);
		const isAllSelected = selectedCategories.length === allSelectableCategories.length;
		if (isAllSelected) return true;

		return personCategories.some((category) => selectedCategories.includes(category));
	};

	const provincePredicate = (person) => {
		// Current API field
		const personProvinces = Array.isArray(person.workProvinces) ? person.workProvinces : [];
		return personProvinces.includes(selectedProvince) || selectedProvince === "Всички Области";
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

	// Fetch photographers data when component mounts (assume 200 -> valid payload)
	useEffect(() => {
		(async () => {
			setLoading(true);
			const response = await peopleService.getAllPeople();
			const list = response.data.personResponseList;
			setPhotographers(Array.isArray(list) ? list : []);
			setLoading(false);
		})();
	}, []);

	// Runs only on changing props.location.state (when clicking on a different tab from the Navbar)
	useEffect(() => {
		let selectedTab;

		if (!location.state) {
			categories.events.forEach((event) => dispatch({ type: "add", item: event.value }));
			categories.other.forEach((other) => dispatch({ type: "add", item: other.value }));
			selectedTab = "photographers";
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

	async function handleSelectPhotographer(personBrief) {
		setSelectedPhotographer(personBrief);
	}

	if (loading) {
		return (
			<Layout>
				<FloatButton.BackTop duration="800" />
				<Affix>
					<Navbar selectedTab={selectedTab} categories={categories} />
				</Affix>
				<Content>
					<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
						<Spin size="large" />
					</div>
				</Content>
			</Layout>
		);
	}

	return (
		<Layout>
			<FloatButton.BackTop duration="800" />
			<Affix>
				<Navbar selectedTab={selectedTab} categories={categories} />
			</Affix>
			<Content>
				<Layout className="peoplePageLayout">
					<Sider
						className="peoplePageSider"
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
									{!collapsed && <PhotographerDetails person={selectedPhotographer} />}
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
						className="peoplePageContent"
						// style={{
						// 	marginLeft: collapsed ? "50px" : "266px", // Adjust for the sider position: fixed
						// }}
					>
						<div className="peoplePagePhotographerFilters">
							<div className="peoplePagePhotographerWorkAreaFilter">
								<span className="peoplePagePhotographerWorkArea">Oбласт на услугата:</span>
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
							<div className="peoplePageSearchContainer">
								<Search
									className="peoplePageSearch"
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
							setSelectedPhotographer={handleSelectPhotographer}
						/>
					</Content>
				</Layout>
			</Content>
		</Layout>
	);
}

export default People;
