import "./Navbar.less";
import React, { useState } from "react";
import { Menu, Layout, Button } from "antd";
import { LoginOutlined } from "@ant-design/icons";
import Logo from "../Logo/Logo";

const { SubMenu, Item, ItemGroup } = Menu;
const { Header } = Layout;

function Navbar() {
    const [selectedTab, setSelectedTab] = useState("home");

    const handleClick = (event) => {
        setSelectedTab(event.key);
    };

    return (
        <Header className="navbarHeader">
            <div className="navbarLogo">
                <Logo />
            </div>
            <div className="navbarLoginBtnContainer">
                <Button type="primary" shape="round" size="large">
                    Вход <LoginOutlined />
                </Button>
            </div>
            <Menu className="navbarMenu" onClick={handleClick} selectedKeys={[selectedTab]} mode="horizontal">
                <Item key="home">Начало</Item>
                <Item key="photographers">Фотографи</Item>
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
