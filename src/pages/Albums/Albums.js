import "./Albums.less";
import { MoreOutlined, FilterOutlined, UserOutlined, PlusOutlined } from "@ant-design/icons";
import { Layout, Affix, FloatButton, Menu, Checkbox, Input, Button, message } from "antd";
import { useState, useEffect, useReducer } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import Navbar from "../../components/Navbar/Navbar";
import PhotographerDetails from "../../components/PhotographerDetails/PhotographerDetails";
import AlbumCard from "../../components/AlbumCard/AlbumCard";
import UploadAlbumModal from "../../components/UploadAlbumModal/UploadAlbumModal";
import { PeopleService } from "../../services/PeopleService";
import { AlbumService } from "../../services/AlbumService";
import { MediaService } from "../../services/MediaService";
import { useAuth } from "../../services/security/AuthContext";
import { OwnershipService } from "../../services/security/OwnershipService";
import { hasValidResponseStatus } from "../../utils/ValidationUtils";
import coverOne from '../../images/GN-821.jpg';
import coverTwo from '../../images/bal.jpg';
import coverThree from '../../images/kryshtene.jpg';
import coverFour from '../../images/ogosta_3.jpg';
import coverFive from '../../images/bikini.jpg';


const { Content, Sider } = Layout;
const { SubMenu } = Menu;
const { Search } = Input;

