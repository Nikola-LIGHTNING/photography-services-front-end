import "./ProfileSider.less";
import { Layout, Menu } from "antd";
import { UserOutlined, BookOutlined, SolutionOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import React from "react";

const { Sider } = Layout;

function ProfileSider({ collapsed, onCollapse, selectedPage, person }) {
	return (
		<Sider
			className="profileSider"
			collapsedWidth="50"
			width="266"
			collapsible="true"
			theme="light"
			collapsed={collapsed}
			onCollapse={onCollapse}
		>
			<Menu mode="inline" defaultSelectedKeys={selectedPage}>
				{!collapsed && (
					<Menu.ItemGroup key="profileSiderNames" title={person.firstName + " " + person.lastName} />
				)}
				<Menu.Item key="profile" icon={<UserOutlined />}>
					<Link to={{ pathname: `/people/${person.id}` }} state={{ selectedPage: "profile" }}>Профил</Link>
				</Menu.Item>
				<Menu.Item key="albums" icon={<BookOutlined />}>
					<Link to={{ pathname: `/people/${person.id}/albums` }} state={{ selectedPage: "albums" }}>
						Албуми
					</Link>
				</Menu.Item>
				<Menu.Item key="pricing" icon={<SolutionOutlined />}>
					<Link to={{ pathname: `/people/${person.id}/pricing` }} state={{ selectedPage: "pricing" }}>
						Ценоразпис
					</Link>
				</Menu.Item>
			</Menu>
		</Sider>
	);
}

export default ProfileSider;
