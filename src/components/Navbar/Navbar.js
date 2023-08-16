import "./Navbar.less";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Layout, Button, Modal } from "antd";
import { LoginOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import Logo from "../Logo/Logo";

const { SubMenu, Item, ItemGroup } = Menu;
const { Header } = Layout;

function Navbar({ selectedTab, categories }) {
	const navigate = useNavigate();

	function showConfirmStayOnPage() {
		Modal.confirm({
			title: "Сигурни ли сте, че искате да продължите?",
			icon: <ExclamationCircleOutlined />,
			centered: true,
			autoFocusButton: "cancel",
			width: 800,
			closeable: true,
			content:
				"За да използвате услугата като обикновен потребител няма нужда да влизате в системата. Влизането в системата е предназначено за хора, които ще качват техните снимки, албуми и предлагани услуги.",
			okText: "Продължи",
			cancelText: "Отказ",

			onOk() {
				navigate("/login");
			},
		});
	}

	function buildSubMenuCategories(categoryList) {
		if (categoryList) {
			return categoryList.map(({ value, key }) => (
				<Menu.Item key={"services_" + key}>
					<Link to="/services" state={{ selectedCategory: value, selectedTab: "services_" + key }} >
						{value}
					</Link>
				</Menu.Item>
			));
		}
	}

	return (
		<Header className="navbarHeader">
			<div className="navbarLogo">
				<Logo />
			</div>
			<div className="navbarLoginBtnContainer">
				<Button type="primary" shape="round" size="large" onClick={showConfirmStayOnPage}>
					Вход <LoginOutlined />
				</Button>
			</div>
			<Menu className="navbarMenu" selectedKeys={[selectedTab]} mode="horizontal">
				<Item key="home">
					<Link to="/">Начало</Link>
				</Item>
				<SubMenu key="photo_services" title="Услуги" onTitleClick={() => navigate("/services")}>
					<ItemGroup title="Отразяване на събития">{buildSubMenuCategories(categories.events)}</ItemGroup>
					<ItemGroup title="Други">{buildSubMenuCategories(categories.other)}</ItemGroup>
				</SubMenu>
				<Item key="photographers">
					<Link to="/photographers">Фотографи</Link>
				</Item>
				<Item key="contacts">
					<a href="https://ant.design" target="_blank" rel="noopener noreferrer">
						Контакти
					</a>
				</Item>
			</Menu>
		</Header>
	);
}

export default Navbar;