const peopleService = new PeopleService();
const albumService = new AlbumService();
const mediaService = new MediaService();
const ownershipService = new OwnershipService();

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
    const { isAuthenticated } = useAuth();
    const [collapsed, setCollapsed] = useState(false);
    const [selectedCategories, dispatch] = useReducer(selectedCategoriesReducer, []);
    const [searchTerm, setSearchTerm] = useState("");
    const [person, setPerson] = useState({});
    const [albums, setAlbums] = useState([]);
    const [isOwner, setIsOwner] = useState(false);
    const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);

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

    function validateResponseStatus(response, validStatusesList) {
        if (!hasValidResponseStatus(response, validStatusesList)) {
            navigate("/info/unknownerror");
        }
    }

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
    // Mock albums for now - will be replaced with real data from API
    const mockAlbums = [
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

    // Load data when component mounts
    useEffect(() => {
        // Extract personId from URL: /people/{personId}/albums -> {personId}
        const pathParts = location.pathname.split("/");
        const personUrlId = pathParts[2];

        if (!personUrlId) {
            navigate("/info/unknownerror");
            return;
        }

        // First fetch person data
        peopleService.getPersonById(personUrlId)
            .then((response) => {
                validateResponseStatus(response, [200]);
                const personData = response.data;
                console.log("Albums page - Person data loaded:", personData);
                console.log("Albums page - Work categories:", personData.workCategories);
                setPerson(personData);

                // Load albums from API
                return albumService.getAlbumsByPerson(personUrlId).then((albumsResponse) => ({ personData, albumsResponse }));
            })
            .then(async ({ personData, albumsResponse }) => {
                if (albumsResponse) {
                    validateResponseStatus(albumsResponse, [200]);
                    const apiAlbums = (albumsResponse.data && albumsResponse.data.albums) ? albumsResponse.data.albums : [];

                    // Map API albums to UI model and lazy load cover images
                    const mapped = apiAlbums.map(a => ({
                        id: a.albumId?.toString(),
                        title: a.title,
                        createdByUser: personData.id,
                        createdOn: a.createdOn,
                        coverMediaId: a.coverMediaId,
                        coverImageSrc: a.coverDownloadUrl || null,
                        categoryKey: 'wedding'
                    }));

                    // Set only real albums from API
                    setAlbums(mapped);
                    
                    mapped.forEach(async (album) => {
                        if (!album.coverImageSrc) {
                            const mediaResp = await mediaService.getMedia(album.coverMediaId);
                            if (hasValidResponseStatus(mediaResp, [200]) && mediaResp.data && mediaResp.data.downloadLink) {
                                setAlbums(prev => prev.map(x => x.id === album.id ? { ...x, coverImageSrc: mediaResp.data.downloadLink } : x));
                            }
                        }
                    });
                } else {
                    setAlbums([]);
                }

                // Fetch ownership check if user is authenticated  
                if (isAuthenticated) {
                    return ownershipService.isProfileOwner(personData.id);
                } else {
                    return Promise.resolve(false);
                }
            })
            .then((isOwnerResult) => {
                setIsOwner(isOwnerResult);
            });

        // Initialize category filters
        categories.events.forEach((event) => dispatch({ type: "add", item: event.key }));
        categories.other.forEach((other) => dispatch({ type: "add", item: other.key }));

        scrollToTop();
    }, [location, isAuthenticated]);

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

    // Handler for opening upload modal
    function handleUploadAlbum() {
        setIsUploadModalVisible(true);
    }

    // Handler for closing upload modal
    function handleUploadCancel() {
        setIsUploadModalVisible(false);
    }

    // Handler for successful album upload
    function handleUploadSuccess(result) {
        console.log("handleUploadSuccess called with result:", result);
        
        // Validate result structure
        if (!result || !result.album || !result.album.albumId) {
            message.error("Качването завърши, но данните за албума са невалидни");
            return;
        }
        
        // Add new album to the list
        const newAlbum = {
            id: result.album.albumId.toString(),
            title: result.album.title,
            createdByUser: person.id,
            createdOn: result.album.createdOn,
            coverMediaId: result.album.coverMediaId,
            coverImageSrc: null, // Will be loaded later when we have real API integration
            categoryKey: "wedding" // TODO: Map from actual category when available
        };

        setAlbums(prevAlbums => [newAlbum, ...prevAlbums]);
        
        /**
         * After successfully creating a new album, fetch its full details (including coverDownloadUrl)
         * and update only the newly added album in the albums list with the fetched cover image.
         * This ensures that only the new album is updated, while all other albums continue to render as before.
         */
        albumService.getAlbum(newAlbum.id).then(albumRes => {
            if (hasValidResponseStatus(albumRes, [200]) && albumRes.data && albumRes.data.coverDownloadUrl) {
                setAlbums(prev =>
                    prev.map(album =>
                        album.id === newAlbum.id
                            ? { ...album, coverImageSrc: albumRes.data.coverDownloadUrl }
                            : album
                    )
                );
            }
        });
        setIsUploadModalVisible(false);
        
        message.success(`Албумът "${result.album.title}" беше създаден успешно!`);
    }

    return (
        <Layout>
            <FloatButton.BackTop duration="800" />
            <Affix>
                <Navbar selectedTab={"photographers"} categories={categories || {}} />
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
                        <Menu mode="inline" defaultOpenKeys={["personDetails", "events", "other"]}>
                            {/* Display the selected photographer .*/}
                            <SubMenu key="personDetails" icon={<UserOutlined />} title={person.firstName || "Loading..."}>
                                {!collapsed && <PhotographerDetails person={person} />}
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
                            {isOwner && (
                                <div className="albumsPageUploadContainer">
                                    <Button 
                                        type="primary" 
                                        icon={<PlusOutlined />}
                                        size="large"
                                        className="albumsPageUploadButton"
                                        onClick={handleUploadAlbum}
                                    >
                                        Добави албум
                                    </Button>
                                </div>
                            )}
                        </div>
                        <div className="albumsPageAlbumsList">{
                            albums
                                .filter(categoriesPredicate)
                                .filter(searchPredicate)
                                .map((album) => (
                                    <AlbumCard
                                        key={album.urlIdentifier}
                                        title={album.title}
                                        coverImageSrc={album.coverImageSrc}
                                        onClick={() => navigate(`/people/${person.id}/albums/${album.id}`)}
                                    />
                                ))}
                        </div>
                    </Content>
                </Layout>
            </Content>
            
            <UploadAlbumModal
                visible={isUploadModalVisible}
                onCancel={handleUploadCancel}
                onSuccess={handleUploadSuccess}
                categories={person.workCategories ? Array.from(person.workCategories) : []}
            />
        </Layout>
    );
}

export default Albums;