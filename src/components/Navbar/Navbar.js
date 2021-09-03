import "./Navbar.css";
import "antd/dist/antd.css";
import React, { useState } from "react";
import { Menu } from "antd";

const { SubMenu, Item, ItemGroup } = Menu;

function Navbar() {
    const [current, setCurrent] = useState("home");

    const handleClick = (event) => {
        setCurrent(event.key);
    };

    return (
        <div className="navbarContainer">
            <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
                <Item key="home">Начало</Item>
                <Item key="photographers">Фотографи</Item>
                <SubMenu key="photo_services" title="Услуги">
                    <ItemGroup title="Отразяване на събития">
                        <Item id="photo_service" key="photo_service:1">
                            Сватбa
                        </Item>
                        <Item id="photo_service" key="photo_service:2">
                            Кръщане
                        </Item>
                        <Item id="photo_service" key="photo_service:3">
                            Бал
                        </Item>
                        <Item id="photo_service" key="photo_service:5">
                            Рожден ден
                        </Item>
                        <Item id="photo_service" key="photo_service:4">
                            Рожден ден
                        </Item>
                        <Item id="photo_service" key="photo_service:6">
                            Рожден ден
                        </Item>
                        <Item id="photo_service" key="photo_service:7">
                            Рожден ден
                        </Item>
                    </ItemGroup>
                    <ItemGroup title="Други">
                        <Item key="photo_other_services:1">Фотокниги</Item>
                        <Item key="photo_other_services:2">Обработка на снимки</Item>
                    </ItemGroup>
                </SubMenu>
                <Item key="contancts">
                    <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
                        Контакти
                    </a>
                </Item>
            </Menu>
        </div>
    );
}

export default Navbar;
