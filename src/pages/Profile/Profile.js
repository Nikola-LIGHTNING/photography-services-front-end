import "./Profile.less";
import Navbar from "../../components/Navbar/Navbar";
import ProfileSider from "../../components/ProfileSider/ProfileSider";
import ProfileDetails from "../../components/ProfileDetails/ProfileDetails";
import TextSection from "../../components/TextSection/TextSection";
import ReviewSection from "../../components/ReviewSection/ReviewSection";
import { Layout, Affix, FloatButton, Modal, Form, Select, Button, message, Upload } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useReducer, useEffect } from "react";
import { ReviewService } from "../../services/ReviewService";
import { PeopleService } from "../../services/PeopleService";
import { AboutMeService } from "../../services/AboutMeService";
import { hasValidResponseStatus } from "../../utils/ValidationUtils";
import { useAuth } from "../../services/security/AuthContext";
import { OwnershipService } from "../../services/security/OwnershipService";
import { ProvinceService } from "../../services/ProvinceService";
import { WorkCategoryService } from "../../services/WorkCategoryService";
import { MediaService } from "../../services/MediaService";

const { Content } = Layout;

const reviewService = new ReviewService();
const peopleService = new PeopleService();
const aboutMeService = new AboutMeService();
const ownershipService = new OwnershipService();
const provinceService = new ProvinceService();
const workCategoryService = new WorkCategoryService();
const mediaService = new MediaService();

/**
 * Profile component displays a photographer's profile page with their details, about section, and reviews.
 * 
 * Features:
 * - Fetches photographer data from URL parameter (personId)
 * - Displays profile details, work categories, and contact information
 * - Shows about section with inline editing capability for profile owners
 * - Lists reviews with ability to add new ones
 * - Ownership detection: compares authenticated user with profile being viewed
 * - Responsive layout with collapsible sidebar
 * 
 * Data Flow:
 * 1. Extracts photographer ID from URL path
 * 2. Fetches photographer data via PeopleService.getPersonById()
 * 3. Parallel fetches: about data, reviews, and ownership check (if authenticated)
 * 4. Updates local state with all fetched data
 * 
 * State Management:
 * - photographer: Core profile data (name, contact, work areas, etc.)
 * - categories: Work categories from photographer response  
 * - aboutMe: About section content with edit capabilities
 * - isOwner: Boolean indicating if authenticated user owns this profile
 * - reviews: Managed via useReducer for complex state operations
 * 
 * Error Handling:
 * - Redirects to error page on API failures
 * - Graceful degradation for ownership check failures
 * - Console logging for debugging purposes
 */
