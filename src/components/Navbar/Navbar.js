import "./Navbar.less";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Layout, Button, Modal, Avatar, Space } from "antd";
import { LoginOutlined, LogoutOutlined, ExclamationCircleOutlined, UserOutlined } from "@ant-design/icons";
import Logo from "../Logo/Logo";
import { useAuth } from "../../utils/AuthContext";


const { SubMenu, Item, ItemGroup } = Menu;
const { Header } = Layout;

function Navbar({ selectedTab, categories }) {
	const navigate = useNavigate();
	const { isAuthenticated, logout } = useAuth(); // Access auth state and logout

	function showConfirmStayOnPage() {
		Modal.confirm({
			title: "Сигурни ли сте, че искате да продължите?",
			icon: <ExclamationCircleOutlined />,
			centered: true,
			autoFocusButton: "cancel",
			width: 800,
			closeable: true,
			content:
				"За да използвате услугите, които се предлагат няма нужда да влизате в системата ни! Влизането в системата е предназначено за хора, които възнамеряват да предлагат своите услуги.",
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

	const renderAuthenticated = () => (		
		<Space>
			<Link to={`/photographers/`}>
				<Avatar
					icon={<UserOutlined />} 
					size="large"
					className="profile-avatar"
				/>
			</Link>
			<Button
				type="primary"
				shape="round"
				size="large"
				onClick={() => { logout(); navigate('/login'); }}
			>
				Изход <LogoutOutlined />
			</Button>
		</Space>
	);

	const renderUnauthenticated = () => (
		<Button type="primary" shape="round" size="large" onClick={showConfirmStayOnPage}>
			Вход <LoginOutlined />
		</Button>
	);

	return (
		<Header className="navbarHeader">
			<div className="navbarLogo">
				<Logo />
			</div>
			<div className="navbarAuthenticationContainer">
				{isAuthenticated ? renderAuthenticated() : renderUnauthenticated()}
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
