import "./Navbar.less";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Menu, Layout, Button, Modal } from "antd";
import { LoginOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import Logo from "../Logo/Logo";

const { SubMenu, Item, ItemGroup } = Menu;
const { Header } = Layout;

function Navbar() {
	const [selectedTab, setSelectedTab] = useState("home");

	const handleClick = (event) => {
		setSelectedTab(event.key);
	};

	const history = useHistory();
	function showConfirmStayOnPage() {
		Modal.confirm({
			title: "Сигурни ли сте, че искате да продължите?",
			icon: <ExclamationCircleOutlined />,
			centered: true,
			autoFocusButton: "cancel",
			width: 800,
			closeable: true,
			content:
				"За да използвате услугата като обикновен потребител няма нужда да влизате в системата. \
            Влизането в системата е предназначено за хора, които ще качват техните снимки, албуми и предлагани услуги.",
			okText: "Продължи",
			cancelText: "Отказ",

			onOk() {
				history.push("/login");
			},
		});
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
			<Menu className="navbarMenu" onClick={handleClick} selectedKeys={[selectedTab]} mode="horizontal">
				<Item key="home">
					<Link to="/">Начало</Link>
				</Item>
				<Item key="photographers">
					<Link to="/photographers">Фотографи</Link>
				</Item>
				<SubMenu key="photo_services" title="Услуги">
					<ItemGroup title="Отразяване на събития">
						<Item key="photo_service:1">Сватбена фотография</Item>
						<Item key="photo_service:2">Кръщене</Item>
						<Item key="photo_service:3">Абитуриентски балове</Item>
						<Item key="photo_service:4">Семейна фотосесия</Item>
						<Item key="photo_service:5">Парти</Item>
						<Item key="photo_service:6">Рожден ден</Item>
						<Item key="photo_service:7">Празници и тържества</Item>
					</ItemGroup>
					<ItemGroup title="Други">
						<Item key="photo_other_services:1">Фотокниги</Item>
						<Item key="photo_other_services:2">Обработка на снимки</Item>
					</ItemGroup>
				</SubMenu>
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