function Profile() {
	const location = useLocation();
	const navigate = useNavigate();
	const { isAuthenticated } = useAuth();
	const [person, setPerson] = useState({});
	const [categories, setCategories] = useState({});
	const [aboutMe, setAboutMe] = useState({});
	const [isOwner, setIsOwner] = useState(false);
	const [collapsed, setCollapsed] = useState(false);
	const [reviews, dispatch] = useReducer(reviewsReducer, []);

	// Edit modal state
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [editForm] = Form.useForm();
	const [provinces, setProvinces] = useState([]);
	const [professions, setProfessions] = useState([]);
	const [workCategories, setWorkCategories] = useState([]);
	const selectedProfession = Form.useWatch('profession', editForm);
	const [profilePictureFile, setProfilePictureFile] = useState(null);
	const [profilePictureUploading, setProfilePictureUploading] = useState(false);

	// Run only when component mounts to fetch required data
	useEffect(() => {
		const personUrlId = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);

		// First fetch person data
		peopleService.getPersonById(personUrlId)
			.then((response) => {
				validateResponseStatus(response, [200]);
				const personData = response.data;
				setPerson(personData);
				// Use work categories directly from person response
				setCategories(personData.workCategories || []);

				// Fetch all data in parallel: about, reviews, and optionally ownership check
				const promises = [
					aboutMeService.getAboutMeByPersonId(personData.id),
					reviewService.getReviewsOfPerson(personData.id),
				];

				// Add ownership check if user is authenticated
				if (isAuthenticated) {
					promises.push(ownershipService.isProfileOwner(personData.id));
				}

				return Promise.all(promises);
			})
			.then((responses) => {
				// Handle about and reviews data (always first two responses)
				const aboutResponse = responses[0];
				const reviewsResponse = responses[1];

				validateResponseStatus(aboutResponse, [200]);
				validateResponseStatus(reviewsResponse, [200]);

				setAboutMe(aboutResponse.data);
				dispatch({ type: "initialise", item: reviewsResponse.data.reviews });

				// Handle ownership result if it was requested (third response)
				if (isAuthenticated) {
					const isOwnerResult = responses[2];
					setIsOwner(isOwnerResult);
				} else {
					setIsOwner(false);
				}
			})
			.catch((error) => {
				console.error("Error fetching profile data:", error);
				navigate("/info/unknownerror");
			});
	}, [isAuthenticated]); // Add isAuthenticated as dependency

	// Load provinces and professions for edit modal
	useEffect(() => {
		Promise.all([
			provinceService.getProvinces(),
			workCategoryService.getProfessions()
		]).then((responses) => {
			setProvinces(responses[0]?.data?.provinces || []);
			setProfessions(responses[1]?.data?.professions || []);
		}).catch(() => { });
	}, []);

	// Load categories when profession changes
	useEffect(() => {
		if (!selectedProfession) return;
		workCategoryService.getWorkCategoriesByProfession(selectedProfession)
			.then((response) => setWorkCategories(response?.data?.workCategories || []))
			.catch(() => setWorkCategories([]));
	}, [selectedProfession]);

	function reviewsReducer(state, action) {
		switch (action.type) {
			case "initialise":
				return [...action.item];
			case "add":
				return [...state, action.item];
			case "delete":
				return [...state.filter((review) => review.reviewId !== action.item.id)];
			case "clean":
				return [];
			default:
				throw new Error();
		}
	}

	function validateResponseStatus(response, validStatusesList) {
		if (!hasValidResponseStatus(response, validStatusesList)) {
			navigate("/info/unknownerror");
		}
	}

	function collapseSider(collapsed) {
		setCollapsed(collapsed);
	}

	function openEditModal() {
		editForm.setFieldsValue({
			profession: person.profession,
			workProvinces: person.workProvinces || [],
			workCategories: person.workCategories || []
		});
		setProfilePictureFile(null);
		setIsEditModalOpen(true);
	}

	function closeEditModal() {
		setIsEditModalOpen(false);
	}

	async function handleAboutSave(newText) {
		try {
			const aboutRequest = { about: newText };
			const response = await aboutMeService.addAboutMeByPersonId(aboutRequest);
			validateResponseStatus(response, [201]);

			// Update local state with the response data
			setAboutMe(response.data);
			console.log("About section updated successfully");
		} catch (error) {
			console.error("Error saving about section:", error);
			// You might want to show an error message to the user here
		}
	}

	async function handleSaveWork() {
		try {
			setProfilePictureUploading(true);
			const values = await editForm.validateFields();

			let profileMediaId = null;

			// Upload profile picture if selected
			if (profilePictureFile) {
				profileMediaId = await uploadProfilePicture(profilePictureFile);
			}

			const payload = {
				profession: values.profession,
				workProvinces: values.workProvinces,
				workCategories: values.workCategories
			};

			if (profileMediaId) {
				payload.profileMediaId = profileMediaId;
			}

			const response = await peopleService.updatePerson(person.id, payload);
			if (!hasValidResponseStatus(response, [200])) throw new Error('status');

			message.success('Профилът е обновен успешно');

			// Update local state with new data including profile media URL
			const updatedPerson = { ...person, ...payload };
			if (response.data.profileMediaUrl) {
				updatedPerson.profileMediaUrl = response.data.profileMediaUrl;
			}

			setPerson(updatedPerson);
			setCategories(payload.workCategories || []);
			closeEditModal();
		} catch (err) {
			console.error('Error updating profile:', err);
			message.error('Неуспешно обновяване на профила');
		} finally {
			setProfilePictureUploading(false);
		}
	}

	async function uploadProfilePicture(file) {
		const result = await mediaService.uploadFile(file);
		return result.mediaId;
	}

	function handleProfilePictureChange(info) {
		if (info.file.status === 'removed') {
			setProfilePictureFile(null);
		} else {
			setProfilePictureFile(info.file.originFileObj || info.file);
		}
	}

	return (
		<Layout>
			<FloatButton.BackTop duration="800" />
			<Affix>
				<Navbar selectedTab={"photographers"} categories={categories} />
			</Affix>
			<Content>
				<Layout className="profilePageLayout">
					<ProfileSider
						collapsed={collapsed}
						onCollapse={collapseSider}
						selectedPage="profile"
						person={person}
					/>
					<Content
						className="profilePageContent"
					>
						<ProfileDetails person={person} reviews={reviews} isOwner={isOwner} onEditClick={openEditModal} />
						<TextSection
							title="За мен"
							text={aboutMe.about}
							isOwner={isOwner}
							onSave={(newText) => handleAboutSave(newText)}
						/>
						<ReviewSection person={person} reviews={reviews} reviewDispatcher={dispatch} isOwner={isOwner} />
						<div className="profilePageContentFooter" />
					</Content>
				</Layout>
			</Content>

			<Modal
				open={isEditModalOpen}
				title="Редактирай профил"
				onCancel={closeEditModal}
				footer={[
					<Button key="cancel" onClick={closeEditModal}>Отказ</Button>,
					<Button key="save" type="primary" onClick={handleSaveWork} loading={profilePictureUploading}>
						Запази
					</Button>
				]}
			>
				<Form form={editForm} layout="vertical">
					<Form.Item label="Профилна снимка">
						<Upload
							listType="picture-card"
							maxCount={1}
							beforeUpload={() => false}
							onChange={handleProfilePictureChange}
							accept="image/*"
						>
							{profilePictureFile ? null : (
								<div>
									<div style={{ marginTop: 8 }}>Качи снимка</div>
								</div>
							)}
						</Upload>
					</Form.Item>
					<Form.Item name="profession" label="Професия">
						<Select placeholder="Избери професия">
							{professions.map(p => (
								<Select.Option key={p} value={p}>{p}</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item name="workProvinces" label="Области на работа">
						<Select mode="multiple" placeholder="Избери области на работа">
							{provinces.map(prov => (
								<Select.Option key={prov} value={prov}>{prov}</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item name="workCategories" label="Специализации">
						<Select mode="multiple" placeholder="Избери специализации">
							{workCategories.map(cat => (
								<Select.Option key={cat} value={cat}>{cat}</Select.Option>
							))}
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		</Layout>
	);
}

export default Profile;
