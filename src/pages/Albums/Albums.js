import "./Albums.less";
import { MoreOutlined, FilterOutlined, UserOutlined } from "@ant-design/icons";
import { Layout, Affix, FloatButton, Menu, Checkbox, Input } from "antd";
import { useState, useEffect, useReducer } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import Navbar from "../../components/Navbar/Navbar";
import PhotographersList from "../../components/PhotographersList/PhotographersList";
import PhotographerDetails from "../../components/PhotographerDetails/PhotographerDetails";
import AlbumCard from "../../components/AlbumCard/AlbumCard";
import coverOne from '../../images/GN-821.jpg';
import coverTwo from '../../images/bal.jpg';
import coverThree from '../../images/kryshtene.jpg';
import coverFour from '../../images/ogosta_3.jpg';
import coverFive from '../../images/bikini.jpg';


const { Content, Sider } = Layout;
const { SubMenu } = Menu;
const { Search } = Input;

function scrollToTop() {
    scroll.scrollToTop({
        duration: 500,
        delay: 0,
        smooth: "easeInOutQuint",
    });
}

// Adds/removes/cleans a list of strings (in this instance a list of category keys)
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

function Albums() {
    const location = useLocation();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [selectedCategories, dispatch] = useReducer(selectedCategoriesReducer, []);
    const [searchTerm, setSearchTerm] = useState("");

    const searchPredicate = (album) => {
        if (searchTerm.trim().length === 0)
            return true;

        const title = album.title.toLowerCase();
        const searchTermLowerCase = searchTerm.toLowerCase();

        return title.includes(searchTermLowerCase);
    };

    const categoriesPredicate = (album) => {
        return selectedCategories.some((categoryKey) => categoryKey != undefined && categoryKey === album.categoryKey);
    };

    // Load from backend API callback. Use a ServiceClass to encapsulate the backend calls logic and use that ServiceClass here.
    const photographer = {
        id: "fotograf.fotografov",
        firstName: "Фотограф",
        lastName: "Фотографов",
        phoneNumber: "0877555333",
        profileImgSrc: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
        gender: "Мъж",
        workArea: ["София", "Монтана", "Враца"],
        categories: ["Сватбена фотография"],
        // 4 Img sources for album covers of every category
        // This logic should be implemented where the albums for a photographer are fetched.
        // when a category is selected we show it as the first album cover for a photographer
        // we add it as the first element or remove it as if the category is deselected
        // we fill the rest of the list (2 items) with categories which are selected
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
    const albums = [
        {
            id: "1",
            title: "Сватбата на Никол и Мартин",
            createdByUser: "177",
            createdOn: "2024-02-08 06:19:26.674",
            coverMediaId: "1",
            coverImageSrc: coverOne,
            categoryKey: "wedding"
            // 4 Img sources for album covers of every category
            // This logic should be implemented where the albums for a photographer are fetched.
            // when a category is selected we show it as the first album cover for a photographer
            // we add it as the first element or remove it as if the category is deselected
            // we fill the rest of the list (2 items) with categories which are selected
        },
        {
            id: "13",
            title: "Зимна семейна фотосесия на Никол и Мартин",
            createdByUser: "177",
            createdOn: "2024-02-08 06:19:26.674",
            coverMediaId: "5",
            coverImageSrc: coverTwo,
            categoryKey: "family"
        },
        {
            id: "11",
            title: "Абитуриентски бал на ПМГ 12а 2013",
            createdByUser: "177",
            createdOn: "2024-02-08 06:19:26.674",
            coverMediaId: "2",
            coverImageSrc: coverThree,
            categoryKey: "prom"
        },
        {
            id: "15",
            title: "Кръщането на Иванчо",
            createdByUser: "177",
            createdOn: "2024-02-08 06:19:26.674",
            coverMediaId: "3",
            coverImageSrc: coverFour,
            categoryKey: "baptism"
        },
        {
            id: "12",
            title: "Абитуриентски бал на яки мацки",
            createdByUser: "177",
            createdOn: "2024-02-08 06:19:26.674",
            coverMediaId: "4",
            coverImageSrc: coverFive,
            categoryKey: "prom"
        }
    ];

    // Runs every time the URL changes: This includes when the page is first opened through a URL, when navigating to a new route within the app, or when the URL parameters or hash change.
    useEffect(() => {
        categories.events.forEach((event) => dispatch({ type: "add", item: event.key }));
        categories.other.forEach((other) => dispatch({ type: "add", item: other.key }));

        scrollToTop();
    }, [location]);

    function collapseSider(collapsed) {
        setCollapsed(collapsed);
    }

    function onCheckboxChange(event) {
        if (event.target.checked) {
            dispatch({ type: "add", item: event.target.category_key });
        } else {
            dispatch({ type: "delete", item: event.target.category_key });
        }
    }

    function buildSidebarCategories(categoryList) {
        if (categoryList) {
            return categoryList.map(({ value, key }) => (
                <Menu.Item key={key}>
                    <Checkbox
                        category={value}
                        category_key={key}
                        onChange={onCheckboxChange}
                        checked={selectedCategories.includes(key) ? true : false}
                    >
                        {value}
                    </Checkbox>
                </Menu.Item>
            ));
        }
    }

    // When pressing the search button (technically not needed if you have onSearchChange)
    function onSearch(value, event) {
        setSearchTerm(value);
    }

    // When entering any text in the search bar
    function onSearchChange(event) {
        onSearch(event.target.value, event);
    }

    return (
        <Layout>
            <FloatButton.BackTop duration="800" />
            <Affix>
                <Navbar selectedTab={"photographers"} categories={categories} />
            </Affix>
            <Content>
                <Layout className="albumsPageLayout">
                    <Sider
                        className="albumsPageSider"
                        collapsedWidth="50"
                        width="266"
                        collapsible="true"
                        theme="light"
                        collapsed={collapsed}
                        onCollapse={collapseSider}
                    >
                        <Menu mode="inline" defaultOpenKeys={["photographerDetails", "events", "other"]}>
                            {/* Display the selected photographer .*/}
                            <SubMenu key="photographerDetails" icon={<UserOutlined />} title={photographer.firstName}>
                                {!collapsed && <PhotographerDetails photographer={photographer} />}
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
                    <Content className="albumsPageContent">
                        <div className="albumsPageCategoryFilters">
                            <div className="albumsPageSearchContainer">
                                <Search
                                    className="albumsPageSearch"
                                    placeholder="Търсене по дума от име на албум"
                                    onChange={onSearchChange}
                                    onSearch={onSearch}
                                    enterButton
                                    allowClear
                                />
                            </div>
                        </div>
                        <div className="albumPageAlbumsList">{
                            albums
                                .filter(categoriesPredicate)
                                .filter(searchPredicate)
                                .map((album) => (
                                    <AlbumCard
                                        key={album.urlIdentifier}
                                        title={album.title}
                                        coverImageSrc={album.coverImageSrc}
                                        onClick={() => navigate(`/photographers/${photographer.id}/albums/${album.id}`)}
                                    />
                                ))}
                        </div>
                    </Content>
                </Layout>
            </Content>
        </Layout>
    );
}

export default Albums;