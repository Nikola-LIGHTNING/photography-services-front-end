import "./Photographers.less";
import { Layout, Menu, Checkbox } from "antd";
import { MoreOutlined, FilterOutlined, UserOutlined } from "@ant-design/icons";
import PhotographersList from "../../components/PhotographersList/PhotographersList";
import PhotographerDetails from "../../components/PhotographerDetails/PhotographerDetails";
import { useState } from "react";

const { Content, Sider } = Layout;
const { SubMenu } = Menu;

function objectIsEmpty(object) {
	if (Object.keys(object).length === 0) {
		return true;
	}

	return false;
}

function Photographers({ categories, selectedCategories, addSelectedCategory, removeSelectedCategory }) {
	const [collapsed, setCollapsed] = useState(false);
	const [selectedPhotographer, setSelectedPhotographer] = useState({});

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
	];

	function collapseSider(collapsed) {
		setCollapsed(collapsed);
	}

	function onCheckboxChange(event) {
		console.log("Logging after checkbox change");
		console.log(selectedPhotographer);
		if (event.target.checked) {
			addSelectedCategory(event.target.category);
			setSelectedPhotographer(photographers[0]);
		} else {
			removeSelectedCategory(event.target.category);
			setSelectedPhotographer(photographers[1]);
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
		<Content>
			<Layout className="photographersLayout">
				<Sider
					className="photographersPageSider"
					collapsedWidth="50"
					width="260"
					collapsible="true"
					theme="light"
					collapsed={collapsed}
					onCollapse={collapseSider}
				>
					<Menu
						className="photographersSiderMenu"
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
				<Content>
					{/* Add another component here. It should have a search box and filters. */}
					<PhotographersList photographers={photographers} setSelectedPhotographer={setSelectedPhotographer} />
				</Content>
			</Layout>
		</Content>
	);
}

export default Photographers;
