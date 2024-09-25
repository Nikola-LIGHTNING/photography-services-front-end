import "./Album.less";
import { UserOutlined } from "@ant-design/icons";
import { Layout, Affix, FloatButton, Menu } from "antd";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import Navbar from "../../components/Navbar/Navbar";
import PhotographerDetails from "../../components/PhotographerDetails/PhotographerDetails";
import coverOne from '../../images/GN-821.jpg';
import coverTwo from '../../images/bal.jpg';
import coverThree from '../../images/kryshtene.jpg';
import coverFour from '../../images/ogosta_3.jpg';
import coverFive from '../../images/bikini.jpg';
import coverSix from '../../images/ogosta.jpg';
import coverSeven from '../../images/ogosta_2.jpg';
import coverEight from '../../images/family.jpg';
import coverNine from '../../images/family2.jpg';
import coverTen from '../../images/family3.jpg';
import coverEleven from '../../images/film.png';
import coverTwelve from '../../images/logo192.png';
import Photo from "../../components/Photo/Photo";


const { Content, Sider } = Layout;
const { SubMenu } = Menu;

function scrollToTop() {
    scroll.scrollToTop({
        duration: 500,
        delay: 0,
        smooth: "easeInOutQuint",
    });
}


function Album() {
    const location = useLocation();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

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
    const album = {
        id: "1",
        title: "Сватбата на Никол и Мартин",
        createdByUser: "177",
        createdOn: "2024-02-08 06:19:26.674",
        coverMediaId: "1",
        coverImageSrc: coverOne,
        categoryKey: "wedding"
    };
    const mediaList = [
        {
            mediaId: "1",
            fileName: "dsc_1",
            fileType: ".jpg",
            mediaType: "IMAGE",
            albumId: "1",
            downloadLink: "string",
            createdOn: "2024-02-08 06:19:26.674",
            coverImageSrc: coverOne,
        },
        {
            mediaId: "2",
            fileName: "dsc_1",
            fileType: ".jpg",
            mediaType: "IMAGE",
            albumId: "1",
            downloadLink: "string",
            createdOn: "2024-02-08 06:19:26.674",
            coverImageSrc: coverTwo,
        },
        {
            mediaId: "3",
            fileName: "dsc_1",
            fileType: ".jpg",
            mediaType: "IMAGE",
            albumId: "1",
            downloadLink: "string",
            createdOn: "2024-02-08 06:19:26.674",
            coverImageSrc: coverThree,
        },
        {
            mediaId: "4",
            fileName: "dsc_1",
            fileType: ".jpg",
            mediaType: "IMAGE",
            albumId: "1",
            downloadLink: "string",
            createdOn: "2024-02-08 06:19:26.674",
            coverImageSrc: coverFour,
        },
        {
            mediaId: "5",
            fileName: "dsc_1",
            fileType: ".jpg",
            mediaType: "IMAGE",
            albumId: "1",
            downloadLink: "string",
            createdOn: "2024-02-08 06:19:26.674",
            coverImageSrc: coverFive,
        },
        {
            mediaId: "6",
            fileName: "dsc_1",
            fileType: ".jpg",
            mediaType: "IMAGE",
            albumId: "1",
            downloadLink: "string",
            createdOn: "2024-02-08 06:19:26.674",
            coverImageSrc: coverSix,
        },
        {
            mediaId: "7",
            fileName: "dsc_1",
            fileType: ".jpg",
            mediaType: "IMAGE",
            albumId: "1",
            downloadLink: "string",
            createdOn: "2024-02-08 06:19:26.674",
            coverImageSrc: coverSeven,
        },
        {
            mediaId: "8",
            fileName: "dsc_1",
            fileType: ".jpg",
            mediaType: "IMAGE",
            albumId: "1",
            downloadLink: "string",
            createdOn: "2024-02-08 06:19:26.674",
            coverImageSrc: coverEight,
        },
        {
            mediaId: "9",
            fileName: "dsc_1",
            fileType: ".jpg",
            mediaType: "IMAGE",
            albumId: "1",
            downloadLink: "string",
            createdOn: "2024-02-08 06:19:26.674",
            coverImageSrc: coverNine,
        },
        {
            mediaId: "10",
            fileName: "dsc_1",
            fileType: ".jpg",
            mediaType: "IMAGE",
            albumId: "1",
            downloadLink: "string",
            createdOn: "2024-02-08 06:19:26.674",
            coverImageSrc: coverTen,
        },
        {
            mediaId: "11",
            fileName: "dsc_1",
            fileType: ".png",
            mediaType: "IMAGE",
            albumId: "1",
            downloadLink: "string",
            createdOn: "2024-02-08 06:19:26.674",
            coverImageSrc: coverEleven,
        },
        {
            mediaId: "12",
            fileName: "dsc_1",
            fileType: ".png",
            mediaType: "IMAGE",
            albumId: "1",
            downloadLink: "string",
            createdOn: "2024-02-08 06:19:26.674",
            coverImageSrc: coverTwelve,
        }
    ];

    // Runs every time the URL changes: This includes when the page is first opened through a URL, when navigating to a new route within the app, or when the URL parameters or hash change.
    useEffect(() => {
        scrollToTop();
    }, [location]);

    function collapseSider(collapsed) {
        setCollapsed(collapsed);
    }


    return (
        <Layout>
            <FloatButton.BackTop duration="800" />
            <Affix>
                <Navbar selectedTab={"photographers"} categories={categories} />
            </Affix>
            <Content>
                <Layout className="albumPageLayout">
                    <Sider
                        className="albumPageSider"
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
                        </Menu>
                    </Sider>
                    <Content className="albumPageContent">
                        <div className="albumPageTitle">{album.title}</div>
                        <div className="albumPageMediaList">{
                            mediaList
                                .map((media) => (
                                    <Photo
                                        key={media.mediaId}
                                        title={media.title}
                                        coverImageSrc={media.coverImageSrc}
                                        // onClick={() => navigate(`/photographers/${photographer.id}/albums/${media.id}`)}
                                    />
                                ))}
                        </div>
                    </Content>
                </Layout>
            </Content>
        </Layout>
    );
}

export default Album;