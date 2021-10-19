import "./Services.less";
import { Layout, Affix, BackTop, Menu, Checkbox } from "antd";
import Navbar from "../../components/Navbar/Navbar";
import { MoreOutlined, FilterOutlined, UserOutlined } from "@ant-design/icons";
import PhotographersList from "../../components/PhotographersList/PhotographersList";
import PhotographerDetails from "../../components/PhotographerDetails/PhotographerDetails";
import { useState, useEffect, useReducer } from "react";
import { animateScroll as scroll } from "react-scroll";

const { Content, Sider } = Layout;
const { SubMenu } = Menu;

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

function Services({ location }) {
	const [collapsed, setCollapsed] = useState(false);
	const [selectedPhotographer, setSelectedPhotographer] = useState({});
	const [selectedTab, setSelectedTab] = useState("services");
	const [selectedCategories, dispatch] = useReducer(selectedCategoriesReducer, []);

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
	const photographers = [
		{
			id: "fotograf.fotografov",
			firstName: "Фотограф",
			lastName: "Фотографов",
			phoneNumber: "0877555333",
			profileImgSrc: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
			workArea: ["София", "Монтана", "Враца"],
			// 3 Img sources for album covers of every category
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
			workArea: ["София", "Монтана", "Хасково"],
		},
		{
			id: "fotografka.zdr",
			firstName: "Фотографка",
			lastName: "Фотографова",
			phoneNumber: "0877555333",
			profileImgSrc: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
			workArea: ["София", "Монтана", "Хасково"],
		},
		{
			id: "fotografka.kpr",
			firstName: "Фотографка",
			lastName: "Фотографова",
			phoneNumber: "0877555333",
			profileImgSrc: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
			workArea: ["София", "Монтана", "Хасково"],
		},
		{
			id: "fotografka.dtb",
			firstName: "Фотографка",
			lastName: "Фотографова",
			phoneNumber: "0877555333",
			profileImgSrc: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
			workArea: ["София", "Монтана", "Хасково"],
		},
		{
			id: "fotografka.v",
			firstName: "Фотографка",
			lastName: "Фотографова",
			phoneNumber: "0877555333",
			profileImgSrc: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
			workArea: ["София", "Монтана", "Хасково"],
		},
		{
			id: "fotografka.mhm",
			firstName: "Фотографка",
			lastName: "Фотографова",
			phoneNumber: "0877555333",
			profileImgSrc: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
			workArea: ["София", "Монтана", "Хасково"],
		},
		{
			id: "fotografka.uha",
			firstName: "Фотографка",
			lastName: "Фотографова",
			phoneNumber: "0877555333",
			profileImgSrc: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
			workArea: ["София", "Монтана", "Хасково"],
		},
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

	return (
		<Layout>
			<BackTop duration="800" />
			<Affix>
				<Navbar selectedTab={selectedTab} categories={categories} />
			</Affix>
			<Content>
				<Layout className="servicesLayout">
					<Sider
						className="servicesPageSider"
						collapsedWidth="50"
						width="260"
						collapsible="true"
						theme="light"
						collapsed={collapsed}
						onCollapse={collapseSider}
					>
						<Menu
							className="servicesSiderMenu"
							mode="inline"
							defaultOpenKeys={["photographerDetails", "events", "other"]}
						>
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
						style={{
							marginLeft: collapsed ? "50px" : "260px", // Adjust for the sider position: fixed
						}}
					>
						{/* Add another component here. It should have a search box and filters. */}
						<PhotographersList photographers={photographers} setSelectedPhotographer={setSelectedPhotographer} />
					</Content>
				</Layout>
			</Content>
		</Layout>
	);
}

export default Services;
