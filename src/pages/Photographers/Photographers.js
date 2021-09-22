import "./Photographers.less";
import { Layout, Affix, BackTop, Menu, Checkbox, Image } from "antd";
import { MoreOutlined, FilterOutlined, UserOutlined } from "@ant-design/icons";
import Navbar from "../../components/Navbar/Navbar";
import { Link } from "react-router-dom";
import PhotographersList from "../../components/PhotographersList/PhotographersList";
import { useState } from "react";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

function Photographers({ photographers }) {
	const [collapsed, setCollapsed] = useState(false);

	const collapseSider = (collapsed) => {
		setCollapsed(collapsed);
	};

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
				value: "Абитируиентски бал",
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

	const filteredCategories = ["Фотокниги"];

	function buildSidebarCategories(categoryList) {
		if (categoryList) {
			return categoryList.map(({ value, key }) => (
				<Menu.Item key={key}>
					<Checkbox
						category={value}
						onChange={onChange}
						defaultChecked={filteredCategories.includes(value) ? true : false}
					>
						{value}
					</Checkbox>
				</Menu.Item>
			));
		}
	}

	function onChange(e) {
		console.log(`checked = ${e.target.checked}`);
		console.log(e.target.category);
		// create filteredCategories list with a use state and show correct content based on state
		// add category to the filter list if checked
		// remove cateogry from filter list if unchecked
	}

	return (
		<div>
			<Layout className="photographersLayout">
				<BackTop duration="800" />
				<Affix>
					<Navbar />
				</Affix>
				<Layout>
					<Sider
						className="photographersPageSider"
						collapsedWidth="50"
						width="260"
						collapsible="true"
						theme="light"
						collapsed={collapsed}
						onCollapse={collapseSider}
					>
						<Menu className="photographersSiderMenu" mode="inline">
							{/* Display/Render the submenu item and div below only if there is a selectedPhotographer.*/}
							{/* Add the names of the photographers to the title tag e.g. selectedPhotographer.names as a placeholder.*/}
							<SubMenu key="contacts" icon={<UserOutlined />} title="Фотограф Фотографов">
								{/* Make this into an separate component named PhotographerDetails or something */}
								{!collapsed && (
									<div className="photographersDetails">
										<Image
											className="photographersDetailsImage"
											src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
											// src={selectedPhotographer.profileImgSrc}
										/>
										<div className="photographerDetailsText">
											<h5>
												Телефон: 0877555333
												{/* Телефон: {selectedPhotographer.phoneNumber} */}
											</h5>
											<h5>
												Работи в областите: София, Враца, Монтана
												{/* Работи в областите: {selectedPhotographer.workArea} */}
											</h5>
											<h5>
												Ценоразпис
												{/* <Link to={`/photgraphers/${selectedPhotographer.id}/prices`}>Ценоразпис</Link> */}
											</h5>
											<h5>
												Профил
												{/* <Link to={`/photgraphers/${selectedPhotographer.id}`}>Профил</Link>{" "} */}
											</h5>
										</div>
									</div>
								)}
							</SubMenu>
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
						<PhotographersList />
					</Content>
				</Layout>
				{/* <Footer /> */}
			</Layout>
		</div>
	);
}

export default Photographers;
