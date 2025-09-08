import "./Pricing.less";
import Navbar from "../../components/Navbar/Navbar";
import PhotographerDetails from "../../components/PhotographerDetails/PhotographerDetails";
import { Layout, Affix, FloatButton, Button, message, Menu } from "antd";
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { PeopleService } from "../../services/PeopleService";
import { PricingService } from "../../services/PricingService";
import { hasValidResponseStatus } from "../../utils/ValidationUtils";
import { useAuth } from "../../services/security/AuthContext";
import { OwnershipService } from "../../services/security/OwnershipService";
import PriceCard from "../../components/PriceCard/PriceCard";
import PricingModal from "../../components/PricingModal/PricingModal";

const { Content, Sider } = Layout;
const { SubMenu } = Menu;

const peopleService = new PeopleService();
const pricingService = new PricingService();
const ownershipService = new OwnershipService();

/**
 * Pricing component displays a photographer's pricing packages with management capabilities.
 * 
 * Features:
 * - Displays pricing cards for all photographer's service packages
 * - Modal-based add/edit functionality for profile owners
 * - Delete functionality with confirmation for profile owners
 * - Responsive layout with consistent card heights
 * - Category selection based on photographer's work categories
 * 
 * Data Flow:
 * 1. Extracts photographer ID from URL path (/people/{personId}/pricing)
 * 2. Fetches photographer data via PeopleService.getPersonById()
 * 3. Parallel fetches: pricing data and ownership check (if authenticated)
 * 4. Updates local state with fetched data and ownership status
 * 
 * State Management:
 * - person: Core photographer profile data (name, work categories, etc.)
 * - categories: Work categories from photographer response (used in modal)
 * - pricing: Array of pricing packages for display and management
 * - isOwner: Boolean indicating if authenticated user owns this profile
 * - isModalVisible: Controls pricing add/edit modal visibility
 * - editingPricing: Holds pricing item being edited (null for new pricing)
 * 
 * Owner Capabilities:
 * - Add new pricing packages via modal form
 * - Edit existing pricing packages with pre-filled data
 * - Delete pricing packages with confirmation dialog
 * - All changes update local state optimistically
 * 
 * Error Handling:
 * - Redirects to error page on API failures
 * - User-friendly error messages for CRUD operations
 * - Form validation in modal component
 * - Console logging for debugging purposes
 */
