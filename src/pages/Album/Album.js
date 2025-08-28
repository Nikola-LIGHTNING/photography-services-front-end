import "./Album.less";
import { UserOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Layout, Affix, FloatButton, Menu, Button, message, Modal, Popconfirm, Spin } from "antd";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";
import Navbar from "../../components/Navbar/Navbar";
import PhotographerDetails from "../../components/PhotographerDetails/PhotographerDetails";
import Photo from "../../components/Photo/Photo";
import { MediaService } from "../../services/MediaService";
import UploadAlbumModal from "../../components/UploadAlbumModal/UploadAlbumModal";
import { PeopleService } from "../../services/PeopleService";
import { AlbumService } from "../../services/AlbumService";
import { useAuth } from "../../services/security/AuthContext";
import { OwnershipService } from "../../services/security/OwnershipService";
import { hasValidResponseStatus } from "../../utils/ValidationUtils";


const { Content, Sider } = Layout;
const { SubMenu } = Menu;

const peopleService = new PeopleService();
const albumService = new AlbumService();
const ownershipService = new OwnershipService();
const mediaService = new MediaService();

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
    const { isAuthenticated } = useAuth();
    const [collapsed, setCollapsed] = useState(false);
    const [person, setPerson] = useState({});
    const [album, setAlbum] = useState(null);
    const [mediaList, setMediaList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [mediaToDelete, setMediaToDelete] = useState(null);

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

    // Helper function to validate API responses
    function validateResponseStatus(response, validStatusesList) {
        if (!hasValidResponseStatus(response, validStatusesList)) {
            navigate("/info/unknownerror");
        }
    }

    // Load album data when component mounts
    useEffect(() => {
        const loadAlbumData = async () => {
            try {
                setLoading(true);
                
                // Extract personId and albumId from URL: /people/{personId}/albums/{albumId}
                const pathParts = location.pathname.split("/");
                const personUrlId = pathParts[2];
                const albumUrlId = pathParts[4];

                if (!personUrlId || !albumUrlId) {
                    navigate("/info/unknownerror");
                    return;
                }

                // Load person data
                const personResponse = await peopleService.getPersonById(personUrlId);
                validateResponseStatus(personResponse, [200]);
                const personData = personResponse.data;
                setPerson(personData);

                // Load album data
                const albumResponse = await albumService.getAlbum(albumUrlId);
                validateResponseStatus(albumResponse, [200]);
                const albumData = albumResponse.data;
                setAlbum(albumData);

                // Load album media
                const mediaResponse = await albumService.getAlbumMedia(albumUrlId);
                validateResponseStatus(mediaResponse, [200]);
                const mediaData = mediaResponse.data.media || [];
                
                // Map media data to component format
                const mappedMedia = mediaData.map(media => ({
                    mediaId: media.mediaId,
                    fileName: media.fileName,
                    fileType: media.fileType,
                    mediaType: media.mediaType,
                    albumId: media.albumId,
                    downloadLink: media.downloadLink,
                    createdOn: media.createdOn,
                    coverImageSrc: media.downloadLink // Use download link as image source
                }));
                
                setMediaList(mappedMedia);

                // Check ownership if user is authenticated
                if (isAuthenticated) {
                    const isOwnerResult = await ownershipService.isProfileOwner(personData.id);
                    setIsOwner(isOwnerResult);
                }

            } catch (error) {
                console.error('Error loading album data:', error);
                message.error('Грешка при зареждане на албума');
                navigate("/info/unknownerror");
            } finally {
                setLoading(false);
            }
        };

        loadAlbumData();
        scrollToTop();
    }, [location, isAuthenticated]);

    function collapseSider(collapsed) {
        setCollapsed(collapsed);
    }

    // Handle edit album
    function handleEditAlbum() {
        setIsEditModalVisible(true);
    }

    // Handle edit modal cancel
    function handleEditCancel() {
        setIsEditModalVisible(false);
    }

    // Handle edit success - refresh album data
    async function handleEditSuccess(result) {
        try {
            setIsEditModalVisible(false);
            
            // Refresh album data
            const pathParts = location.pathname.split("/");
            const albumUrlId = pathParts[4];
            
            const albumResponse = await albumService.getAlbum(albumUrlId);
            validateResponseStatus(albumResponse, [200]);
            setAlbum(albumResponse.data);
            
            // Refresh media list
            const mediaResponse = await albumService.getAlbumMedia(albumUrlId);
            validateResponseStatus(mediaResponse, [200]);
            const mediaData = mediaResponse.data.media || [];
            
            const mappedMedia = mediaData.map(media => ({
                mediaId: media.mediaId,
                fileName: media.fileName,
                fileType: media.fileType,
                mediaType: media.mediaType,
                albumId: media.albumId,
                downloadLink: media.downloadLink,
                createdOn: media.createdOn,
                coverImageSrc: media.downloadLink
            }));
            
            setMediaList(mappedMedia);
            
        } catch (error) {
            console.error('Error refreshing album data:', error);
            message.error('Грешка при зареждане на обновените данни');
        }
    }

    // Handle delete album
    function handleDeleteAlbum() {
        Modal.confirm({
            title: 'Потвърждение за изтриване',
            content: `Сигурни ли сте, че искате да изтриете албума "${album?.title}"? Това действие не може да бъде отменено.`,
            okText: 'Изтрий',
            okType: 'danger',
            cancelText: 'Отказ',
            onOk: async () => {
                try {
                    const pathParts = location.pathname.split("/");
                    const albumUrlId = pathParts[4];
                    
                    const deleteResponse = await albumService.deleteAlbum(albumUrlId);
                    if (hasValidResponseStatus(deleteResponse, [204])) {
                        message.success('Албумът беше изтрит успешно');
                        navigate(`/people/${person.id}/albums`);
                    } else {
                        message.error('Изтриването на албума не беше успешно');
                    }
                } catch (error) {
                    console.error('Error deleting album:', error);
                    message.error('Грешка при изтриване на албума');
                }
            }
        });
    }

    // Handle delete individual media
    function handleDeleteMedia(mediaId) {
        setMediaToDelete(mediaId);
    }

    // Confirm delete media
    async function confirmDeleteMedia() {
        if (!mediaToDelete) return;
        try {
            const response = await mediaService.deleteMedia(mediaToDelete);
            if (hasValidResponseStatus(response, [204])) {
                message.success('Снимката беше изтрита успешно');
                setMediaList(prev => prev.filter(media => media.mediaId !== mediaToDelete));
            } else {
                message.error('Изтриването на снимката не беше успешно');
            }
        } catch (err) {
            console.error('Error deleting media:', err);
            message.error('Грешка при изтриване на снимката');
        } finally {
            setMediaToDelete(null);
        }
    }


    if (loading) {
        return (
            <Layout>
                <FloatButton.BackTop duration="800" />
                <Affix>
                    <Navbar selectedTab={"photographers"} categories={categories} />
                </Affix>
                <Content>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                        <Spin size="large" />
                    </div>
                </Content>
            </Layout>
        );
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
                        <Menu mode="inline" defaultOpenKeys={["personDetails"]}>
                            {/* Display the selected photographer */}
                            <SubMenu key="personDetails" icon={<UserOutlined />} title={person.firstName || "Loading..."}>
                                {!collapsed && <PhotographerDetails person={person} />}
                            </SubMenu>
                        </Menu>
                    </Sider>
                    <Content className="albumPageContent">
                        <div className="albumPageTitle">{album?.title || "Loading..."}</div>
                        {isOwner && (
                            <div className="albumPageActions">
                                <Button
                                    type="primary"
                                    icon={<EditOutlined />}
                                    onClick={handleEditAlbum}
                                    style={{ marginRight: 8 }}
                                >
                                    Редактирай албум
                                </Button>
                                <Button
                                    type="primary"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={handleDeleteAlbum}
                                >
                                    Изтрий албум
                                </Button>
                            </div>
                        )}
                        <div className="albumPageMediaList">
                            {mediaList.length === 0 ? (
                                <div className="albumPageEmptyState">
                                    <p>Няма качени снимки в този албум.</p>
                                </div>
                            ) : (
                                mediaList.map((media) => (
                                    <div key={media.mediaId} className="albumPageMediaItem">
                                        <Photo
                                            title={media.fileName}
                                            coverImageSrc={media.coverImageSrc}
                                        />
                                        {isOwner && (
                                            <Popconfirm
                                                title="Изтриване на снимка"
                                                description="Сигурни ли сте, че искате да изтриете тази снимка?"
                                                onConfirm={() => confirmDeleteMedia()}
                                                okText="Да"
                                                cancelText="Не"
                                            >
                                                <Button
                                                    type="text"
                                                    danger
                                                    size="small"
                                                    icon={<DeleteOutlined />}
                                                    className="albumPageDeleteMediaButton"
                                                    onClick={() => handleDeleteMedia(media.mediaId)}
                                                />
                                            </Popconfirm>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </Content>
                </Layout>
            </Content>

            {/* Edit Album Modal */}
            <UploadAlbumModal
                visible={isEditModalVisible}
                onCancel={handleEditCancel}
                onSuccess={handleEditSuccess}
                categories={person.workCategories ? Array.from(person.workCategories) : []}
                editMode={true}
                initialData={{
                    albumId: album?.albumId,
                    title: album?.title,
                    coverMediaId: album?.coverMediaId,
                    existingMedia: mediaList
                }}
            />
        </Layout>
    );
}

export default Album;