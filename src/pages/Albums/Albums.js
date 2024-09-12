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
    // const [photographer, setPhotographer] = useState({});
    // const [categories, setCategories] = useState({});
    const [selectedTab, setSelectedTab] = useState("services");
    const [selectedCategories, dispatch] = useReducer(selectedCategoriesReducer, []);
    const [searchTerm, setSearchTerm] = useState("");

    const searchPredicate = (album) => {
        if (searchTerm.trim().length === 0) return true;

        const title = album.title.toLowerCase();
        const searchTermLowerCase = searchTerm.toLowerCase();

        return title.includes(searchTermLowerCase);
    };

    const categoriesPredicate = (album) => {
        return selectedCategories.some((category) => category != undefined && category.key === album.category);
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
            category: "wedding"
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
            category: "family"
        },
        {
            id: "11",
            title: "Абитуриентски бал на ПМГ 12а 2013",
            createdByUser: "177",
            createdOn: "2024-02-08 06:19:26.674",
            coverMediaId: "2",
            coverImageSrc: coverThree,
            category: "prom"
        },
        {
            id: "15",
            title: "Кръщането на Иванчо",
            createdByUser: "177",
            createdOn: "2024-02-08 06:19:26.674",
            coverMediaId: "3",
            coverImageSrc: coverFour,
            category: "baptism"
        },
        {
            id: "12",
            title: "Абитуриентски бал на яки мацки",
            createdByUser: "177",
            createdOn: "2024-02-08 06:19:26.674",
            coverMediaId: "4",
            coverImageSrc: coverFive,
            category: "prom"
        }
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
                        {value}photographer
                    </Checkbox>
                </Menu.Item>
            ));
        }
    }

    function onSearch(value, event) {
        setSearchTerm(value);
    }

    function onSearchChange(event) {
        onSearch(event.target.value, event);
    }

    function buildAlbums() {
        return albums.map((album) => (
            <AlbumCard
                key={album.urlIdentifier}
                title={album.title}
                coverImageSrc={album.coverImageSrc}
                onClick={() => navigate(`/photographers/${photographer.id}/albums/${album.id}`)}
            />
        ));
    }

    return (
        <Layout>
            <FloatButton.BackTop duration="800" />
            <Affix>
                <Navbar selectedTab={selectedTab} categories={categories} />
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
                        <div className="albumPageAlbumsList">{buildAlbums()}</div>

                        {
                            /* 
                                Done: 1. Build list of album cards that is linearly ordered and all albums have the same height (ask grok how). Width can be dynamic. Similar to https://www.tatyanachohadjieva.com/MNwedd/n-4ZJcsQ
                                Done: 2. Finalise hover effect
                                3. Connect the category filter to work properly
                                4. Connect the search filter to work properly
                                5. Make the menu select photographers when you are on the albums page of some photographer
                                6. Replicate for the album page itself
                            
                            
                            <PhotographersList
                                photographers={
                                    albums
                                        .filter(categoriesPredicate)
                                        .filter(searchPredicate)}
                                setPhotographer={setPhotographer}
                            /> 
                            */
                        }
                    </Content>
                </Layout>
            </Content>
        </Layout>
    );
}

export default Albums;