function Pricing() {
	const location = useLocation();
	const navigate = useNavigate();
	const { isAuthenticated } = useAuth();
	const [person, setPerson] = useState({});
	const [categories, setCategories] = useState([]);
	const [pricing, setPricing] = useState([]);
	const [isOwner, setIsOwner] = useState(false);
	const [collapsed, setCollapsed] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingPricing, setEditingPricing] = useState(null);

	// Run only when component mounts to fetch required data
	useEffect(() => {
		// Extract personId from URL: /people/{personId}/pricing -> {personId}
		const pathParts = location.pathname.split("/");
		const personUrlId = pathParts[2];

		// First fetch person data
		peopleService.getPersonById(personUrlId)
			.then((response) => {
				validateResponseStatus(response, [200]);
				const personData = response.data;
				setPerson(personData);
				setCategories(personData.workCategories || []);

				// Fetch pricing data and optionally ownership check in parallel
				const promises = [
					pricingService.getPricingByPerson(personData.id),
				];

				// Add ownership check if user is authenticated
				if (isAuthenticated) {
					promises.push(ownershipService.isProfileOwner(personData.id));
				}

				return Promise.all(promises);
			})
			.then((responses) => {
				// Handle pricing data (always first response)
				const pricingResponse = responses[0];
				validateResponseStatus(pricingResponse, [200]);
				setPricing(pricingResponse.data.pricingList || []);

				// Handle ownership result if it was requested (second response)
				if (isAuthenticated) {
					const isOwnerResult = responses[1];
					setIsOwner(isOwnerResult);
				} else {
					setIsOwner(false);
				}
			})
			.catch((error) => {
				console.error("Error fetching pricing data:", error);
				navigate("/info/unknownerror");
			});
	}, [isAuthenticated]);

	function validateResponseStatus(response, validStatusesList) {
		if (!hasValidResponseStatus(response, validStatusesList)) {
			navigate("/info/unknownerror");
		}
	}

	function collapseSider(collapsed) {
		setCollapsed(collapsed);
	}

	// Handler for "Add Pricing" button
	function handleAddPricing() {
		setEditingPricing(null);
		setIsModalVisible(true);
	}

	// Handler for edit button on existing pricing card
	function handleEditPricing(pricingItem) {
		setEditingPricing(pricingItem);
		setIsModalVisible(true);
	}

	// Handler for delete button on existing pricing card
	async function handleDeletePricing(pricingId) {
		try {
			const response = await pricingService.deletePricing(pricingId);
			validateResponseStatus(response, [204]);
			
			// Remove from local state
			setPricing(prev => prev.filter(item => item.pricingId !== pricingId));
			message.success("Ценоразписът беше изтрит успешно!");
			console.log("Pricing deleted successfully");
		} catch (error) {
			console.error("Error deleting pricing:", error);
			message.error("Възникна грешка при изтриване на ценоразписа. Моля опитайте отново.");
		}
	}

	// Handler for saving new or edited pricing
	async function handleSavePricing(pricingData) {
		try {
			let response;
			
			if (editingPricing) {
				// Update existing pricing
				response = await pricingService.updatePricing(editingPricing.pricingId, pricingData);
				validateResponseStatus(response, [200]);
				
				// Update in local state
				setPricing(prev => prev.map(item => 
					item.pricingId === editingPricing.pricingId 
						? { ...item, ...response.data }
						: item
				));
			} else {
				// Create new pricing
				response = await pricingService.createPricing(pricingData);
				validateResponseStatus(response, [201]);
				
				// Add to local state
				setPricing(prev => [...prev, response.data]);
			}
			
			// Reset editing state and close modal
			setIsModalVisible(false);
			setEditingPricing(null);
			message.success(editingPricing ? "Ценоразписът беше актуализиран успешно!" : "Ценоразписът беше създаден успешно!");
			console.log("Pricing saved successfully");
		} catch (error) {
			console.error("Error saving pricing:", error);
			message.error("Възникна грешка при запазване на ценоразписа. Моля опитайте отново.");
			throw error; // Re-throw to let EditablePriceCard handle loading state
		}
	}

	// Handler for canceling add/edit
	function handleCancelEdit() {
		setIsModalVisible(false);
		setEditingPricing(null);
	}

	return (
		<Layout>
			<FloatButton.BackTop duration="800" />
			<Affix>
				<Navbar selectedTab={"photographers"} categories={categories} />
			</Affix>
			<Content>
				<Layout className="pricingPageLayout">
					<Sider
						className="pricingPageSider"
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
					<Content className="pricingPageContent">
						{isOwner && (
							<div className="pricingAddButtonContainer">
								<Button 
									type="primary" 
									icon={<PlusOutlined />}
									size="large"
									className="pricingAddButton"
									onClick={handleAddPricing}
								>
									Добави ценоразпис
								</Button>
							</div>
						)}
						
						<div className="pricingListContainer">
							{pricing.map((priceItem) => (
								<PriceCard 
									key={priceItem.pricingId} 
									price={priceItem}
									isOwner={isOwner}
									onEdit={handleEditPricing}
									onDelete={handleDeletePricing}
								/>
							))}
						</div>
						<div className="pricingPageContentFooter" />
						
						{/* Pricing Modal */}
						<PricingModal
							visible={isModalVisible}
							pricing={editingPricing}
							categories={categories}
							onSave={handleSavePricing}
							onCancel={handleCancelEdit}
						/>
					</Content>
				</Layout>
			</Content>
		</Layout>
	);
}

export default Pricing;
